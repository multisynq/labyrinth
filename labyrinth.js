//------------------Labyrinth---------------------------------------------------------------
// This is a simple example of a multi-player 3D shooter.
// Actually, it isn't just a shooter. It is a strategy game.
// Think of it as "Go" with guns.
//
// It is loosely based upon the early Maze War game created at NASA Ames in 1973
// https://en.wikipedia.org/wiki/Maze_War and has elements of Pacman, The Colony and Dodgeball.
//------------------------------------------------------------------------------------------
// Changes:
// Minimal world - showing we exist. We get an alert when a new user joins.
// Add simple avatars w/ mouselook interface
// Add missiles and collision detection
// Fix textures, add powerup with fake glow, add wobble shader
// Better missiles. Maze walls are instanced. Generate the maze.
// Collision detection with walls for avatars and missiles.
// Columns, CSM lighting
// Added floor reflections, enhance lighting, fixed disappearing columns
// Added the horse weenie
// Changed sky, added uv coordinates to hexasphere
// Avatar & missile tests collision with columns
// Seasonal trees weenies
// Made the missiles glow, slowed it down
// Place player at random location when spawned
// Sound effects:
// Missile bounce sound
// - missile fire sound
// - ready to shoot sound and click when not ready
// - player enter/exit game
// - missile whoosh when it goes by
// Cell collected tone
// Fixed sounds not playing after a while
// Fixed getting stuck under the horse
// Restructured loaded instance management
// Added ivy to some walls
// Added color to instances
// Break the floor model into a grid of floor tiles
// You can only claim cells from one of your own cells
// You can't claim a corner - they are fixed to the season color.
// Preloaded assets (sounds, textures, models). This is done before the main
// render loop starts. It is still taking too long to complete loading.
// Display the claimed cells on a 2D minimap.
// Track your avatar's location on the minimap.
// Missiles are color coded by the player's season color.
// Rotated the minimap so that my season color is at the bottom.
// Made the corner cells darker to make them more obvious.
// The players spawn and respawn in their own corners.
// Resize the minimap when the window is resized.
// Players cannot be harmed while on those four tiles, but they can shoot back. Projectiles bounce.
// You can only shoot if you are on your own season color.
// You move 1.5 times faster when you are on your own color.
// Added a compass rose to the minimap.
// Missile/missile collision works.
// Added credit info to be added to credits screen.
// Added effects when you capture a cell.
// Reusable fireball - hide it when not in use.
// If a user slices off a section of cells so that it is no longer connected to
// your tree, those cells revert to their original, null color. Use flood fill:
// https://www.geeksforgeeks.org/flood-fill-algorithm-implement-fill-paint/
// When you lose territory, players can actually see and hear it go away.
// Hook up the clock - start with 15 minutes.
// Added a sorted scoring display.
// Moved the timer and the score box to make room for mobile controls.
// Shrank the avatar radius to 3.7 so that they can't block a corridor.
// Fixed the fake glow material complaints - at least in local.
// Fixed the scoreboard so that it doesn't get larger.
// Added a version display to the bottom of the screen.
// Boxscore now resizes and doesn't get larger.
// Determine if we are on a mobile device.
// Restructured the code so that web objects are in separate files.
// If you fire when you first start, you get an error. Fixed.
// Joystick controls.
// Fix mobile testing.
// Broke up the big file into smaller files.
// Compass is in the minimap.
// Added a full screen button.
// Warmed up floor shader.
// Use '/' to turn sound on and off.
// Snap the floor shader to the floor.
// Destroy the glow when the avatar is destroyed.
// Play the shock sound when another player captures a cell.
// Shock and awe are working.
// Volume is working.
// Added text display for volume and sound and other things as required.
//------------------------------------------------------------------------------------------
// To do:
// Sound effects are put on hold until the avatar's sound is ready, but should be ignored.
// The center of the maze is at 10,10.
// The compass should be made as a circle around the minimap - each direction is the color.
// Shaders need to be "warmed-up" before they are used.
// - Missile shaders
// Perhaps raise your tiles.
// Resize elements when the window is resized.
// - Scoreboard
// - Clock
// - Minimap
// - Compass
// Three big weenies.
// Rooms?
// Different sound for the user cutting off cells
// The ivy needs to be cleaned up at the top.
// The iris of the eyes must match the season color.
// Add end game and effects.
// Need a rules screen at the start. See:
// https://docs.google.com/document/d/1qjPm6pxaejuq5KydRh0C6Honory8DLICO3jfQkpJotc/edit?usp=sharing
// Chat -broadcast messages to all players, colors are their team color. This is difficult, as we
// are in mouse look mode. Perhaps press "c" to type a message, hit enter and then you are back.
// Add a "ready" button to start the game.
// Music is streamed to the game from the web. Players can turn it on and off - or play along
// and vote for the songs they like. 
//------------------------------------------------------------------------------------------
// Bugs:
// The avatar is probably visible to other players before you can see them on
// loading. Need to hide the new avatar until it is able to play.
// Sometimes, a delay will cause you to jump through a wall - including outside of
// the maze. This is very bad.
//------------------------------------------------------------------------------------------
import { App, StartWorldcore, ViewService, ModelRoot, ViewRoot,Actor, mix,
    InputManager, AM_Spatial, PM_Spatial, PM_Smoothed, Pawn, AM_Avatar, PM_Avatar, UserManager, User,
    q_yaw, q_pitch, q_axisAngle, v3_add, v3_sub, v3_normalize, v3_rotate, v3_scale, v3_distanceSqr,
    THREE, ADDONS, PM_ThreeVisible, ThreeRenderManager, PM_ThreeCamera, PM_ThreeInstanced, ThreeInstanceManager } from 'https://esm.run/@croquet/worldcore@2.0.0-alpha.28';

import { FullscreenButton } from './src/Fullscreen.js';
import FakeGlowMaterial from './src/FakeGlowMaterial.js';
import DeviceDetector from './src/DeviceDetector.js';
import BoxScore from './src/BoxScore.js';
import Compass from './src/Compass.js';
import Joystick from './src/Joystick.js';
import Countdown from './src/Countdown.js';
import MazeActor from './src/MazeActor.js';
import {InstanceActor, instances, materials} from './src/Instance.js';
import apiKey from "./src/apiKey.js";

function createTextDisplay() {
    // Create container
    const textDisplay = document.createElement('div');
    textDisplay.className = 'text-display';
    
    // Add to DOM just before version number
    const versionNumber = document.getElementById('version-number');
    versionNumber.parentNode.insertBefore(textDisplay, versionNumber);
    
    // Add CSS for fade effect with longer transition
    const style = document.createElement('style');
    style.textContent = `
        .text-display {
            position: fixed;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            font-family: Arial, sans-serif;
            background: rgba(0, 0, 0, 0.5);
            padding: 8px 16px;
            border-radius: 4px;
            z-index: 1000;
            opacity: 1;
            transition: opacity 2s ease-out;
            pointer-events: none;
            color: white;
        }
        
        .text-display.fade {
            opacity: 0;
        }
        
        .text-display.hidden {
            display: none;
        }
    `;
    document.head.appendChild(style);
    
    let currentTimeout;
    let fadeTimeout;
    
    // Return update function
    return (text, duration = 0) => {
        // Clear any existing timeouts
        if (currentTimeout) clearTimeout(currentTimeout);
        if (fadeTimeout) clearTimeout(fadeTimeout);
        
        // Remove classes and show element
        textDisplay.classList.remove('fade', 'hidden');
        // Force a reflow
        textDisplay.offsetHeight;
        
        // Update text
        textDisplay.textContent = text;
        
        // Set up fade if duration provided
        if (duration > 0) {
            currentTimeout = setTimeout(() => {
                textDisplay.classList.add('fade');
                
                // Set up the hide after fade completes
                fadeTimeout = setTimeout(() => {
                    textDisplay.classList.add('hidden');
                }, 2000); // Match the transition duration
            }, duration * 1000);
        }
    };
}

const setTextDisplay = createTextDisplay();

// Initialize fullscreen button
new FullscreenButton();
const device = new DeviceDetector();
console.log("Running on ", device.isMobile? "mobile device":"desktop");
setTextDisplay(device.isMobile? "mobile device":"desktop",10);

const boxScore = new BoxScore();
boxScore.setScores({"Spring": 4, "Summer": 4, "Autumn": 4, "Winter": 4});

const compass = new Compass();



// Textures
//------------------------------------------------------------------------------------------
import sky from "./assets/textures/aboveClouds.jpg";
import missile_color from "./assets/textures/metal_gold_vein/metal_0080_color_1k.jpg";
import missile_normal from "./assets/textures/metal_gold_vein/metal_0080_normal_opengl_1k.png";
import missile_roughness from "./assets/textures/metal_gold_vein/metal_0080_roughness_1k.jpg";
import missile_displacement from "./assets/textures/metal_gold_vein/metal_0080_height_1k.png";
import missile_metalness from "./assets/textures/metal_gold_vein/metal_0080_metallic_1k.jpg";
/*
import power_color from "./assets/textures/metal_hex/metal_0076_color_1k.jpg";
import power_normal from "./assets/textures/metal_hex/metal_0076_normal_opengl_1k.png";
import power_roughness from "./assets/textures/metal_hex/metal_0076_roughness_1k.jpg";
import power_displacement from "./assets/textures/metal_hex/metal_0076_height_1k.png";
import power_metalness from "./assets/textures/metal_hex/metal_0076_metallic_1k.jpg";
*/
import marble_color from "./assets/textures/marble_checker/marble_0013_color_1k.jpg";
import marble_normal from "./assets/textures/marble_checker/marble_0013_normal_opengl_1k.png";
import marble_roughness from "./assets/textures/marble_checker/marble_0013_roughness_1k.jpg";
import marble_displacement from "./assets/textures/marble_checker/marble_0013_height_1k.png";

