/* -------------------------------------------------------------
   TRAFFIC & ACCIDENT INTELLIGENCE SYSTEM - CHART MANAGER MODULE
   ------------------------------------------------------------- */

const ChartManager = {
    charts: {}, // Store Chart.js instances to destroy/recreate them dynamically

    // Theme Color Constants
    colors: {
        cyan: '#00f0ff',
        purple: '#bd00ff',
        rose: '#ff0055',
        orange: '#ff9900',
        yellow: '#ffdd00',
        blue: '#0088ff',
        green: '#00ff88',
        muted: '#8c9bb3',
        gridLine: 'rgba(255, 255, 255, 0.05)',
        text: '#8c9bb3'
    },

    /**
     * Create linear gradient fills for charts
     */
    createGradient(ctx, colorHex, opacityStart = 0.4, opacityEnd = 0) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, this.hexToRgbA(colorHex, opacityStart));
        gradient.addColorStop(1, this.hexToRgbA(colorHex, opacityEnd));
        return gradient;
    },

    hexToRgbA(hex, alpha) {
        let c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length === 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
        }
        return 'rgba(255,255,255,' + alpha + ')';
    },

    /**
     * Common chart option overrides
     */
    getCommonOptions(titleX = '', titleY = '', isArea = false) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // We use custom overlays or display it selectively
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 16, 32, 0.9)',
                    titleFont: { family: 'Space Grotesk', size: 13, weight: 'bold' },
                    bodyFont: { family: 'Inter', size: 12 },
                    borderColor: 'rgba(0, 240, 255, 0.25)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    displayColors: true
                }
            },
            scales: {
                x: {
                    grid: { color: this.colors.gridLine, drawBorder: false },
                    ticks: { color: this.colors.text, font: { family: 'Inter', size: 10 } },
                    title: { display: !!titleX, text: titleX, color: this.colors.text }
                },
                y: {
                    grid: { color: this.colors.gridLine, drawBorder: false },
                    ticks: { color: this.colors.text, font: { family: 'Inter', size: 10 } },
                    title: { display: !!titleY, text: titleY, color: this.colors.text }
                }
            }
        };
    },

    /**
     * Safely destroy a chart instance if it exists
     */
    destroyChart(id) {
        if (this.charts[id]) {
            this.charts[id].destroy();
            delete this.charts[id];
        }
    },

    /**
     * Render all dashboard charts based on current active tab and filtered data
     */
    renderCharts(tabId, records) {
        if (records.length === 0) {
            console.log("No data available to plot charts.");
            return;
        }

        if (tabId === 'overview') {
            this.renderOverviewCharts(records);
        } else if (tabId === 'traffic') {
            this.renderTrafficCharts(records);
        } else if (tabId === 'accident') {
            this.renderAccidentCharts(records);
        } else if (tabId === 'emergency') {
            this.renderEmergencyCharts(records);
        }
    },

    /* =============================================================
       1. OVERVIEW SECTION CHARTS
       ============================================================= */

    renderOverviewCharts(records) {
        const ctxIncidentTrend = document.getElementById('chart-incident-trend')?.getContext('2d');
        const ctxVolumeComparison = document.getElementById('chart-volume-comparison')?.getContext('2d');
        const ctxSeverityPie = document.getElementById('chart-severity-pie')?.getContext('2d');
        const ctxSubcategoriesBar = document.getElementById('chart-subcategories-bar')?.getContext('2d');

        // Chart 1: Incident Trend Over Time (Daily)
        if (ctxIncidentTrend) {
            this.destroyChart('incidentTrend');
            
            const dailyData = {};
            records.forEach(r => {
                if (r.date) {
                    const dStr = r.date.toISOString().split('T')[0];
                    dailyData[dStr] = (dailyData[dStr] || 0) + 1;
                }
            });
            
            const sortedDates = Object.keys(dailyData).sort();
            // Downsample if there are too many days to keep rendering fast (limit to 45 intervals)
            let labels = sortedDates;
            let data = sortedDates.map(d => dailyData[d]);
            
            if (sortedDates.length > 45) {
                const step = Math.ceil(sortedDates.length / 45);
                labels = [];
                data = [];
                for (let i = 0; i < sortedDates.length; i += step) {
                    labels.push(sortedDates[i]);
                    let sum = 0;
                    let count = 0;
                    for (let j = i; j < Math.min(i + step, sortedDates.length); j++) {
                        sum += dailyData[sortedDates[j]];
                        count++;
                    }
                    data.push(Math.round(sum / count)); // show average daily count in step
                }
            }

            const gradient = this.createGradient(ctxIncidentTrend, this.colors.cyan, 0.35, 0);

            this.charts.incidentTrend = new Chart(ctxIncidentTrend, {
                type: 'line',
                data: {
                    labels: labels.map(l => {
                        const d = new Date(l);
                        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }),
                    datasets: [{
                        label: 'Incidents/Day',
                        data: data,
                        borderColor: this.colors.cyan,
                        borderWidth: 2,
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.3,
                        pointRadius: data.length > 30 ? 0 : 2,
                        pointHoverRadius: 5
                    }]
                },
                options: this.getCommonOptions('Timeline', 'Calls Volume')
            });
        }

        // Chart 2: Traffic vs Emergency Volume over Hour of Day
        if (ctxVolumeComparison) {
            this.destroyChart('volumeComparison');
            
            const trafficHour = Array(24).fill(0);
            const emsFireHour = Array(24).fill(0);

            records.forEach(r => {
                if (r.date) {
                    const hour = r.date.getHours();
                    if (r.category === "Traffic") {
                        trafficHour[hour]++;
                    } else {
                        emsFireHour[hour]++;
                    }
                }
            });

            const labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
            const gradTraffic = this.createGradient(ctxVolumeComparison, this.colors.orange, 0.25, 0);
            const gradEmsFire = this.createGradient(ctxVolumeComparison, this.colors.purple, 0.25, 0);

            this.charts.volumeComparison = new Chart(ctxVolumeComparison, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Traffic Telemetry',
                            data: trafficHour,
                            borderColor: this.colors.orange,
                            borderWidth: 2,
                            backgroundColor: gradTraffic,
                            fill: true,
                            tension: 0.3,
                            pointRadius: 1
                        },
                        {
                            label: 'EMS & Fire Alarms',
                            data: emsFireHour,
                            borderColor: this.colors.purple,
                            borderWidth: 2,
                            backgroundColor: gradEmsFire,
                            fill: true,
                            tension: 0.3,
                            pointRadius: 1
                        }
                    ]
                },
                options: {
                    ...this.getCommonOptions('Hour of Day', 'Volume'),
                    plugins: {
                        legend: { display: true, labels: { color: this.colors.text, font: { family: 'Inter' } } }
                    }
                }
            });
        }

        // Chart 3: Incident Severity Distribution (Pie/Doughnut)
        if (ctxSeverityPie) {
            this.destroyChart('severityPie');

            const severityCounts = { 'CRITICAL': 0, 'SEVERE': 0, 'MODERATE': 0, 'MINOR': 0 };
            records.forEach(r => {
                if (severityCounts[r.severity] !== undefined) {
                    severityCounts[r.severity]++;
                }
            });

            this.charts.severityPie = new Chart(ctxSeverityPie, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(severityCounts),
                    datasets: [{
                        data: Object.values(severityCounts),
                        backgroundColor: [
                            this.colors.rose,    // CRITICAL
                            this.colors.orange,  // SEVERE
                            this.colors.yellow,  // MODERATE
                            this.colors.green    // MINOR
                        ],
                        borderWidth: 1,
                        borderColor: '#0a0f1e'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                            labels: {
                                color: '#ffffff',
                                font: { family: 'Inter', size: 11 },
                                boxWidth: 12
                            }
                        }
                    }
                }
            });
        }

        // Chart 4: Primary Incident Subcategories (Bar)
        if (ctxSubcategoriesBar) {
            this.destroyChart('subcategoriesBar');

            const counts = {};
            records.forEach(r => {
                counts[r.subcategory] = (counts[r.subcategory] || 0) + 1;
            });

            const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 8);
            const labels = sorted.map(x => x[0]);
            const values = sorted.map(x => x[1]);

            this.charts.subcategoriesBar = new Chart(ctxSubcategoriesBar, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: this.colors.cyan,
                        borderWidth: 0,
                        borderRadius: 6
                    }]
                },
                options: {
                    ...this.getCommonOptions('', 'Count'),
                    indexAxis: 'y', // Horizontal bars look more premium here
                    scales: {
                        x: { grid: { color: this.colors.gridLine }, ticks: { color: this.colors.text } },
                        y: { grid: { display: false }, ticks: { color: '#ffffff', font: { family: 'Inter', size: 10 } } }
                    }
                }
            });
        }
    },

    /* =============================================================
       2. TRAFFIC INTELLIGENCE SECTION CHARTS
       ============================================================= */

    renderTrafficCharts(records) {
        const ctxTrafficHours = document.getElementById('chart-traffic-hours')?.getContext('2d');
        const ctxTrafficDays = document.getElementById('chart-traffic-days')?.getContext('2d');
        const ctxTrafficSubs = document.getElementById('chart-traffic-subcategories')?.getContext('2d');

        const trafficRecords = records.filter(r => r.category === "Traffic");

        // Chart 1: Traffic Peak Hours Line
        if (ctxTrafficHours) {
            this.destroyChart('trafficHours');

            const hourCounts = Array(24).fill(0);
            trafficRecords.forEach(r => {
                if (r.date) hourCounts[r.date.getHours()]++;
            });

            const grad = this.createGradient(ctxTrafficHours, this.colors.cyan, 0.35, 0);

            this.charts.trafficHours = new Chart(ctxTrafficHours, {
                type: 'line',
                data: {
                    labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
                    datasets: [{
                        label: 'Traffic Events',
                        data: hourCounts,
                        borderColor: this.colors.cyan,
                        backgroundColor: grad,
                        fill: true,
                        tension: 0.3,
                        borderWidth: 2,
                        pointRadius: 2
                    }]
                },
                options: this.getCommonOptions('Hour of Day', 'Incident Volume')
            });
        }

        // Chart 2: Weekly Traffic Patterns Bar
        if (ctxTrafficDays) {
            this.destroyChart('trafficDays');

            // JS getDay() is 0 (Sunday) to 6 (Saturday). We want Mon-Sun
            const weekdayCounts = Array(7).fill(0);
            trafficRecords.forEach(r => {
                if (r.date) {
                    let day = r.date.getDay(); // 0 is Sun, 1 Mon...
                    day = day === 0 ? 6 : day - 1; // Map to Mon=0, Tue=1... Sun=6
                    weekdayCounts[day]++;
                }
            });

            this.charts.trafficDays = new Chart(ctxTrafficDays, {
                type: 'bar',
                data: {
                    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    datasets: [{
                        data: weekdayCounts,
                        backgroundColor: this.colors.purple,
                        borderRadius: 6
                    }]
                },
                options: this.getCommonOptions('Day of Week', 'Incident Volume')
            });
        }

        // Chart 3: Traffic Subcategories Donut
        if (ctxTrafficSubs) {
            this.destroyChart('trafficSubs');

            const subCounts = {};
            trafficRecords.forEach(r => {
                subCounts[r.subcategory] = (subCounts[r.subcategory] || 0) + 1;
            });

            this.charts.trafficSubs = new Chart(ctxTrafficSubs, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(subCounts),
                    datasets: [{
                        data: Object.values(subCounts),
                        backgroundColor: [
                            this.colors.cyan,
                            this.colors.orange,
                            this.colors.blue,
                            this.colors.purple,
                            this.colors.yellow
                        ],
                        borderWidth: 1,
                        borderColor: '#0a0f1e'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                            labels: { color: '#ffffff', font: { family: 'Inter', size: 11 } }
                        }
                    }
                }
            });
        }

        // Populate Traffic Hotspots ranked list
        this.populateTrafficHotspots(trafficRecords);
    },

    populateTrafficHotspots(trafficRecords) {
        const container = document.getElementById('traffic-hotspots-container');
        if (!container) return;

        const counts = {};
        trafficRecords.forEach(r => {
            counts[r.twp] = (counts[r.twp] || 0) + 1;
        });

        const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 10);
        
        if (sorted.length === 0) {
            container.innerHTML = '<div class="loading-placeholder">No traffic hotspots in this range</div>';
            return;
        }

        container.innerHTML = sorted.map(([twp, count], idx) => {
            const riskInfo = DataManager.townshipRiskData[twp] || { riskLevel: 'LOW' };
            let badgeClass = 'badge-low';
            if (riskInfo.riskLevel === 'CRITICAL') badgeClass = 'badge-critical';
            else if (riskInfo.riskLevel === 'HIGH') badgeClass = 'badge-high';
            else if (riskInfo.riskLevel === 'MODERATE') badgeClass = 'badge-moderate';

            return `
                <div class="hotspot-item">
                    <div class="hotspot-meta">
                        <span class="hotspot-rank">#${idx+1}</span>
                        <span class="hotspot-name">${twp}</span>
                    </div>
                    <div class="hotspot-data">
                        <span class="hotspot-count">${count} events</span>
                        <span class="hotspot-badge ${badgeClass}">${riskInfo.riskLevel} RISK</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    /* =============================================================
       3. ACCIDENT INTELLIGENCE SECTION CHARTS
       ============================================================= */

    renderAccidentCharts(records) {
        const ctxAccidentMonths = document.getElementById('chart-accident-months')?.getContext('2d');
        const ctxAccidentSev = document.getElementById('chart-accident-severity-bar')?.getContext('2d');
        const ctxAccidentTypes = document.getElementById('chart-accident-types-donut')?.getContext('2d');

        // Filter accident records only (where subcategory has "accident")
        const accidentRecords = records.filter(r => r.title.toLowerCase().includes("accident"));

        // Chart 1: Accident Trend over Months
        if (ctxAccidentMonths) {
            this.destroyChart('accidentMonths');

            const monthCounts = Array(12).fill(0);
            accidentRecords.forEach(r => {
                if (r.date) {
                    monthCounts[r.date.getMonth()]++;
                }
            });

            // We filter labels based on months that actually contain data to keep chart clean
            const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const activeMonths = [];
            const activeCounts = [];
            
            // Check which months actually have records in this dataset
            for (let i = 0; i < 12; i++) {
                if (monthCounts[i] > 0) {
                    activeMonths.push(monthLabels[i]);
                    activeCounts.push(monthCounts[i]);
                }
            }

            const grad = this.createGradient(ctxAccidentMonths, this.colors.rose, 0.3, 0);

            this.charts.accidentMonths = new Chart(ctxAccidentMonths, {
                type: 'line',
                data: {
                    labels: activeMonths,
                    datasets: [{
                        label: 'Accidents Volume',
                        data: activeCounts,
                        borderColor: this.colors.rose,
                        backgroundColor: grad,
                        fill: true,
                        tension: 0.3,
                        borderWidth: 2,
                        pointRadius: 3
                    }]
                },
                options: this.getCommonOptions('Month', 'Accident Rate')
            });
        }

        // Chart 2: Accident Severity Matrix (Bar)
        if (ctxAccidentSev) {
            this.destroyChart('accidentSev');

            const counts = { 'CRITICAL': 0, 'SEVERE': 0, 'MODERATE': 0, 'MINOR': 0 };
            accidentRecords.forEach(r => {
                if (counts[r.severity] !== undefined) counts[r.severity]++;
            });

            this.charts.accidentSev = new Chart(ctxAccidentSev, {
                type: 'bar',
                data: {
                    labels: Object.keys(counts),
                    datasets: [{
                        data: Object.values(counts),
                        backgroundColor: [
                            this.colors.rose,
                            this.colors.orange,
                            this.colors.yellow,
                            this.colors.green
                        ],
                        borderRadius: 6
                    }]
                },
                options: this.getCommonOptions('Derived Severity', 'Collision Counts')
            });
        }

        // Chart 3: Accident Sub-types Donut
        if (ctxAccidentTypes) {
            this.destroyChart('accidentTypes');

            const typeCounts = {};
            accidentRecords.forEach(r => {
                typeCounts[r.subcategory] = (typeCounts[r.subcategory] || 0) + 1;
            });

            this.charts.accidentTypes = new Chart(ctxAccidentTypes, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(typeCounts),
                    datasets: [{
                        data: Object.values(typeCounts),
                        backgroundColor: [
                            this.colors.rose,
                            this.colors.purple,
                            this.colors.orange,
                            this.colors.yellow,
                            this.colors.blue
                        ],
                        borderWidth: 1,
                        borderColor: '#0a0f1e'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                            labels: { color: '#ffffff', font: { family: 'Inter', size: 10 } }
                        }
                    }
                }
            });
        }

        // Render environmental weather notes derived from data
        this.renderEnvironmentalNotes(records);
    },

    renderEnvironmentalNotes(records) {
        const container = document.getElementById('environmental-alerts-list');
        if (!container) return;

        // Count occurrences of environment-related terms in description
        const tags = {
            'HAZARDOUS ROAD': 0,
            'ICY ROAD': 0,
            'SNOW ACCIDENT': 0,
            'HEAVY RAIN / WET ROAD': 0,
            'FOG / MIST': 0
        };

        records.forEach(r => {
            const descLower = r.desc.toLowerCase();
            const titleLower = r.title.toLowerCase();

            if (descLower.includes('hazardous road') || titleLower.includes('hazardous road')) tags['HAZARDOUS ROAD']++;
            if (descLower.includes('icy') || descLower.includes('ice')) tags['ICY ROAD']++;
            if (descLower.includes('snow') || descLower.includes('slush')) tags['SNOW ACCIDENT']++;
            if (descLower.includes('rain') || descLower.includes('wet')) tags['HEAVY RAIN / WET ROAD']++;
            if (descLower.includes('fog') || descLower.includes('mist')) tags['FOG / MIST']++;
        });

        const activeTags = Object.entries(tags).filter(x => x[1] > 0);

        if (activeTags.length === 0) {
            container.innerHTML = '<span class="tag tag-info">No derived environmental records in range</span>';
            return;
        }

        container.innerHTML = activeTags.map(([tag, count]) => {
            let styleClass = 'tag-warning';
            if (count > 200) styleClass = 'tag-danger';
            else if (count < 25) styleClass = 'tag-info';
            
            return `<span class="tag ${styleClass}">${tag} (${count} logs)</span>`;
        }).join('');
    },

    /* =============================================================
       4. EMERGENCY INSIGHTS SECTION CHARTS
       ============================================================= */

    renderEmergencyCharts(records) {
        const ctxRespTwp = document.getElementById('chart-response-by-twp')?.getContext('2d');
        const ctxRespHour = document.getElementById('chart-response-hour-trend')?.getContext('2d');

        // Chart 1: Average Response Delay by Township (Top 10 townships)
        if (ctxRespTwp) {
            this.destroyChart('respTwp');

            const twpDelays = {};
            records.forEach(r => {
                if (r.responseDelay !== null) {
                    if (!twpDelays[r.twp]) twpDelays[r.twp] = { sum: 0, count: 0 };
                    twpDelays[r.twp].sum += r.responseDelay;
                    twpDelays[r.twp].count++;
                }
            });

            const averaged = Object.entries(twpDelays)
                .map(([twp, stats]) => [twp, Math.round(stats.sum / stats.count)])
                .sort((a,b) => b[1] - a[1]) // highest average delays first
                .slice(0, 10);

            this.charts.respTwp = new Chart(ctxRespTwp, {
                type: 'bar',
                data: {
                    labels: averaged.map(x => x[0]),
                    datasets: [{
                        data: averaged.map(x => x[1]),
                        backgroundColor: this.colors.orange,
                        borderRadius: 6
                    }]
                },
                options: this.getCommonOptions('Township', 'Delay (Minutes)')
            });
        }

        // Chart 2: Average Response Delay Hour Trend
        if (ctxRespHour) {
            this.destroyChart('respHour');

            const hourDelays = Array(24).fill(0).map(() => ({ sum: 0, count: 0 }));
            records.forEach(r => {
                if (r.date && r.responseDelay !== null) {
                    const hr = r.date.getHours();
                    hourDelays[hr].sum += r.responseDelay;
                    hourDelays[hr].count++;
                }
            });

            const averagedHourly = hourDelays.map(x => x.count > 0 ? Math.round(x.sum / x.count) : 0);
            const grad = this.createGradient(ctxRespHour, this.colors.cyan, 0.3, 0);

            this.charts.respHour = new Chart(ctxRespHour, {
                type: 'line',
                data: {
                    labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
                    datasets: [{
                        label: 'Average Delay (min)',
                        data: averagedHourly,
                        borderColor: this.colors.cyan,
                        backgroundColor: grad,
                        fill: true,
                        tension: 0.3,
                        borderWidth: 2,
                        pointRadius: 2
                    }]
                },
                options: this.getCommonOptions('Hour of Day', 'Average Delay (Minutes)')
            });
        }

        // Populate Critical Incident Log
        this.populateCriticalIncidentLog(records);
    },

    populateCriticalIncidentLog(records) {
        const tbody = document.getElementById('critical-incidents-feed-body');
        if (!tbody) return;

        // Select the most recent 15 Critical or Severe incidents
        const criticalIncidents = records
            .filter(r => r.severity === "CRITICAL" || r.severity === "SEVERE")
            .sort((a, b) => {
                if (a.date && b.date) return b.date - a.date;
                return 0;
            })
            .slice(0, 15);

        if (criticalIncidents.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="table-empty">No active critical incidents in range.</td></tr>';
            return;
        }

        tbody.innerHTML = criticalIncidents.map(r => {
            const dateStr = r.date ? r.date.toLocaleString() : 'N/A';
            const delayStr = r.responseDelay !== null ? `${r.responseDelay} min` : 'N/A';
            const coordsStr = `${r.lat.toFixed(4)}, ${r.lng.toFixed(4)}`;
            
            let badgeClass = 'badge-critical';
            if (r.severity === 'SEVERE') badgeClass = 'badge-high';

            return `
                <tr>
                    <td class="font-bold text-white">${r.title}</td>
                    <td>${r.twp}</td>
                    <td class="font-mono text-small">${dateStr}</td>
                    <td class="font-mono">${delayStr}</td>
                    <td class="font-mono text-small text-cyan">${coordsStr}</td>
                    <td><span class="badge ${badgeClass}">${r.severity}</span></td>
                </tr>
            `;
        }).join('');
    }
};
