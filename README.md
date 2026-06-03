# U-INSPIRE-Project-
# Blogr — Landing Page
A modern, fully responsive landing page for Blogr, a publishing platform for writers and creators. Built with semantic HTML5, vanilla CSS (ITCSS architecture), and vanilla JavaScript — zero dependencies, no build tools required.

 Features
- Fully responsive — mobile-first layout that adapts across all screen sizes
- Accessible — keyboard navigation, skip links, ARIA attributes, focus management, `prefers-reduced-motion` support
- Animated — scroll-triggered reveal animations using `IntersectionObserver` (no scroll listeners)
- Interactive navigation — desktop dropdowns and a mobile slide-in menu with accordion submenus
- Performance-optimised — CSS custom properties, GPU-accelerated animations, orbit pause when off-screen
- No dependencies — pure HTML, CSS, and JavaScript
- 
Project Structure

```

blogr-landing/

├── index.html              # Main HTML entry point

├── README.md               # Project documentation (you are here)

│

├── assets/

│   ├── images/             # All image assets (SVGs, PNGs, preview screenshot)

│   └── fonts/              # Self-hosted fonts (if applicable)

│

├── css/

│   ├── base.css            # Design tokens, CSS reset, root variables

│   ├── layout.css          # Structural layout: header, sections, grid

│   ├── components.css      # UI components: nav, hero, cards, footer

│   └── utilities.css       # Animations, helpers, media queries

│

└── js/

    ├── utils.js            # Shared utility functions (BlogrUtils)

    ├── loader.js           # Page loader module (BlogrLoader)

    ├── navigation.js       # Desktop dropdowns + mobile menu (BlogrNavigation)

    ├── animations.js       # Scroll reveals, ripple, header scroll (BlogrAnimations)

    └── main.js             # App entry point — bootstraps all modules

```


> Note: The current version ships as a single `index.html` file with all CSS and JS inlined for simplicity. The structure above represents the recommended split for maintainability.

 Getting Started

Option 1 — Just open it
No build step needed. Clone the repo and open `index.html` in any browser:

```bash

git clone https://github.com/your-username/blogr-landing.git

cd blogr-landing

open index.html   # macOS

# or double-click index.html on Windows/Linux

```

 Option 2 — Local dev server (recommended)
For a better development experience with live reload:

```bash

Using Node.js (npx — no install required)

npx serve .



Using Python

python3 -m http.server 8080



Using VS Code

Install the "Live Server" extension, then click "Go Live"

```



Then open `http://localhost:8080` (or the port shown) in your browser.

 Design Tokens

All visual values are defined as CSS custom properties in `:root` (see `base.css`). To retheme the site, change only these values:

| Token | Value | Usage |

|---|---|---|

| `--color-red` | `#FF525D` | Primary brand colour |

| `--color-coral` | `#FF8F70` | Gradient accent |

| `--color-dark-900` | `#1f3f5b` | Headings, dark text |

| `--font-primary` | `Overpass` | Body copy |

| `--font-secondary` | `Ubuntu` | Navigation, buttons |



---


 CSS Architecture
Styles follow the ITCSS (Inverted Triangle CSS) methodology, layered from global to specific:
1. Design tokens — all values in one place
2. CSS reset — modern, accessible baseline
3. Layout — structural containers and grid
4. Components — individual UI pieces
5. Utilities — overrides and animations

 Accessibility
- Skip-to-content link for keyboard users
- All interactive elements are keyboard and screen-reader accessible
- ARIA roles and `aria-expanded` on all dropdowns and toggles
- Colour contrast meets WCAG AA
- Animations respect `prefers-reduced-motion`
Deployment
This site is deployed via GitHub Pages. Any push to `main` automatically updates the live site.

To deploy your own copy:
1. Fork this repository
2. Go to Settings → Pages
3. Set source to `main` branch, `/ (root)` folder
4. Your site will be live at `https://your-username.github.io/blogr-landing`
 
License
This project is open source and available under the [MIT License](LICENSE)
Design based on the [Frontend Mentor Blogr challenge](https://www.frontendmentor.io/challenges/blogr-landing-page-EX2RLAApP).
