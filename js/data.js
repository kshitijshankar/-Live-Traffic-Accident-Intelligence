/* -------------------------------------------------------------
   TRAFFIC & ACCIDENT INTELLIGENCE SYSTEM - DATA MANAGEMENT LAYER
   ------------------------------------------------------------- */

const DataManager = {
    allRecords: [],
    filteredRecords: [],
    townshipRiskData: {}, // Holds computed risk scores per township
    townshipsList: [],    // Unique sorted list of townships
    latestDate: null,     // Max date in feed
    earliestDate: null,   // Min date in feed
    
    // Config: Severity Weights
    SEVERITY_WEIGHTS: {
        'CRITICAL': 4,
        'SEVERE': 3,
        'MODERATE': 2,
        'MINOR': 1
    },

    /**
     * Load, sanitize, and normalize the JSON dataset
     */
    async loadData(onProgress) {
        try {
            console.log("Attempting to fetch 911.json.json...");
            let response = null;
            try {
                response = await fetch('911.json.json');
            } catch (err) {
                console.log("Could not fetch 911.json.json, trying 911.json...");
                response = await fetch('911.json');
            }

            if (!response || !response.ok) {
                throw new Error(`HTTP error! status: ${response ? response.status : 'failed'}`);
            }

            // Since we're dealing with a large file, read as text to clean invalid NaNs
            const text = await response.text();
            console.log("Sanitizing JSON contents (replacing non-standard NaNs with null)...");
            
            // Replace invalid unquoted NaNs
            const sanitizedText = text.replace(/:\s*NaN/g, ': null');
            
            console.log("Parsing sanitized JSON...");
            const rawData = JSON.parse(sanitizedText);
            console.log(`Successfully parsed ${rawData.length} raw records.`);
            
            // Normalize records
            console.log("Normalizing telemetry fields...");
            this.allRecords = this.normalizeData(rawData);
            console.log("Telemetry normalization complete.");
            
            // Compute global ranges & metadata
            this.computeMetadata();
            
            // Pre-compute township risk scores
            this.computeTownshipRisks();
            
            // Initialize filtered records
            this.filteredRecords = [...this.allRecords];
            
            return true;
        } catch (error) {
            console.warn("AJAX fetch blocked or file not found. Activating offline compatibility fallback...", error);
            
            // Check if embedded telemetry data is present
            if (typeof RAW_TELEMETRY_DATA !== 'undefined' && Array.isArray(RAW_TELEMETRY_DATA)) {
                console.log(`Loading embedded offline telemetry dataset (${RAW_TELEMETRY_DATA.length} records)...`);
                
                // Normalize embedded data
                this.allRecords = this.normalizeData(RAW_TELEMETRY_DATA);
                
                // Compute metadata & risks
                this.computeMetadata();
                this.computeTownshipRisks();
                
                this.filteredRecords = [...this.allRecords];
                return true;
            } else {
                console.error("Critical loader failure: Offline fallback data is missing.");
                throw error; // Re-throw if fallback is also missing
            }
        }
    },

    /**
     * Convert raw fields into normalized structures
     */
    normalizeData(rawData) {
        return rawData.map((row, index) => {
            // Extract category and subcategory from title (e.g. "EMS: BACK PAINS/INJURY")
            let category = "Unknown";
            let subcategory = "General Emergency";
            
            if (row.title && row.title.includes(":")) {
                const parts = row.title.split(":");
                category = parts[0].trim();
                subcategory = parts[1].replace("-", "").trim();
            } else if (row.title) {
                subcategory = row.title;
            }

            // Parse official log timestamp (DD-MM-YYYY HH.MM)
            const logTime = this.parseLogTimestamp(row.timeStamp);
            
            // Extract incident occurrence time from description using regex
            const incidentTime = this.extractIncidentTime(row.desc);
            
            // Calculate response delay (in minutes)
            let responseDelay = null;
            if (logTime && incidentTime) {
                const diffMs = logTime.getTime() - incidentTime.getTime();
                responseDelay = Math.round(diffMs / 60000);
                
                // Clock drift handling: if delay is negative or excessively large (>8 hrs), normalize it
                if (responseDelay < 0 || responseDelay > 480) {
                    responseDelay = Math.abs(responseDelay) % 60; // Keep within 60 min bounds as estimate
                }
            }

            // Derive severity
            const severity = this.deriveSeverity(category, subcategory);

            return {
                id: index + 100001, // Unique visual ID
                lat: parseFloat(row.lat) || 0.0,
                lng: parseFloat(row.lng) || 0.0,
                desc: row.desc || "",
                zip: row.zip ? Math.round(row.zip) : null,
                title: row.title || "",
                category: category,
                subcategory: subcategory,
                timeStampStr: row.timeStamp || "",
                date: logTime,
                incidentDate: incidentTime,
                responseDelay: responseDelay,
                severity: severity,
                twp: row.twp ? row.twp.trim() : "UNKNOWN",
                addr: row.addr ? row.addr.trim() : "UNKNOWN"
            };
        });
    },

    /**
     * Parses custom date string format: "DD-MM-YYYY HH.MM"
     */
    parseLogTimestamp(tsStr) {
        if (!tsStr) return null;
        try {
            const parts = tsStr.split(' ');
            if (parts.length < 2) return null;
            
            const dateParts = parts[0].split('-');
            const timeParts = parts[1].split('.');
            
            if (dateParts.length < 3 || timeParts.length < 2) return null;
            
            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1; // 0-indexed month
            const year = parseInt(dateParts[2], 10);
            const hour = parseInt(timeParts[0], 10);
            const minute = parseInt(timeParts[1], 10);
            
            return new Date(year, month, day, hour, minute);
        } catch (e) {
            return null;
        }
    },

    /**
     * Extracts date and time from the desc field: "2015-12-10 @ 17:10:52"
     */
    extractIncidentTime(desc) {
        if (!desc) return null;
        try {
            const match = desc.match(/(\d{4}-\d{2}-\d{2})\s*@\s*(\d{2}):(\d{2}):(\d{2})/);
            if (match) {
                const dateParts = match[1].split('-');
                const year = parseInt(dateParts[0], 10);
                const month = parseInt(dateParts[1], 10) - 1;
                const day = parseInt(dateParts[2], 10);
                
                const hour = parseInt(match[2], 10);
                const minute = parseInt(match[3], 10);
                const second = parseInt(match[4], 10);
                
                return new Date(year, month, day, hour, minute, second);
            }
        } catch (e) {
            // Fallback
        }
        return null;
    },

    /**
     * Derive Severity based on Title details
     */
    deriveSeverity(category, subcategory) {
        const subLower = subcategory.toLowerCase();
        
        // Critical conditions
        if (
            subLower.includes('cardiac') || 
            subLower.includes('respiratory') || 
            subLower.includes('stroke') || 
            subLower.includes('unconscious') || 
            subLower.includes('major') ||
            subLower.includes('shooting') ||
            subLower.includes('stabbing') ||
            subLower.includes('asphyxia')
        ) {
            return 'CRITICAL';
        }
        
        // Severe conditions (standard vehicle accidents, leaks, fires)
        if (
            subLower.includes('accident') || 
            subLower.includes('fire') || 
            subLower.includes('leak') || 
            subLower.includes('head injury') || 
            subLower.includes('burn') ||
            subLower.includes('electrocution') ||
            subLower.includes('homicide')
        ) {
            return 'SEVERE';
        }
        
        // Moderate conditions
        if (
            subLower.includes('fall') || 
            subLower.includes('pain') || 
            subLower.includes('seizure') || 
            subLower.includes('diabetic') || 
            subLower.includes('obstruction') || 
            subLower.includes('syncope') || 
            subLower.includes('overdose') ||
            subLower.includes('allergic') ||
            subLower.includes('dehydration')
        ) {
            return 'MODERATE';
        }
        
        // Minor/Other (disabled vehicles, nausea, dizziness)
        return 'MINOR';
    },

    /**
     * Compute metadata like latest date and list of townships
     */
    computeMetadata() {
        const twps = new Set();
        let minD = new Date(8640000000000000);
        let maxD = new Date(-8640000000000000);
        
        this.allRecords.forEach(r => {
            if (r.twp) twps.add(r.twp);
            if (r.date) {
                if (r.date < minD) minD = r.date;
                if (r.date > maxD) maxD = r.date;
            }
        });
        
        this.townshipsList = Array.from(twps).sort();
        this.earliestDate = minD;
        this.latestDate = maxD;
        
        console.log(`Feed dates: ${minD.toDateString()} to ${maxD.toDateString()}`);
    },

    /**
     * Compute risk scores per township using:
     * - Frequency Weight (40%): normalized volume of calls
     * - Severity Weight (40%): average severity weight (1-4 scale)
     * - Congestion Weight (20%): percentage of Traffic category alerts
     */
    computeTownshipRisks() {
        const twpStats = {};
        
        // Accumulate statistics per township
        this.allRecords.forEach(r => {
            const twp = r.twp;
            if (!twpStats[twp]) {
                twpStats[twp] = {
                    total: 0,
                    severitySum: 0,
                    trafficCount: 0,
                    accidentCount: 0,
                    subcategories: {}
                };
            }
            
            const stats = twpStats[twp];
            stats.total++;
            stats.severitySum += this.SEVERITY_WEIGHTS[r.severity] || 1;
            
            if (r.category === "Traffic") {
                stats.trafficCount++;
                if (r.subcategory.toLowerCase().includes("accident")) {
                    stats.accidentCount++;
                }
            }
            
            stats.subcategories[r.subcategory] = (stats.subcategories[r.subcategory] || 0) + 1;
        });

        // Find max incident volume for normalization
        let maxVolume = 1;
        Object.keys(twpStats).forEach(twp => {
            if (twpStats[twp].total > maxVolume) {
                maxVolume = twpStats[twp].total;
            }
        });

        // Calculate scores
        Object.keys(twpStats).forEach(twp => {
            const stats = twpStats[twp];
            const avgSeverity = stats.severitySum / stats.total;
            const trafficRatio = stats.trafficCount / stats.total;
            
            // Score components (out of 100)
            const frequencyScore = (stats.total / maxVolume) * 40;
            const severityScore = (avgSeverity / 4.0) * 40;
            const congestionScore = trafficRatio * 20;
            
            const score = Math.round(frequencyScore + severityScore + congestionScore);
            
            // Classify risk level
            let level = "LOW";
            if (score > 75) level = "CRITICAL";
            else if (score > 50) level = "HIGH";
            else if (score > 25) level = "MODERATE";

            // Find primary risk factor (highest occurring subcategory)
            let primaryRisk = "General Safety";
            let maxRiskCount = 0;
            Object.keys(stats.subcategories).forEach(sub => {
                if (stats.subcategories[sub] > maxRiskCount) {
                    maxRiskCount = stats.subcategories[sub];
                    primaryRisk = sub;
                }
            });

            this.townshipRiskData[twp] = {
                township: twp,
                totalIncidents: stats.total,
                accidentCount: stats.accidentCount,
                trafficRatio: trafficRatio,
                avgSeverity: avgSeverity.toFixed(2),
                riskScore: score,
                riskLevel: level,
                primaryRiskFactor: primaryRisk
            };
        });
    },

    /**
     * Filter the dataset dynamically based on UI selections
     */
    filterData(filters) {
        const { search, township, category, datePreset, startDate, endDate } = filters;
        
        const searchLower = search ? search.toLowerCase().trim() : "";
        
        // Calculate date cutoff for presets relative to the latestDate in the feed
        let cutoffDate = null;
        if (datePreset === "7") {
            cutoffDate = new Date(this.latestDate);
            cutoffDate.setDate(cutoffDate.getDate() - 7);
        } else if (datePreset === "30") {
            cutoffDate = new Date(this.latestDate);
            cutoffDate.setDate(cutoffDate.getDate() - 30);
        }

        const startRange = (datePreset === "CUSTOM" && startDate) ? new Date(startDate) : null;
        const endRange = (datePreset === "CUSTOM" && endDate) ? new Date(endDate) : null;
        if (endRange) {
            endRange.setHours(23, 59, 59, 999); // include end day completely
        }

        this.filteredRecords = this.allRecords.filter(r => {
            // 1. Category Filter
            if (category !== "ALL" && r.category !== category) {
                return false;
            }

            // 2. Township Filter
            if (township !== "ALL" && r.twp !== township) {
                return false;
            }

            // 3. Date Presets & Custom Date Ranges
            if (r.date) {
                if (cutoffDate && r.date < cutoffDate) {
                    return false;
                }
                if (startRange && r.date < startRange) {
                    return false;
                }
                if (endRange && r.date > endRange) {
                    return false;
                }
            }

            // 4. Global Search Filter
            if (searchLower) {
                const matchTitle = r.title && r.title.toLowerCase().includes(searchLower);
                const matchTwp = r.twp && r.twp.toLowerCase().includes(searchLower);
                const matchAddr = r.addr && r.addr.toLowerCase().includes(searchLower);
                const matchZip = r.zip && r.zip.toString().includes(searchLower);
                const matchDesc = r.desc && r.desc.toLowerCase().includes(searchLower);
                
                if (!matchTitle && !matchTwp && !matchAddr && !matchZip && !matchDesc) {
                    return false;
                }
            }

            return true;
        });

        console.log(`Filtered records: ${this.filteredRecords.length}`);
        return this.filteredRecords;
    },

    /**
     * Compute metrics on active filtered dataset for KPI cards
     */
    getFilteredKPIs() {
        const total = this.filteredRecords.length;
        if (total === 0) {
            return {
                totalCalls: 0,
                totalAccidents: 0,
                accidentsPct: 0,
                criticalCalls: 0,
                criticalPct: 0,
                hottestLocation: "N/A",
                hottestCount: 0,
                avgResponseDelay: 0,
                trafficRatio: 0
            };
        }

        let accidentsCount = 0;
        let criticalCount = 0;
        let trafficCount = 0;
        let responseDelaySum = 0;
        let responseDelayCount = 0;
        const twpCounts = {};

        this.filteredRecords.forEach(r => {
            // Count accidents
            const titleLower = r.title.toLowerCase();
            if (titleLower.includes("accident")) {
                accidentsCount++;
            }

            // Count critical calls
            if (r.severity === "CRITICAL") {
                criticalCount++;
            }

            // Count traffic
            if (r.category === "Traffic") {
                trafficCount++;
            }

            // Accumulate response delay
            if (r.responseDelay !== null) {
                responseDelaySum += r.responseDelay;
                responseDelayCount++;
            }

            // Count township volumes
            twpCounts[r.twp] = (twpCounts[r.twp] || 0) + 1;
        });

        // Find hottest location
        let hottest = "UNKNOWN";
        let maxCount = 0;
        Object.keys(twpCounts).forEach(twp => {
            if (twpCounts[twp] > maxCount) {
                maxCount = twpCounts[twp];
                hottest = twp;
            }
        });

        const avgDelay = responseDelayCount > 0 ? Math.round(responseDelaySum / responseDelayCount) : 0;

        return {
            totalCalls: total,
            totalAccidents: accidentsCount,
            accidentsPct: Math.round((accidentsCount / total) * 100),
            criticalCalls: criticalCount,
            criticalPct: Math.round((criticalCount / total) * 100),
            hottestLocation: hottest,
            hottestCount: maxCount,
            avgResponseDelay: avgDelay,
            trafficRatio: Math.round((trafficCount / total) * 100)
        };
    }
};
