class BoxScore {
    constructor() {
        this.container = document.querySelector('.box-score');
        
        this.scores = {
            Spring: { emoji: '🌸', value: 0, element: document.querySelector('[data-season="Spring"]')},
            Summer: { emoji: '🌿', value: 0, element: document.querySelector('[data-season="Summer"]')},
            Autumn: { emoji: '🍁', value: 0, element: document.querySelector('[data-season="Autumn"]')},
            Winter: { emoji: '❄️', value: 0, element: document.querySelector('[data-season="Winter"]')}
        };

        this.names = {
            Spring: "Spring",
            Summer: "Summer",
            Autumn: "Autumn",
            Winter: "Winter"
        };

        // Initialize positions
        Object.values(this.scores).forEach((score, index) => {
            score.element.style.position = 'absolute';
            score.element.style.left = '0';
            score.element.style.right = '0';
            score.element.style.height = '25%'; // Set fixed height for each score
        });
        // Change the container's positioning
        this.container.style.position = 'fixed';
        this.container.style.left = '20px';
        this.container.style.top = '40vh';  // Changed to 40% from top
        this.container.style.transform = 'translateY(-50%)';  // Center the box itself
        this.resize();
        // Debounce resize event
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.resize(), 100);
        });
    }

    resize() {
        // Calculate new dimensions based on window size
        const height = Math.min(window.innerHeight, window.innerWidth);
        const boxSize = height / 4;
        
        // Update container size
        this.container.style.width = `${boxSize}px`;
        this.container.style.height = `${boxSize * 0.8}px`;
        
        // Calculate new row height
        this.rowHeight = Math.floor((boxSize * 0.8) / 4 );
        
        // Update font sizes
        const fontSize = this.rowHeight * 0.5;
        this.container.style.fontSize = `${fontSize}px`;
        
        // Update positions immediately
        this.updatePositions();
    }

    setScores(scores) {
        ["Autumn", "Winter", "Summer", "Spring"].forEach(season => {
            this.scores[season].value = scores[season];
            this.scores[season].element.querySelector('.score').textContent = scores[season];
        });
        
        if (!this.updatePending) {
            this.updatePending = true;
            requestAnimationFrame(() => {
                this.updatePositions();
                this.updatePending = false;
            });
        }
    }

    setName(season, userName = season) {
        const scoreElement = this.scores[season]?.element;
        if (!scoreElement) return;
        // Find the season span that contains both emoji and name
        const seasonSpan = scoreElement.querySelector('.season');
        if (!seasonSpan) return;
        
        // Get the emoji for this season
        const emoji = this.scores[season].emoji;
        this.names[season] = userName;
        // Update just the text content while preserving the class, emoji, and styling
        seasonSpan.textContent = `${emoji} ${userName}`;
    }

    getName(season) {
        return this.names[season];
    }

    updatePositions() {
        const sortedScores = Object.entries(this.scores)
            .sort(([,a], [,b]) => b.value - a.value);

        sortedScores.forEach(([, score], index) => {
            const yPosition = (index-0.4) * this.rowHeight;
            score.element.style.transform = `translateY(${yPosition}px)`;
        });
    }
}

export default BoxScore;