import corinthian_color from "./assets/textures/corinthian/concrete_0014_color_1k.jpg";
import corinthian_normal from "./assets/textures/corinthian/concrete_0014_normal_opengl_1k.png";
import corinthian_roughness from "./assets/textures/corinthian/concrete_0014_roughness_1k.jpg";
import corinthian_displacement from "./assets/textures/corinthian/concrete_0014_height_1k.png";

// 3D Models
//------------------------------------------------------------------------------------------
// https://free3d.com/3d-model/eyeball-3d-model-181166.html
import eyeball_glb from "./assets/eyeball.glb";
// https://free3d.com/3d-model/-doric-column--353773.html
import column_glb from "./assets/column2.glb";
// https://www.robscanlon.com/hexasphere/
import hexasphere_glb from "./assets/hexasphere.glb";
// https://optimesh.gumroad.com/l/SJpXC
import horse2_glb from "./assets/Horse_Copper2.glb";
// https://sketchfab.com/tochechka
import fourSeasonsTree_glb from "./assets/fourSeasonsTree.glb";
// https://sketchfab.com/dangry
import ivy_glb from "./assets/ivy2.glb";

// Shaders
//------------------------------------------------------------------------------------------
// https://www.clicktorelease.com/code/perlin/explosion.html
import fireballTexture from "./assets/textures/explosion.png";
import * as fireballFragmentShader from "./src/shaders/fireball.frag.js";
import * as fireballVertexShader from "./src/shaders/fireball.vert.js";

// Sounds
//------------------------------------------------------------------------------------------
import bounceSound from "./assets/sounds/bounce.wav";
import shootSound from "./assets/sounds/shot1.wav";
import shootFailSound from "./assets/sounds/ShootFail.wav";
import rechargedSound from "./assets/sounds/Recharge.wav";
import enterSound from "./assets/sounds/avatarEnter.wav";
import exitSound from "./assets/sounds/avatarLeave.wav";
import missileSound from "./assets/sounds/Warning.mp3";
import implosionSound from "./assets/sounds/Implosion.mp3";
//import cellSound from "./assets/sounds/Granted.wav";
import cellSound from "./assets/sounds/Heartbeat4.wav";
import shockSound from "./assets/sounds/Shock.wav";
import aweSound from "./assets/sounds/Awe.wav";

// Global Variables
//------------------------------------------------------------------------------------------
const PI_2 = Math.PI/2;
const PI_4 = Math.PI/4;
const MISSILE_LIFE = 4000;
export const CELL_SIZE = 20;
const AVATAR_RADIUS = 3.7;
const AVATAR_HEIGHT = 6.0;
const MISSILE_RADIUS = 2;
const WALL_EPSILON = 0.01;
const MAZE_ROWS = 20;
const MAZE_COLUMNS = 20;
const MISSILE_SPEED = 0.50;

export let csm; // CSM is Cascaded Shadow Maps
export const seasons = {
    Spring:{cell:{x:0,y:0}, nextCell:{x:1,y:1}, angle:180+45, color:0xFFB6C1, color2:0xCC8A94, color3:0xB37780},
    Summer: {cell: {x:0,y:CELL_SIZE-2}, nextCell:{x:1,y:CELL_SIZE-3}, angle:270+45, color:0x90EE90, color2:0x65AA65, color3:0x508850},
    Autumn: {cell:{x:CELL_SIZE-2, y:CELL_SIZE-2}, nextCell:{x:CELL_SIZE-3,y:CELL_SIZE-3}, angle:0+45, color:0xFFE5B4, color2:0xCCB38B, color3:0xB39977},
    Winter: {cell:{x:CELL_SIZE-2, y:0}, nextCell:{x:CELL_SIZE-3,y:1}, angle:90+45, color:0xA5F2F3, color2:0x73BFBF, color3:0x5AA5A5}};
// Minimap canvas
const minimapCanvas = document.createElement('canvas');
const minimapCtx = minimapCanvas.getContext('2d');
minimapCtx.globalAlpha = 0.1;
minimapCanvas.width = 200;
minimapCanvas.height = 200;

function scaleMinimap() {
    const minimapDiv = document.getElementById('minimap');
    const height = Math.min(window.innerHeight, window.innerWidth);

    // Calculate size where diagonal is 1/3 of page height
    // For a square, diagonal = side * √2
    // So, side = diagonal / √2
    const diagonal = height / 2;
    const sideLength = diagonal / Math.sqrt(2);

    // Set the size
    minimapDiv.style.width = `${sideLength}px`;
    minimapDiv.style.height = `${sideLength}px`;
    minimapCanvas.style.width = `${sideLength}px`;
    minimapCanvas.style.height = `${sideLength}px`;
    compass.resize(sideLength/6);
}

let readyToLoad3D = false;
let readyToLoadTextures = false;
let readyToLoadSounds = false;
let eyeball;
let column;
let hexasphere;
let horse;
let trees;
let plants;
let ivy;

scaleMinimap();

// Sound Manager
//------------------------------------------------------------------------------------------
let soundSwitch = false; // turn sound on and off
let volume = 1;

const maxSound = 16;
const listener = new THREE.AudioListener();
const soundList = {};
const soundLoops = [];
const loopSoundVolume = 0.25;

export const playSound = function() {
    function play(soundURL, parent3D, force, loop = false) {
        if (!soundSwitch) return;
        
        // Check if we're on mobile and the audio context is suspended
        const audioContext = THREE.AudioContext.getContext();
        if (device.isMobile && audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                playSoundOnce(soundList[soundURL], parent3D, force, loop);
            });
        } else if (soundList[soundURL]) {
            playSoundOnce(soundList[soundURL], parent3D, force, loop);
        }
    }
    return play;
}();

function playSoundOnce(sound, parent3D, force, loop = false) {
    // console.log("playSoundOnce", sound.count, maxSound, parent3D);
    if (!force && sound.count>maxSound) return;
    sound.count++;
    let mySound;
    console.log("---------------------------");
    console.log("volume ", volume);
    if (parent3D) {
        mySound = new THREE.PositionalAudio( listener );  // listener is a global
        //mySound = new MyAudio( listener );  // listener is a global
        mySound.setRefDistance( 8 );
        mySound.setVolume( volume );
    }
    else {
        mySound = new THREE.Audio( listener );
        mySound.setVolume( volume * loopSoundVolume );
        soundLoops.push(mySound);
    }

    mySound.setBuffer( sound.buffer );
    mySound.setLoop(loop);
    if (parent3D) {
        parent3D.add(mySound);
        parent3D.mySound = mySound;
        mySound.onEnded = ()=> { sound.count--; mySound.removeFromParent(); };
    } else mySound.onEnded = ()=> { sound.count--; };

    mySound.play();
}

async function loadSounds() {
    const audioLoader = new THREE.AudioLoader();
    
    // Add mobile audio unlock
    if (device.isMobile) {
        const unlockAudio = () => {
            // Create and play a silent audio context
            const audioContext = THREE.AudioContext.getContext();
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            // Create and play a silent audio element
            const silentSound = new Audio();
            silentSound.play().catch(() => {});
            
            // Remove the event listeners once unlocked
            ['touchstart', 'touchend', 'click'].forEach(event => {
                document.removeEventListener(event, unlockAudio);
            });
        };

        // Add event listeners for user interaction
        ['touchstart', 'touchend', 'click'].forEach(event => {
            document.addEventListener(event, unlockAudio);
        });
    }

    return Promise.all([
        audioLoader.loadAsync(bounceSound),
        audioLoader.loadAsync(shootSound),
        audioLoader.loadAsync(shootFailSound),
        audioLoader.loadAsync(rechargedSound),
        audioLoader.loadAsync(enterSound),
        audioLoader.loadAsync(exitSound),
        audioLoader.loadAsync(missileSound),
        audioLoader.loadAsync(implosionSound),
        audioLoader.loadAsync(cellSound),
        audioLoader.loadAsync(shockSound),
        audioLoader.loadAsync(aweSound),
    ]);
}
loadSounds().then( sounds => {
    readyToLoadSounds = true;
    console.log("sounds loaded-------------------");
    soundList[bounceSound] = {buffer:sounds[0], count:0};
    soundList[shootSound] = {buffer:sounds[1], count:0};
    soundList[shootFailSound] = {buffer:sounds[2], count:0};
    soundList[rechargedSound] = {buffer:sounds[3], count:0};
    soundList[enterSound] = {buffer:sounds[4], count:0};
    soundList[exitSound] = {buffer:sounds[5], count:0};
    soundList[missileSound] = {buffer:sounds[6], count:0};
    soundList[implosionSound] = {buffer:sounds[7], count:0};
    soundList[cellSound] = {buffer:sounds[8], count:0};
    soundList[shockSound] = {buffer:sounds[9], count:0};
    soundList[aweSound] = {buffer:sounds[10], count:0}; 
});

// Load 3D Models
//------------------------------------------------------------------------------------------
async function modelConstruct() {
    const gltfLoader = new ADDONS.GLTFLoader();
    const dracoLoader = new ADDONS.DRACOLoader();
    dracoLoader.setDecoderPath('./src/draco/');
    gltfLoader.setDRACOLoader(dracoLoader);
    return [eyeball, column, ivy, hexasphere, horse, trees] = await Promise.all( [
        // add additional GLB files to load here
        gltfLoader.loadAsync( eyeball_glb ),
        gltfLoader.loadAsync( column_glb ),
        gltfLoader.loadAsync( ivy_glb ),
        gltfLoader.loadAsync( hexasphere_glb ),
        gltfLoader.loadAsync( horse2_glb ),
        gltfLoader.loadAsync( fourSeasonsTree_glb ),
    ]);
}

