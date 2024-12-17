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
            //platform: navigator.platform,
            //vendor: navigator.vendor,
            touchPoints: navigator.maxTouchPoints,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            screenActual: `${window.screen.width}x${window.screen.height}`,
            pixelRatio: window.devicePixelRatio,
            orientation: screen.orientation?.type || 'unknown',
            isMobile: this._isMobile,
            forceMobile: forceMobile
        });
    }

    checkIfiOS() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
             (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        return isIOS;
    }

    checkIfMobile() {
        // Debug logging
        const debugInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            maxTouchPoints: navigator.maxTouchPoints,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            pixelRatio: window.devicePixelRatio
        };
        console.log('Device Debug Info:', debugInfo);

        // Check if it's a Mac first
        const isMac = (
            navigator.platform.includes('Mac') && 
            navigator.userAgent.includes('Macintosh') && 
            !navigator.userAgent.includes('Mobile')
        );
        
        if (isMac) {
            return false;
        }

        // Mobile-specific checks
        const mobileChecks = [
            // Primary check: User agent for mobile keywords
            () => {
                const ua = navigator.userAgent.toLowerCase();
                const isMobile = /mobile|android|iphone|ipad|phone|samsung|galaxy/i.test(ua);
                console.log('UA Mobile Check:', isMobile, ua);
                return isMobile;
            },
            
            // Screen size and ratio check
            () => {
                const isMobileSize = window.innerWidth <= 768 || window.devicePixelRatio >= 2.5;
                console.log('Screen Size Check:', isMobileSize);
                return isMobileSize;
            },
            
            // Touch capability
            () => {
                const hasTouch = navigator.maxTouchPoints > 0;
                console.log('Touch Check:', hasTouch);
                return hasTouch;
            },
        ];

        // Run checks and log results
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