class DeviceDetector {
    constructor() {
        this._isMobile = this.checkIfMobile();
        this._isIOS = this.checkIfiOS();
        // Check URL parameters for override
        const urlParams = new URLSearchParams(window.location.search);
        const forceMobile = urlParams.get('mobile');
        if (forceMobile !== null) {
            this._isMobile = forceMobile.toLowerCase() === 'true';
        }

        console.log('Device Detection Details:', {
            userAgent: navigator.userAgent,
            touchPoints: navigator.maxTouchPoints,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            screenActual: `${window.screen.width}x${window.screen.height}`,
            pixelRatio: window.devicePixelRatio,
            orientation: screen.orientation?.type || 'unknown',
            isMobile: this._isMobile,
            isIOS: this._isIOS,
            forceMobile: forceMobile
        });
    }

    checkIfiOS() {
        // Simplified iOS check focusing on touch points for iPad Pro
        return navigator.maxTouchPoints > 1 || /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    checkIfMobile() {
        // Debug logging
        const debugInfo = {
            userAgent: navigator.userAgent,
            maxTouchPoints: navigator.maxTouchPoints,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            pixelRatio: window.devicePixelRatio
        };
        console.log('Device Debug Info:', debugInfo);

        // First check: Touch points (catches iPad Pro)
        if (navigator.maxTouchPoints > 1) {
            console.log('Detected touch device with multiple touch points');
            return true;
        }

        // Second check: iOS devices
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            console.log('Detected iOS device via user agent');
            return true;
        }

        // Mobile-specific checks as fallback
        const mobileChecks = [
            // User agent check
            () => {
                const ua = navigator.userAgent.toLowerCase();
                const isMobile = /mobile|android|phone|samsung|galaxy/i.test(ua);
                console.log('UA Mobile Check:', isMobile, ua);
                return isMobile;
            },
            
            // Screen size and ratio check
            () => {
                const isMobileSize = window.innerWidth <= 768 || window.devicePixelRatio >= 2.5;
                console.log('Screen Size Check:', isMobileSize);
                return isMobileSize;
            },
            
            // Basic touch capability
            () => {
                const hasTouch = navigator.maxTouchPoints > 0;
                console.log('Touch Check:', hasTouch);
                return hasTouch;
            },
        ];

        // Run fallback checks
        const results = mobileChecks.map(check => {
            try {
                return check();
            } catch (e) {
                console.error('Check failed:', e);
                return false;
            }
        });

        console.log('Mobile Check Results:', results);
        return results.some(result => result === true);
    }

    get isMobile() {
        return this._isMobile;
    }

    get isDesktop() {
        return !this._isMobile;
    }

    get isIOS() {
        return this._isIOS;
    }

    refresh() {
        this._isMobile = this.checkIfMobile();
        return this._isMobile;
    }
}

export default DeviceDetector;