# React Image Upload and Editor Module

This React aplication allows users create customized Crossword, Fill-In, and Word Search puzzles online. Choose grid sizes from 10x10 to 25x25, add words manually or via Excel, and download high-quality PDFs with puzzles and solutions.

## Installation

To make modifications to the React component, first, install the dependencies:

```bash
npm install
```

## Development

Use the following command to start the development server. Every time you make a change, the component will be packaged into `puzzle_generator.js` inside the `dev` folder. While this command is running, `puzzle_generator.js` will be updated automatically every time you save:

```bash
npm start
```

If you prefer to update the `puzzle_generator.js` file only when executing the command, use:

```bash
npm run test
```

Both commands compile the debug version with elements activated through the browser console.

## Production

To compile the deployment version ready for production, use the following command. This will package the application into `puzzle_generator.js` inside the `dist` folder:

```bash
npm run build
```

## Usage

To test these components, create an HTML file with the following structure:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="logo.png" />
    <link rel="apple-touch-icon" href="logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="<My description>" data-rh="true" />
    <title>My title</title>
  </head>
  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>

    <div id="puzzle_generator"></div>
    <script src="puzzle_generator.js"></script>
  </body>
</html>
```

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request with improvements.

## License

MIT
