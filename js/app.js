/* -------------------------------------------------------------
   TRAFFIC & ACCIDENT INTELLIGENCE SYSTEM - MAIN CONTROLLER MODULE
   ------------------------------------------------------------- */

const App = {
    currentTab: 'overview',
    dataLoaded: false,
    btnGoNextClicked: false,
    
    // Pagination state for Explorer
    explorerPage: 1,
    explorerRowsPerPage: 15,
    sortColumn: 'timeStamp',
    sortAscending: false,
    
    // Active filters
    filters: {
        search: "",
        township: "ALL",
        category: "ALL",
        datePreset: "ALL",
        startDate: "",
        endDate: ""
    },

    /**
     * Start the application
     */
    init() {
        console.log("Initializing Command Center App...");
        
        // 1. Setup UI transitions
        Interactions.init();
        
        // 2. Wire up UI event listeners
        this.bindEvents();
        
        // 3. Begin loading JSON data asynchronously
        this.loadDataset();
    },

    /**
     * Trigger JSON download and normalization
     */
    async loadDataset() {
        const loaderScreen = document.getElementById('loader-screen');
        const errorScreen = document.getElementById('error-screen');
        const errorMsg = document.getElementById('error-message');

        try {
            // Load and process data
            await DataManager.loadData();
            
            this.dataLoaded = true;
            
            // Populate filters and update metadata
            this.populateFilters();
            this.updateTelemetrySummary();

            // If user clicked "GO NEXT" while loading was in progress, transition them immediately
            if (this.btnGoNextClicked) {
                this.revealDashboard();
            }
        } catch (error) {
            console.error("Critical loader failure: ", error);
            if (errorScreen && errorMsg) {
                errorMsg.textContent = `File connection error: ${error.message}`;
                loaderScreen.classList.add('hidden');
                errorScreen.classList.remove('hidden');
            }
        }
    },

    /**
     * Set up all click, change, and scroll event listeners
     */
    bindEvents() {
        // "GO NEXT" loading interceptor
        const btnGoNext = document.getElementById('btn-go-next');
        if (btnGoNext) {
            btnGoNext.addEventListener('click', () => {
                this.btnGoNextClicked = true;
                if (!this.dataLoaded) {
                    // Show full-screen loader if data is still downloading
                    document.getElementById('loader-screen').classList.remove('hidden');
                } else {
                    this.revealDashboard();
                }
            });
        }

        // Retry connection buttons
        const btnRetry = document.getElementById('btn-retry');
        if (btnRetry) {
            btnRetry.addEventListener('click', () => {
                document.getElementById('error-screen').classList.add('hidden');
                document.getElementById('loader-screen').classList.remove('hidden');
                this.loadDataset();
            });
        }

        // Tab Navigation
        const navItems = document.querySelectorAll('.nav-links .nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Global Filters change handlers
        const searchInput = document.getElementById('search-input');
        const searchClear = document.getElementById('search-clear');
        const twpSelect = document.getElementById('filter-twp');
        const categoryGroup = document.getElementById('filter-category-group');
        const datePresetSelect = document.getElementById('filter-date-preset');
        const btnApplyCustomDate = document.getElementById('btn-apply-custom-date');

        // Search inputs (with debounce)
        let searchTimeout;
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                if (searchClear) {
                    searchClear.style.display = e.target.value ? 'block' : 'none';
                }
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => this.applyFilters(), 350);
            });
        }

        if (searchClear && searchInput) {
            searchClear.addEventListener('click', () => {
                searchInput.value = "";
                searchClear.style.display = 'none';
                this.filters.search = "";
                this.applyFilters();
            });
        }

        // Township selection
        if (twpSelect) {
            twpSelect.addEventListener('change', (e) => {
                this.filters.twp = e.target.value;
                this.applyFilters();
            });
        }

        // Category toggles
        if (categoryGroup) {
            const btns = categoryGroup.querySelectorAll('.btn-toggle');
            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    btns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.filters.category = btn.getAttribute('data-val');
                    this.applyFilters();
                });
            });
        }

        // Date Preset Selection
        if (datePresetSelect) {
            datePresetSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                this.filters.datePreset = val;
                
                const customContainer = document.getElementById('custom-date-container');
                if (val === 'CUSTOM') {
                    customContainer.classList.remove('hidden');
                } else {
                    customContainer.classList.add('hidden');
                    this.applyFilters();
                }
            });
        }

        // Apply Custom Date Range Button
        if (btnApplyCustomDate) {
            btnApplyCustomDate.addEventListener('click', () => {
                const startVal = document.getElementById('filter-start-date').value;
                const endVal = document.getElementById('filter-end-date').value;
                this.filters.startDate = startVal;
                this.filters.endDate = endVal;
                this.applyFilters();
            });
        }

        // Data Explorer Pagination
        const btnPrev = document.getElementById('btn-page-prev');
        const btnNext = document.getElementById('btn-page-next');
        if (btnPrev) btnPrev.addEventListener('click', () => this.changeExplorerPage(-1));
        if (btnNext) btnNext.addEventListener('click', () => this.changeExplorerPage(1));

        // Sorting
        const tableHeaders = document.querySelectorAll('.explorer-table th.sortable');
        tableHeaders.forEach(th => {
            th.addEventListener('click', () => {
                const col = th.getAttribute('data-col');
                if (this.sortColumn === col) {
                    this.sortAscending = !this.sortAscending;
                } else {
                    this.sortColumn = col;
                    this.sortAscending = true;
                }
                this.renderExplorerTable();
            });
        });
    },

    /**
     * Helper to show dashboard and initialize elements
     */
    revealDashboard() {
        document.getElementById('loader-screen').classList.add('hidden');
        document.getElementById('dashboard-wrapper').classList.remove('hidden');
        this.switchTab('overview');
    },

    /**
     * Populates filter selectors with unique items from the dataset
     */
    populateFilters() {
        const twpSelect = document.getElementById('filter-twp');
        if (twpSelect) {
            twpSelect.innerHTML = '<option value="ALL">All Townships</option>';
            DataManager.townshipsList.forEach(twp => {
                const opt = document.createElement('option');
                opt.value = twp;
                opt.textContent = twp;
                twpSelect.appendChild(opt);
            });
        }

        // Initialize date pickers boundaries
        if (DataManager.earliestDate && DataManager.latestDate) {
            const startPicker = document.getElementById('filter-start-date');
            const endPicker = document.getElementById('filter-end-date');
            
            const startISO = DataManager.earliestDate.toISOString().split('T')[0];
            const endISO = DataManager.latestDate.toISOString().split('T')[0];
            
            if (startPicker) {
                startPicker.min = startISO;
                startPicker.max = endISO;
                startPicker.value = startISO;
            }
            if (endPicker) {
                endPicker.min = startISO;
                endPicker.max = endISO;
                endPicker.value = endISO;
            }
        }
    },

    /**
     * Switch view tabs smoothly
     */
    switchTab(tabId) {
        this.currentTab = tabId;

        // Toggle active navigation buttons
        const navItems = document.querySelectorAll('.nav-links .nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Hide/Show tab panels
        const panels = document.querySelectorAll('.tab-panel');
        panels.forEach(panel => {
            const id = panel.getAttribute('id');
            if (id === `sec-${tabId}`) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Trigger Leaflet invalidate size checks to redraw tiles properly
        Interactions.onTabChange(tabId);

        // Update charts & maps for active viewport
        this.updateTabVisualizations();
    },

    /**
     * Re-filters data and triggers visual refreshes
     */
    applyFilters() {
        console.log("Applying filters:", this.filters);
        
        // Filter records
        DataManager.filterData({
            search: this.filters.search,
            township: this.filters.twp,
            category: this.filters.category,
            datePreset: this.filters.datePreset,
            startDate: this.filters.startDate,
            endDate: this.filters.endDate
        });

        // Reset pagination
        this.explorerPage = 1;

        // Update counts
        this.updateTelemetrySummary();
        this.updateDashboardKPIs();
        
        // Redraw active views
        this.updateTabVisualizations();
        
        // Always redraw Explorer table as it's displayed on every page below panels
        this.renderExplorerTable();
    },

    /**
     * Update global count metrics
     */
    updateTelemetrySummary() {
        const el = document.getElementById('telemetry-record-count');
        if (el) {
            const filteredCount = DataManager.filteredRecords.length;
            const totalCount = DataManager.allRecords.length;
            el.textContent = `Records: ${filteredCount.toLocaleString()} / ${totalCount.toLocaleString()}`;
        }
    },

    /**
     * Refresh KPIs with counting animation
     */
    updateDashboardKPIs() {
        const stats = DataManager.getFilteredKPIs();

        Interactions.animateValue('kpi-total-calls', stats.totalCalls);
        Interactions.animateValue('kpi-total-accidents', stats.totalAccidents);
        Interactions.animateValue('kpi-critical-incidents', stats.criticalCalls);
        Interactions.animateValue('kpi-avg-response', stats.avgResponseDelay, ' min');
        Interactions.animateValue('kpi-traffic-ratio', stats.trafficRatio, '%');

        // Text labels updates
        const accidentsPctEl = document.getElementById('kpi-accidents-pct');
        if (accidentsPctEl) accidentsPctEl.textContent = `${stats.accidentsPct}% of emergency volume`;

        const criticalPctEl = document.getElementById('kpi-critical-pct');
        if (criticalPctEl) criticalPctEl.textContent = `${stats.criticalPct}% high risk events`;

        const hottestLocEl = document.getElementById('kpi-hottest-location');
        if (hottestLocEl) {
            hottestLocEl.textContent = stats.hottestLocation;
            hottestLocEl.title = stats.hottestLocation; // tooltip for overflow
        }

        const hottestCountEl = document.getElementById('kpi-hottest-count');
        if (hottestCountEl) hottestCountEl.textContent = `${stats.hottestCount.toLocaleString()} events`;
    },

    /**
     * Renders visual components specific to active tab
     */
    updateTabVisualizations() {
        const records = DataManager.filteredRecords;

        // 1. Render charts specific to active tab
        ChartManager.renderCharts(this.currentTab, records);

        // 2. Map Rendering in Risk tab
        if (this.currentTab === 'risk') {
            Interactions.renderMap(records);
            this.renderRiskCards();
        }
        
        // Re-attach 3D tilts to newly created cards
        Interactions.refresh3DTilts();
    },

    /**
     * Renders the high-risk location cards under Risk tab
     */
    renderRiskCards() {
        const container = document.getElementById('risk-cards-container');
        if (!container) return;

        // Find active townships within filtered set
        const activeTwps = new Set();
        DataManager.filteredRecords.forEach(r => activeTwps.add(r.twp));

        // Fetch township risks and sort descending
        const sortedRisks = Object.values(DataManager.townshipRiskData)
            .filter(r => activeTwps.has(r.township))
            .sort((a, b) => b.riskScore - a.riskScore)
            .slice(0, 4); // Display top 4 high-risk areas

        if (sortedRisks.length === 0) {
            container.innerHTML = '<div class="loading-placeholder">No risk zones mapped in selection.</div>';
            return;
        }

        container.innerHTML = sortedRisks.map(r => {
            let levelBadge = 'badge-low';
            if (r.riskLevel === 'CRITICAL') levelBadge = 'badge-critical';
            else if (r.riskLevel === 'HIGH') levelBadge = 'badge-high';
            else if (r.riskLevel === 'MODERATE') levelBadge = 'badge-moderate';

            const trafficPct = Math.round(r.trafficRatio * 100);

            return `
                <div class="risk-location-card glass-panel 3d-card" data-tilt>
                    <div class="risk-card-head">
                        <h5>${r.township}</h5>
                        <div class="risk-card-score-box">
                            <span class="risk-val text-cyan">${r.riskScore}</span>
                            <span class="badge ${levelBadge}">${r.riskLevel}</span>
                        </div>
                    </div>
                    <div class="risk-card-footer">
                        <span>Accidents: <strong>${r.accidentCount}</strong></span>
                        <span>Congestion: <strong>${trafficPct}%</strong></span>
                        <span>Primary risk: <strong class="text-yellow" title="${r.primaryRiskFactor}">${r.primaryRiskFactor}</strong></span>
                    </div>
                </div>
            `;
        }).join('');
    },

    /* =============================================================
       5. DATA EXPLORER & COMPREHENSIVE TABLE
       ============================================================= */

    renderExplorerTable() {
        const tbody = document.getElementById('explorer-tbody');
        const indicator = document.getElementById('page-indicator');
        const btnPrev = document.getElementById('btn-page-prev');
        const btnNext = document.getElementById('btn-page-next');
        const rowCountInfo = document.getElementById('explorer-row-count');

        if (!tbody) return;

        // Apply Sorting
        const sorted = [...DataManager.filteredRecords].sort((a, b) => {
            let valA = a[this.sortColumn];
            let valB = b[this.sortColumn];

            // Handle dates comparison
            if (valA instanceof Date) {
                valA = valA.getTime();
                valB = valB ? valB.getTime() : 0;
            }

            if (valA === null || valA === undefined) return 1;
            if (valB === null || valB === undefined) return -1;

            if (typeof valA === 'string') {
                return this.sortAscending 
                    ? valA.localeCompare(valB) 
                    : valB.localeCompare(valA);
            } else {
                return this.sortAscending 
                    ? valA - valB 
                    : valB - valA;
            }
        });

        const totalRows = sorted.length;
        const totalPages = Math.max(1, Math.ceil(totalRows / this.explorerRowsPerPage));

        // Update pagination UI controls
        this.explorerPage = Math.min(this.explorerPage, totalPages);
        if (indicator) indicator.textContent = `Page ${this.explorerPage} of ${totalPages}`;
        if (btnPrev) btnPrev.disabled = this.explorerPage === 1;
        if (btnNext) btnNext.disabled = this.explorerPage === totalPages;
        if (rowCountInfo) {
            const startIdx = (this.explorerPage - 1) * this.explorerRowsPerPage;
            const endIdx = Math.min(startIdx + this.explorerRowsPerPage, totalRows);
            rowCountInfo.textContent = `Showing ${totalRows > 0 ? startIdx + 1 : 0}-${endIdx} of ${totalRows.toLocaleString()} entries`;
        }

        if (totalRows === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="table-empty">No matching telemetry records found. Try resetting filters.</td></tr>';
            return;
        }

        // Slice rows to display
        const startIndex = (this.explorerPage - 1) * this.explorerRowsPerPage;
        const pageRows = sorted.slice(startIndex, startIndex + this.explorerRowsPerPage);

        tbody.innerHTML = pageRows.map(r => {
            const dateStr = r.date ? r.date.toLocaleDateString() + ' ' + r.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : r.timeStampStr;
            const zipStr = r.zip ? r.zip : 'N/A';
            return `
                <tr id="row-${r.id}" class="explorer-row">
                    <td>
                        <span class="pulse-dot text-${r.category.toLowerCase()}">●</span>
                        <strong class="text-white">${r.subcategory}</strong>
                    </td>
                    <td>${r.twp}</td>
                    <td class="text-small" title="${r.addr}">${r.addr}</td>
                    <td class="font-mono text-small">${dateStr}</td>
                    <td class="font-mono text-small">${zipStr}</td>
                    <td>
                        <button class="btn-table-action" onclick="App.toggleRowDetails(${r.id})">Expand</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    changeExplorerPage(delta) {
        this.explorerPage += delta;
        this.renderExplorerTable();
    },

    toggleRowDetails(recordId) {
        const row = document.getElementById(`row-${recordId}`);
        if (!row) return;

        // Check if details row is already open
        const existingDetails = document.getElementById(`details-${recordId}`);
        if (existingDetails) {
            existingDetails.remove();
            row.classList.remove('expanded-row');
            row.querySelector('.btn-table-action').textContent = "Expand";
            return;
        }

        // Close other expanded rows
        const activeDetails = document.querySelectorAll('.expanded-row-details-row');
        activeDetails.forEach(d => d.remove());
        const activeRows = document.querySelectorAll('.explorer-row');
        activeRows.forEach(r => {
            r.classList.remove('expanded-row');
            const btn = r.querySelector('.btn-table-action');
            if (btn) btn.textContent = "Expand";
        });

        // Find the record details
        const r = DataManager.allRecords.find(item => item.id === recordId);
        if (!r) return;

        row.classList.add('expanded-row');
        row.querySelector('.btn-table-action').textContent = "Collapse";

        const detailsHtml = `
            <tr id="details-${recordId}" class="expanded-row-details-row">
                <td colspan="6" class="expanded-row-details">
                    <div class="details-grid">
                        <div class="detail-block">
                            <span class="detail-lbl">Telemetry ID</span>
                            <span class="detail-val font-mono text-cyan">#${r.id}</span>
                        </div>
                        <div class="detail-block">
                            <span class="detail-lbl">Coordinates</span>
                            <span class="detail-val font-mono text-white">${r.lat.toFixed(6)}, ${r.lng.toFixed(6)}</span>
                        </div>
                        <div class="detail-block">
                            <span class="detail-lbl">Derived Severity</span>
                            <span class="detail-val font-bold text-${r.severity.toLowerCase()}">${r.severity}</span>
                        </div>
                        <div class="detail-block">
                            <span class="detail-lbl">Response Delay</span>
                            <span class="detail-val font-mono">${r.responseDelay !== null ? r.responseDelay + ' minutes' : 'N/A'}</span>
                        </div>
                        <div class="detail-block" style="grid-column: span 3;">
                            <span class="detail-lbl">Full Description</span>
                            <span class="detail-val text-white">${r.desc}</span>
                        </div>
                        <div class="detail-block" style="justify-content: center; align-items: flex-end;">
                            <button class="btn-glow-small" onclick="App.centerOnMap(${r.lat}, ${r.lng}, ${r.id})">📍 View On Map</button>
                        </div>
                    </div>
                </td>
            </tr>
        `;
        
        row.insertAdjacentHTML('afterend', detailsHtml);
    },

    /**
     * Map Navigation Link: Centers the Leaflet Map onto a specific record
     */
    centerOnMap(lat, lng, recordId) {
        if (!lat || !lng) return;
        
        // 1. Shift View to Risk Analysis tab
        this.switchTab('risk');

        // 2. Recenter Leaflet Map and open marker popup
        if (Interactions.mapInstance) {
            Interactions.mapInstance.setView([lat, lng], 15);
            
            // Loop through active marker layers to find this one and trigger popup
            if (Interactions.markerLayerGroup) {
                Interactions.markerLayerGroup.eachLayer(layer => {
                    const lLatLng = layer.getLatLng();
                    // Match coordinates to small floating error bounds
                    if (Math.abs(lLatLng.lat - lat) < 0.0001 && Math.abs(lLatLng.lng - lng) < 0.0001) {
                        setTimeout(() => {
                            layer.openPopup();
                        }, 300);
                    }
                });
            }
        }
    }
};

// Start the Dashboard App on page load
window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
