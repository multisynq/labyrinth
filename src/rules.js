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
    const checkScrollable = () => {
        const content = rulesContainer.querySelector('.rules-content');
        const scrollBorder = rulesContainer.querySelector('.scroll-border');
        if (content && scrollBorder) {
            if (content.scrollHeight <= content.clientHeight) {
                scrollBorder.classList.add('hidden');
            } else {
                scrollBorder.classList.remove('hidden');
            }
        }
    };

    // Check multiple times to ensure content has rendered
    setTimeout(checkScrollable, 0);
    setTimeout(checkScrollable, 100);
    setTimeout(checkScrollable, 500);

    // Also check when window is resized
    window.addEventListener('resize', checkScrollable);

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
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 8px;
            z-index: 10000;
            max-height: calc(100vh - 40px);
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
            flex-direction: row-reverse;
        }

        .rules-header h2 {
            margin: 0;
            font-size: 1.8em;
            flex-grow: 1;
            text-align: center;
            font-family: "Times New Roman", Times, serif;  /* Add this line only */
        }

        .rules-close {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 4px;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 8px 16px;
            min-width: 44px;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
            margin-left: 0;
            transition: background-color 0.2s;
        }

        .rules-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .rules-content {
            padding: 20px;
            padding-right: 25px;
            overflow-y: scroll;
            flex-grow: 1;
            max-height: calc(80vh - 130px);
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
            font-family: "Times New Roman", Times, serif;  /* Add this line only */
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

        .rules-divider {
            border: none;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            margin: 15px 0;
            width: 100%;
        }

        /* Desktop styles */
        @media screen and (min-width: 1025px) {
            .rules-overlay {
                width: min(80vh, 90vw);
            }
        }

        /* Mobile landscape */
        @media screen and (max-width: 1024px) and (orientation: landscape) {
            .rules-overlay {
                width: 85vw !important;
                max-height: 90vh;
                top: 5vh;
            }
            
            .rules-content {
                max-height: calc(90vh - 130px);
            }
        }

        /* Mobile portrait */
        @media screen and (max-width: 1024px) and (orientation: portrait) {
            .rules-overlay {
                width: 90vw;
                max-height: 85vh;
            }
            
            .rules-content {
                max-height: calc(85vh - 120px);
                padding: 15px;
                padding-right: 20px;
                font-size: 0.9em;
            }
            
            .rules-header h2 {
                font-size: 1.4em;
            }

            .rules-close {
                width: 36px;
                height: 36px;
                min-width: 36px;
                min-height: 36px;
                font-size: 28px;
                margin-right: 15px;
            }

            .scroll-border {
                height: 50px;
            }

            .scroll-border:hover {
                background: none;
            }

            .scroll-border:active {
                background: rgba(255, 255, 255, 0.1);
            }
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('resize', () => handleResize(rulesContainer));
    window.addEventListener('orientationchange', () => {
        setTimeout(() => handleResize(rulesContainer), 100);
    });

    handleResize(rulesContainer);
    return rulesContainer;
}

// Handle window resize
function handleResize(container) {
    if (!container || container.style.display === 'none') return;

    requestAnimationFrame(() => {
        container.style.removeProperty('width');
        
        const content = container.querySelector('.rules-content');
        const header = container.querySelector('.rules-header');
        const scrollBorder = container.querySelector('.scroll-border');
        
        if (content && header && scrollBorder) {
            const headerHeight = header.offsetHeight;
            const scrollHeight = scrollBorder.offsetHeight;
            
            // Set max-height based on orientation
            if (window.innerWidth > window.innerHeight) {
                content.style.maxHeight = `calc(90vh - ${headerHeight + scrollHeight + 40}px)`;
            } else {
                content.style.maxHeight = `calc(85vh - ${headerHeight + scrollHeight + 40}px)`;
            }
            
            // Force layout calculation and check scroll
            void content.offsetHeight;
            
            // Check if content is scrollable
            if (content.scrollHeight <= content.clientHeight) {
                scrollBorder.classList.add('hidden');
            } else {
                scrollBorder.classList.remove('hidden');
            }
        }
    });
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

        #boxScore {
            top: 80px !important;
        }
    `;
    document.head.appendChild(style);

    const helpButton = document.createElement('button');
    helpButton.className = 'help-button';
    helpButton.innerHTML = '?';
    helpButton.onclick = showRules;
    
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
        "MOVE and ROTATE: WASD or Arrow Keys",
        "LOOK: Mouse",
        "SHOOT: Space/Mouse Button",
        "SOUND: /",
        "VOLUME: +/-",
        "HELP (this screen): H/?",
        "COLOR BLIND MODE: C",
        "-",
        "📱  Mobile Controls:",
        "MOVE: Left side of screen",
        "LOOK: Right side of screen",
        "SHOOT: Tap",
        "HELP (this screen): Help button",
        "-",
        "🗺 Roadmap:",
        "NFT rewards to winning players",
        "Coins to collect",
        "Mobile menu:",
        "- switch controls left/right",
        "- color blindness mode",
        "- sound on/off",
    ];
    
    rulesOverlay = createRules(heading, content);
    createHelpButton();
}

function showRules() {
    if (!rulesOverlay) {
        initRules();
    }
    
    if (rulesOverlay.style.display === 'block') {
        rulesOverlay.style.display = 'none';
        rulesOverlay.style.pointerEvents = 'none';
    } else {
        rulesOverlay.style.display = 'block';
        rulesOverlay.style.pointerEvents = 'auto';
        
        // Force layout calculations and check scroll arrow
        const checkLayout = () => {
            handleResize(rulesOverlay);
            
            const content = rulesOverlay.querySelector('.rules-content');
            const scrollBorder = rulesOverlay.querySelector('.scroll-border');
            
            if (content && scrollBorder) {
                void content.offsetHeight;
                if (content.scrollHeight <= content.clientHeight) {
                    scrollBorder.classList.add('hidden');
                } else {
                    scrollBorder.classList.remove('hidden');
                }
            }
        };
        
        // Check multiple times to ensure proper layout
        checkLayout();
        requestAnimationFrame(checkLayout);
        setTimeout(checkLayout, 50);
        setTimeout(checkLayout, 100);
        setTimeout(checkLayout, 300);
    }
}

function isRulesVisible() {
    return rulesOverlay && rulesOverlay.style.display === 'block';
}

export { showRules, isRulesVisible };