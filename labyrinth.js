//------------------Labyrinth---------------------------------------------------------------
// This is a simple example of a multi-player 3D shooter.
// Actually, it isn't just a shooter. It is a strategy game.
// Think of it as "Go" with guns.
//
// It is loosely based upon the early Maze War game created at NASA Ames in 1973
// https://en.wikipedia.org/wiki/Maze_War and has elements of Go, Pacman, The Colony and Dodgeball.
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
// Compass is in the minimap (removed).
// Added a full screen button.
// Warmed up floor shader.
// Use '/' to turn sound on and off.
// Snap the floor shader to the floor.
// Destroy the glow when the avatar is destroyed.
// Play the shock sound when another player captures a cell.
// Shock and awe are working.
// Volume is working.
// Added text display for volume and sound and other things as required.
// Compass is now centered on the white square (removed).
// The iris of the eyes matches the season color.
// Removed the compass - minimap now rotates.
// Season icons are now displayed in the center of the screen.
// View the rules screen.
// Fixed respawn to update lastX and lastY. Could not shoot until you moved.
// Added color blindness mode for minimap.
// We don't go off the map anymore, but we can tunnel through walls or jump 2 cells.
// Missiles are warmed up.
// Fixed the floor glow objects that became visible when a reload occurs.
// Tuned mobile controls. May need more work based on testing.
// Sounds are now warmed up.
// Added season color to avatar.
// Only generate the number of instances that are actually needed.
// Turned the WallActor into an InstanceActor.
// Safari pointer lock support.
// Scrollable window displays an arrow to show that it is scrollable.
// Mobile controls - copy Call of Duty mobile.
// - right is look around
// - left is move (strafe and forward)
// - tap is shoot
// - rules window close button is on top of the full screen button - move it to the left side
// - rules window close button gets scaled in the y direction when the window is resized
// - rules window is too narrow when the window is rotated
// - score board needs to be larger
// Switch to emoji for season display
// Switch to emoji for victory display
// Winning display displays the season and name.
// Fixed the rules window so the arrow at the bottom is visible in various orientations and ratios on all devices.
// Added a win sound
// Added text display for recharged.
// Reset the world to start a new game.
// Emoji display text has stronger shadow.
// Added a "Start Game" button to restart the game.
// Resized textures so that it works on iPhone. So far so good.
// Use left/right arrows to turn for people who don't have a mouse.
// Resized the ivy model. Seems to be working on iOS now.
// Place new users in free spots. Note that this only occurs if the user gets around the lobby and joins the game directly.
// Ignore users who do not join the game from the lobby and there is no room.
// Fixed the goes to sleep and restart problem.
// Added the lobby.
// Fixed lobby layout. Added stats to the banner.
// Added "photo mode" to remove all of the overlay elements for screenshots and videos.
// Added background image (from photo mode) to the lobby. 
// Fixed the maze generation so that it doesn't have dead ends around corners.
// Removed the back arrow to return to the lobby. 
// Added the 30 second countdown sound.
//------------------------------------------------------------------------------------------
// Bugs:
// We don't go off the map anymore, but we can tunnel through walls or jump 2 cells.
//------------------------------------------------------------------------------------------
// Priority To do:
// Lobby:
// - Send current game state to lobby.
// - Don't update the lobby very often.
// Add the coins.
// Use the color blind colors for the cells.
//------------------------------------------------------------------------------------------
// Nice to have:
// Claiming another player's cell should take longer than claiming a free cell.
// Last ten seconds of the game should have a countdown alert.
// Sound effects are put on hold until the avatar's sound is ready, but should be ignored.
// The center of the maze is at 10,10.
// Three big weenies.
// Rooms (Brian Upton suggestion)?
// Chat -broadcast messages to all players, colors are their team color. This is difficult, as we
// are in mouse look mode. Perhaps press "c" to type a message, hit enter and then you are back.
// Add a "ready" button to start the game.
// Music is streamed to the game from the web. Players can turn it on and off - or play along
// and vote for the songs they like.
// Ask the AI to take the source code for labyrinth and document the entire thing so that it could be nicely formatted as a book.
//------------------------------------------------------------------------------------------
// Need artist:
// The ivy needs to be cleaned up at the top.
//------------------------------------------------------------------------------------------
// Education:
// - Anything that can stay in the view, keep in the view. If no one else needs to
//   see it or know it, don't share it.
// - Sending messages from the view to the model is expensive. Try to avoid it.
// - Sending messages from the model to view is very cheap. Send as much as you want.
// - The purpose of the model is to provide shared computations. This is particularly
//   true for simulations.
//------------------------------------------------------------------------------------------

import { App, StartWorldcore, Constants, ViewService, ModelRoot, ViewRoot,Actor, mix, toRad,
    InputManager, AM_Spatial, PM_Spatial, PM_Smoothed, Pawn, AM_Avatar, PM_Avatar, UserManager, User,
    q_yaw, q_pitch, q_axisAngle, v3_add, v3_sub, v3_normalize, v3_rotate, v3_scale, v3_distanceSqr,
    THREE, ADDONS, PM_ThreeVisible, ThreeRenderManager, PM_ThreeCamera, PM_ThreeInstanced, ThreeInstanceManager
} from '@croquet/worldcore';


import FullscreenButton from './src/Fullscreen.js';
import FakeGlowMaterial from './src/FakeGlowMaterial.js';
import DeviceDetector from './src/DeviceDetector.js';
import BoxScore from './src/BoxScore.js';
// import Joystick from './src/Joystick.js';
import Countdown from './src/Countdown.js';
import MazeActor from './src/MazeActor.js';
import {InstanceActor, instances, materials, geometries} from './src/Instance.js';  
import showRules from './src/rules.js';
import EmojiDisplay from './src/EmojiDisplay.js';
import GameButton from './src/GameButton.js';

import apiKey from "./src/apiKey.js";

