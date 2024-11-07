class CountdownTimer {
    constructor(time) {
        this.element = document.getElementById('countdown');
        this.timeRemaining = Math.floor(time/1000); // Convert to seconds
    }

    set(time) {
        if (time<0) time = 0;
        this.timeRemaining = Math.floor(time/1000); // Convert to seconds
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;

        // Remove padStart for minutes, keep it for seconds
        this.element.textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Color changes based on time remaining
        if (this.timeRemaining <= 30) {
            this.element.style.color = 'rgba(255, 50, 50, 0.9)';
        } else if (this.timeRemaining <= 60) {
            this.element.style.color = 'rgba(255, 255, 0, 0.9)';
        } else {
            this.element.style.color = 'rgba(255, 255, 255, 0.9)';
        }
    }
}

export default CountdownTimer;