modelConstruct().then( () => {
    readyToLoad3D = true;
    console.log("models loaded-------------------");
    instances.column = column.scene.children[0];
    instances.column.geometry.scale(0.028,0.028,0.028);
    instances.column.geometry.rotateX(-PI_2);
    instances.ivy0 = ivy.scene.children[0];
    instances.ivy1 = ivy.scene.children[1];
    instances.ivy0.geometry.scale(8,5,4);
    instances.ivy1.geometry.scale(8,5,4);
    instances.ivy0.geometry.translate(0,3.5,0.22);
    instances.hexasphere = hexasphere.scene.children[0].children[0];
    instances.hexasphere.geometry.scale(0.05,0.05,0.05);
    fixUV(instances.hexasphere.geometry);
    plants = {Spring: new THREE.Group(), Summer: new THREE.Group(), Autumn: new THREE.Group(), Winter: new THREE.Group()};
    horse = horse.scene.clone();
    horse.traverse( m => {if (m.geometry) { m.castShadow=true; m.receiveShadow=true; m.position.set(0,0,0);} });

    trees.scene.children.forEach(node => {
        if (node.name) {
            if (node.name.includes("spring")) plants.Spring.add(node.clone());
            else if (node.name.includes("summer")) plants.Summer.add(node.clone());
            else if (node.name.includes("fall")) plants.Autumn.add(node.clone());
            else if (node.name.includes("winter")) plants.Winter.add(node.clone());
        }
    });
    plants.Spring.traverse( m => {if (m.geometry) { m.castShadow=true; m.receiveShadow=true; m.position.set(0,0,0); } });
    plants.Summer.traverse( m => {if (m.geometry) { m.castShadow=true; m.receiveShadow=true; m.position.set(0,0,0);} });
    plants.Autumn.traverse( m => {if (m.geometry) { m.castShadow=true; m.receiveShadow=true; m.position.set(0,0,0);} });
    plants.Winter.traverse( m => {if (m.geometry) { m.castShadow=true; m.receiveShadow=true; m.position.set(0,0,0);} });
});
function fixUV(geometry) {
    // Angle around the Y axis, counter-clockwise when looking from above.
    function azimuth( vector ) { return Math.atan2( vector.z, -vector.x ); }

    // Angle above the XZ plane.
    function inclination( vector ) {return Math.atan2( -vector.y, Math.sqrt( ( vector.x * vector.x ) + ( vector.z * vector.z ) ) ); }

    const uvBuffer = [];
    const vertex = new THREE.Vector3();
    const positions = geometry.getAttribute('position').array;
    // console.log("fixUV", positions);
    for ( let i = 0; i < positions.length; i += 3 ) {

        vertex.x = positions[ i + 0 ];
        vertex.y = positions[ i + 1 ];
        vertex.z = positions[ i + 2 ];

        const u = azimuth( vertex ) / 2 / Math.PI + 0.5;
        const v = inclination( vertex ) / Math.PI + 0.5;
        uvBuffer.push( u, 1 - v );
    }
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvBuffer, 2));
}
// Create fireball material
//------------------------------------------------------------------------------------------
let fireMaterial;
new THREE.TextureLoader().load(fireballTexture, texture => {
    fireMaterial = new THREE.ShaderMaterial( {
            uniforms: {
                tExplosion: { value: texture },
                time: { value: 0.0 },
                tOpacity: { value: 1.0 }
            },
            vertexShader: fireballVertexShader.vertexShader(),
            fragmentShader: fireballFragmentShader.fragmentShader(),
            side: THREE.DoubleSide
        } );
    });

let sky_t, missile_color_t, missile_normal_t, missile_roughness_t, missile_displacement_t, missile_metalness_t,
//    power_color_t, power_normal_t, power_roughness_t, power_displacement_t, power_metalness_t,
    marble_color_t, marble_normal_t, marble_roughness_t, marble_displacement_t,
    corinthian_color_t, corinthian_normal_t, corinthian_roughness_t, corinthian_displacement_t;

async function textureConstruct() {
    ["hexasphere", "wall", "floor"].forEach( name => {
        const material = new THREE.MeshStandardMaterial();
        materials[name] = material;
    });

    const textureLoader = new THREE.TextureLoader();

    return [sky_t, missile_color_t, missile_normal_t, missile_roughness_t, missile_displacement_t, missile_metalness_t,
    // power_color_t, power_normal_t, power_roughness_t, power_displacement_t, power_metalness_t,
     marble_color_t, marble_normal_t, marble_roughness_t, marble_displacement_t,
     corinthian_color_t, corinthian_normal_t, corinthian_roughness_t, corinthian_displacement_t
    ] = await Promise.all( [
        textureLoader.loadAsync(sky),
        textureLoader.loadAsync(missile_color),
        textureLoader.loadAsync(missile_normal),
        textureLoader.loadAsync(missile_roughness),
        textureLoader.loadAsync(missile_displacement),
        textureLoader.loadAsync(missile_metalness),
        // textureLoader.loadAsync(power_color),
        // textureLoader.loadAsync(power_normal),
        // textureLoader.loadAsync(power_roughness),
        // textureLoader.loadAsync(power_displacement),
        // textureLoader.loadAsync(power_metalness),
        textureLoader.loadAsync(marble_color),
        textureLoader.loadAsync(marble_normal),
        textureLoader.loadAsync(marble_roughness),
        textureLoader.loadAsync(marble_displacement),
        textureLoader.loadAsync(corinthian_color),
        textureLoader.loadAsync(corinthian_normal),
        textureLoader.loadAsync(corinthian_roughness),
        textureLoader.loadAsync(corinthian_displacement),
    ]);
}

textureConstruct().then( () => {
    readyToLoadTextures = true;
    console.log("textures loaded-------------------");
    complexMaterial({
        colorMap: missile_color_t,
        normalMap: missile_normal_t,
        roughnessMap: missile_roughness_t,
        metalnessMap: missile_metalness_t,
        displacementMap: missile_displacement_t,
        repeat: [1.5,1],
        displacementScale: 0.1,
        displacementBias: -0.05,
        side: THREE.DoubleSide,
        name: "hexasphere"
    });
/*
    complexMaterial({
        colorMap: power_color_t,
        normalMap: power_normal_t,
        roughnessMap: power_roughness_t,
        metalnessMap: power_metalness_t,
        displacementMap: power_displacement_t,
        repeat: [1.5,1],
        displacementScale: 0.1,
        displacementBias: -0.05,
        name: "power"
    });
*/
    complexMaterial({
        colorMap: corinthian_color_t,
        normalMap: corinthian_normal_t,
        roughnessMap: corinthian_roughness_t,
        displacementMap: corinthian_displacement_t,
        displacementScale: 1.5,
        displacementBias: -0.4,
        anisotropy: 4,
        repeat: [2, 1],
        name: "wall"
    });

    complexMaterial({
        colorMap: marble_color_t,
        normalMap: marble_normal_t,
        roughnessMap: marble_roughness_t,
        displacementMap: marble_displacement_t,
        anisotropy: 4,
        metalness: 0.1,
        repeat: [1, 1],
        transparent: true,
        opacity: 0.8,
        name: "floor"
    });
});

// Create complex materials
//------------------------------------------------------------------------------------------
function complexMaterial(options) {
    const material = materials[options.name];
    const repeat = options.repeat || [1,1];
    let map = options.colorMap;
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = options.anisotropy || 4;
    map.repeat.set( ...repeat );
    map.encoding = THREE.SRGBColorSpace;
    material.map = options.colorMap;
    material.needsUpdate = true;

    if (options.normalMap) {
        map = options.normalMap;
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.repeat.set( ...repeat );
        material.normalMap = map;
        material.needsUpdate = true;
        if (options.normalScale) material.normalScale.set(options.normalScale);
        //console.log(options.name,"normalMap", map);
    }
    if (options.roughnessMap) {
        map = options.roughnessMap;
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.repeat.set( ...repeat );
        material.roughnessMap = map;
        if (options.roughness) material.roughness = options.roughness;
        material.needsUpdate = true;
        //console.log(options.name,"roughnessMap", map);
    }
    if (options.metalnessMap) {
        map = options.metalnessMap;
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.repeat.set( ...repeat );
        material.metalnessMap = map;
        if (options.metalness) material.metalness = options.metalness;
        material.needsUpdate = true;
        //console.log(options.name,"metalnessMap", map);
    }
    if (options.displacementMap) {
        map = options.displacementMap;
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.repeat.set( ...repeat );
        material.displacementMap = map;
        if (options.displacementScale) material.displacementScale = options.displacementScale;
        if (options.displacementBias) material.displacementBias = options.displacementBias;
        material.needsUpdate = true;
        //console.log(options.name,"displacementMap", map);
    }
    if (options.emissiveMap) {
        map = options.emissiveMap;
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.repeat.set( ...repeat );
        map.encoding = THREE.SRGBColorSpace;
        material.emissiveMap = map;
        if (options.emissiveIntensity) material.emissiveIntensity = options.emissiveIntensity;
        material.needsUpdate = true;
        //console.log(options.name,"emissiveMap", map);
    }
    if (options.emissive) material.emissive = options.emissive; // this is the color of the emissive object
    if (options.name) material.name = options.name;
    if (options.transparent) material.transparent = options.transparent;
    if (options.opacity) material.opacity = options.opacity;
    if (options.side) material.side = options.side;
    material.needsUpdate = true;
    return material;
}

// BaseActor
// This is the ground plane.
//------------------------------------------------------------------------------------------
class BaseActor extends mix(Actor).with(AM_Spatial) {

    get pawn() {return "BasePawn"}
}
BaseActor.register('BaseActor');

// BasePawn
// This is the ground of the world. This uses a simple transparent tile texture with a
// reflecting mirror just beneath it.
//------------------------------------------------------------------------------------------
class BasePawn extends mix(Pawn).with(PM_Spatial, PM_ThreeVisible) {
    constructor(...args) {
        super(...args);

        this.mirrorGeometry = new THREE.PlaneGeometry((MAZE_ROWS-1)*CELL_SIZE, (MAZE_COLUMNS-1)* CELL_SIZE);
        const mirror = new ADDONS.Reflector( this.mirrorGeometry, {
            clipBias: 0.003,
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio,
            color: 0xb5b5b5
        } );
        mirror.position.set(-CELL_SIZE/2, -0.1, -CELL_SIZE/2);
        mirror.rotateX( -PI_2 );
        const group = new THREE.Group();
        group.add( mirror );

        this.setRenderObject(group);
    }
}
BasePawn.register("BasePawn");

