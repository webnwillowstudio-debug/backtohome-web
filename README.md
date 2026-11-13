# BACK TO HOME — Website

Global Resources | A Stronger Kerala

Static website (HTML + CSS + vanilla JS). No build step or framework needed.
Open `index.html` in a browser, or upload the folder to any host (Vercel, Netlify, cPanel, GitHub Pages).

## Pages
| File | Page |
|---|---|
| index.html | Home: hero, about, challenge, 5 pillars, 6-phase framework, programs, audience, core values, mentors, stories, FAQ, CTA |
| about.html | Vision, mission, Malayalam story, why it matters, core values with "ലളിതമായി പറഞ്ഞാൽ" lines, belief |
| programs.html | All programs with category filters |
| program.html | Program detail page (`program.html?id=pravasi-launchpad`) |
| mentors.html | Lead mentor, mentor panel, become-a-mentor |
| apply.html | 3-step application form (`apply.html?program=skill-bridge` pre-selects a program) |
| 404.html | Not-found page |

## Edit content
- **Programs & mentors:** `assets/js/data.js` (DEMO content: replace mentors, fees and dates with real ones)
- **Colours / fonts:** top of `assets/css/style.css` (`--green #0F3D2A`, `--gold #C9A24B`)
- **Logo:** `assets/img/logo.svg` (dark text), `logo-light.svg` (white text), `logo-mark.svg` (icon), `favicon.svg`

## Receive form submissions
In `apply.html` set `data-endpoint="https://formspree.io/f/XXXX"` (or your own API / Google Apps Script URL) on `<form id="apply-form">`.
Submissions are POSTed as JSON.

## Header, footer and pages
The pages are generated from `src/` (shared header/footer partials) with `python3 src/build.py`.
You can also edit the final HTML files directly.
