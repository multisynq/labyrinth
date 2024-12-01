class Tree {
    constructor(model) {
        this.model = model;
        this.initialPositions = new Map();
        this.time = 0;
        
        // Store initial vertex positions
        this.saveInitialPositions();
    }

    saveInitialPositions() {
        // Traverse the model to find all meshes
        this.model.traverse((child) => {
            if (child.isMesh && child.geometry) {
                // Store original positions of vertices
                const positions = child.geometry.attributes.position.array;
                this.initialPositions.set(child, Float32Array.from(positions));
            }
        });
    }

    update(deltaTime) {
        this.time += deltaTime;

        this.model.traverse((child) => {
            if (child.isMesh && child.geometry) {
                const positions = child.geometry.attributes.position.array;
                const originalPositions = this.initialPositions.get(child);

                // Update each vertex position
                for (let i = 0; i < positions.length; i += 3) {
                    const y = originalPositions[i + 1]; // Original height (y-coordinate)
                    
                    // Calculate sway amount based on height
                    // Higher vertices sway more than lower ones
                    const swayFactor = Math.pow(y / 10, 1.5); // Adjust divisor to control sway intensity
                    
                    // Combine multiple sine waves for more natural movement
                    const swayX = Math.sin(this.time * 1.5 + y * 0.1) * 0.1 * swayFactor;
                    const swayZ = Math.cos(this.time * 2.0 + y * 0.1) * 0.1 * swayFactor;

                    // Apply sway to x and z coordinates
                    positions[i] = originalPositions[i] + swayX;
                    positions[i + 2] = originalPositions[i + 2] + swayZ;
                }

                // Mark geometry for update
                child.geometry.attributes.position.needsUpdate = true;
            }
        });
    }
}

// Usage example:
const tree = new Tree(treeModel);

// In your animation loop:
function animate(time) {
    requestAnimationFrame(animate);
    
    const deltaTime = clock.getDelta();
    tree.update(deltaTime);
    
    renderer.render(scene, camera);
}

----------

class Tree {
    constructor(model) {
        this.model = model;
        this.initialPositions = new Map();
        this.time = 0;
        
        // Wind parameters
        this.windDirection = new THREE.Vector2(1, 1).normalize();
        this.windStrength = 1.0;
        this.gustTimer = 0;
        this.currentGust = 0;
        
        this.saveInitialPositions();
    }

    updateWind(deltaTime) {
        // Update gust
        this.gustTimer += deltaTime;
        if (this.gustTimer > Math.random() * 2 + 1) { // Random gust every 1-3 seconds
            this.gustTimer = 0;
            this.currentGust = Math.random() * 2; // Random gust strength
        }
        
        // Fade out gust
        this.currentGust *= 0.95;
        
        // Slowly change wind direction
        const windChangeSpeed = 0.1;
        this.windDirection.x += (Math.random() - 0.5) * windChangeSpeed * deltaTime;
        this.windDirection.y += (Math.random() - 0.5) * windChangeSpeed * deltaTime;
        this.windDirection.normalize();
    }

    update(deltaTime) {
        this.time += deltaTime;
        this.updateWind(deltaTime);

        this.model.traverse((child) => {
            if (child.isMesh && child.geometry) {
                const positions = child.geometry.attributes.position.array;
                const originalPositions = this.initialPositions.get(child);

                for (let i = 0; i < positions.length; i += 3) {
                    const y = originalPositions[i + 1];
                    
                    // Calculate sway amount based on height and wind
                    const swayFactor = Math.pow(y / 10, 1.5);
                    const windEffect = (this.windStrength + this.currentGust) * swayFactor;
                    
                    // Combine smooth movement with wind direction
                    const baseSwayX = Math.sin(this.time * 1.5 + y * 0.1);
                    const baseSwayZ = Math.cos(this.time * 2.0 + y * 0.1);
                    
                    const swayX = (baseSwayX + this.windDirection.x) * windEffect * 0.1;
                    const swayZ = (baseSwayZ + this.windDirection.y) * windEffect * 0.1;

                    positions[i] = originalPositions[i] + swayX;
                    positions[i + 2] = originalPositions[i + 2] + swayZ;
                }

                child.geometry.attributes.position.needsUpdate = true;
            }
        });
    }
}


The tree is likely a collection of meshes and groups, each with their own local transforms. Should the positions that make up the geometry first be transformed to the trees base coordinate system?

Yes, absolutely! When dealing with a hierarchical model, we need to consider the world positions of vertices. Here's the improved version that handles the transform hierarchy correctly:

