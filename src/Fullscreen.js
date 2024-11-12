class FullscreenButton {
    constructor() {
        this.button = document.createElement('button');
        this.button.className = 'fullscreen-button';
        this.button.innerHTML = '⛶';
        this.button.setAttribute('aria-label', 'Toggle fullscreen');
        
        // Add iOS detection
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        
        // Hide button on iOS
        if (this.isIOS) {
            this.button.style.display = 'none';
        }
        
        // Add the pointer down event listener
        this.button.addEventListener('pointerdown', (event) => {
            event.stopPropagation();
            event.preventDefault();
            this.toggleFullscreen();
        });
        
        document.body.appendChild(this.button);
    }

    async toggleFullscreen() {
        try {
            if (!document.fullscreenElement && 
                !document.webkitFullscreenElement && 
                !document.mozFullScreenElement &&
                !document.msFullscreenElement) {
                
                // Enter fullscreen
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    await document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    await document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    await document.documentElement.msRequestFullscreen();
                }
                
                // Handle mobile screen orientation
                if (screen.orientation && screen.orientation.lock) {
                    try {
                        await screen.orientation.lock('landscape');
                    } catch (e) {
                        console.log('Orientation lock not supported');
                    }
                }

                this.button.innerHTML = '⛶';
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    await document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    await document.msExitFullscreen();
                }

                this.button.innerHTML = '⛶';
            }
        } catch (err) {
            console.error('Fullscreen error:', err);
        }
    }
}

export default FullscreenButton;