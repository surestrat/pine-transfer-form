# SureStrat Pine Transfer Form

A modern form application with full backward compatibility for older browsers.

## Features

- Modern UI with Framer Motion animations for new browsers
- Fallbacks and compatibility for older browsers (including IE11 and Chrome on Windows 7)
- CSS Variables with fallbacks
- Progressive enhancement based on browser capabilities
- Full form validation

## Browser Compatibility

This application has been specifically optimized for:

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Internet Explorer 11
- Older Chrome versions (specifically for Windows 7)

For more details about the browser compatibility implementations, see [BROWSER_COMPATIBILITY.md](./BROWSER_COMPATIBILITY.md).

## Testing Browser Compatibility

To test browser compatibility:

1. Start the development server:

   ```
   npm run dev
   ```

2. Open the browser compatibility test page at:

   ```
   http://localhost:5173/browser-test.html
   ```

3. The test page will show which features are supported in your current browser and if fallbacks are being applied correctly.

## Development

This project uses React with Vite for development. The standard Vite commands apply:
