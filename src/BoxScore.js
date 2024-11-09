class BoxScore {
    constructor() {
        this.container = document.querySelector('.box-score');
        this.scores = {
            Spring: { value: 0, element: document.querySelector('[data-season="Spring"]') },
            Summer: { value: 0, element: document.querySelector('[data-season="Summer"]') },
            Autumn: { value: 0, element: document.querySelector('[data-season="Autumn"]') },
            Winter: { value: 0, element: document.querySelector('[data-season="Winter"]') }
        };
        
        // Initialize positions
        Object.values(this.scores).forEach(score => {
            score.element.style.position = 'absolute';
            score.element.style.left = '0';
            score.element.style.right = '0';
            score.element.style.height = '25%'; // Set fixed height for each score
        });
        
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
        const boxSize = height / 3.5;
        
        // Update container size
        this.container.style.width = `${boxSize}px`;
        this.container.style.height = `${boxSize * 0.8}px`;
        
        // Calculate new row height
        this.rowHeight = Math.floor((boxSize * 0.8) / 4); // Ensure whole pixels
        
        // Update font sizes
        const fontSize = this.rowHeight * 0.5;
        this.container.style.fontSize = `${fontSize}px`;
        
        // Force layout recalculation
        this.container.offsetHeight;
        
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

    updatePositions() {
        const sortedScores = Object.entries(this.scores)
            .sort(([,a], [,b]) => b.value - a.value);

        sortedScores.forEach(([, score], index) => {
            const yPosition = index * this.rowHeight;
            score.element.style.transform = `translateY(${yPosition}px)`;
        });
    }
}

export default BoxScore;