// My Model Root
// Construct the game world
//------------------------------------------------------------------------------------------

class MyModelRoot extends ModelRoot {

    static modelServices() {
        return [MyUserManager];
    }

    init(options) {
        super.init(options);
        this.minutes = 15;
        const xOffset = (MAZE_ROWS*CELL_SIZE)/2;
        const zOffset = (MAZE_COLUMNS*CELL_SIZE)/2;
        this.base = BaseActor.create({ translation:[xOffset,0,zOffset]});
        this.maze = MazeActor.create({translation: [0,5,0], rows: MAZE_ROWS, columns: MAZE_COLUMNS, cellSize: CELL_SIZE});
        for (let y = 0; y < MAZE_ROWS; y++) {
            for (let x = 0; x < MAZE_COLUMNS; x++) {
                const t = [x*CELL_SIZE, 0, y*CELL_SIZE];
                InstanceActor.create({name:"column", color:0xFFA07A,translation: t});
            }
        }
        this.horse = HorseActor.create({translation:[210.9,10,209.70], scale:[8.75,8.75,8.75]});
        const s = 9.0;
        this.spring = PlantActor.create({plant:"Spring",translation: [20, 0.5, 20], scale:[s,s,s]});
        this.summer = PlantActor.create({plant:"Summer",translation: [20, 0.5, 360], scale:[s,s,s]});
        this.autumn = PlantActor.create({plant:"Autumn",translation: [360, 0.5, 360], scale:[s,s,s]});
        this.winter = PlantActor.create({plant:"Winter",translation: [360, 0.5, 20], scale:[s,s,s]});
        this.skyAngle = 0;
        this.rotateSky();
        this.future(1000).countDown();
    }

    get minutes() {return this._minutes || 8}
    set minutes(value) {this._minutes = value; this.timer = value*60000}

    countDown() {
        this.timer -= 1000;
        if (this.timer < 0) this.timer = 0;
        else this.future(1000).countDown();
        this.publish("root", "countDown", this.timer);
    }

    rotateSky() {
        this.skyAngle += 0.001;
        if (this.skyAngle > 2*Math.PI) this.skyAngle -= 2*Math.PI;
        this.publish("root","rotateSky", this.skyAngle);
        this.future(100).rotateSky();
    }
}
MyModelRoot.register("MyModelRoot");

// MyViewRoot
// Construct the visual world
//------------------------------------------------------------------------------------------

export class MyViewRoot extends ViewRoot {

    static viewServices() {
        return [InputManager, ThreeRenderManager, AvatarManager, ThreeInstanceManager];
    }

    onStart() {
        this.buildView();
        this.countdownTimer = new Countdown(this.wellKnownModel("ModelRoot").timer);
        console.log("MyViewRoot onStart", this);
        this.skyRotation = new THREE.Euler(0, 0, 0);
        this.subscribe("root", "rotateSky", this.rotateSky);
        this.subscribe("input", "resize", scaleMinimap);
        this.subscribe("root", "countDown", this.countDown);
    }

    countDown(timer) {
        // console.log("countDown", timer);
        this.countdownTimer.set(timer);
    }

    buildView() {
        const rm = this.service("ThreeRenderManager");
        rm.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
        THREE.ColorManagement.enabled = true; // or false
        rm.renderer.useLegacyLights = false; // or true
        rm.doRender = false;
        rm.camera.add( listener );
        rm.listener = listener;
        rm.renderer.shadowMap.enabled = true;
        rm.renderer.shadowMap.type = THREE.PCFShadowMap;
        rm.renderer.toneMapping = THREE.ReinhardToneMapping;
        const ambientLight = new THREE.AmbientLight( 0xffffff, 1.5 );
        rm.scene.add( ambientLight );
        const blueLight = new THREE.DirectionalLight( 0x446699, 2.5 );
        blueLight.position.set( -1, -1, 1 ).normalize().multiplyScalar( -200 );
        rm.scene.add( blueLight );
        const redLight = new THREE.DirectionalLight( 0x995533, 2.5 );
        redLight.position.set( -1, -1, -0.5 ).normalize().multiplyScalar( -200 );
        rm.scene.add( redLight );
        csm = new ADDONS.CSM( {
            maxFar: 2000,
            cascades: 4,
            mode: 'practical',
            shadowMapSize: 2048,
            shadowBias: 0.0,
            lightDirection: new THREE.Vector3( -1, -1, -0.5 ).normalize(),
            camera: rm.camera,
            parent: rm.scene,
        } );
        this.buildSky();
    }

    buildSky() {
        if (readyToLoadTextures) {
            const rm = this.service("ThreeRenderManager");
            const pmremGenerator = new THREE.PMREMGenerator(rm.renderer);
            pmremGenerator.compileEquirectangularShader();
            const skyEnvironment = pmremGenerator.fromEquirectangular(sky_t);
            skyEnvironment.encoding = THREE.LinearSRGBColorSpace;
            rm.scene.background = skyEnvironment.texture;
        } else this.future(100).buildSky();
    }

    rotateSky(angle) {
        const rm = this.service("ThreeRenderManager");
        this.skyRotation.y = angle;
        rm.scene.backgroundRotation = this.skyRotation;
    }

    update(time, delta) {
        super.update(time, delta);
        if (readyToLoad3D && readyToLoadTextures && readyToLoadSounds) {
            const rm = this.service("ThreeRenderManager");
            rm.doRender = true;
        }
        if ( csm ) csm.update();
    }
}

// AvatarActor
// This is you. Most of the control code for the avatar is in the pawn.
// The AvatarActor has minimal need for replicated state except for user events.
//------------------------------------------------------------------------------------------
class AvatarActor extends mix(Actor).with(AM_Spatial, AM_Avatar) {
    get pawn() { return "AvatarPawn" }

    init(options) {
        super.init(options);
        this.throttleMin = 0.75;
        this.throttleMax = 2.0;
        const t = [CELL_SIZE*seasons[this.season].cell.x+10,AVATAR_HEIGHT,CELL_SIZE*seasons[this.season].cell.y+10];
        const angle = Math.PI*2*seasons[this.season].angle/360;
        const r = q_axisAngle([0,1,0],angle);
        this.set({translation: t, rotation: r});
        this.canShoot = true;
        this.inCorner = true;
        this.isCollider = true;
        this.isAvatar = true;
        this.radius = AVATAR_RADIUS;
        this.eyeball = EyeballActor.create({parent: this});
        this.highGear = this.throttleMin;
        this.listen("shootMissile", this.shootMissile);
        this.listen("claimCell", this.claimCell);
        this.fireball =  FireballActor.create({parent: this, radius:this.radius});
        this.fireball.future(1000).hide();
        this.future(1000).buildGlow();
        this.setHighSpeed(this.throttleMax);
    }

    buildGlow() {
        this.glow = [];
        this.glowIndex = 0;
        const cell = seasons[this.season].cell;
        const nextCell = seasons[this.season].nextCell;
        const glowPosition = [];
        glowPosition[0] = [cell.x, cell.y];
        glowPosition[1] = [cell.x, nextCell.y];
        glowPosition[2] = [nextCell.x, cell.y];
        glowPosition[3] = [nextCell.x, nextCell.y];
        const mazeActor = this.wellKnownModel("ModelRoot").maze;
        let doCell = mazeActor.map[glowPosition[0][0]][glowPosition[0][1]];
        // possible that the floor is not created yet...
        if(!doCell.floor) {this.future(100).buildGlow(); return;}
        for(let i=0; i<4; i++) {
            doCell = mazeActor.map[glowPosition[i][0]][glowPosition[i][1]];
            this.glow[i] = GlowActor.create({shape:"cube", color: seasons[this.season].color, depthTest: true, radius: 1.25, glowRadius: 0.5, falloff: 0.1, opacity: 0.75, sharpness: 0.5});
            this.glow[i].sink(1000, 1, doCell.floor.translation);
            this.glow[i].future(1000).hide();
        }
    }

    get season() {return this._season || "spring"}

    get color() {return seasons[this.season].color}

    claimCell(data) {
        const mazeActor = this.wellKnownModel("ModelRoot").maze;
        // only claim the cell if it is not already yours
        const seasonCorner = mazeActor.checkCornersSeason(data.x-1, data.y-1);
        this.inCorner = seasonCorner === this.season;
        const cell = mazeActor.map[data.x-1][data.y-1];
        if (cell.season !== this.season) {
            this.highGear = this.throttleMin;
            // if the cell you are moving from is yours, then you can claim it
            if (data.lastX && mazeActor.map[data.lastX-1][data.lastY-1].season === this.season) {
                // set the season of the cell you are moving to
                if (!seasonCorner && mazeActor.setSeason(data.x, data.y, this.season, this.id)) {
                    this.say("claimCellUpdate", {x:data.x, y:data.y, color:seasons[this.season].color});
                    //GlowActor.create({parent: cell.floor, shape:"cube", translation:[0,1,0], color: seasons[this.season].color, depthTest: true, radius: 1.25, glowRadius: 0.5, falloff: 0.1, opacity: 0.75, sharpness: 0.5});
                    const glow = this.glow[this.glowIndex];
                    this.glowIndex = (this.glowIndex+1)%4;  
                    glow.sink(1000, 1, cell.floor.translation);
                    glow.show();
                    //this.future(1200).setHighSpeed(this.throttleMax);
                    glow.future(1000).hide();
                }
            }
        } else this.highGear = this.throttleMax;
    }

    setHighSpeed(value) {
        this.highGear = value;
    }

