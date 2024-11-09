class DeviceDetector {
    constructor() {
        this._isMobile = this.checkIfMobile();
        // Check URL parameters for override
        const urlParams = new URLSearchParams(window.location.search);
        const forceMobile = urlParams.get('mobile');
        if (forceMobile !== null) {
            this._isMobile = forceMobile.toLowerCase() === 'true';
        }

        console.log('Device Detection Details:', {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            vendor: navigator.vendor,
            touchPoints: navigator.maxTouchPoints,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            screenActual: `${window.screen.width}x${window.screen.height}`,
            pixelRatio: window.devicePixelRatio,
            orientation: screen.orientation?.type || 'unknown',
            isMobile: this._isMobile,
            forceMobile: forceMobile
        });
    }

    checkIfMobile() {
        const desktopOS = [
            'Win32',
            'Win64',
            'Windows',
            'WinCE',
            'Linux x86_64',
            'Linux i686',
            'Linux i586',
            'Linux i486',
            'Linux i386',
        ];

        // Modified platform check - don't return early for MacBooks
        if (desktopOS.includes(navigator.platform) && !navigator.userAgent.includes('Mobile')) {
            return false;
        }

        // Mobile-specific checks
        const mobileChecks = [
            // Check user agent for mobile keywords
            () => /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            
            // Check for mobile-specific features
            () => typeof window.orientation !== 'undefined',
            
            // Check screen size and pixel ratio
            () => (window.innerWidth <= 1024 && window.devicePixelRatio > 1),
            
            // Check for touch screen (modified to work with simulators)
            () => navigator.maxTouchPoints > 0,
        ];

        // iOS specific detection (enhanced)
        const isIOS = [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform) || 
        (navigator.userAgent.includes("iPad") || 
         navigator.userAgent.includes("iPhone")) ||
        // iOS 13+ iPad detection
        (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 0);

        // Count how many mobile checks pass
        const passedChecks = mobileChecks.filter(check => {
            try {
                return check();
            } catch (e) {
                return false;
            }
        }).length;

        // Return true if it's iOS or if at least one mobile indicator is present
        return isIOS || passedChecks >= 1; // Reduced threshold from 2 to 1
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