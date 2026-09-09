# Pradeepa N O — Portfolio

Interactive portfolio for **Pradeepa N O**, Embedded Systems Engineer
(multilayer PCB design, power electronics, STM32 / nRF / ESP32 firmware).

Static site — plain HTML / CSS / JS, no build step.

## Structure

| Path | What it is |
|------|------------|
| `index.html` | Main site — reception scene → dashboard (Home / About / Skills / Projects / Contact) |
| `styles.css` | All styles for the main site |
| `script.js` | Reception animation, clock, dashboard navigation, forms |
| `projects/*.html` | Standalone project spec sheets (print / save-as-PDF) |
| `Photo/` | Photos and board renders (`Photo/boards/`) |

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy

Hosted with GitHub Pages from the `main` branch (root).