    shootMissile() {
        console.log("AvatarActor shootMissile");
        this.canShoot = false;
        this.say("shootMissileSound", this.id);
        this.future(MISSILE_LIFE).reloadMissile();
        MissileActor.create({avatar: this, color: seasons[this.season].color2});
    }

    reloadMissile() {
        this.say("recharged");
        this.canShoot = true;
    }

    kill() {
        console.log("kill", this.id, "KILLED");
        this.fireball.show();
        this.fireball.future(3000).hide();
        this.future(1000).respawn();
    }

    respawn() {
        const t = [CELL_SIZE*seasons[this.season].cell.x+10,AVATAR_HEIGHT,CELL_SIZE*seasons[this.season].cell.y+10];
        const angle = Math.PI*2*seasons[this.season].angle/360;
        const r = q_axisAngle([0,1,0],angle);
        this.set({translation: t, rotation: r});
        this.canShoot = true;
        this.inCorner = true;
        this.say("respawn", {t, r, angle});
    }

    destroy() {
        super.destroy();
        console.log("AvatarActor destroy", this.id);
        for(let i=0; i<4; i++) {this.glow[i].destroy();}
    }
}
AvatarActor.register('AvatarActor');

// Eyeball Actor/Pawn
// Tracks the orientation of the camera so others see where you are looking.
//------------------------------------------------------------------------------------------
class EyeballActor extends mix(Actor).with(AM_Spatial,) {
    get pawn() { return "EyeballPawn" }
}
EyeballActor.register('EyeballActor');

class EyeballPawn extends mix(Pawn).with(PM_Smoothed, PM_ThreeVisible, PM_ThreeCamera) {

    constructor(actor) {
        super(actor);
        this.radius = AVATAR_RADIUS;
        this.pitch = q_pitch(this.rotation);
        this.pitchQ = q_axisAngle([1,0,0], this.pitch);
        if ( !this.parent.isMyAvatar ) {
            this.load3D();
        } else this.parent.eyeball = this;
        playSound( enterSound, this.renderObject );
        this.shootNow = true;
    }

    load3D() {
        if (this.doomed) return;
        if (readyToLoad3D && eyeball) {
            this.eye = eyeball.scene.clone();
            this.eye.scale.set(40,40,40);
            this.eye.rotation.set(0,Math.PI,0);
            this.eye.traverse( m => {if (m.geometry) { m.castShadow=true; m.receiveShadow=true; } });
            this.group = new THREE.Group();
            this.group.add(this.eye);
            this.setRenderObject(this.group);
        } else this.future(100).load3D();
    }

    update(time, delta) {
        super.update(time, delta);
        if ( this.parent.isMyAvatar ) this.refreshCameraTransform();
    }

    destroy() {
        super.destroy();
        if (this.renderObject) {
            playSound( exitSound );
            this.destroy3D( this.renderObject );
        }
    }

    destroy3D( obj3D ) {
        obj3D.traverse( obj => {
            if (obj.geometry) {
                obj.geometry.dispose();
                obj.material.dispose();
            }
        });
    }
}
EyeballPawn.register("EyeballPawn");

// AvatarPawn
// The avatar is designed to instantly react to user input and the publish those changes
// so other users are able to see and interact with this avatar. Though there will be some latency
// between when you see your actions and the other users do, this should have a minimal
// impact on gameplay.
//------------------------------------------------------------------------------------------
class AvatarPawn extends mix(Pawn).with(PM_Smoothed, PM_ThreeVisible, PM_Avatar) {

    constructor(actor) {
        super(actor);
        this.isAvatar = true;
        this.radius = actor.radius;
        this.yaw = q_yaw(this.rotation);
        compass.update(this.yaw);
        this.yawQ = q_axisAngle([0,1,0], this.yaw);
        this.lastX = seasons[this.actor.season].cell.x+1;
        this.lastY = seasons[this.actor.season].cell.y+1;
        console.log("AvatarPawn constructor", this.lastX, this.lastY);
        this.service("AvatarManager").avatars.add(this);
        this.listen("shootMissileSound", this.didShootSound);
        this.listen("recharged", this.rechargedSound);
        this.listen("claimCellUpdate", this.claimCellUpdate);
        this.listen("respawn", this.respawn);
        this.subscribe(this.viewId, "synced", this.handleSynced);
        this.subscribe("maze", "clearCells", this.clearCells);
    }

    handleSynced() {
        console.log("session is synced - enable sound");
        soundSwitch = true;
    }

    destroy() {
        super.destroy();
        this.service("AvatarManager").avatars.delete(this);
    }

    respawn(data) {
        console.log("AvatarPawn respawn", data);
        this.positionTo(data.t, data.r);
        //this.set({translation: data.t, rotation: data.r});
        this.yaw = data.angle;
        compass.update(this.yaw);
        this.yawQ = data.r;
    }

    // If this is YOUR avatar, the AvatarPawn automatically calls this.drive() in the constructor.
    // The drive() function sets up the user interface for the avatar.
    // If this is not YOUR avatar, the park() function is called.
    drive() {
        console.log("DRIVE");
        this.gas = 0;
        this.turn = 0;
        this.strafe = 0;
        this.pointerId = 0;
        this.subscribe("input", "keyDown", this.keyDown);
        this.subscribe("input", "keyUp", this.keyUp);
        this.subscribe("input", "pointerDown", this.doPointerDown);
        this.subscribe("input", "pointerUp", this.doPointerUp);
        this.subscribe("input", "pointerDelta", this.doPointerDelta);
        //this.subscribe("input", "tap", this.doPointerTap);
        //this.subscribe("input", 'wheel', this.onWheel);
        this.createMinimap();
        const scores = this.wellKnownModel("ModelRoot").maze.seasons;
        boxScore.setScores(scores);
        this.subscribe("maze", "score", this.scoreUpdate);

        if ( device.isMobile) {
            // Create two joysticks
            this.leftJoystick = new Joystick({ id: 'left', side: 'left' });
            this.rightJoystick = new Joystick({ id: 'right', side: 'right' });
            
            // Listen for left joystick events
            document.addEventListener('joystick-start-left', (e) => {
                this.joystickStart("left");
                //console.log("joystick-start-left");
            });

            document.addEventListener('joystick-move-left', (e) => {
                const { x, y, side } = e.detail;
                this.joystickMove(x, y, side);
                //console.log('Left joystick:', x, y);
            });
            document.addEventListener('joystick-release-left', (e) => {
                this.joystickRelease("left");
                //console.log('Left joystick released:', e.detail);
            });

            document.addEventListener('joystick-tap-left', (e) => {
                const { side } = e.detail;
                this.joystickTap(side);
                //console.log('Left joystick tapped!');
            });
            
            // Listen for right joystick events
            document.addEventListener('joystick-start-right', (e) => {
                this.joystickStart("right");
                //console.log('Right joystick started:', e.detail);
            });

            document.addEventListener('joystick-move-right', (e) => {
                const { x, y, side } = e.detail;
                this.joystickMove(x, y, side);
                //console.log('Right joystick:', x, y);
            });
            
            document.addEventListener('joystick-release-right', (e) => {
                this.joystickRelease("right");
                //console.log('Right joystick released:', e.detail);
            });
    
            document.addEventListener('joystick-tap-right', (e) => {
                const { side } = e.detail;
                this.joystickTap(side);
                //console.log('Right joystick tapped!');
            });
        }
    }

    scoreUpdate( data ){
        boxScore.setScores(data);
   //     console.log("scoreUpdate", data);
    }

    park() {
        this.gas = 0;
        this.turn = 0;
        this.strafe = 0;
        this.highGear = 1;
    }

    didShootSound(id) {
        if (this.isMyAvatar) return; // only play the sound if it is not your avatar
        playSound(shootSound, this.renderObject, false);
    }

    shootMissile() {
        if (this.actor.canShoot) {
            const mazeActor = this.wellKnownModel("ModelRoot").maze;
            if (this.actor.season === mazeActor.getSeason(this.lastX, this.lastY)) {
                this.say("shootMissile");
                playSound(shootSound, null, false);
                return;
            }
        }
        playSound(shootFailSound, null, false);
        console.log("can't shoot");
    }

    rechargedSound() {
        console.log("recharged");
        if (this.isMyAvatar) playSound(rechargedSound, this.renderObject, false);
    }

    keyDown(e) {
        //console.log("keyDown", e.key);
        switch (e.key) {
            case "ArrowUp": case "W": case "w":
                this.gas = 1; break;
            case "ArrowDown": case "S": case "s":
                this.gas = -1; break;
            case "ArrowLeft": case "A": case "a":
                this.strafe = 1; break;
            case "ArrowRight": case "D": case "d":
                this.strafe = -1; break;
            case " ":
                this.shootMissile();
                break;
            case "I": case "i":
                console.log( "AvatarPawn", this );
                break;
            case '-': case '_':
                volume = Math.max(0, volume - 0.1);
                setTextDisplay("Volume: " + Math.floor(volume*10),2);
                soundLoops.forEach( sound => sound.setVolume(volume * loopSoundVolume) );
                break;
            case '+': case '=':
                volume = Math.min(1, volume + 0.1);
                setTextDisplay("Volume: " + Math.floor(volume*10),2);
                soundLoops.forEach( sound => sound.setVolume(volume * loopSoundVolume) );
                break;
            case '/':
                soundSwitch = !soundSwitch; // toggle sound on and off
                setTextDisplay("Sound: " + (soundSwitch? "on":"off"),2);
                soundLoops.forEach( sound => {if (soundSwitch) sound.play(); else sound.pause();} );
                console.log( "sound is " + soundSwitch);
                break;
            case 'm': case 'M':
                console.log("pause/play music");
                soundLoops.forEach( sound => {if (sound.isPlaying) sound.pause(); else sound.play();} );
                break;
            default:
        }
    }

