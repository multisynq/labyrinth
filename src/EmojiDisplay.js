class EmojiDisplay {
    constructor() {
        this.element = null;
    }

    show(emoji, size = 32, color, text1, text2 = null) {
        // Remove any existing emoji
        if (this.element) {
            this.element.remove();
        }

        // Determine position based on whether text2 is provided
        const position = text2 ? {
            left: '50%',
            top: '160px',  // Position to center on minimap (50px + 110px)
            transform: 'translateX(-50%)'
        } : {
            right: '20px',
            bottom: '20px',
            transform: 'none'
        };

        // Create container
        this.element = document.createElement('div');
        this.element.style.cssText = `
            position: fixed;
            ${position.left ? 'left: ' + position.left + ';' : ''}
            ${position.right ? 'right: ' + position.right + ';' : ''}
            ${position.top ? 'top: ' + position.top + ';' : ''}
            ${position.bottom ? 'bottom: ' + position.bottom + ';' : ''}
            transform: ${position.transform};
            z-index: 1000;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            width: ${size}px;
        `;
        
        // Create emoji element
        const emojiElement = document.createElement('div');
        emojiElement.style.cssText = `
            font-size: ${size}px;
            text-shadow: 
                0 4px 3px rgba(0, 0, 0, 0.5),
                0 2px 2px rgba(0, 0, 0, 0.9),
                0 1px 1px rgba(0, 0, 0, 0.7);
            line-height: 1;
        `;
        emojiElement.textContent = emoji;
        
        // Create first text element
        const textElement1 = document.createElement('div');
        textElement1.style.cssText = `
            font-family: Arial, sans-serif;
            font-size: ${size/4}px;
            font-weight: bold;
            color: #${color.toString(16).padStart(6, '0')};
            margin-top: 2px;
            text-shadow: 
                0 2px 2px rgba(0, 0, 0, 0.9),
                0 4px 4px rgba(0, 0, 0, 0.9),
                0 6px 8px rgba(0, 0, 0, 0.9);
            width: 100%;
        `;
        textElement1.textContent = text1;
        
        // Add elements to container
        this.element.appendChild(emojiElement);
        this.element.appendChild(textElement1);

        // Add second text if provided
        if (text2) {
            const textElement2 = document.createElement('div');
            textElement2.style.cssText = `
                font-family: Arial, sans-serif;
                font-size: ${size/4}px;
                font-weight: bold;
                color: #${color.toString(16).padStart(6, '0')};
                margin-top: 2px;
                text-shadow: 
                    0 2px 2px rgba(0, 0, 0, 0.9),
                    0 4px 4px rgba(0, 0, 0, 0.9),
                    0 6px 8px rgba(0, 0, 0, 0.9);
                width: 100%;
            `;
            textElement2.textContent = text2;
            this.element.appendChild(textElement2);
        }

        document.body.appendChild(this.element);
    }

    hide() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}

export default EmojiDisplay;