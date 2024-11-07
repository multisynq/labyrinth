class DeviceDetector {
    constructor() {
        this._isMobile = this.checkIfMobile();
        console.log('Device Detection Details:', {
            userAgent: navigator.userAgent,
            touchPoints: navigator.maxTouchPoints,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            isMobile: this._isMobile
        });
    }

    checkIfMobile() {
        // Primary check: User agent for mobile devices
        const ua = navigator.userAgent.toLowerCase();
        const mobileKeywords = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
        const isMobileUA = mobileKeywords.test(ua);

        // Secondary checks
        const isTouchOnly = navigator.maxTouchPoints > 0 && !ua.includes('windows') && !ua.includes('macintosh');
        
        // Many laptops now have touch screens, so we need to be more specific
        const isSmallScreen = window.innerWidth <= 800;

        // Return true only if we're confident it's a mobile device
        return isMobileUA || (isTouchOnly && isSmallScreen);
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