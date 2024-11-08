class Joystick {
    constructor(options = {}) {
        this.id = options.id || 'default';
        this.position = { x: 0, y: 0 };
        this.baseRadius = 50;
        this.stickRadius = 25;
        this.maxDistance = this.baseRadius - this.stickRadius;
        this.isDragging = false;
        this.touchStartTime = 0;
        this.tapTimeThreshold = 200;
        this.tapMovementThreshold = 10;
        this.touchStartPos = { x: 0, y: 0 };
        this.side = options.side || 'right';

        this.createElements();
        this.setupEventListeners();
    }

    createElements() {
        this.container = document.createElement('div');
        this.container.className = `joystick-container joystick-${this.side}`;
        
        this.base = document.createElement('div');
        this.base.className = 'joystick-base';
        
        this.stick = document.createElement('div');
        this.stick.className = 'joystick-stick';
        
        this.base.appendChild(this.stick);
        this.container.appendChild(this.base);
        document.body.appendChild(this.container);
    }

    setupEventListeners() {
        this.stick.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.isDragging) {
                const touch = e.touches[0];
                this.touchId = touch.identifier;
                this.handleStart(touch);
            }
        });

        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            for (let i = 0; i < e.touches.length; i++) {
                if (e.touches[i].identifier === this.touchId) {
                    this.handleMove(e.touches[i]);
                    break;
                }
            }
        });

        document.addEventListener('touchend', (e) => {
            e.preventDefault();
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === this.touchId) {
                    this.handleEnd(e.changedTouches[i]);
                    this.touchId = null;
                    break;
                }
            }
        });

        this.stick.addEventListener('mousedown', (e) => this.handleStart(e));
        document.addEventListener('mousemove', (e) => this.handleMove(e));
        document.addEventListener('mouseup', (e) => this.handleEnd(e));
    }

    handleStart(e) {
        this.isDragging = true;
        this.stick.style.transition = 'none';
        this.touchStartTime = Date.now();
        this.touchStartPos = {
            x: e.clientX,
            y: e.clientY
        };

        const startEvent = new CustomEvent(`joystick-start-${this.id}`, {
            detail: {
                side: this.side,
                position: this.position
            }
        });
        document.dispatchEvent(startEvent);
    }

    handleMove(e) {
        if (!this.isDragging) return;
        
        const rect = this.base.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        let deltaX = e.clientX - centerX;
        let deltaY = e.clientY - centerY;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > this.maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            deltaX = Math.cos(angle) * this.maxDistance;
            deltaY = Math.sin(angle) * this.maxDistance;
        }
        
        this.stick.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
        
        this.position = {
            x: deltaX / this.maxDistance,
            y: deltaY / this.maxDistance
        };
        
        const moveEvent = new CustomEvent(`joystick-move-${this.id}`, { 
            detail: {
                x: this.position.x,
                y: this.position.y,
                side: this.side
            }
        });
        document.dispatchEvent(moveEvent);
    }

    handleEnd(e) {
        if (!this.isDragging) return;
        
        const touchDuration = Date.now() - this.touchStartTime;
        const touchDistance = Math.sqrt(
            Math.pow(e.clientX - this.touchStartPos.x, 2) +
            Math.pow(e.clientY - this.touchStartPos.y, 2)
        );

        if (touchDuration < this.tapTimeThreshold && touchDistance < this.tapMovementThreshold) {
            const tapEvent = new CustomEvent(`joystick-tap-${this.id}`, {
                detail: { 
                    side: this.side,
                    position: this.position
                }
            });
            document.dispatchEvent(tapEvent);
        }

        const releaseEvent = new CustomEvent(`joystick-release-${this.id}`, {
            detail: {
                side: this.side,
                finalPosition: this.position
            }
        });
        document.dispatchEvent(releaseEvent);

        this.isDragging = false;
        this.stick.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        this.stick.style.transform = 'translate(-50%, -50%)';
        
        this.position = { x: 0, y: 0 };
        
        const moveEvent = new CustomEvent(`joystick-move-${this.id}`, { 
            detail: {
                x: 0,
                y: 0,
                side: this.side
            }
        });
        document.dispatchEvent(moveEvent);
    }
}

export { Joystick as default };