// Textures
//------------------------------------------------------------------------------------------
import sky from "./assets/textures/aboveClouds.jpg";
// import eyeball_summer from "./assets/textures/EyeSummer.png";
import eyeball_autumn from "./assets/textures/EyeAutumn_05k.png";
import eyeball_winter from "./assets/textures/EyeWinter_05k.png";
import eyeball_spring from "./assets/textures/EyeSpring_05k.png";
/*
import missile_color from "./assets/textures/metal_gold_vein/metal_0080_color_1k.jpg";
import missile_normal from "./assets/textures/metal_gold_vein/metal_0080_normal_opengl_1k.png";
import missile_roughness from "./assets/textures/metal_gold_vein/metal_0080_roughness_1k.jpg";
import missile_displacement from "./assets/textures/metal_gold_vein/metal_0080_height_1k.png";
import missile_metalness from "./assets/textures/metal_gold_vein/metal_0080_metallic_1k.jpg";

import marble_color from "./assets/textures/marble_checker/marble_0013_color_1k.jpg";
import marble_normal from "./assets/textures/marble_checker/marble_0013_normal_opengl_1k.png";
import marble_roughness from "./assets/textures/marble_checker/marble_0013_roughness_1k.jpg";
//import marble_displacement from "./assets/textures/marble_checker/marble_0013_height_1k.png";

import corinthian_color from "./assets/textures/corinthian/concrete_0014_color_1k.jpg";
import corinthian_normal from "./assets/textures/corinthian/concrete_0014_normal_opengl_1k.png";
import corinthian_roughness from "./assets/textures/corinthian/concrete_0014_roughness_1k.jpg";
import corinthian_displacement from "./assets/textures/corinthian/concrete_0014_height_1k.png";
*/
import missile_color from "./assets/textures/metal_gold_vein/metal_0080_color_05k.jpg";
import missile_normal from "./assets/textures/metal_gold_vein/metal_0080_normal_opengl_05k.png";
import missile_roughness from "./assets/textures/metal_gold_vein/metal_0080_roughness_05k.jpg";
//import missile_displacement from "./assets/textures/metal_gold_vein/metal_0080_height_05k.png";
//import missile_metalness from "./assets/textures/metal_gold_vein/metal_0080_metallic_05k.jpg";

import marble_color from "./assets/textures/marble_checker/marble_0013_color_05k.jpg";
// import marble_normal from "./assets/textures/marble_checker/marble_0013_normal_opengl_05k.png";
import marble_roughness from "./assets/textures/marble_checker/marble_0013_roughness_05k.jpg";
// import marble_displacement from "./assets/textures/marble_checker/marble_0013_height_05k.png";

import corinthian_color from "./assets/textures/corinthian/concrete_0014_color_05k.jpg";
import corinthian_normal from "./assets/textures/corinthian/concrete_0014_normal_opengl_05k.png";
import corinthian_roughness from "./assets/textures/corinthian/concrete_0014_roughness_05k.jpg";
import corinthian_displacement from "./assets/textures/corinthian/concrete_0014_height_05k.png";

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
import ivy_glb from "./assets/ivy3.glb";

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
import winSound from "./assets/sounds/Win.wav";
import startGameSound from "./assets/sounds/StartGame.wav";
import clockSound from "./assets/sounds/Clock.wav";
export { clockSound };

// Global Variables
//------------------------------------------------------------------------------------------
const GAME_MINUTES = 1;
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

let readyToLoad3D = false;
let readyToLoadTextures = false;
let readyToLoadSounds = false;

// 3D Models
let eyeball;
let column;
let hexasphere;
let horse;
let trees;
let plants;
let ivy;

export const seasons = {
    Spring:{cell:{x:0,y:0}, emoji: "🌸", nextCell:{x:1,y:1}, angle:toRad(180+45), color:0xFFB6C1, color2:0xCC8A94, colorBlind:0xCC79A7, colorEye: 0xFFEEEE},
    Summer: {cell: {x:0,y:CELL_SIZE-2}, emoji: "🌿", nextCell:{x:1,y:CELL_SIZE-3}, angle:toRad(270+45), color:0x90EE90, color2:0x65AA65, colorBlind:0x009E73, colorEye: 0xD0FFD0},
    Autumn: {cell:{x:CELL_SIZE-2, y:CELL_SIZE-2}, emoji: "🍁", nextCell:{x:CELL_SIZE-3,y:CELL_SIZE-3}, angle:toRad(0+45), color:0xFFE5B4, color2:0xCCB38B, colorBlind:0xE69F00, colorEye: 0xFFE5B4},
    Winter: {cell:{x:CELL_SIZE-2, y:0}, emoji: "❄️", nextCell:{x:CELL_SIZE-3,y:1}, angle:toRad(90+45), color:0xA5F2F3, color2:0x73BFBF, colorBlind:0x0072B2, colorEye: 0xE0E0FF},
    none: {cell:{x:0,y:0}, emoji: "🌐", nextCell:{x:1,y:1}, angle:0, color:0xFFFFFF, color2:0xFFFFFF, colorBlind:0xFFFFFF, colorEye: 0xFFFFFF}
};

// display the rules window
showRules();
// the new game button
const gameButton = new GameButton();

