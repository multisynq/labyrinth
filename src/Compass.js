class Compass {
    constructor(size = 40) {
        this.element = document.getElementById('compass');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setSize(size);
        this.element.appendChild(this.canvas);
        this.draw(0);
    }

    setSize(size) {
        this.element.style.width = `${size}px`;
        this.element.style.height = `${size}px`;
        this.canvas.width = size;
        this.canvas.height = size;
        this.centerX = size / 2;
        this.centerY = size / 2;
        this.radius = (size / 2) - 2;
    }

    draw(angle) {
        const ctx = this.ctx;
        // Clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw outer circle
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
        // Save context for rotation
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(-angle);
        // Draw direction indents
        const indentSize = this.radius * 0.15;
        const directions = [0, Math.PI/2, Math.PI, Math.PI*3/2];
        directions.forEach( dir => {
            ctx.beginPath();
            ctx.moveTo(0, -this.radius);
            ctx.lineTo(0, -this.radius + indentSize);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.rotate(Math.PI/2);
        });

        // Draw north (red) half of needle
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -this.radius + indentSize);
        ctx.strokeStyle = 'rgba(255, 50, 50, 0.8)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw south (white) half of needle
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.radius - indentSize);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Restore context
        ctx.restore();
    }

    update(angle) {
        this.draw(angle);
    }

    resize(size) {
        this.setSize(size);
        this.draw(0);
    }
}

export default Compass;