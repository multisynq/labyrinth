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

    // Add each content item as a paragraph or horizontal line
    contentText.forEach(text => {
        if (text.trim() === '-') {
            const hr = document.createElement('hr');
            hr.className = 'rules-divider';
            content.appendChild(hr);
        } else {
            const p = document.createElement('p');
            p.textContent = text;
            content.appendChild(p);
        }
    });

    rulesContainer.appendChild(content);

    // Create scroll indicator border
    const scrollBorder = document.createElement('div');
    scrollBorder.className = 'scroll-border';
    const scrollArrow = document.createElement('div');
    scrollArrow.className = 'scroll-arrow';
    scrollArrow.innerHTML = '⌄';
    scrollBorder.appendChild(scrollArrow);
    rulesContainer.appendChild(scrollBorder);

    // Add click/touch handler for the scroll border
    const handleScroll = (e) => {
        e.stopPropagation();
        const contentElement = content;
        const currentScroll = contentElement.scrollTop;
        const pageHeight = contentElement.clientHeight;
        const totalHeight = contentElement.scrollHeight;

        // If near bottom, scroll all the way to bottom
        if (totalHeight - currentScroll - pageHeight < pageHeight) {
            contentElement.scrollTop = totalHeight;
        } else {
            // Otherwise, scroll one page
            contentElement.scrollTop = currentScroll + pageHeight;
        }
    };

    scrollBorder.addEventListener('pointerdown', handleScroll);
    scrollBorder.addEventListener('touchstart', (e) => {
        e.preventDefault();  // Prevent double-firing on some devices
        e.stopPropagation();
        handleScroll(e);
    }, { passive: false });

    document.body.appendChild(rulesContainer);

    // Add scroll event listener to content
    content.addEventListener('scroll', () => {
        const isScrolledToBottom = 
            content.scrollHeight - content.scrollTop <= content.clientHeight + 1;
        
        if (isScrolledToBottom) {
            scrollBorder.classList.add('hidden');
        } else {
            scrollBorder.classList.remove('hidden');
        }
    });

    // Initial check if content is scrollable
    setTimeout(() => {
        if (content.scrollHeight <= content.clientHeight) {
            scrollBorder.classList.add('hidden');
        }
    }, 100);

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
            top: 20px;  /* Match countdown timer position */
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 8px;
            z-index: 10000;
            max-height: calc(100vh - 40px);  /* Account for top margin */
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
            max-height: calc(80vh - 130px);  /* Adjusted to make room for scroll border */
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

        .scroll-border {
            height: 40px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            justify-content: center;
            align-items: center;
            transition: opacity 0.3s;
            cursor: pointer;
        }

        .scroll-border:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .scroll-arrow {
            font-size: 24px;
            color: white;
            animation: bounce 1.5s infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(5px); }
        }

        .scroll-border.hidden {
            opacity: 0;
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
                max-height: calc(85vh - 120px);  /* Adjusted for scroll border */
            }

            .rules-close {
                width: 36px;
                height: 36px;
                font-size: 28px;
            }

            .scroll-border {
                height: 50px;  /* Larger touch target on mobile */
            }

            .scroll-border:hover {
                background: none;  /* Prevent hover state from sticking on mobile */
            }

            .scroll-border:active {
                background: rgba(255, 255, 255, 0.1);  /* Show feedback on active touch */
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
        .rules-divider {
            border: none;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            margin: 15px 0;
            width: 100%;
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
    const heading = "🌿 Labyrinth of Seasons 🌿";
    const content = [
        "Welcome to the Labyrinth! ",
        "Labyrinth is a multiplayer strategy/shooter game where you compete by claiming territory.",
        "You represent a season and start the game near your season's tree.",
        "You claim a new cell for your season by moving from an already claimed cell.",
        "The new cell is then connected to your season's tree.",
        "You cannot be harmed when you are in your season's corner.",
        "You can only shoot at someone when you are standing on your season's color.",
        "You move faster on your claimed territory.",
        "If your territory gets cut off from your base, you lose those cells.",
        "-",
        "The winner is the player with the most territory when time runs out.",
        "They receive the game generated NFT as well as other prizes!",
        "-",
        "💻  PC Controls:",
        "Click in the window to enter Pointer Lock to play.",
        "Press ESC to exit Pointer Lock.",
        "MOVE: WASD or Arrow Keys",
        "LOOK: Mouse",
        "SHOOT: Space/Mouse Button",
        "SOUND: /",
        "VOLUME: +/-",
        "HELP (this screen): H/?",
        "COLOR BLIND MODE: C",
        "-",
        "📱  Mobile Controls:",
        "MOVE/LOOK: Joystick",
        "SHOOT: Tap",
        "HELP (this screen): Help button",
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