// display the centered bottom text info display
function createTextDisplay() {
    // Create container
    const textDisplay = document.createElement('div');
    textDisplay.className = 'text-display';

    // Add to DOM
    document.body.appendChild(textDisplay);

    // Add CSS for fade effect with longer transition
    const style = document.createElement('style');
    style.textContent = `
        .text-display {
            position: fixed;
            bottom: 100px;  /* Fixed distance from bottom */
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

// Determine if we are mobile or desktop
const device = new DeviceDetector();
setTextDisplay(device.isMobile? "mobile device":"desktop",10);

// Minimap canvas
const minimapDiv = document.getElementById('minimap');
const minimapCanvas = document.createElement('canvas');
const minimapCtx = minimapCanvas.getContext('2d');
minimapCtx.globalAlpha = 0.1;
minimapCanvas.width = 220;
minimapCanvas.height = 220;

function scaleMinimap() {
    //const minimapDiv = document.getElementById('minimap');
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
/*
        // Adjust top position based on orientation
        if (window.innerHeight > window.innerWidth) { // portrait mode
            minimapDiv.style.top = '80px';
        } else { // landscape mode
            minimapDiv.style.top = '50px';
        }
            */
}
scaleMinimap();

let overlaysHidden = false;
let hiddenElements = new Map(); // Store original display values

function toggleOverlays() {
    overlaysHidden = !overlaysHidden;
    
    // List of element IDs and classes to toggle
    const elements = [
        '#minimap',
        '.box-score',
        '#countdown',
        '#version-number',
        '.text-display',
        '.help-button',
        '#codelink',
        '.victory-display',
        '.victory-icon',
        '.victory-text',
        '#built-with'
    ];
    
    // Handle standard elements
    elements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            if (overlaysHidden) {
                if (window.getComputedStyle(element).display !== 'none') {
                    hiddenElements.set(selector, element.style.display || 'block');
                    element.style.display = 'none';
                }
            } else {
                if (hiddenElements.has(selector)) {
                    element.style.display = hiddenElements.get(selector);
                    hiddenElements.delete(selector);
                }
            }
        }
    });

    // Handle fullscreen button separately to preserve flex display
    const fullscreenButton = document.querySelector('.fullscreen-button');
    if (fullscreenButton) {
        if (overlaysHidden) {
            if (window.getComputedStyle(fullscreenButton).display !== 'none') {
                hiddenElements.set('fullscreen', 'flex'); // Always store as flex
                fullscreenButton.style.display = 'none';
            }
        } else {
            if (hiddenElements.has('fullscreen')) {
                fullscreenButton.style.display = 'flex'; // Always restore as flex
                hiddenElements.delete('fullscreen');
            }
        }
    }

    // Handle emoji element from EmojiDisplay
    const emojiElement = document.querySelector('div[style*="position: fixed"][style*="z-index: 1000"]');
    if (emojiElement) {
        if (overlaysHidden) {
            if (window.getComputedStyle(emojiElement).display !== 'none') {
                hiddenElements.set('emoji', emojiElement.style.display || 'flex');
                emojiElement.style.display = 'none';
            }
        } else {
            if (hiddenElements.has('emoji')) {
                emojiElement.style.display = hiddenElements.get('emoji');
                hiddenElements.delete('emoji');
            }
        }
    }
}

// Sound Manager
//------------------------------------------------------------------------------------------
export let soundSwitch = false; // turn sound on and off
let volume = 1;

const maxSound = 16;
const listener = new THREE.AudioListener();
const soundList = {};
const soundLoops = [];
const loopSoundVolume = 0.25;

function warmupAudio() {
    // Create and play a silent buffer
    const audioContext = listener.context;
    const silentBuffer = audioContext.createBuffer(1, 1, 22050);
    const source = audioContext.createBufferSource();
    source.buffer = silentBuffer;
    source.connect(audioContext.destination);
    source.start();
    source.stop();
    
    // Resume audio context if it's suspended
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}
document.addEventListener('click', () => {
    warmupAudio();
}, { once: true });

export const playSound = function() {
    function play(soundURL, parent3D, force, loop = false) {
        if (!soundSwitch) return;

        // Check if we're on mobile and the audio context is suspended
        const audioContext = THREE.AudioContext.getContext();
        if (device.isMobile && audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                return playSoundOnce(soundList[soundURL], parent3D, force, loop);
            });
        } else if (soundList[soundURL]) {
            return playSoundOnce(soundList[soundURL], parent3D, force, loop);
        }
    }
    return play;
}();

function playSoundOnce(sound, parent3D, force, loop = false) {
    // console.log("playSoundOnce", sound.count, maxSound, parent3D);
    if (!force && sound.count>maxSound) return null;
    sound.count++;
    let mySound;
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

    // don't play if sound is muted
    if (soundSwitch )mySound.play();
    return mySound;
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
        audioLoader.loadAsync(winSound),
        audioLoader.loadAsync(startGameSound),
        audioLoader.loadAsync(clockSound),
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
    soundList[winSound] = {buffer:sounds[11], count:0};
    soundList[startGameSound] = {buffer:sounds[12], count:0};
    soundList[clockSound] = {buffer:sounds[13], count:0};
});

// Load 3D Models
//------------------------------------------------------------------------------------------
function  deepClone(original) {

    let clone;
    if (original.isMesh) 
        clone = new THREE.Mesh(original.geometry.clone(),original.material.clone());
    else clone = new THREE.Group();
    
    original.children.forEach((child) => clone.add(deepClone(child)));
 // Copy transform
    clone.position.copy(original.position);
    clone.rotation.copy(original.rotation);
    clone.scale.copy(original.scale);
    
    return clone;
}

async function modelConstruct() {
    const gltfLoader = new ADDONS.GLTFLoader();
    const dracoLoader = new ADDONS.DRACOLoader();
    dracoLoader.setDecoderPath('draco/');
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
    const width = 20;
    const height = 10;
    const frontWall = new THREE.PlaneGeometry(width, height);
    const backWall = new THREE.PlaneGeometry(width, height);
    backWall.rotateY(Math.PI);
    geometries.wall = ADDONS.BufferGeometryUtils.mergeGeometries([frontWall, backWall], false);
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

let sky_t, missile_color_t, missile_normal_t, missile_roughness_t, //missile_displacement_t, missile_metalness_t,
//    power_color_t, power_normal_t, power_roughness_t, power_displacement_t, power_metalness_t,
    marble_color_t, marble_roughness_t, // marble_normal_t, marble_displacement_t,
    corinthian_color_t, corinthian_normal_t, corinthian_roughness_t, corinthian_displacement_t, eyeball_spring_t, eyeball_autumn_t, eyeball_winter_t;

async function textureConstruct() {
    ["hexasphere", "wall", "floor"].forEach( name => {
        const material = new THREE.MeshStandardMaterial();
        materials[name] = material;
    });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    return [sky_t, missile_color_t, missile_normal_t, missile_roughness_t, // missile_displacement_t, missile_metalness_t,
    // power_color_t, power_normal_t, power_roughness_t, power_displacement_t, power_metalness_t,
     marble_color_t, marble_roughness_t, //marble_normal_t, marble_displacement_t,
     corinthian_color_t, corinthian_normal_t, corinthian_roughness_t, corinthian_displacement_t,
     eyeball_spring_t, eyeball_autumn_t, eyeball_winter_t
    ] = await Promise.all( [
        textureLoader.loadAsync(sky),
        textureLoader.loadAsync(missile_color),
        textureLoader.loadAsync(missile_normal),
        textureLoader.loadAsync(missile_roughness),
        //textureLoader.loadAsync(missile_displacement),
        //textureLoader.loadAsync(missile_metalness),
        // textureLoader.loadAsync(power_color),
        // textureLoader.loadAsync(power_normal),
        // textureLoader.loadAsync(power_roughness),
        // textureLoader.loadAsync(power_displacement),
        // textureLoader.loadAsync(power_metalness),
        textureLoader.loadAsync(marble_color),
        //textureLoader.loadAsync(marble_normal),
        textureLoader.loadAsync(marble_roughness),
       // textureLoader.loadAsync(marble_displacement),
        textureLoader.loadAsync(corinthian_color),
        textureLoader.loadAsync(corinthian_normal),
        textureLoader.loadAsync(corinthian_roughness),
        textureLoader.loadAsync(corinthian_displacement),
        textureLoader.loadAsync(eyeball_spring),
        textureLoader.loadAsync(eyeball_autumn),
        textureLoader.loadAsync(eyeball_winter),
    ]);
}

textureConstruct().then( () => {
    readyToLoadTextures = true;
    console.log("textures loaded-------------------");
    complexMaterial({
        colorMap: missile_color_t,
        normalMap: missile_normal_t,
        roughnessMap: missile_roughness_t,
        //metalnessMap: missile_metalness_t,
        //displacementMap: missile_displacement_t,
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
        //normalMap: marble_normal_t,
        roughnessMap: marble_roughness_t,
    //    displacementMap: marble_displacement_t,
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
        LobbyRelay.create();
        this.seasons = {};
        const xOffset = (MAZE_ROWS*CELL_SIZE)/2;
        const zOffset = (MAZE_COLUMNS*CELL_SIZE)/2;
        this.base = BaseActor.create({ translation:[xOffset,0,zOffset]});
        this.maze = MazeActor.create({translation: [0,5,0], rows: MAZE_ROWS, columns: MAZE_COLUMNS, cellSize: CELL_SIZE, minutes: GAME_MINUTES});
        this.horse = HorseActor.create({translation:[210.9,10,209.70], scale:[8.75,8.75,8.75]});
        const s = 9.0;
        this.spring = PlantActor.create({plant:"Spring",translation: [20, 0.5, 20], scale:[s,s,s]});
        this.summer = PlantActor.create({plant:"Summer",translation: [20, 0.5, 360], scale:[s,s,s]});
        this.autumn = PlantActor.create({plant:"Autumn",translation: [360, 0.5, 360], scale:[s,s,s]});
        this.winter = PlantActor.create({plant:"Winter",translation: [360, 0.5, 20], scale:[s,s,s]});
        this.skyAngle = 0;
        this.rotateSky();
    }

    getSeason(driver){
        // this should manage first come/first serve, but that is tricky. Especially if someone waiting leaves.
        let rval;
        if (!this.seasons.Spring) { this.seasons.Spring = {driver}; rval = "Spring"; }
        else if (!this.seasons.Summer) { this.seasons.Summer = {driver}; rval = "Summer"; }
        else if (!this.seasons.Autumn) { this.seasons.Autumn = {driver}; rval = "Autumn"; }
        else if (!this.seasons.Winter) { this.seasons.Winter = {driver}; rval = "Winter"; }
        // console.log("getSeason", rval, this.seasons);
        return rval;
    }

    releaseSeason(season) {
        delete this.seasons[season];
    }

    rotateSky() {
        this.skyAngle += 0.0005;
        if (this.skyAngle > 2*Math.PI) this.skyAngle -= 2*Math.PI;
        this.publish("root","rotateSky", this.skyAngle);
        this.future(50).rotateSky();
    }
}
MyModelRoot.register("MyModelRoot");

// MyViewRoot
// Construct the visual world
//------------------------------------------------------------------------------------------
const victoryEmojiDisplay = new EmojiDisplay();
export class MyViewRoot extends ViewRoot {

    static viewServices() {
        return [MyInputManager, ThreeRenderManager, AvatarManager, ThreeInstanceManager];
    }

    onStart() {
        this.buildView();
        const timer = this.wellKnownModel("ModelRoot").maze.timer
        this.countdownTimer = new Countdown(timer);
        // Initialize the scoreboard
        this.boxScore = new BoxScore();
        this.boxScore.setScores({"Spring": 4, "Summer": 4, "Autumn": 4, "Winter": 4});
        this.skyRotation = new THREE.Euler(0, 0, 0);
        this.subscribe("root", "rotateSky", this.rotateSky);
        this.subscribe("input", "resize", scaleMinimap);
        this.subscribe("maze", "countDown", this.countDown);
        this.subscribe("maze", "victory", this.victory);
        // this.subscribe("game", "reset", this.reset);
        const scores = this.wellKnownModel("ModelRoot").maze.seasons;
        this.boxScore.setScores(scores);
        this.subscribe("maze", "score", this.scoreUpdate);
        this.subscribe("maze", "reset", this.reset);
        // We joined at the end of the game...
        if(timer === 0) this.newGameButton();
        //const actors = this.wellKnownModel('ActorManager').actors;
        //console.log("MyViewRoot onStart actors", actors);
        this.lobbyRelay = new LobbyRelayView(this.wellKnownModel("lobbyRelay"));
    }

    detach() {
        this.lobbyRelay.detach();
        this.lobbyRelay = null;
        super.detach();
    }
    reset(){
        victoryEmojiDisplay.hide();
        gameButton.hide();
        playSound(startGameSound);
    }

    countDown(timer) {
        // console.log("countDown", timer);
        this.countdownTimer.set(timer);
    }

    scoreUpdate( data ){
        this.boxScore.setScores(data);
   //     console.log("scoreUpdate", data);
    }

    victory(scores) {
        console.log("Victory: ", scores);
        let winner = "Spring";
        for (const season in scores) {
            if (scores[season] > scores[winner]) winner = season;
        }

        victoryEmojiDisplay.show(seasons[winner].emoji, device.isMobile?128:256, seasons[winner].color, winner, "Wins!");
        this.future(4000).newGameButton();
        playSound( winSound );
    }

    newGameButton() {
    // Show the button when game ends
        gameButton.show(() => {
            // Your reset game logic here
            this.publish("game", "reset");
        });
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
export let colorBlind = false;
class AvatarActor extends mix(Actor).with(AM_Spatial, AM_Avatar) {
    get pawn() { return "AvatarPawn" }

    init(options) {
        super.init(options);
        //this.season = this.wellKnownModel("ModelRoot").getSeason(this.driver);
        this.throttleMin = 1.0;
        this.throttleMax = 2.0;
        this.canShoot = true;
        this.inCorner = true;
        this.isCollider = true;
        this.isAvatar = true;
        this.radius = AVATAR_RADIUS;
        this.highGear = this.throttleMin;
        this.listen("shootMissile", this.shootMissile);
        this.listen("claimCell", this.claimCell);
        this.fireball =  FireballActor.create({parent: this, radius:this.radius});
        this.fireball.future(1000).hide();
        const translation = [this.translation[0], this.translation[1]-5, this.translation[2]];
        MissileActor.create({parent: this, color: 0x000000, translation}); // throw away missile for warming up
        this.setHighSpeed(this.throttleMax);
        this.subscribe("game", "reset", this.reset);
        this.future(1000).startSeason();
    }

    startSeason() {
        this.season = this.wellKnownModel("ModelRoot").getSeason(this.driver);
        if(this.season) {
            console.log("AvatarActor init", this.season);
            this.eyeball = EyeballActor.create({parent: this});
            const x = seasons[this.season].cell.x;
            const y = seasons[this.season].cell.y;
            const t = [CELL_SIZE*x+10,AVATAR_HEIGHT,CELL_SIZE*y+10];
            const angle = seasons[this.season].angle; //Math.PI*2*seasons[this.season].angle/360;
            const r = q_axisAngle([0,1,0],angle);
            this.set({translation: t, rotation: r});
            this.buildGlow();
            if(this.season)this.say("startMeUp",this.season);
            this.seasonStarted = true;
        }else this.future(1000).startSeason();
    }

    reset() {
        this.future(1000).respawn();
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
            this.glow[i] = GlowActor.create({avatar: this,shape:"cube", color: this.color, depthTest: true, radius: 1.25, glowRadius: 0.5, falloff: 0.1, opacity: 0.75, sharpness: 0.5});
            this.glow[i].sink(1000, 1, doCell.floor.translation);
            this.glow[i].future(1000).hide();
        }
    }

 //   get season() {return this._season || "spring"}

    get color() {return colorBlind? seasons[this.season].colorBlind:seasons[this.season].color}
    get color2() {return colorBlind? seasons[this.season].colorBlind:seasons[this.season].color2}
    get colorBlind() {return seasons[this.season].colorBlind}

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
                    this.say("claimCellUpdate", {x:data.x, y:data.y, season:this.season});
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
        //console.log("AvatarActor shootMissile");
        this.canShoot = false;
        this.say("shootMissileSound", this.id);
        this.future(MISSILE_LIFE/2).reloadMissile();
        MissileActor.create({avatar: this, color: this.color2});
    }

    reloadMissile() {
        this.say("recharged");
        this.canShoot = true;
    }

    kill() {
        // console.log("kill", this.id, "KILLED");
        this.fireball.show();
        this.fireball.future(3000).hide();
        this.future(1000).respawn();
    }

    respawn() {
        const t = [CELL_SIZE*seasons[this.season].cell.x+10,AVATAR_HEIGHT,CELL_SIZE*seasons[this.season].cell.y+10];
        const angle = seasons[this.season].angle; //Math.PI*2*seasons[this.season].angle/360;
        const r = q_axisAngle([0,1,0],angle);
        this.set({translation: t, rotation: r});
        this.canShoot = true;
        this.inCorner = true;
        this.say("respawn", {t, r, angle});
    }

    destroy() {
        // console.log("AvatarActor destroy", this);
        this.wellKnownModel("ModelRoot").releaseSeason(this.season);
        for(let i=0; i<4; i++) {this.glow[i].destroy();}
        super.destroy();
    }
}
AvatarActor.register('AvatarActor');

// AvatarPawn
// The avatar is designed to instantly react to user input and the publish those changes
// so other users are able to see and interact with this avatar. Though there will be some latency
// between when you see your actions and the other users do, this should have a minimal
// impact on gameplay.
//------------------------------------------------------------------------------------------
const avatarEmojiDisplay = new EmojiDisplay();
class AvatarPawn extends mix(Pawn).with(PM_Smoothed, PM_ThreeVisible, PM_Avatar) {

    constructor(actor) {
        super(actor);
        this.listen("startMeUp", this.onStart);
        this.isAvatar = true;
        this.radius = actor.radius;

        // console.log("AvatarPawn constructor", this.lastX, this.lastY);
        this.service("AvatarManager").avatars.add(this);

        this.listen("shootMissileSound", this.didShootSound);
        this.listen("recharged", this.rechargedSound);
        this.listen("claimCellUpdate", this.claimCellUpdate);
        this.listen("respawn", this.respawn);
        //this.listen("colorBlindReady", this.setColorBlind);
        this.subscribe(this.viewId, "synced", this.handleSynced);
        this.subscribe("maze", "clearCells", this.clearCells);
        this.subscribe("maze", "reset", this.reset);
        this.setupMobile();
        if(this.actor.seasonStarted) this.onStart(this.actor.season);
    }
    
    // Reset the minimap for new game
    reset() {
        this.redrawMinimap();
    }
    
    onStart(season) {
        console.log("AvatarPawn onStart", season);
        this._translation = this.actor.translation;
        this._rotation = this.actor.rotation;
        this.yaw = q_yaw(this.rotation);
        this.yawQ = q_axisAngle([0,1,0], this.yaw);
        this.lastX = seasons[this.season].cell.x+1;
        this.lastY = seasons[this.season].cell.y+1;
        this.localChanged();
        this.refreshDrawTransform();
        this.refreshChildDrawTransform();
        if(this.isMyAvatar) {
            //this.yaw = q_yaw(this.rotation);
            this.createMinimap();
            minimapDiv.style.transform = `rotate(${this.yaw}rad)`;
            avatarEmojiDisplay.show(seasons[this.season].emoji, device.isMobile?64:128, seasons[this.season].color, this.season);
        }
    }

    get season() {return this.actor.season}
    get color() {return colorBlind? seasons[this.season].colorBlind:seasons[this.season].color}
    get color2() {return colorBlind? seasons[this.season].colorBlind:seasons[this.season].color2}
    get colorBlind() {return seasons[this.season].colorBlind}

    setColorBlind() {
        this.redrawMinimap();
        this.redrawMaze();
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
        this.yaw = data.angle;
        this.yawQ = data.r;
        const x = seasons[this.season].cell.x+1;
        const y = seasons[this.season].cell.y+1;
        if (this.isMyAvatar) {
            this.avatarMinimap(this.lastX, this.lastY, x, y);
            minimapDiv.style.transform = `rotate(${this.yaw}rad)`;
        }
        this.lastX = x;
        this.lastY = y;
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
            if (this.season === mazeActor.getSeason(this.lastX, this.lastY)) {
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
        if (this.isMyAvatar) {
            playSound(rechargedSound, this.renderObject, false);
            setTextDisplay("Recharged!", 2);
        }
    }

    keyDown(e) {
        //console.log("keyDown", e.key);
        switch (e.key) {
            case "ArrowUp": case "W": case "w":
                this.gas = 1; break;
            case "ArrowDown": case "S": case "s":
                this.gas = -1; break;
            case "A": case "a":
                this.strafe = 1; break;
            case "D": case "d":
                this.strafe = -1; break;
            case "ArrowLeft":
                this.turn = -1; break;
            case "ArrowRight":
                this.turn = 1; break;
            case " ":
                this.shootMissile();
                break;
            case "?": case "h": case "H":
                showRules();
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
            case 'c': case 'C':
                console.log("toggle color blindness mode");
                setTextDisplay("Color Blind "+ (colorBlind? "off":"on"),4);
                colorBlind = !colorBlind;
                this.setColorBlind();
                break;
            case 'r': case 'R':
                this.publish("game", "reset");
                break;
            case 'p': case 'P':
                toggleOverlays();
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
            case "A": case "a":
                this.strafe = 0; break;
            case "D": case "d":
                this.strafe = 0; break;
            case "ArrowRight": case "ArrowLeft": 
                this.turn = 0; break;                
            case " ":
                this.shootNow = false;
                break;
            default:
        }
    }

    doPointerDown(e) {
        if (!device.isMobile) {
            const im = this.service("MyInputManager");
            if (im.inPointerLock) this.shootMissile();
            else {
                im.enterPointerLock();
                soundSwitch = true;
            }
        } else soundSwitch = true; // turn sound on for mobile
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
        const im = this.service("MyInputManager");
        if ( im.inPointerLock ) this.pointerLook(e.xy[0], e.xy[1], 0.002);
    }

   pointerLook(x,y,scale) {
       // console.log("AvatarPawn lookAround", x,y,scale);
        this.yaw -= x * scale;
        this.yaw = this.normalizeRotation(this.yaw);
        minimapDiv.style.transform = `rotate(${this.yaw}rad)`;
        this.yawQ = q_axisAngle([0,1,0], this.yaw);
        this.positionTo(this.translation, this.yawQ);

        // update the eyeball's pitch
        /*
        let p = this.eyeball.pitch;
        p -= y * scale;
        p = Math.max(-PI_4, Math.min(PI_4, p));
        this.eyeball.pitch = p;
        this.eyeball.pitchQ = q_axisAngle([1,0,0], this.eyeball.pitch);
        this.eyeball.set({rotation: this.eyeball.pitchQ});
        */
    }

    setupMobile() {
        if (device.isMobile) {
            // Separate touch tracking for each side
            this.leftTouch = {
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
                startTime: 0,
                active: false,
                identifier: null
            };
            
            this.rightTouch = {
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
                startTime: 0,
                active: false,
                identifier: null
            };

            this.gas = 0;
            this.strafe = 0;
            
            // Add the control overlay with visible divider
            const style = document.createElement('style');
            style.textContent = `
                #mobileControls {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 100;
                    display: flex;
                }
                #leftControl, #rightControl {
                    flex: 1;
                    height: 100%;
                    touch-action: none;
                }
                #rightControl {
                    border-left: 2px solid rgba(255, 255, 255, 0.2);
                }
            `;
            document.head.appendChild(style);

            // Create and add the control elements
            const controls = document.createElement('div');
            controls.id = 'mobileControls';
            
            const leftControl = document.createElement('div');
            leftControl.id = 'leftControl';
            
            const rightControl = document.createElement('div');
            rightControl.id = 'rightControl';
            
            controls.appendChild(leftControl);
            controls.appendChild(rightControl);
            document.body.appendChild(controls);

            // Debug logging
            console.log("Mobile controls initialized");

            // Add event listeners
            const addTouchListeners = (element, side) => {
                element.addEventListener('touchstart', (e) => {
                    console.log(`${side} touchstart`);
                    this.handleTouchStart(e, side);
                });
                element.addEventListener('touchmove', (e) => {
                    console.log(`${side} touchmove`);
                    this.handleTouchMove(e, side);
                });
                element.addEventListener('touchend', (e) => {
                    console.log(`${side} touchend`);
                    this.handleTouchEnd(e, side);
                });
            };

            addTouchListeners(leftControl, 'left');
            addTouchListeners(rightControl, 'right');
        }
    }

    handleTouchStart(e, side) {
        e.preventDefault();
        
        // Get the touch that occurred in this control's area
        const rect = document.getElementById(side === 'left' ? 'leftControl' : 'rightControl').getBoundingClientRect();
        const touch = Array.from(e.touches).find(t => {
            const x = t.clientX;
            return side === 'left' ? 
                (x < rect.right && x >= rect.left) : 
                (x >= rect.left && x < rect.right);
        });
        
        if (!touch) return;

        if (side === 'left') {
            this.leftTouch = {
                startX: touch.clientX,
                startY: touch.clientY,
                currentX: touch.clientX,
                currentY: touch.clientY,
                startTime: Date.now(),
                active: true,
                identifier: touch.identifier
            };
        } else {
            this.rightTouch = {
                startX: touch.clientX,
                startY: touch.clientY,
                currentX: touch.clientX,
                currentY: touch.clientY,
                startTime: Date.now(),
                active: true,
                identifier: touch.identifier
            };
        }
    }

    handleTouchMove(e, side) {
        e.preventDefault();
        
        // Find the touch that matches our stored identifier
        const touchData = side === 'left' ? this.leftTouch : this.rightTouch;
        if (!touchData.active) return;

        const touch = Array.from(e.touches).find(t => t.identifier === touchData.identifier);
        if (!touch) return;

        const control = document.getElementById(side === 'left' ? 'leftControl' : 'rightControl');
        const rect = control.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        if (side === 'left') {
            this.leftTouch.currentX = touch.clientX;
            this.leftTouch.currentY = touch.clientY;
            
            const divider = Math.min(width, height) * 0.25;
            const deltaX = (this.leftTouch.currentX - this.leftTouch.startX) / divider;
            const deltaY = (this.leftTouch.currentY - this.leftTouch.startY) / divider;
            
            this.gas = -Math.max(-1, Math.min(1, deltaY));
            this.strafe = -Math.max(-1, Math.min(1, deltaX));
            
        } else {
            this.rightTouch.currentX = touch.clientX;
            this.rightTouch.currentY = touch.clientY;
            
            const deltaX = this.rightTouch.currentX - this.rightTouch.startX;
            const scaledDeltaX = (deltaX / width) * Math.PI;
            
            this.pointerLook(scaledDeltaX, 0, 1);
            this.rightTouch.startX = this.rightTouch.currentX;
            this.rightTouch.startY = this.rightTouch.currentY;
        }
    }

    handleTouchEnd(e, side) {
        e.preventDefault();
        
        // Check if our tracked touch has ended
        const touchData = side === 'left' ? this.leftTouch : this.rightTouch;
        const touchStillActive = Array.from(e.touches).some(t => t.identifier === touchData.identifier);
        
        if (!touchStillActive) {
            const touchDuration = Date.now() - touchData.startTime;
            
            if (touchDuration < 100 && touchData.active && 
                Math.abs(touchData.currentX - touchData.startX) < 10 &&
                Math.abs(touchData.currentY - touchData.startY) < 10) {
                console.log("shoot");
                this.shootMissile();
            }
            
            if (side === 'left') {
                this.gas = 0;
                this.strafe = 0;
                this.leftTouch.active = false;
                this.leftTouch.identifier = null;
            } else {
                this.rightTouch.active = false;
                this.rightTouch.identifier = null;
            }
        }
    }

    update(time, delta) {
        super.update(time,delta);
        if (this.driving) {
            if ( this.turn ) this.pointerLook(this.turn, 0, 0.05);
            if (this.gas || this.strafe) {
                if(delta/1000 > 0.1) console.log("AvatarPawn update", delta);
                const factor = Math.min(delta/1000,0.1);
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
        } else { return this.translation;}// if we find ourselves off the map, then jump back
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
        if(this.isMyAvatar) playSound(cellSound, null, false);
        this.drawMinimapCell(data.x,data.y, data.season);
    }

    clearCells(data) {
//        console.log("AvatarPawn clearCells", data.avatarId, this.actor.id);
        if(this.isMyAvatar) {
            if(data.avatarId === this.actor.id) playSound(aweSound, this.renderObject, false);
            else playSound(shockSound, null, false);
        }
        for (const cell of data.clearCells) {
            this.drawMinimapCell(cell[0]+1,cell[1]+1, null);
        }
    }

    createMinimap() {
        //console.log("createMinimap");
        // Add the canvas to the minimap div
        //const minimapDiv = document.getElementById('minimap');
        minimapDiv.style.display = 'block'; // Show minimap when game starts
        minimapDiv.appendChild(minimapCanvas);
        this.redrawMinimap();
    }

    redrawMinimap() {
       // if (!this.isMyAvatar) return;
        console.log("redrawMinimap");
        const mazeActor = this.wellKnownModel("ModelRoot").maze;
        minimapCtx.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);

        for (let y = 1; y < mazeActor.rows; y++) {
            for (let x = 1; x < mazeActor.columns; x++) {
                this.drawMinimapCell(x,y,  mazeActor.getCellSeason(x,y));
            }
        }
        const xCell = 1+Math.floor(this.translation[0]/CELL_SIZE);
        const yCell = 1+Math.floor(this.translation[2]/CELL_SIZE);
        if (this.isMyAvatar) {
            this.avatarMinimap(null, null, xCell, yCell);
            minimapDiv.style.transform = `rotate(${this.yaw}rad)`;
        }
    }

    drawMinimapCell(x,y, season) {
        // console.log("drawMinimapCell", x,y, season);
        let color;
        if (!season) color = 0xFFFFFF;
        else color = colorBlind ? seasons[season].colorBlind:seasons[season].color;
        function hexNumberToColorString(hexNumber) {
            let hexString = hexNumber.toString(16);
            while (hexString.length < 6) {
                hexString = '0' + hexString;
            }
            return '#' + hexString.toUpperCase();
        }
        if (color !== 0xFFFFFF) {
            minimapCtx.clearRect(x*11-5, y*11-5, 10, 10);
            minimapCtx.globalAlpha = 0.5;
            minimapCtx.fillStyle = hexNumberToColorString(color);
            minimapCtx.fillRect(x*11-5, y*11-5, 10, 10);
        } else {
            minimapCtx.clearRect(x*11-5, y*11-5, 10, 10);
        }
    }

    avatarMinimap(lastX, lastY, x, y) {
        if (lastX) {
            const mazeActor = this.wellKnownModel("ModelRoot").maze;
            this.drawMinimapCell(lastX, lastY, mazeActor.getCellSeason(lastX,lastY));
        }
        minimapDiv.style.transform = `rotate(${this.yaw}rad)`;
        minimapCtx.globalAlpha = 0.9;
        minimapCtx.fillStyle = "#FFFFFF";
        minimapCtx.fillRect(x*11-4, y*11-4, 8, 8);
    }

    redrawMaze() {
        this.publish("maze", "redraw");
    }
}

AvatarPawn.register("AvatarPawn");

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
        //this.pitch = q_pitch(this.rotation);
        //this.pitchQ = q_axisAngle([1,0,0], this.pitch);
        if ( !this.parent.isMyAvatar ) {
            this.load3D();
        } else this.parent.eyeball = this;
        playSound( enterSound, this.renderObject );
        this.shootNow = true;
    }

    load3D() {
        if (this.doomed) return;
        if (readyToLoad3D && eyeball) {
            let color = seasons[this.parent.season].colorEye;
            // console.log("load3D", this.parent.season, color.toString(16));
            if(this.parent.season === "Summer") this.eye = eyeball.scene;
            else this.eye = deepClone(eyeball.scene);

            //console.log("EyeballPawn load3D", this.parent.season);
            //console.log("EYES:", this.eye, eyeball.scene);

            const material = this.eye.children[0].children[0].material;
            material.color = new THREE.Color(color);
            // console.log("material color", color, color.toString(16),material.color);
            if(this.parent.season === "Spring") material.map = eyeball_spring_t;
            else if(this.parent.season === "Autumn") material.map = eyeball_autumn_t;
            else if(this.parent.season === "Winter") material.map = eyeball_winter_t;
            material.needsUpdate = true;
            this.eye.traverse( m => {
                if (m.geometry) {    
                    m.castShadow=true; 
                    m.receiveShadow=true; 
                }
            });
            this.eye.scale.set(40,40,40);
            this.eye.rotation.set(0,Math.PI,0);
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
       // console.log("MyUser init", this);
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
        console.log("MyUser destroy");
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
// MyInputManager
// Patching the InputManager to support Safari pointer lock. 
// This is a bit of a hack - we need to have the pointer lock in the direct user thread.
//------------------------------------------------------------------------------------------

// Mobile controls - copy Call of Duty mobile.
// - right is look around
// - left is move (strafe and forward)
// - tap is shoot
// - score board needs to be larger
//------------------------------------------------------------------------------------------
class MyInputManager extends InputManager {
    constructor() {
        super("MyInputManager");    
    }
    // Override pointer lock for mobile
    // Override pointer lock for mobile and Safari
    onPointerDown(event) {
        if (device.isMobile) return;
        
        // Check if Safari
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        if (!this.inPointerLock) {
            if (isSafari && document.fullscreenElement) {
                // For Safari in fullscreen, exit fullscreen before requesting pointer lock
                document.exitFullscreen().then(() => {
                    this.enterPointerLock();
                    soundSwitch = true;
                });
            } else {
                this.enterPointerLock();
                soundSwitch = true;
            }
        } else {
            super.onPointerDown(event);
        }
    }
}

// MissileActor
// Fired by the avatar - they destroy the other players but bounce off of everything else
//------------------------------------------------------------------------------------------
class MissileActor extends mix(Actor).with(AM_Spatial) {
    get pawn() { return "MissilePawn" }

    init(options) {
        super.init(options);
        this.hexasphere = InstanceActor.create({name: "hexasphere", parent: this, max:8});
        this.glow = GlowActor.create({parent: this, color: options.color||0xff8844, depthTest: true, radius: 1.25, glowRadius: 0.5, falloff: 0.1, opacity: 0.75, sharpness: 0.5});
        this.flicker = PointFlickerActor.create({parent: this, playSound: true,color: options.color||0xff8844});
        this.future(this._avatar ? 4000 : 1000).destroy(); // destroy after some time
        if (this._avatar) {
            this.isCollider = true;
            this.radius = MISSILE_RADIUS;
            const t = [...this._avatar.translation];
            t[1]=5;
            this.translation = [...t];
            this.rotation = [...this._avatar.rotation];
            this.yaw = q_yaw(this.rotation);
            this.yawQ = q_axisAngle([0,1,0], this.yaw);
            this.direction = v3_scale(v3_rotate(this.forward, this.yawQ), -1);
            this.velocity = v3_scale(this.direction, MISSILE_SPEED*2);
            //this.timeScale = 0.00025 + Math.random()*0.00002;
            this.hasBounced = false; // I can kill my avatar if I bounce off a wall first
            this.tick(0);
        }
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
//        const scale = Math.sin(this.now()*0.01)*0.5 + 1.5;
//        this.hexasphere.set({scale: [scale,scale,scale]});
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
        //console.log("testCollision", this.id, "KILLED");
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
        // console.log("PointFlickerPawn constructor", this);
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

// CoinActor
// Capture the flag coin.
//------------------------------------------------------------------------------------------
class CoinActor extends mix(Actor).with(AM_Spatial) {
    get pawn() { return "CoinPawn" }

    init(options) {
        super.init(options);
        this.center = this.translation[1];
        this.timeScale = 0.00025 + Math.random()*0.00002;
        this.offset = Math.random()*Math.PI;
       this.future(100).tick();
    }

    get name() { return this._name || "coin" }

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
CoinActor.register('CoinActor');

// CoinPawn
//------------------------------------------------------------------------------------------
export class CoinPawn extends mix(Pawn).with(PM_Smoothed, PM_ThreeVisible, PM_ThreeInstanced) {

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
CoinPawn.register("CoinPawn");

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
        this.doVisible(this.actor.visible);
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

// Elected
// This model elects a view to relay messages to the lobby.
//------------------------------------------------------------------------------------------
class Elected extends Croquet.Model {
    init() {
        super.init();
        this.viewIds = new Set();
        this.electedViewId = "";
        this.subscribe(this.sessionId, "view-join", this.viewJoined);
        this.subscribe(this.sessionId, "view-exit", this.viewExited);
    }

    viewJoined(viewId) {
        this.viewIds.add(viewId);
        this.viewsChanged();
    }

    viewExited(viewId) {
        this.viewIds.delete(viewId);
        this.viewsChanged();
    }

    viewsChanged() {
        if (!this.viewIds.has(this.electedViewId)) {
            this.electedViewId = this.viewIds.values().next().value;
            this.viewElected(this.electedViewId);
            console.log(this.now(), "elected", this.electedViewId);
        }
    }

    viewElected(viewId) {
        this.publish(this.sessionId, "elected-view", viewId);
    }
}
Elected.register("Elected");
// LobbyRelay
// This relay model relays messages from the game to the lobby.
//------------------------------------------------------------------------------------------
class LobbyRelay extends Elected {
    init() {
        super.init();
        this.beWellKnownAs("lobbyRelay");
        this.changeId = 0;
        this.toRelay = null;
        this.subscribe(this.id, "relay-done", this.relayDone);
    }

    viewsChanged() {
        super.viewsChanged();
        if (this.viewIds.size === 0) {
            this.toRelay = null;
        } else {
            this.toRelay = { changeId: ++this.changeId, views: [...this.viewIds] };
            this.publish(this.id, "relay-views");
        }
        console.log(this.now(), "to relay", this.toRelay);
    }

    viewElected(viewId) {
        this.publish(this.id, "relay-changed", viewId);
    }

    relayDone(changeId) {
        console.log(this.now(), "relay done", changeId);
        if (this.toRelay && this.toRelay.changeId === changeId) {
            this.toRelay = null;
            console.log(this.now(), "to relay", this.toRelay);
        }
    }
}
LobbyRelay.register("LobbyRelay");

// LobbyRelayView
// This view relays messages from the game to the lobby.
//------------------------------------------------------------------------------------------
class LobbyRelayView extends Croquet.View {
    constructor(model) {
        super(model);
        this.model = model;
        window.addEventListener("message", this);
        this.subscribe(model.id, "relay-changed", this.relayChanged);
        console.log("relay", this.viewId, "created");
        this.relayChanged(this.model.electedViewId);
    }

    relayChanged(viewId) {
        console.log("relay", this.viewId, "relay changed to", viewId, this.viewId === viewId ? "(me)" : "(not me)");
        clearInterval(this.lobbyInterval);
        if (viewId === this.viewId) {
            this.reportToLobby();
            this.lobbyInterval = setInterval(() => this.reportToLobby(), 1000);
        }
    }

    detach() {
        clearInterval(this.lobbyInterval);
        window.removeEventListener("message", this);
        super.detach();
        console.log("relay", this.viewId, "detached");
    }

    reportToLobby() {
        let users = `${this.model.viewIds.size} player${this.model.viewIds.size === 1 ? "" : "s"}`;
        const locations = new Map();
        let unknown = false;
        for (const viewId of this.model.viewIds) {
            const loc = CROQUETVM.views[viewId]?.loc;
            if (loc?.country) {
                let location = loc.country;
                if (loc.region) location = loc.region + ", " + location;
                if (loc.city) location = loc.city.name + " (" + location + ")";
                locations.set(location, (locations.get(location) || 0) + 1);
            } else {
                unknown = true;
            }
        }
        if (locations.size > 0) {
            let sorted = [...locations].sort((a, b) => b[1] - a[1]);
            if (sorted.length > 3) {
                sorted = sorted.slice(0, 3);
                unknown = true;
            }
            users += ` from ${sorted.map(([location]) => location).join(", ")}`;
            if (unknown) users += " and elsewhere";
        }

        window.parent.postMessage({type: "croquet-lobby", name: this.session.name, users}, "*");
        // console.log("relay", this.viewId, "sending croquet-lobby", this.session.name, users);
    }

    handleEvent(event) {
        if (event.type !== "message") return;
        console.log("relay", this.viewId, "got", event.data);
    }
}

// StartWorldcore
// We either start or join a Croquet session here.
// If we are using the lobby, we use the session name in the URL to join an existing session.
// If we are not using the lobby, we create a new session.
//------------------------------------------------------------------------------------------

// redirect to lobby if not in iframe or session
const inIframe = window.parent !== window;
const url = new URL(window.location.href);
const sessionName = url.searchParams.get("session");
url.pathname = url.pathname.replace(/[^/]*$/, "index.html");
if (!inIframe || !sessionName) window.location.href = url.href;

// ensure unique session per lobby URL
const BaseUrl = url.href.replace(/[^/?#]*([?#].*)?$/, "");
Constants.LobbyUrl = BaseUrl + "index.html";    // hashed into sessionId without params

// QR code points to lobby, with session name in hash
url.searchParams.delete("session");
url.hash = encodeURIComponent(sessionName);
App.sessionURL = url.href;

App.makeWidgetDock({ iframe: true });
App.messages = true;

StartWorldcore({
    ...apiKey,
    appId: 'io.multisynq.labyrinth', // <-- feel free to change
    name: sessionName,
    password: "none",
    location: true,
    model: MyModelRoot,
    view: MyViewRoot,
});