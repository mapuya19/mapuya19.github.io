/**
 * Terminal Effects - Boot Sequence & Easter Egg
 * Creates an immersive retro terminal experience
 */

(function() {
  'use strict';

  // ==========================================================================
  // Configuration
  // ==========================================================================
  
  const CONFIG = {
    boot: {
      typingSpeed: 12,        // ms per character (faster typing)
      lineDelay: 60,          // ms between lines (quicker transitions)
      okDelay: 100,           // ms before [OK] appears
      finalDelay: 400,        // ms before fade out
      skipOnMobile: false,    // Show boot on mobile too
      mobileLineCount: 7      // Fewer lines on mobile
    },
    statusBar: {
      updateInterval: 1000    // Update time every second
    },
    easterEgg: {
      typingSpeed: 1,         // Very fast typing for ASCII art
      displayDuration: 5000   // Auto-dismiss after 5s
    }
  };

  // Boot sequence messages
  const BOOT_MESSAGES = [
    { text: '> BIOS v3.14.159 initialized...', type: 'info' },
    { text: '> Loading kernel modules...', type: 'default', hasOk: true },
    { text: '> Mounting /dev/creativity...', type: 'default', hasOk: true },
    { text: '> Starting services...', type: 'default', hasOk: true },
    { text: '> Authenticating user: guest', type: 'default', hasOk: true },
    { text: '> ', type: 'default' },
    { text: '> Welcome to mapuya.sh', type: 'success' },
    { text: '> Session started.', type: 'success' }
  ];

  // Mobile-optimized boot messages (shorter)
  const BOOT_MESSAGES_MOBILE = [
    { text: '> BIOS initialized...', type: 'info' },
    { text: '> Loading modules...', type: 'default', hasOk: true },
    { text: '> Starting services...', type: 'default', hasOk: true },
    { text: '> Authenticating...', type: 'default', hasOk: true },
    { text: '> ', type: 'default' },
    { text: '> Welcome to mapuya.sh', type: 'success' },
    { text: '> ', type: 'default' }
  ];

  // ASCII Art for Easter Egg - Straw Hat Jolly Roger
  const ASCII_ART = `
⠀⠀⠀⠀⠀⣠⡶⠟⠛⠻⢶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡶⠛⠛⠻⢶⣄⠀⠀⠀⠀
⠀⠀⠀⠀⣼⠏⠀⠀⠀⠀⠀⢹⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⣤⣤⣤⣤⣤⣤⣤⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠋⠀⠀⠀⠀⠀⢻⡆⠀⠀⠀
⠀⣀⣤⠶⠿⠀⠀⠀⠀⠀⠀⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⠾⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠛⢶⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡄⠀⠀⠀⠀⠀⠸⠷⠶⣤⡀
⣴⠟⠁⠀⠀⠀⠀⠀⠀⠀⠙⢿⣄⠀⠀⠀⠀⠀⠀⠀⢀⣴⠟⠋⢀⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢙⠷⣦⡀⠀⠀⠀⠀⠀⠀⠀⣩⡿⠓⢀⠀⠀⠀⠀⠀⠀⠈⢻
⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣷⡄⠀⠀⠀⠀⣴⡟⠁⠀⣴⣿⠋⣶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⠀⠀⣿⣮⠈⢻⣦⠀⠀⠀⠀⢠⣾⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸
⠹⣧⡀⠀⠀⠀⢠⣆⠀⠀⠀⠀⠀⠈⠻⣦⡀⢀⡾⠋⠀⣠⣾⠟⢡⣾⠟⢀⣼⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣷⡀⠈⢻⣦⡀⠻⣧⡀⣠⡼⠋⠁⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⢀⣼
⠀⠈⠻⠶⠶⠾⠛⠙⢷⣆⡀⠀⠀⠀⠀⠈⢹⡿⠁⠀⠀⡟⡁⠰⡿⠃⣠⢿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢙⢿⣄⠀⡹⣿⡄⢸⣿⡋⠀⠀⠀⠀⠀⢀⣴⡞⠋⠛⠶⠶⠶⠛⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢷⣤⡀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⢀⣴⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣦⡀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢀⣴⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⣈⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣛⣁⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⡟⢯⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⢻⡆⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠘⠿⠾⠶⠶⠶⠶⠶⠶⢶⣷⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⣶⠶⠶⠶⠶⠶⠶⠶⠶⠟⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡀⠀⠀⠀⠀⠀⠀⣠⣴⣾⣶⣶⣦⣀⠀⠀⠀⠀⠀⢀⠀⣠⣴⣾⣶⣶⣤⡀⠀⠀⠀⠀⠀⢰⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣧⠀⠀⠀⠀⢈⣾⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⢬⣾⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀⠠⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣾⡀⠀⠀⣹⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⢰⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⢀⣸⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣥⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠈⠾⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠈⣰⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣮⠀⠀⠙⢿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⠟⠁⢀⣼⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠿⣤⡀⠀⠈⠉⡉⠉⠀⠀⠀⣠⣤⣤⣆⠀⠀⠀⠈⠉⠙⠉⠀⢀⣴⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⣿⣷⣄⣀⠀⠀⠀⠀⠀⠻⠿⠿⠛⠀⠀⠀⠀⠀⣀⣤⡾⣯⡑⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡶⠋⣱⡟⠈⠙⠻⢶⣦⣤⣤⣤⣤⣄⣤⣤⣤⢶⡾⠛⠋⠁⢿⡌⠻⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡾⠋⠀⢠⣿⣄⡀⠀⠀⣾⠀⠀⠀⠠⣹⡏⠀⠀⠀⢸⣇⠀⠀⢀⣼⣷⠀⠈⠻⢦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡾⠋⠀⠀⢀⢸⡇⠉⠛⠳⢦⣿⣄⣀⣀⣀⣸⣇⣀⣀⣠⣬⣿⠶⠞⠋⠁⢼⡆⠀⠀⠀⠙⢷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣠⡶⠶⠳⠶⣦⣴⠞⠋⠀⠀⠀⠀⢸⣸⣯⡀⠀⠀⢰⡇⠈⠉⠉⠉⣹⡏⠉⠉⠁⠀⣿⠀⠀⠀⢀⣼⡇⠀⠀⠀⠀⠀⠙⢷⣤⡴⠾⠳⠶⣦⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣼⠏⠀⠀⠀⠀⠘⠁⠀⠀⠀⠀⠀⣠⡿⢻⡏⠛⢶⣤⣸⣇⡀⠀⠀⠀⢸⡇⠀⠀⠀⢀⣻⣆⣤⠾⠋⣹⡿⣦⡀⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀⠈⢻⡆⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣼⠟⠣⢸⣇⠀⠀⠀⠛⠛⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠛⠛⠀⠀⠀⣼⠇⠘⢿⣇⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠹⣧⣂⠀⠀⠀⠀⠀⠀⠀⠰⣿⡁⠀⠀⢪⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡿⡀⠀⠁⢩⡿⠂⠀⠀⠀⠀⢀⠀⠀⣴⣾⠃⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⣾⠀⠀⠀⠀⠀⠀⢸⡷⠀⠀⠈⠹⣧⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡿⠃⠀⠀⠸⣿⡁⠀⠀⠀⠀⠀⢸⡷⠟⠋⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣆⠀⠀⠀⠀⢀⣼⠇⠀⠀⠀⠀⠙⢷⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⠟⠁⠀⠀⠀⠀⡹⣧⠀⠀⠀⠀⢀⣼⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠅⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⢙⡻⢶⠶⠶⢟⣁⠀⠀⠀⠀⠀⠀⠀⠈⣙⠳⠶⣤⣤⣤⣤⣤⣤⣤⡴⠶⣛⣋⠁⠀⠀⠀⠀⠀⠀⠁⢙⡻⠶⡶⠶⣟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`;

  // ==========================================================================
  // Utility Functions
  // ==========================================================================

  function isMobile() {
    return window.innerWidth < 576;
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==========================================================================
  // Boot Sequence
  // ==========================================================================

  class BootSequence {
    constructor() {
      this.bootScreen = document.getElementById('boot-screen');
      this.bootContent = document.getElementById('boot-content');
      this.mainContent = document.querySelector('.main-content');
      this.isComplete = false;
    }

    async start() {
      if (!this.bootScreen || !this.bootContent) {
        this.showMainContent();
        return;
      }

      // Skip animation if user prefers reduced motion
      if (prefersReducedMotion()) {
        this.skipBoot();
        return;
      }

      // Check if already booted (persists for 1 hour)
      const bootTime = localStorage.getItem('bootComplete');
      if (bootTime && (Date.now() - parseInt(bootTime)) < 3600000) {
        this.skipBoot();
        return;
      }

      const messages = isMobile() ? BOOT_MESSAGES_MOBILE : BOOT_MESSAGES;
      
      // Allow clicking to skip boot
      this.bootScreen.addEventListener('click', () => this.skipBoot());
      document.addEventListener('keydown', (e) => {
        if (!this.isComplete && (e.key === 'Escape' || e.key === ' ')) {
          this.skipBoot();
        }
      });

      await this.runBootSequence(messages);
    }

    async runBootSequence(messages) {
      for (let i = 0; i < messages.length; i++) {
        if (this.isComplete) return;
        
        const msg = messages[i];
        const line = document.createElement('p');
        line.className = `boot-line ${msg.type || ''}`;
        this.bootContent.appendChild(line);

        await this.typeLine(line, msg.text);
        
        if (msg.hasOk && !this.isComplete) {
          await sleep(CONFIG.boot.okDelay);
          const okSpan = document.createElement('span');
          okSpan.className = 'ok-tag';
          okSpan.textContent = ' [OK]';
          line.appendChild(okSpan);
        }

        await sleep(msg.delay || CONFIG.boot.lineDelay);
        
        // Auto-scroll to bottom
        this.bootContent.scrollTop = this.bootContent.scrollHeight;
      }

      if (!this.isComplete) {
        await sleep(CONFIG.boot.finalDelay);
        this.completeBoot();
      }
    }

    async typeLine(element, text) {
      const cursor = document.createElement('span');
      cursor.className = 'boot-cursor';
      element.appendChild(cursor);

      for (let i = 0; i < text.length; i++) {
        if (this.isComplete) {
          element.textContent = text;
          return;
        }
        element.insertBefore(document.createTextNode(text[i]), cursor);
        await sleep(CONFIG.boot.typingSpeed);
      }

      cursor.remove();
    }

    skipBoot() {
      if (this.isComplete) return;
      this.isComplete = true;
      this.completeBoot();
    }

    completeBoot() {
      this.isComplete = true;
      localStorage.setItem('bootComplete', Date.now().toString());
      
      if (this.bootScreen) {
        this.bootScreen.classList.add('fade-out');
        setTimeout(() => {
          this.bootScreen.classList.add('hidden');
        }, 800);
      }
      
      this.showMainContent();
    }

    showMainContent() {
      if (this.mainContent) {
        this.mainContent.classList.add('visible');
      }
    }
  }

  // ==========================================================================
  // Easter Egg
  // ==========================================================================

  class EasterEgg {
    constructor() {
      this.modal = null;
      this.isShowing = false;
      this.autoCloseTimer = null;
      this.observer = null;
    }

    init() {
      // Find and attach click handler to the easter egg element in typed-strings
      const easterEggElement = document.querySelector('.easter-egg');
      if (easterEggElement) {
        easterEggElement.addEventListener('click', (e) => {
          e.preventDefault();
          this.show();
        });
      }

      // Watch the typed element for "one piece" text and make it clickable
      this.watchTypedElement();
    }

    watchTypedElement() {
      const typedElement = document.getElementById('typed');
      if (!typedElement) return;

      // Use MutationObserver to watch for text changes
      this.observer = new MutationObserver(() => {
        const text = typedElement.textContent.toLowerCase();
        if (text.includes('one piece')) {
          typedElement.classList.add('easter-egg-active');
          if (!typedElement.dataset.easterEggBound) {
            typedElement.dataset.easterEggBound = 'true';
            typedElement.addEventListener('click', (e) => {
              if (typedElement.textContent.toLowerCase().includes('one piece')) {
                e.preventDefault();
                this.show();
              }
            });
          }
        } else {
          typedElement.classList.remove('easter-egg-active');
        }
      });

      this.observer.observe(typedElement, { 
        childList: true, 
        characterData: true, 
        subtree: true 
      });
    }

    createModal() {
      const modal = document.createElement('div');
      modal.className = 'ascii-modal';
      modal.innerHTML = `
        <pre class="ascii-art"></pre>
        <p class="ascii-message">☠  THE ONE PIECE IS REAL  ☠</p>
        <p class="dismiss-hint">click anywhere to close</p>
      `;
      document.body.appendChild(modal);
      
      modal.addEventListener('click', () => this.hide());
      document.addEventListener('keydown', (e) => {
        if (this.isShowing && e.key === 'Escape') {
          this.hide();
        }
      });
      
      return modal;
    }

    async show() {
      if (this.isShowing) return;
      this.isShowing = true;

      if (!this.modal) {
        this.modal = this.createModal();
      }

      const artElement = this.modal.querySelector('.ascii-art');
      artElement.textContent = '';
      
      // Show modal with animation
      requestAnimationFrame(() => {
        this.modal.classList.add('visible');
      });

      // Type out ASCII art (or show instantly if reduced motion)
      if (prefersReducedMotion()) {
        artElement.textContent = ASCII_ART;
      } else {
        await this.typeAsciiArt(artElement, ASCII_ART);
      }

      // Keep modal open until user clicks to close
    }

    async typeAsciiArt(element, art) {
      for (let i = 0; i < art.length; i++) {
        if (!this.isShowing) return;
        element.textContent += art[i];
        
        // Speed up for whitespace
        if (art[i] === ' ' || art[i] === '\n') {
          continue;
        }
        await sleep(CONFIG.easterEgg.typingSpeed);
      }
    }

    hide() {
      if (!this.isShowing) return;
      this.isShowing = false;
      
      if (this.autoCloseTimer) {
        clearTimeout(this.autoCloseTimer);
        this.autoCloseTimer = null;
      }

      if (this.modal) {
        this.modal.classList.remove('visible');
      }
    }
  }

  // ==========================================================================
  // Custom Cursor (Under CRT Effects)
  // ==========================================================================

  class CustomCursor {
    constructor() {
      this.cursor = null;
      this.isPointer = false;
      this.mouseX = -100;
      this.mouseY = -100;
      this.cursorX = -100;
      this.cursorY = -100;
      this.rafId = null;
      this.hasMouseMoved = false;
    }

    init() {
      // Don't show custom cursor on touch devices
      if (this.isTouchDevice()) return;

      this.createCursor();
      this.bindEvents();
      this.animate();
    }

    isTouchDevice() {
      return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
    }

    createCursor() {
      this.cursor = document.createElement('div');
      this.cursor.className = 'custom-cursor cursor-default';
      this.cursor.style.opacity = '0'; // Hidden until first mouse movement
      
      // Insert cursor inside the CRT container so it appears under the overlays
      const crtContainer = document.querySelector('.crt-glass');
      if (crtContainer) {
        crtContainer.appendChild(this.cursor);
      } else {
        document.body.appendChild(this.cursor);
      }
    }

    bindEvents() {
      // Track mouse position
      document.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        // Show cursor on first mouse movement
        if (!this.hasMouseMoved) {
          this.hasMouseMoved = true;
          this.cursorX = e.clientX;
          this.cursorY = e.clientY;
          if (this.cursor) {
            this.cursor.style.opacity = '1';
          }
        }
      });

      // Track hover state for pointer cursor
      document.addEventListener('mouseover', (e) => {
        const target = e.target;
        const isClickable = 
          target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button') ||
          target.classList.contains('easter-egg') ||
          target.classList.contains('easter-egg-active') ||
          target.closest('.ascii-modal') ||
          window.getComputedStyle(target).cursor === 'pointer';

        if (isClickable && !this.isPointer) {
          this.isPointer = true;
          this.cursor.classList.remove('cursor-default');
          this.cursor.classList.add('cursor-pointer');
        }
      });

      document.addEventListener('mouseout', (e) => {
        const target = e.target;
        const isClickable = 
          target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button') ||
          target.classList.contains('easter-egg') ||
          target.classList.contains('easter-egg-active') ||
          target.closest('.ascii-modal');

        if (isClickable && this.isPointer) {
          this.isPointer = false;
          this.cursor.classList.remove('cursor-pointer');
          this.cursor.classList.add('cursor-default');
        }
      });

      // Hide cursor when leaving window
      document.addEventListener('mouseleave', () => {
        if (this.cursor) {
          this.cursor.style.opacity = '0';
        }
      });

      document.addEventListener('mouseenter', () => {
        if (this.cursor) {
          this.cursor.style.opacity = '1';
        }
      });
    }

    animate() {
      // Smooth cursor movement with slight lag for CRT feel
      this.cursorX += (this.mouseX - this.cursorX) * 0.5;
      this.cursorY += (this.mouseY - this.cursorY) * 0.5;

      if (this.cursor) {
        // Adjust for hotspot: arrow is (0,0), hand is (4,0)
        const hotspotX = this.isPointer ? 4 : 0;
        const hotspotY = 0;
        this.cursor.style.transform = `translate(${this.cursorX - hotspotX}px, ${this.cursorY - hotspotY}px)`;
      }

      this.rafId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
      if (this.cursor && this.cursor.parentNode) {
        this.cursor.parentNode.removeChild(this.cursor);
      }
    }
  }

  // ==========================================================================
  // Status Bar
  // ==========================================================================

  class StatusBar {
    constructor() {
      this.timeElement = document.querySelector('.status-time');
      this.uptimeElement = document.querySelector('.status-uptime');
      this.startTime = Date.now();
    }

    init() {
      if (!this.timeElement && !this.uptimeElement) return;
      
      this.update();
      setInterval(() => this.update(), CONFIG.statusBar.updateInterval);
    }

    update() {
      // Update time
      if (this.timeElement) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        this.timeElement.textContent = timeStr;
      }

      // Update uptime
      if (this.uptimeElement) {
        const elapsed = Date.now() - this.startTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        const s = seconds % 60;
        const m = minutes % 60;
        const h = hours;
        
        this.uptimeElement.textContent = `uptime: ${h}h ${m}m ${s}s`;
      }
    }
  }

  // ==========================================================================
  // Initialization
  // ==========================================================================

  function init() {
    // Initialize boot sequence
    const boot = new BootSequence();
    boot.start();

    // Initialize easter egg after boot completes (or immediately if skipped)
    const easterEgg = new EasterEgg();
    
    // Wait for DOM to be ready for easter egg
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => easterEgg.init());
    } else {
      easterEgg.init();
    }

    // Initialize status bar
    const statusBar = new StatusBar();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => statusBar.init());
    } else {
      statusBar.init();
    }

    // Initialize custom cursor (under CRT effects)
    const customCursor = new CustomCursor();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => customCursor.init());
    } else {
      customCursor.init();
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

