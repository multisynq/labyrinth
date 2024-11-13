import { Actor, mix, AM_Spatial, PM_Spatial,Pawn, PM_ThreeVisible, PM_ThreeInstanced, THREE, ADDONS } from '@croquet/worldcore';
import { csm } from '../labyrinth.js';
import { materials } from './Instance.js';

//-- WallActor -----------------------------------------------------------------------------
// This provides a simple wall.
//------------------------------------------------------------------------------------------
export class WallActor extends mix(Actor).with(AM_Spatial) {
    get pawn() {return "WallPawn"}
}
WallActor.register('WallActor');
//------------------------------------------------------------------------------------------
//-- WallPawn ------------------------------------------------------------------------------
// This is used to generate the walls of the maze.
//------------------------------------------------------------------------------------------
class WallPawn extends mix(Pawn).with(PM_Spatial, PM_ThreeVisible, PM_ThreeInstanced) {
    constructor(...args) {
        super(...args);
        this.wall = this.createInstance();
    }

    createInstance() {
        const im = this.service("ThreeInstanceManager");
        let wall = this.useInstance("wall");
        if ( !wall ) {
            const width = 20;
            const height = 10;
            const frontWall = new THREE.PlaneGeometry(width, height);
            const backWall = new THREE.PlaneGeometry(width, height);
            backWall.rotateY(Math.PI);
            const geometry = ADDONS.BufferGeometryUtils.mergeGeometries([frontWall, backWall], false);
            csm.setupMaterial(materials.wall);
            im.addMaterial("wall", materials.wall);
            im.addGeometry("wall", geometry);
            im.addMesh("wall", "wall", "wall");
            wall = this.useInstance("wall");
        }
        wall.mesh.material.needsUpdate = true;
        wall.mesh.receiveShadow = true;
        wall.mesh.castShadow = true;
        return wall;
    }
}
WallPawn.register("WallPawn");

export {WallActor as default };