    keyUp(e) {
        switch (e.key) {
            case "ArrowUp": case "W": case "w":
                this.gas = 0; break;
            case "ArrowDown": case "S": case "s":
                this.gas = 0; break;
            case "ArrowLeft": case "A": case "a":
                this.strafe = 0; break;
            case "ArrowRight": case "D": case "d":
                this.strafe = 0; break;
            case " ":
                this.shootNow = false;
                break;
            default:
        }
    }
    joystickStart(side) {
        this.looking = true;
        this.lookX = 0;
        this.lookY = 0;
        this.moving = true;
        // this.lookY = 0;
        this.joystickLook();
    }

    joystickMove(x, y, side) {
        this.lookX = x;
        this.gas = -y;
        this.strafe = 0;
    }

    joystickRelease(side) {
        this.looking = false;
        this.moving = false;
    }

    joystickTap(side) {
        this.shootMissile();
        console.log("AvatarPawn joystickTap", side);
    }

    doPointerDown(e) {
    //    console.log("AvatarPawn.onPointerDown()", e);
        if (!device.isMobile) {
            const im = this.service("InputManager");
            if ( im.inPointerLock ) this.shootMissile();
            else {
                im.enterPointerLock();
                soundSwitch = true;
            }
        }else soundSwitch = true; // turn sound on for mobile
    }

    doPointerUp(e) {
        //console.log("AvatarPawn.onPointerUp()", e);
        // console.log("mouse0Up");
    }

    normalizeRotation(rotation) {
        return ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    }

    doPointerDelta(e) {
        //console.log("AvatarPawn.onPointerDelta()", e.xy);
        // update the avatar's yaw
        const im = this.service("InputManager");
        if ( im.inPointerLock ) this.keyboardLook(e.xy[0], e.xy[1], 0.002);
    }

    joystickLook() {
        //console.log("AvatarPawn lookingAround");
        if(this.looking){ 
            this.yaw -= this.lookX * 0.075;
            this.yaw = this.normalizeRotation(this.yaw);
            compass.update(this.yaw);
            this.yawQ = q_axisAngle([0,1,0], this.yaw);
            this.positionTo(this.translation, this.yawQ);
            const linearToExponential = (x, exponent = 2) => Math.pow(Math.max(0, Math.min(1, x)), exponent);
            this.eyeball.pitch = linearToExponential(this.lookY) * PI_4;
            this.eyeball.pitchQ = q_axisAngle([1,0,0], this.eyeball.pitch);
            this.eyeball.set({rotation: this.eyeball.pitchQ});

            this.future(50).joystickLook();
        }
    }

    keyboardLook(x,y,scale) {
       // console.log("AvatarPawn lookAround", x,y,scale);
        this.yaw -= x * scale;
        this.yaw = this.normalizeRotation(this.yaw);
        compass.update(this.yaw);
        this.yawQ = q_axisAngle([0,1,0], this.yaw);
        this.positionTo(this.translation, this.yawQ);

        // update the eyeball's pitch
        let p = this.eyeball.pitch;
        p -= y * scale;
        p = Math.max(-PI_4, Math.min(PI_4, p));
        this.eyeball.pitch = p;
        this.eyeball.pitchQ = q_axisAngle([1,0,0], this.eyeball.pitch);
        this.eyeball.set({rotation: this.eyeball.pitchQ});
    }

    update(time, delta) {
        super.update(time,delta);
        if (this.driving) {
            if (this.gas || this.strafe) {
                const factor = delta/1000;
                const speed = this.gas * 20 * factor * this.actor.highGear;
                const strafeSpeed = this.strafe * 20 * factor * this.actor.highGear;
                const forward = v3_rotate([0,0,-1], this.yawQ);
                let velocity = v3_scale(forward, speed);
                if (strafeSpeed !== 0) {
                    const leftQ = q_axisAngle([0,1,0], this.yaw+PI_2);
                    const left = v3_rotate([0,0,-1], leftQ);
                    const leftVelocity = v3_scale(left, strafeSpeed);
                    velocity = v3_add(velocity, leftVelocity);
                }
                this.collide(velocity);
            }
        }
    }

    collide(velocity) {
        // set translation to limit after any collision
        let translation = v3_add(this.translation, velocity);
        const avatars = this.service("AvatarManager").avatars;
        for (const avatar of avatars) {
            if (avatar === this) continue; // don't collide with yourself
            const collideDist = this.radius+avatar.radius;
            const collideSqr = collideDist*collideDist;
            const distanceSqr = v3_distanceSqr(translation, avatar.translation);
            if (distanceSqr < collideSqr) {
                if (distanceSqr === 0) translation = this.translation;
                translation = v3_add(avatar.translation,
                    v3_scale(
                        v3_normalize(
                            v3_sub(translation, avatar.translation)), collideDist));

            }
        }
        translation = this.verifyMaze(translation);
        this.positionTo(translation, this.yawQ);
    }

    verifyMaze(loc) {
        const mazeActor = this.wellKnownModel("ModelRoot").maze;
        const cellInset = CELL_SIZE/2 - this.radius;
        let x = loc[0];
        let y = loc[1];
        let z = loc[2];
        const xCell = 1+Math.floor(x/CELL_SIZE);
        const yCell = 1+Math.floor(z/CELL_SIZE);
        // console.log("verifyMaze", this.lastX, this.lastY, xCell, yCell);
        if ( xCell>0 && xCell < MAZE_COLUMNS && yCell>0 && yCell < MAZE_ROWS ) { //on the map
            // what cell are we in?
            const cell = mazeActor.map[xCell][yCell];
            // where are we within the cell?
            const offsetX = x - (xCell-0.5)*CELL_SIZE;
            const offsetZ = z - (yCell-0.5)*CELL_SIZE;

            const s = offsetZ > cellInset;
            const n = offsetZ < -cellInset;
            const e = offsetX > cellInset;
            const w = offsetX < -cellInset;

            // check for corner collisions
            let collided = false;
            if (!cell.S && s) { z -= WALL_EPSILON + offsetZ - cellInset; collided = 'S'; }
            else if (!cell.N && n) { z -= offsetZ  + cellInset - WALL_EPSILON; collided = 'N'; }
            if (!cell.E && e) { x -= WALL_EPSILON + offsetX - cellInset; collided = 'E'; }
            else if (!cell.W && w) { x -= offsetX + cellInset - WALL_EPSILON; collided = 'W'; }

            if (!collided) {
                if (s && e) {
                    if ( offsetX < offsetZ ) x -= offsetX - cellInset;
                    else z -= offsetZ - cellInset;
                }
                else if (s && w) {
                    if ( -offsetX < offsetZ ) x -= offsetX + cellInset;
                    else z -= offsetZ - cellInset;
                }
                else if (n && e) {
                    if ( -offsetX > offsetZ ) x -= offsetX - cellInset;
                    else z -= offsetZ  + cellInset;
                }
                else if (n && w) {
                    if ( offsetX > offsetZ ) x -= offsetX + cellInset;
                    else z -= offsetZ + cellInset;
                }
            }
        } // else {}// if we find ourselves off the map, then jump back
        this.tryClaimCell(xCell, yCell);
        return [x, y, z];
    }

    tryClaimCell(x, y) {
        //console.log("AvatarPawn tryClaimCell", x, y, this.lastX, this.lastY, this.actor.inCorner);
        if (x!==this.lastX || y!==this.lastY) this.say("claimCell", {x, y, lastX:this.lastX, lastY:this.lastY});
        this.avatarMinimap(this.lastX, this.lastY, x, y);
        this.lastX = x;
        this.lastY = y;
    }

    claimCellUpdate(data) {
        console.log("AvatarPawn claimCellUpdate", this.isMyAvatar);
        if(this.isMyAvatar) playSound(cellSound, null, false);
        this.drawMinimapCell(data.x,data.y, data.color);
    }

    clearCells(data) {
        console.log("AvatarPawn clearCells", data.avatarId, this.actor.id);
        for (const cell of data.clearCells) {
            this.drawMinimapCell(cell[0]+1,cell[1]+1, 0xFFFFFF);
        }
        if(this.isMyAvatar) {
            if(data.avatarId === this.actor.id) playSound(aweSound, this.renderObject, false);
            else playSound(shockSound, null, false);
        }
    }

    createMinimap() {
        //console.log("createMinimap");
        // Add the canvas to the minimap div
        const minimapDiv = document.getElementById('minimap');
        minimapDiv.appendChild(minimapCanvas);
        this.redrawMinimap();
    }

    redrawMinimap() {
        //console.log("redrawMinimap");
        const mazeActor = this.wellKnownModel("ModelRoot").maze;
        minimapCtx.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);

        for (let y = 1; y < mazeActor.rows; y++) {
            for (let x = 1; x < mazeActor.columns; x++) {
                this.drawMinimapCell(x,y,  mazeActor.getCellColor(x,y));
            }
        }
        const xCell = 1+Math.floor(this.translation[0]/CELL_SIZE);
        const yCell = 1+Math.floor(this.translation[2]/CELL_SIZE);
        this.avatarMinimap(null, null, xCell, yCell);
        const minimapDiv = document.getElementById('minimap');
        minimapDiv.style.transform = `rotate(${seasons[this.actor.season].angle}deg)`;
    }

    drawMinimapCell(x,y, color) {
        function hexNumberToColorString(hexNumber) {
            let hexString = hexNumber.toString(16);
            while (hexString.length < 6) {
                hexString = '0' + hexString;
            }
            return '#' + hexString.toUpperCase();
        }
        if (color !== 0xFFFFFF) {
            minimapCtx.clearRect(x*10-5, y*10-5, 9, 9);
            minimapCtx.globalAlpha = 0.6;
            minimapCtx.fillStyle = hexNumberToColorString(color);
            minimapCtx.fillRect(x*10-5, y*10-5, 9, 9);
        } else {
            minimapCtx.clearRect(x*10-5, y*10-5, 9, 9);
        }
    }

    avatarMinimap(lastX, lastY, x, y) {
        if (lastX) {
            const mazeActor = this.wellKnownModel("ModelRoot").maze;
            this.drawMinimapCell(lastX, lastY, mazeActor.getCellColor(lastX,lastY));
        }
        minimapCtx.globalAlpha = 0.9;
        minimapCtx.fillStyle = "#FFFFFF";
        minimapCtx.fillRect(x*10-4, y*10-4, 8, 8);
    }
}

