class GameButton {
    constructor() {
        this.element = null;
        this.callback = null;
        this.keyHandler = null;
    }

    show(callback) {
        // Store callback
        this.callback = callback;

        // Remove any existing button
        if (this.element) {
            this.element.remove();
        }

        // Create container
        this.element = document.createElement('div');
        this.element.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 2000;  
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        `;

        // Create button
        const button = document.createElement('button');
        button.textContent = 'New Game';
        button.style.cssText = `
            font-family: Arial, sans-serif;
            font-size: 28px;
            font-weight: bold;
            color: #FFFFFF;
            background: rgba(0, 0, 0, 0.95);
            padding: 20px 40px;
            border: 3px solid rgba(255, 255, 255, 0.8);
            border-radius: 16px;
            cursor: pointer;
            box-shadow: 
                0 0 0 2px rgba(0, 0, 0, 0.3),
                0 4px 6px rgba(0, 0, 0, 0.4),
                0 8px 12px rgba(0, 0, 0, 0.3),
                0 16px 24px rgba(0, 0, 0, 0.2),
                0 32px 48px rgba(0, 0, 0, 0.1);
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
            transition: all 0.2s ease-in-out;
        `;

        // Add hover effects
        button.onmouseover = (e) => {
            e.stopPropagation();
            button.style.transform = 'translateY(-3px) scale(1.02)';
            button.style.boxShadow = `
                0 0 0 2px rgba(0, 0, 0, 0.3),
                0 6px 8px rgba(0, 0, 0, 0.4),
                0 12px 16px rgba(0, 0, 0, 0.3),
                0 24px 32px rgba(0, 0, 0, 0.2),
                0 48px 64px rgba(0, 0, 0, 0.1)
            `;
            button.style.borderColor = 'rgba(255, 255, 255, 0.9)';
        };

        button.onmouseout = (e) => {
            e.stopPropagation();
            button.style.transform = 'translateY(0) scale(1)';
            button.style.boxShadow = `
                0 0 0 2px rgba(0, 0, 0, 0.3),
                0 4px 6px rgba(0, 0, 0, 0.4),
                0 8px 12px rgba(0, 0, 0, 0.3),
                0 16px 24px rgba(0, 0, 0, 0.2),
                0 32px 48px rgba(0, 0, 0, 0.1)
            `;
            button.style.borderColor = 'rgba(255, 255, 255, 0.8)';
        };

        button.onmousedown = (e) => {
            e.stopPropagation();
            button.style.transform = 'translateY(2px) scale(0.98)';
            button.style.boxShadow = `
                0 0 0 2px rgba(0, 0, 0, 0.3),
                0 2px 4px rgba(0, 0, 0, 0.4),
                0 4px 8px rgba(0, 0, 0, 0.3),
                0 8px 16px rgba(0, 0, 0, 0.2),
                0 16px 32px rgba(0, 0, 0, 0.1)
            `;
            button.style.borderColor = 'rgba(255, 255, 255, 0.7)';
        };

        button.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.triggerCallback();
        };

        // Prevent pointer events from reaching elements below
        this.element.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
        });

        // Add keyboard handler for Enter key
        this.keyHandler = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                button.style.transform = 'translateY(1px)';
                button.style.boxShadow = `
                    0 2px 4px rgba(0, 0, 0, 0.3),
                    0 4px 8px rgba(0, 0, 0, 0.2),
                    0 8px 16px rgba(0, 0, 0, 0.1)
                `;
                // Small delay to show the button press effect
                setTimeout(() => {
                    this.triggerCallback();
                }, 100);
            }
        };
        document.addEventListener('keydown', this.keyHandler);

        // Add button to container
        this.element.appendChild(button);

        // Add to document
        document.body.appendChild(this.element);
    }

    triggerCallback() {
        if (this.callback) {
            this.callback();
        }
        this.hide();
    }

    hide() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
        // Remove keyboard handler when hiding
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
            this.keyHandler = null;
        }
    }
}

export default GameButton;