![Cover art](/art/cover.png)

# Artboard Tricks plugin for Figma

A set of utilities for working with top-level frames (i.e. artboards). Current features include:

* Rearrange your artboards into a grid
* Fit artboards to their contents (with padding)

[Install the plugin](https://www.figma.com/community/plugin/911261236876701307/Artboard-Tricks)

## Contributing

To try making some changes to the plugin:

1. Clone the repo and run:

       $ npm install
       $ npm run watch

   This packages up the plugin in the `dist` folder.

2. In Figma, click **Plugins > In Development > Create new plugin > Link existing plugin**
   and choose the `manifest.json` file in the `dist` folder.
