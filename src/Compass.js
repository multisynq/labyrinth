class Compass {
    constructor(size = 40) {
        this.element = document.querySelector('.compass');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Make canvas positionable
        this.canvas.style.position = 'absolute';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        this.canvas.style.borderRadius = '50%';
        
        // Make sure parent element has position relative
        this.element.style.position = 'relative';
        
        this.setSize(size);
        this.element.appendChild(this.canvas);
        this.draw(0);
        
        // Set initial position to center
        this.setPosition(0, 0);
    }

    setSize(size) {
        // Don't set width/height on parent element
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style.width = `${size}px`;
        this.canvas.style.height = `${size}px`;
        this.centerX = size / 2;
        this.centerY = size / 2;
        this.radius = size / 2;
    }
    setPosition(x, y) {
        // The white square is drawn at (x*10-4, y*10-4) with size 8x8
        // To center the compass on this square:
        const squareX = x;  // x is already in the correct format from avatarMinimap
        const squareY = y;  // y is already in the correct format from avatarMinimap
        
        // Center the compass (size 40x40) on the white square
        const xPos = squareX - (this.canvas.width / 2) + 5;  // +4 to center on 8x8 square
        const yPos = squareY - (this.canvas.height / 2) + 5;

        // Keep compass within minimap bounds
        //const maxX = 220 - this.canvas.width;
        //const maxY = 220 - this.canvas.height;
        
        //const boundedX = Math.max(0, Math.min(maxX, xPos));
        //const boundedY = Math.max(0, Math.min(maxY, yPos));
        
        this.canvas.style.left = `${xPos}px`;
        this.canvas.style.top = `${yPos}px`;
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
        directions.forEach(dir => {
            ctx.beginPath();
            ctx.moveTo(0, -this.radius);
            ctx.lineTo(0, -this.radius + indentSize);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.rotate(Math.PI/2);
        });
    
        // Draw a more prominent needle
        // North (red) half
        ctx.beginPath();
        ctx.moveTo(-2, 0);  // Make needle wider
        ctx.lineTo(0, -this.radius + 5);  // Point
        ctx.lineTo(2, 0);   // Make needle wider
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 50, 50, 0.8)';
        ctx.fill();
        
        // South (white) half
        ctx.beginPath();
        ctx.moveTo(-2, 0);
        ctx.lineTo(0, this.radius - 5);
        ctx.lineTo(2, 0);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
    
        ctx.restore();
    }
    update(angle, x, y) {
        if (x !== undefined && y !== undefined) {
            this.setPosition(x, y);
        }
        this.draw(angle);
    }

    resize(size) {
        this.setSize(size);
        this.draw(0);
    }
}

export default Compass;