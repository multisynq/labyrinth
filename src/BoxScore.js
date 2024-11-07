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
        });
        
        this.resize();
        // Add resize listener
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        // Calculate new dimensions based on window size
        const height = Math.min(window.innerHeight, window.innerWidth);
        const boxSize = height / 3.5; // Or whatever ratio you prefer
        
        // Update container size
        this.container.style.width = `${boxSize}px`;
        this.container.style.height = `${boxSize * 0.8}px`; // Slightly shorter than width
        
        // Calculate new row height
        this.rowHeight = (boxSize * 0.8) / 4; // Divide container height by number of rows
        
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

    updatePositions() {
        const sortedScores = Object.entries(this.scores)
            .sort(([,a], [,b]) => b.value - a.value);

        sortedScores.forEach(([, score], index) => {
            // Ensure transform stays within container bounds
            const yPosition = Math.min(
                index * this.rowHeight,
                this.container.clientHeight - this.rowHeight
            );
            score.element.style.transform = `translateY(${yPosition}px)`;
        });
    }
}

export default BoxScore;