AvatarPawn.register("AvatarPawn");

// MyUserManager
// Create a new avatar when a new user joins.
//------------------------------------------------------------------------------------------
class MyUserManager extends UserManager {
    init() {
        super.init();
    }
    get defaultUser() {return MyUser}
}

MyUserManager.register('MyUserManager');

class MyUser extends User {
    init(options) {
        super.init(options);
        console.log("MyUser init", this);
        let cellX = Math.floor(18.9*Math.random());
        let cellY = Math.floor(18.9*Math.random());

        if ( cellX === 10 && cellY === 10 ) { // don't spawn in the center
            cellX = 11;
            cellY = 11;
        }
        const season = ["Spring","Summer","Autumn","Winter"][this.userNumber%4];

        this.avatar = AvatarActor.create({
            driver: this.userId,
            season
        });
    }

    destroy() {
        super.destroy();
        if (this.avatar) this.avatar.destroy();
    }
}
MyUser.register('MyUser');

// AvatarManager
// Easy to find all of the avatars in the world
//------------------------------------------------------------------------------------------
class AvatarManager extends ViewService {

    constructor() {
        super("AvatarManager");
        this.avatars = new Set();
    }
}
// MissileActor
// Fired by the avatar - they destroy the other players but bounce off of everything else
//------------------------------------------------------------------------------------------
class MissileActor extends mix(Actor).with(AM_Spatial) {
    get pawn() { return "MissilePawn" }

    init(options) {
        super.init(options);
        this.isCollider = true;
        this.future(4000).destroy(); // destroy after some time
        this.radius = MISSILE_RADIUS;
        const t = [...this._avatar.translation];
        t[1]=5;
        this.translation = [...t];
        this.rotation = [...this._avatar.rotation];
        this.yaw = q_yaw(this.rotation);
        this.yawQ = q_axisAngle([0,1,0], this.yaw);
        this.direction = v3_scale(v3_rotate(this.forward, this.yawQ), -1);
        this.velocity = v3_scale(this.direction, MISSILE_SPEED*2);
        this.timeScale = 0.00025 + Math.random()*0.00002;
        this.hasBounced = false; // I can kill my avatar if I bounce off a wall first
        InstanceActor.create({name: "hexasphere", parent: this});
        GlowActor.create({parent: this, color: options.color||0xff8844, depthTest: true, radius: 1.25, glowRadius: 0.5, falloff: 0.1, opacity: 0.75, sharpness: 0.5});
        this.flicker = PointFlickerActor.create({parent: this, playSound: true,color: options.color||0xff8844});
        this.tick(0);
        //console.log("MissileActor init", this);
    }

    resetGame() {
        this.destroy();
    }

    tick(count) {
        // test for collisions
        const actors = this.wellKnownModel('ActorManager').actors;
        this.translation = v3_add(this.translation, this.velocity);
        actors.forEach(actor => { if (!this.doomed && actor.isCollider) this.testCollision(actor); });

        if (!this.doomed) {
            this.verifyMaze();
            this.future(20).tick(count+1);
        }
    }

    testCollision( actor ) {
        // console.log("testCollision", actor.translation);
        if (actor.id === this.id) return false; // don't kill yourself
        if (actor.id === this._avatar.id && !this.hasBounced) return false; // don't kill yourself
        const distanceSqr = v3_distanceSqr(this.translation, actor.translation);
        const collide = actor.radius + this.radius;
        const collideSqr = collide*collide;
        if (distanceSqr < collideSqr) {
            if (actor.inCorner && distanceSqr > 0) {
                // the missile bounces off the avatar when they are in their own corner
                this.hasBounced = true;
                const d = 1/Math.sqrt(distanceSqr);
                const dd = v3_sub(this.translation, actor.translation);
                dd[1] = 0;
                const norm = v3_scale(dd, d);
                const dot = this.velocity[0]*norm[0] + this.velocity[2]*norm[2];
                const projection = v3_scale(norm, dot);
                this.velocity = v3_sub(this.velocity, v3_scale(projection, 2));
            } else {
                actor.kill();
                this.destroy();
                return true;
            }
        }
        return false;
    }

    verifyMaze() {
        const mazeActor = this.wellKnownModel("ModelRoot").maze;
        const cellInset = CELL_SIZE/2 - this.radius;
        let [x,y,z] = this.translation;

        const xCell = 1+Math.floor(x/CELL_SIZE);
        const yCell = 1+Math.floor(z/CELL_SIZE);

        if ( xCell>=0 && xCell < MAZE_COLUMNS && yCell>=0 && yCell < MAZE_ROWS ) { //off the map
            // what cell are we in?
            const cell = mazeActor.map[xCell][yCell];
            // where are we within the cell?
            const offsetX = x - (xCell-0.5)*CELL_SIZE;
            const offsetZ = z - (yCell-0.5)*CELL_SIZE;

            const s = offsetZ > cellInset;
            const n = offsetZ < -cellInset;
            const e = offsetX > cellInset;
            const w = offsetX < -cellInset;

            // we have to have the flickering light manage the bounce sound
            // because the missile is an instance and can't have children in threejs
            if (!cell.S && s) {
              z -= WALL_EPSILON + offsetZ - cellInset;
              this.velocity[2]=-this.velocity[2];
              this.hasBounced = true;
              this.flicker.say('bounce');
            }
            else if (!cell.N && n) {
              z -= offsetZ  + cellInset - WALL_EPSILON;
              this.velocity[2] = -this.velocity[2];
              this.hasBounced = true;
              this.flicker.say('bounce');
            }
            if (!cell.E && e) {
              x -= WALL_EPSILON + offsetX - cellInset;
              this.velocity[0] = -this.velocity[0];
              this.hasBounced = true;
              this.flicker.say('bounce');
            }
            else if (!cell.W && w) {
              x -= offsetX + cellInset - WALL_EPSILON;
              this.velocity[0] = -this.velocity[0];
              this.hasBounced = true;
              this.flicker.say('bounce');
            }
            if ( !this.hasBounced ) {
                if (s && e) {
                    if ( offsetX < offsetZ ) this.velocity[0] = -this.velocity[0];
                    else this.velocity[2]=-this.velocity[2];
                    this.hasBounced = true;
                    this.flicker.say('bounce');
                }
                else if (s && w) {
                    if ( -offsetX < offsetZ ) this.velocity[0] = -this.velocity[0];
                    else this.velocity[2]=-this.velocity[2];
                    this.hasBounced = true;
                    this.flicker.say('bounce');
                }
                else if (n && e) {
                    if ( -offsetX > offsetZ ) this.velocity[0] = -this.velocity[0];
                    else this.velocity[2]=-this.velocity[2];
                    this.hasBounced = true;
                    this.flicker.say('bounce');
                }
                else if (n && w) {
                    if ( offsetX > offsetZ ) this.velocity[0] = -this.velocity[0];
                    else this.velocity[2]=-this.velocity[2];
                    this.hasBounced = true;
                    this.flicker.say('bounce');
                }
            }
            this.translation = [x, y, z];
            this.yaw += 0.01;
            this.yawQ = q_axisAngle([0,1,0], this.yaw);
            this.rotation = this.yawQ;
        }
    }

    kill() { // missiles can kill missiles
        console.log("testCollision", this.id, "KILLED");
        if ( !this.doomed ) {
            FireballActor.create({translation: this.translation, radius: this.radius});
            this.destroy();
        }
    }
}
MissileActor.register('MissileActor');

// MissilePawn
// Flashy missile object.
//------------------------------------------------------------------------------------------
export class MissilePawn extends mix(Pawn).with(PM_Smoothed, PM_ThreeVisible, PM_ThreeInstanced) {
    get radius() { return this.actor.radius }
}
MissilePawn.register("MissilePawn");

// PointFlickerActor
// The missile emits a flickering light.
//------------------------------------------------------------------------------------------
class PointFlickerActor extends mix(Actor).with(AM_Spatial) {
    get pawn() { return "PointFlickerPawn" }
    get color() { return this._color || 0xff8844 }
    get playSound() { return this._playSound || false }
    init(options) {
        super.init(options);
        // this.future(100).tick();
    }

    tick() { // add flickering light
        this.future(100).tick();
    }

    resetGame() {
        this.destroy();
    }
}
PointFlickerActor.register('PointFlickerActor');

// PointFlickerPawn
// The missile emits a flickering light- this also manages the sound.
//------------------------------------------------------------------------------------------
export class PointFlickerPawn extends mix(Pawn).with(PM_Smoothed, PM_ThreeVisible) {

    constructor(actor) {
        super(actor);
        console.log("PointFlickerPawn constructor", this);
        this.pointLight = new THREE.PointLight(this.actor.color, 20, 20, 2);
        this.setRenderObject(this.pointLight);
        if (this.actor.playSound) {
            this.listen("bounce", this.playBounce);
            playSound( missileSound, this.renderObject, true);
        }
    }

    playBounce() {
        playSound(bounceSound, this.renderObject, false);
    }

    destroy() {
        super.destroy();
        if (this.pointLight) this.pointLight.dispose();
    }
}
PointFlickerPawn.register("PointFlickerPawn");
// FireballActor 
// When a missile hits an avatar a fireball is generated. It is attached to the avatar.
//------------------------------------------------------------------------------------------
class FireballActor extends mix(Actor).with(AM_Spatial) {
    get pawn() { return "FireballPawn" }

