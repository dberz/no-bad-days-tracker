# Custom Fonts

This directory is for custom font files that will be used in the Social Substance Health Tracker application.

## How to Use Custom Fonts

1. Upload your font files (e.g., .woff, .woff2, .ttf) to this directory
2. Import the fonts in your CSS or use the Next.js Font system

### Example using CSS (in globals.css):

```css
@font-face {
  font-family: 'YourCustomFont';
  src: url('/fonts/your-font-file.woff2') format('woff2'),
       url('/fonts/your-font-file.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* Then use it in your styles */
.custom-text {
  font-family: 'YourCustomFont', sans-serif;
}