class Tree {
    constructor(model) {
        this.model = model;
        this.initialPositions = new Map();
        this.initialMatrices = new Map();
        this.time = 0;
        
        // Store initial state
        this.saveInitialState();
    }

    saveInitialState() {
        // Update world matrices for the entire tree
        this.model.updateWorldMatrix(true, true);

        this.model.traverse((child) => {
            if (child.isMesh && child.geometry) {
                // Store original vertex positions in local space
                const positions = child.geometry.attributes.position.array;
                this.initialPositions.set(child, Float32Array.from(positions));

                // Store the initial world matrix
                this.initialMatrices.set(child, child.matrixWorld.clone());
            }
        });
    }

    update(deltaTime) {
        this.time += deltaTime;

        // Temporary vectors and matrices for calculations
        const tempVector = new THREE.Vector3();
        const tempMatrix = new THREE.Matrix4();
        const invMatrix = new THREE.Matrix4();

        this.model.traverse((child) => {
            if (child.isMesh && child.geometry) {
                const positions = child.geometry.attributes.position.array;
                const originalPositions = this.initialPositions.get(child);
                const originalMatrix = this.initialMatrices.get(child);

                // Get current world matrix
                child.updateWorldMatrix(true, false);
                
                // Calculate matrix to transform from original world space to current local space
                invMatrix.copy(child.matrixWorld).invert();
                tempMatrix.multiplyMatrices(invMatrix, originalMatrix);

                // Update each vertex
                for (let i = 0; i < positions.length; i += 3) {
                    // Get original vertex position in world space
                    tempVector.set(
                        originalPositions[i],
                        originalPositions[i + 1],
                        originalPositions[i + 2]
                    );
                    
                    // Transform to original world space
                    tempVector.applyMatrix4(originalMatrix);

                    // Calculate height in world space
                    const worldY = tempVector.y;

                    // Apply sway based on world height
                    const swayFactor = Math.pow(worldY / 10, 1.5);
                    const swayX = Math.sin(this.time * 1.5 + worldY * 0.1) * 0.1 * swayFactor;
                    const swayZ = Math.cos(this.time * 2.0 + worldY * 0.1) * 0.1 * swayFactor;

                    // Apply sway in world space
                    tempVector.x += swayX;
                    tempVector.z += swayZ;

                    // Transform back to current local space
                    tempVector.applyMatrix4(invMatrix);

                    // Update vertex position
                    positions[i] = tempVector.x;
                    positions[i + 1] = tempVector.y;
                    positions[i + 2] = tempVector.z;
                }

                child.geometry.attributes.position.needsUpdate = true;
            }
        });
    }
}

// Usage:
const tree = new Tree(treeModel);

// In animation loop:
function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();
    tree.update(deltaTime);
    renderer.render(scene, camera);
}

----------
For even better performance with complex models:


class Tree {
    constructor(model) {
        // ... previous constructor code ...
        
        // Pre-allocate reusable arrays for transformed positions
        this.worldPositions = new Map();
        this.model.traverse((child) => {
            if (child.isMesh && child.geometry) {
                const count = child.geometry.attributes.position.count;
                this.worldPositions.set(child, new Float32Array(count * 3));
            }
        });
    }

    update(deltaTime) {
        this.time += deltaTime;

        const tempVector = new THREE.Vector3();
        const tempMatrix = new THREE.Matrix4();
        const invMatrix = new THREE.Matrix4();

        this.model.traverse((child) => {
            if (child.isMesh && child.geometry) {
                const positions = child.geometry.attributes.position.array;
                const originalPositions = this.initialPositions.get(child);
                const originalMatrix = this.initialMatrices.get(child);
                const worldPositions = this.worldPositions.get(child);

                // Transform all vertices to world space at once
                child.updateWorldMatrix(true, false);
                invMatrix.copy(child.matrixWorld).invert();
                tempMatrix.multiplyMatrices(invMatrix, originalMatrix);

                // Batch process vertices
                for (let i = 0; i < positions.length; i += 3) {
                    tempVector.fromArray(originalPositions, i);
                    tempVector.applyMatrix4(originalMatrix);
                    
                    const worldY = tempVector.y;
                    const swayFactor = Math.pow(worldY / 10, 1.5);
                    
                    // Combined sway calculation
                    const swayAmount = swayFactor * 0.1;
                    const timeOffset = this.time + worldY * 0.1;
                    tempVector.x += Math.sin(timeOffset * 1.5) * swayAmount;
                    tempVector.z += Math.cos(timeOffset * 2.0) * swayAmount;
                    
                    tempVector.applyMatrix4(invMatrix);
                    tempVector.toArray(positions, i);
                }

                child.geometry.attributes.position.needsUpdate = true;
            }
        });
    }
}