    init(options) {
        super.init(options);
        this.timeScale = 0.00025 + Math.random()*0.00002;
        this.future(1000).hide();
        // this.future(3000).destroy(); // destroy after some time
        // console.log("FireballActor init", this, this.parent);
    }

    hide() { this.visible = false; }
    show() { this.visible = true; }
    set visible(value) { this._visible = value; this.say("visible", value); }
    get visible() { return this._visible || false }
    get radius() { return this._radius || AVATAR_RADIUS}

    resetGame() {
        this.destroy();
    }
}
FireballActor.register('FireballActor');

// FireballPawn
// Fireball explosion when hit by missile on pawn or other missile.
//------------------------------------------------------------------------------------------
export class FireballPawn extends mix(Pawn).with(PM_Smoothed, PM_ThreeVisible) {

    constructor(actor) {
        super(actor);
        // console.log("FireballPawn constructor", this);
        this.startTime = this.now();
        this.material = fireMaterial;
        this.geometry = new THREE.IcosahedronGeometry( actor.radius*2, 20 );
        this.fireball = new THREE.Mesh(this.geometry, this.material);
        this.pointLight = new THREE.PointLight(0xff8844, 1, 4, 2);
        this.fireball.add(this.pointLight);
        this.setRenderObject(this.fireball);
        this.doVisible(this.actor.visible); 
        this.listen("visible", this.doVisible);
        //playSound(implosionSound, this.fireball, false);
    }

    doVisible(value) {
        if (value) playSound(implosionSound, this.fireball, false);
        this.fireball.visible = value;
        this.pointLight.visible = value;
    }

    update(time, delta) {
        super.update(time,delta);
        //this.refreshDrawTransform();
        const now = this.now(); // NB: time argument is not now()
        const age = now-this.startTime;
        this.fireball.material.uniforms[ 'time' ].value = time*this.actor.timeScale;
        this.fireball.material.uniforms[ 'tOpacity' ].value = 0.25;
        this.pointLight.intensity = 0.25+ 0.75* Math.sin(age*0.020)*Math.cos(age*0.007);
    }

    destroy() {
        super.destroy();
        if (this.geometry) this.geometry.dispose();
        //this.material.dispose();
        if (this.pointLight) this.pointLight.dispose();
    }
}
FireballPawn.register("FireballPawn");

// SphereActor
// Power up that a player can pick up to fuel their missile.
//------------------------------------------------------------------------------------------
class SphereActor extends mix(Actor).with(AM_Spatial) {
    get pawn() { return "SpherePawn" }

    init(options) {
        super.init(options);
        this.center = this.translation[1];
        this.timeScale = 0.00025 + Math.random()*0.00002;
        this.offset = Math.random()*Math.PI;
        //console.log("SphereActor init", this, this.parent);
        //InstanceActor.create({name:"minotaur", parent: this});
       // GlowActor.create({parent: this});
       this.future(100).tick();
    }

    get name() { return this._name || "power" }

    tick() {
        const t = this.translation;
        t[1] = this.center + 0.5*Math.sin(this.now()*0.001 + this.offset);
        this.set({translation: t});
        this.future(100).tick();
    }

    resetGame() {
        this.destroy();
    }
}
SphereActor.register('SphereActor');

// SpherePawn
// Flashy sphere object.
//------------------------------------------------------------------------------------------
export class SpherePawn extends mix(Pawn).with(PM_Smoothed, PM_ThreeVisible, PM_ThreeInstanced) {

    constructor(actor) {
        super(actor);
        this.radius = actor.radius;
        this.createInstance();
    }

    createInstance() {
        const im = this.service("ThreeInstanceManager");
        const name = this.actor.name;
        let instance = this.useInstance(name);
        if ( !instance ) {
            const geometry = new THREE.IcosahedronGeometry( 1, 2 );
            csm.setupMaterial(materials.power);
            im.addMaterial(name, materials.power);
            im.addGeometry(name, geometry);
            im.addMesh(name, name, name);
            instance = this.useInstance(name);
            instance.mesh.castShadow = true;
        }
    }
}
SpherePawn.register("SpherePawn");

//--GlowActor ---------------------------------------------------------------------------
// Make the power up and missiles glow.
//------------------------------------------------------------------------------------------
class GlowActor extends mix(Actor).with(AM_Spatial) {
    get pawn() { return "GlowPawn" }

    init(options) {
        super.init(options);
    }
    resetGame() {
        this.destroy();
    }
    hide() { this.visible = false; }
    show() { this.visible = true; }
    set visible(value) { this._visible = value; this.say("visible", value); }
    get visible() { return this._visible || false }
    get radius() { return this._radius || 2 }
    get glowRadius() { return this._glowRadius || 1 }
    get color() { return this._color || 0xff8844 }
    get transparent() { return this._transparent || true }
    get depthTest() { return this._depthTest || true }
    get falloff() { return this._falloff || 0.1 }
    get side() { return this._side || THREE.FrontSide }
    get sharpness() { return this._sharpness || 0.5 }
    get opacity() { return this._opacity || 1 }
    get shape() { return this._shape || "sphere" }

    sink(time, distance, translate) {
        const t = [...translate];
        t[1] = distance*time/1000;
        this.snap({translation: t});
        if(time>0) this.future(100).sink(time-100, distance, t);
    }
}
GlowActor.register('GlowActor');

export class GlowPawn extends mix(Pawn).with(PM_Smoothed, PM_ThreeVisible) {
// can't use instancing because the FakeGlowMaterial doesn't support it
    constructor(actor) {
        super(actor);
        // console.log("GlowPawn constructor", this);
        let geometry;
        if (this.actor.shape === "sphere") geometry = new THREE.SphereGeometry(this.actor.radius, 32, 32);
        else if (this.actor.shape === "cube") geometry = new THREE.BoxGeometry(20, 1, 20, 5,1,5);
        //console.log(this.color, this.radius);
        const material = new FakeGlowMaterial({
            glowColor: this.actor.color,
            glowInternalRadius: this.actor.glowRadius,
            glowSharpness: this.actor.sharpness,
            transparent: this.actor.transparent,
            depthTest: this.actor.depthTest,
            falloff: this.actor.falloff,
            opacity: this.actor.opacity,
            side: this.actor.side
        });
        this.glow = new THREE.Mesh(geometry, material);
        this.glow.renderOrder = 5000; // this must be set to a large number to keep the associated pawn visible
        this.setRenderObject(this.glow);
        this.listen("visible", this.doVisible);
    }

    doVisible(value) {
        this.glow.visible = value;
    }

    destroy() {
        this.glow.material.dispose();
        this.glow.geometry.dispose();
        super.destroy();
    }
}
GlowPawn.register("GlowPawn");

// HorseActor
// Hero statue at the center of the maze.
//------------------------------------------------------------------------------------------
class HorseActor extends mix(Actor).with(AM_Spatial,) {
    get pawn() { return "HorsePawn" }
}
HorseActor.register('HorseActor');

class HorsePawn extends mix(Pawn).with(PM_Smoothed, PM_ThreeVisible) {

    constructor(actor) {
        super(actor);
        this.load3D();
    }

    load3D() {
        if (this.doomed) return;
        if (readyToLoad3D && horse) {
            this.horse = horse.clone();
            this.horse.traverse( m => {if (m.geometry) { m.castShadow=true; m.receiveShadow=true; } });
            this.setRenderObject(this.horse);
        } else this.future(100).load3D();
    }

    destroy() {
        super.destroy();
        this.horse.traverse( obj => {
            if (obj.geometry) {
                obj.geometry.dispose();
                obj.material.dispose();
            }
        });
    }
}
HorsePawn.register("HorsePawn");

// TreeActor
// Seasonal trees in each corner of the maze.
//------------------------------------------------------------------------------------------
class PlantActor extends mix(Actor).with(AM_Spatial,) {
    get pawn() { return "PlantPawn" }
    get plant() { return this._plant || "spring"}
}
PlantActor.register('PlantActor');

class PlantPawn extends mix(Pawn).with(PM_Smoothed, PM_ThreeVisible) {

    constructor(actor) {
        super(actor);
        this.load3D();
    }

    load3D() {
        if (this.doomed) return;
        if (readyToLoad3D && plants && plants[this.actor.plant]) {
            const model3d = plants[this.actor.plant];
            this.model3d = model3d.clone(); // clone because we will modify it
//            this.tree.traverse( m => {if (m.geometry) { m.castShadow=true; m.receiveShadow=true; } });
            this.setRenderObject(this.model3d);
        } else this.future(100).load3D();
    }

    destroy() {
        super.destroy();
        this.model3d.traverse( obj => {
            if (obj.geometry) {
                obj.geometry.dispose();
                obj.material.dispose();
            }
        });
    }
}
PlantPawn.register("PlantPawn");

// StartWorldcore
// We either start or join a Croquet session here.
// If we are using the lobby, we use the session name in the URL to join an existing session.
// If we are not using the lobby, we create a new session.
//------------------------------------------------------------------------------------------

// redirect to lobby if not in iframe or session
/*const inIframe = window.parent !== window;
const url = new URL(window.location.href);
const sessionName = url.searchParams.get("session");
url.pathname = url.pathname.replace(/[^/]*$/, "index.html");
if (!inIframe || !sessionName) window.location.href = url.href;
*/
// ensure unique session per lobby URL
//const BaseUrl = url.href.replace(/[^/?#]*([?#].*)?$/, "");
//Constants.LobbyUrl = BaseUrl + "index.html";    // hashed into sessionId without params

// QR code points to lobby, with session name in hash
//url.searchParams.delete("session");
//url.hash = encodeURIComponent(sessionName);
//App.sessionURL = url.href;

App.makeWidgetDock({ iframe: true });
App.messages = true;

StartWorldcore({
    ...apiKey,
    appId: 'io.croquet.mazewars', // <-- feel free to change
    //name: sessionName,
    password: "none",
    location: true,
    model: MyModelRoot,
    view: MyViewRoot,
});