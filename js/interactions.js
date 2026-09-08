/* -------------------------------------------------------------
   TRAFFIC & ACCIDENT INTELLIGENCE SYSTEM - USER INTERACTIONS LAYER
   ------------------------------------------------------------- */

const Interactions = {
    mapInstance: null,
    markerLayerGroup: null,
    
    // Severity colors matching CSS theme
    colors: {
        rose: '#ff0055',    // CRITICAL
        orange: '#ff9900',  // SEVERE
        yellow: '#ffdd00',  // MODERATE
        green: '#00ff88',   // MINOR
        cyan: '#00f0ff'
    },

    /**
     * Initializes all UI interactions (3D Tilts, Easing Transitions, Maps, etc.)
     */
    init() {
        this.setupPageTransitions();
        this.setup3DTilts();
    },

    /**
     * Handle transition from Cinematic Landing Page to Dashboard
     */
    setupPageTransitions() {
        const btnGoNext = document.getElementById('btn-go-next');
        const landingPage = document.getElementById('landing-page');
        const dashboardWrapper = document.getElementById('dashboard-wrapper');

        if (btnGoNext && landingPage && dashboardWrapper) {
            btnGoNext.addEventListener('click', () => {
                landingPage.classList.add('slide-up');
                dashboardWrapper.classList.remove('hidden');
                
                // Allow CSS transition to finish, then hide landing page from layout
                setTimeout(() => {
                    landingPage.style.display = 'none';
                    // Trigger first viewport update (e.g. counters or layout fixes)
                    window.dispatchEvent(new Event('resize'));
                }, 800);
            });
        }
    },

    /**
     * Cursor-Based 3D Card Hover Rotation Effect
     */
    setup3DTilts() {
        // Find elements with the data-tilt attribute
        const tiltCards = document.querySelectorAll('[data-tilt]');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // Mouse position inside card
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Normalise mouse position offset to [-1, 1]
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                const maxRotation = 6; // Max degrees of tilt rotation
                
                const rotateY = (deltaX * maxRotation).toFixed(2);
                const rotateX = (-deltaY * maxRotation).toFixed(2); // Invert Y to tilt towards mouse
                
                // Apply rotation transform and slight lift
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) translateZ(10px)`;
                card.style.boxShadow = `0 15px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(0, 240, 255, 0.15)`;
            });

            card.addEventListener('mouseleave', () => {
                // Smooth transition back to neutral state
                card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0px)`;
                card.style.boxShadow = '';
            });

            card.addEventListener('mouseenter', () => {
                // Snap transition for interactive feedback on entrance
                card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
            });
        });
    },

    /**
     * Refreshes/re-attaches 3D tilts dynamically (for dynamically added elements)
     */
    refresh3DTilts() {
        this.setup3DTilts();
    },

    /**
     * Animates a single KPI number counting up from 0
     */
    animateValue(id, targetValue, suffix = '') {
        const el = document.getElementById(id);
        if (!el) return;

        // Strip non-numeric elements to animate
        const cleanString = targetValue.toString().replace(/[^0-9]/g, '');
        const endVal = parseInt(cleanString, 10) || 0;
        
        if (endVal === 0) {
            el.textContent = targetValue + suffix;
            return;
        }

        const duration = 1200; // Animation duration in milliseconds
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Linear progression mapped to value
            const currentVal = Math.floor(progress * endVal);
            
            el.textContent = currentVal.toLocaleString() + suffix;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Ensure exact ending value is displayed
                el.textContent = endVal.toLocaleString() + suffix;
            }
        };
        
        window.requestAnimationFrame(step);
    },

    /**
     * Initialize or update Leaflet risk map
     */
    renderMap(records) {
        const mapContainer = document.getElementById('risk-map');
        if (!mapContainer) return;

        // Compute centroid dynamically based on records to auto-align map
        let centerLat = 40.15;
        let centerLng = -75.35;
        let count = 0;

        records.forEach(r => {
            if (r.lat && r.lng) {
                centerLat += r.lat;
                centerLng += r.lng;
                count++;
            }
        });

        if (count > 0) {
            centerLat = centerLat / count;
            centerLng = centerLng / count;
        }

        // Initialize Map Instance if not already created
        if (!this.mapInstance) {
            this.mapInstance = L.map('risk-map', {
                center: [centerLat, centerLng],
                zoom: 11,
                zoomControl: true
            });

            // Load free OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.mapInstance);

            this.markerLayerGroup = L.layerGroup().addTo(this.mapInstance);
        } else {
            // If already initialized, clear previous marker layers and update center
            this.markerLayerGroup.clearLayers();
            this.mapInstance.setView([centerLat, centerLng], 11);
        }

        // Filter and plot top 500 incidents (prioritising Critical & Severe severity)
        const plottable = records
            .filter(r => r.lat && r.lng)
            .sort((a, b) => {
                const mapA = a.severity === 'CRITICAL' ? 3 : a.severity === 'SEVERE' ? 2 : a.severity === 'MODERATE' ? 1 : 0;
                const mapB = b.severity === 'CRITICAL' ? 3 : b.severity === 'SEVERE' ? 2 : b.severity === 'MODERATE' ? 1 : 0;
                if (mapA !== mapB) return mapB - mapA;
                return b.id - a.id;
            })
            .slice(0, 500);

        plottable.forEach(r => {
            let color = this.colors.green;
            if (r.severity === 'CRITICAL') color = this.colors.rose;
            else if (r.severity === 'SEVERE') color = this.colors.orange;
            else if (r.severity === 'MODERATE') color = this.colors.yellow;

            // Plot circle markers
            const marker = L.circleMarker([r.lat, r.lng], {
                radius: 6,
                fillColor: color,
                color: '#03050b',
                weight: 1.5,
                opacity: 0.9,
                fillOpacity: 0.75
            });

            // Bind structured details popup
            const popupContent = `
                <div class="map-popup-card">
                    <h5>${r.title}</h5>
                    <p><strong>Township:</strong> ${r.twp}</p>
                    <p><strong>Address:</strong> ${r.addr}</p>
                    <p><strong>Logged Time:</strong> ${r.timeStampStr}</p>
                    <p><strong>Response Delay:</strong> ${r.responseDelay !== null ? r.responseDelay + ' mins' : 'N/A'}</p>
                    <p><strong>Severity:</strong> <span style="color:${color};font-weight:700;">${r.severity}</span></p>
                </div>
            `;

            marker.bindPopup(popupContent);
            this.markerLayerGroup.addLayer(marker);
        });
    },

    /**
     * Fixes Leaflet rendering glitch when tab transitions from display:none to active
     */
    onTabChange(tabId) {
        if (tabId === 'risk' && this.mapInstance) {
            // Leaflet requires a slight timeout to render layout tiles after the DOM reveals it
            setTimeout(() => {
                this.mapInstance.invalidateSize(true);
            }, 250);
        }
    }
};
