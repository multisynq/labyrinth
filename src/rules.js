let rulesOverlay;

function createRules(headingText, contentText) {
    // Create container
    const rulesContainer = document.createElement('div');
    rulesContainer.className = 'rules-overlay';
    rulesContainer.style.display = 'none';

    // Create header with close button
    const header = document.createElement('div');
    header.className = 'rules-header';
    
    const title = document.createElement('h2');
    title.textContent = headingText;
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.className = 'rules-close';
    closeButton.onclick = () => {
        rulesContainer.style.display = 'none';
        rulesContainer.style.pointerEvents = 'none';
    };
    
    header.appendChild(title);
    header.appendChild(closeButton);
    rulesContainer.appendChild(header);

    // Create content container
    const content = document.createElement('div');
    content.className = 'rules-content';

    // Add each content item as a paragraph
    contentText.forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        content.appendChild(p);
    });

    rulesContainer.appendChild(content);
    document.body.appendChild(rulesContainer);

    // Prevent pointer events from reaching the game
    rulesContainer.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
    });

    // Prevent wheel events from reaching the game
    rulesContainer.addEventListener('wheel', (e) => {
        e.stopPropagation();
    });

    // Add CSS
    const style = document.createElement('style');
    style.textContent = `
        .rules-overlay {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 8px;
            z-index: 1000;
            max-height: 80vh;
            width: min(80vh, 90vw);
            display: flex;
            flex-direction: column;
            pointer-events: auto;
            overflow: hidden;
            -webkit-overflow-scrolling: touch;
        }

        .rules-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            flex-shrink: 0;
        }

        .rules-header h2 {
            margin: 0;
            font-size: 1.8em;
            flex-grow: 1;
            text-align: center;
        }

        .rules-close {
            background: none;
            border: 2px solid white;
            border-radius: 50%;
            color: white;
            font-size: 36px;
            cursor: pointer;
            padding: 0;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            margin-left: 20px;
        }

        .rules-close:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .rules-content {
            padding: 20px;
            padding-right: 25px;
            overflow-y: scroll;
            flex-grow: 1;
            max-height: calc(80vh - 90px);
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }

        .rules-content::-webkit-scrollbar {
            width: 12px;
            background-color: rgba(0, 0, 0, 0.2);
        }

        .rules-content::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 6px;
        }

        .rules-content::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 6px;
            border: 2px solid rgba(0, 0, 0, 0.2);
        }

        .rules-content::-webkit-scrollbar-thumb:hover {
            background-color: rgba(255, 255, 255, 0.4);
        }

        .rules-content p {
            margin: 0 0 15px 0;
            line-height: 1.6;
            font-size: 1.1em;
        }

        @media (max-width: 768px) {
            .rules-overlay {
                width: 90vw;
                max-height: 85vh;
            }
            
            .rules-header h2 {
                font-size: 1.4em;
            }
            
            .rules-content {
                padding: 15px;
                padding-right: 20px;
                font-size: 0.9em;
                max-height: calc(85vh - 80px);
            }

            .rules-close {
                width: 36px;
                height: 36px;
                font-size: 28px;
            }
        }
    `;
    document.head.appendChild(style);

    // Handle window resize
    function handleResize() {
        if (rulesContainer.style.display !== 'none') {
            rulesContainer.style.width = `min(80vh, 90vw)`;
            rulesContainer.style.maxHeight = '80vh';
        }
    }
    window.addEventListener('resize', handleResize);

    return rulesContainer;
}

function createHelpButton() {
    const style = document.createElement('style');
    style.textContent = `
        .help-button {
            position: fixed;
            top: 20px;
            left: 20px;
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.5);
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            color: white;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            transition: background-color 0.3s;
            padding: 0;
        }

        .help-button:hover {
            background: rgba(0, 0, 0, 0.7);
        }

        /* Adjust scorebox position */
        #boxScore {
            top: 80px !important;
        }
    `;
    document.head.appendChild(style);

    const helpButton = document.createElement('button');
    helpButton.className = 'help-button';
    helpButton.innerHTML = '?';
    helpButton.onclick = showRules;
    
    // Prevent pointer events from reaching the game
    helpButton.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
    });

    document.body.appendChild(helpButton);
}

function initRules() {
    const heading = "Labyrinth of Seasons";
    const content = [
        "Welcome to the Labyrinth! ",
        "Labyrinth is a multiplayer strategy/shooter game where you compete by claiming territory.",
        "The winner is the player with the most territory when time runs out.",
        "Each player represents a season and starts near their own season'stree.",
        "You claim adjacent tiles by moving onto them from your existing territory.",
        "You cannot be harmed when you are in your season's corner.",
        "You can only shoot at someone when standing on your own season's color.",
        "You move faster when on your own colored tiles.",
        "If your territory gets cut off from your base, you lose those tiles.",
        "PC Controls:",
        "   MOVE: WASD or Arrow Keys",
        "   LOOK: Mouse",
        "   SHOOT: Space/Mouse Button",
        "   SOUND: /",
        "   VOLUME: +/-",
        "Mobile Controls:",
        "   MOVE/LOOK: Joystick",
        "   SHOOT: Tap"
    ];
    
    rulesOverlay = createRules(heading, content);
    createHelpButton();
}

function showRules() {
    if (!rulesOverlay) {
        initRules();
    }
    
    // Toggle visibility
    if (rulesOverlay.style.display === 'block') {
        rulesOverlay.style.display = 'none';
        rulesOverlay.style.pointerEvents = 'none';
    } else {
        rulesOverlay.style.display = 'block';
        rulesOverlay.style.pointerEvents = 'auto';
    }
}

export default showRules;