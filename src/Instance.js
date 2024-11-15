import { Actor, mix, AM_Spatial, Pawn, PM_Smoothed, PM_ThreeVisible, PM_ThreeInstanced, toRad, THREE } from '@croquet/worldcore';
import { csm } from '../labyrinth.js';
export const instances = {};
export const materials = {};
export const geometries = {};
// Floor cell instance geometry
geometries.floor = new THREE.PlaneGeometry(20,20,2,2);
geometries.floor.rotateX(toRad(-90));
// InstanceActor
// Generate loaded instances.
//------------------------------------------------------------------------------------------
export class InstanceActor extends mix(Actor).with(AM_Spatial) {
    get pawn() {return "InstancePawn"}
    get name() { return this._name || "column"}
    get color() { return this._color || 0xffffff }
    get max() { return this._max || 400 }
    setColor(color) { this._color = color; this.say("color", color); }
}
InstanceActor.register('InstanceActor');

// InstancePawn
// Load 3D models and convert them into instances. This is used when we have many
// copies of the same model. Loading these as instances is a bit tricky, hence the
// separate class.
//------------------------------------------------------------------------------------------
export class InstancePawn extends mix(Pawn).with(PM_Smoothed, PM_ThreeVisible, PM_ThreeInstanced) {
    constructor(...args) {
        super(...args);
        this.loadInstance();
        this.listen("color", this.doColor);
    }

    doColor(color) {
        this.setColor(new THREE.Color(color));
    }

    loadInstance() {
        if (this.doomed) return;
        const name = this.actor.name;
        let instance = this.useInstance(name);
        //if(instance) console.log("InstancePawn", name);
        if (!instance) { // does the instance not exist?
            if (instances[name] || geometries[name]) { // is it ready to load?
                const geometry = geometries[name] || instances[name].geometry.clone();
                const material = materials[name] || instances[name].material;
                csm.setupMaterial(material);
                //console.log("InstancePawn", name, geometry, material);
                const im = this.service("ThreeInstanceManager");
                im.addMaterial(name, material);
                im.addGeometry(name, geometry);
                im.addMesh(name, name, name, this.actor.max);
                instance = this.useInstance(name);
                instance.mesh.material.needsUpdate = true;
                csm.setupMaterial(instance.mesh.material);
                instance.mesh.receiveShadow = true;
                instance.mesh.castShadow = true;
            } else this.future(100).loadInstance(); // not ready to load - try again later
        }
        if (instance && this.actor.color) this.doColor(this.actor.color);
    }
}
InstancePawn.register("InstancePawn");
