class DeviceDetector {
    constructor() {
        this._isMobile = this.checkIfMobile();
        console.log('Device Detection Details:', {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            vendor: navigator.vendor,
            touchPoints: navigator.maxTouchPoints,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            pixelRatio: window.devicePixelRatio,
            orientation: screen.orientation?.type || 'unknown',
            isMobile: this._isMobile
        });
    }

    checkIfMobile() {
        // Multiple checks for more reliable detection
        const checks = [
            // Check user agent
            () => /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            
            // Check platform
            () => ['iPhone', 'iPad', 'iPod', 'Android'].includes(navigator.platform),
            
            // Check screen size and touch
            () => window.innerWidth <= 800 && navigator.maxTouchPoints > 0,
            
            // Check orientation capability
            () => typeof screen.orientation !== 'undefined',
            
            // Check pixel ratio (most mobile devices have ratio > 1)
            () => window.devicePixelRatio >= 2,
            
            // Check vendor
            () => navigator.vendor?.includes('Apple') && navigator.maxTouchPoints > 0,
            
            // Check standalone mode (PWA)
            () => window.navigator.standalone === true
        ];

        // Additional iOS detection
        const isIOS = [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform) || 
        (navigator.userAgent.includes("Mac") && "ontouchend" in document);

        // Count how many checks pass
        const passedChecks = checks.filter(check => {
            try {
                return check();
            } catch (e) {
                return false;
            }
        }).length;

        // If iOS is detected or multiple checks pass, consider it mobile
        return isIOS || passedChecks >= 2;
    }

    get isMobile() {
        return this._isMobile;
    }

    get isDesktop() {
        return !this._isMobile;
    }

    refresh() {
        this._isMobile = this.checkIfMobile();
        return this._isMobile;
    }
}

export default DeviceDetector;