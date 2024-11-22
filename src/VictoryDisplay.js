import { seasons } from '../labyrinth.js';

class VictoryDisplay {
    constructor() {
        this.container = document.getElementById('victory-display');
        this.iconElement = this.container.querySelector('.victory-icon');
        this.textElement = this.container.querySelector('.victory-text');
    }

    show(season) {
        // Get season data
        const seasonData = seasons[season];
        
        // Set container styles
        this.container.style.cssText = `
            display: flex !important;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.5);
            padding: 20px;
            z-index: 9999;
            visibility: visible;
            opacity: 1;
            pointer-events: none;
        `;
        
        // Set icon styles
        this.iconElement.style.cssText = `
            display: block !important;
            width: 66vh;
            height: 66vh;
            max-width: 66vw;
            max-height: 66vw;
            object-fit: contain;
            visibility: visible;
            opacity: 1;
            filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.5))
                   drop-shadow(0 2px 2px rgba(0, 0, 0, 0.9))
                   drop-shadow(0 1px 1px rgba(0, 0, 0, 0.7));
        `;
        
        // Set the icon source
        this.iconElement.src = seasonData.icon;
        
        // Set the text
        this.textElement.textContent = `${season} Wins!`;
        this.textElement.style.color = `#${seasonData.color.toString(16).padStart(6, '0')}`;
        this.textElement.style.display = 'block';
    }

    hide() {
        this.container.style.display = 'none';
    }
}

export default VictoryDisplay;