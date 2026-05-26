# Draftflow Mermaid Plugin

A [Draftflow](https://draftflow.app) plugin that renders Mermaid diagrams from your editor in a dedicated, pannable/zoomable preview window.

## Features

- Adds a **diagram** button to the Draftflow toolbar
- Detects all ` ```mermaid ` fenced code blocks in the active document
- Opens a floating window with a live-rendered preview
- Supports **pan** (drag) and **zoom** (scroll wheel, `+`/`-` keys, or toolbar buttons)
- Shows **tabs** when the document contains multiple diagrams
- **Copy source** button copies the raw Mermaid source back to clipboard
- Dark theme that matches Draftflow's UI

## Supported diagram types

Any diagram type supported by [Mermaid v10](https://mermaid.js.org/intro/):
flowchart, sequenceDiagram, classDiagram, stateDiagram, erDiagram, gantt, pie, journey, gitGraph, mindmap, timeline, and more.

## Installation

### Requirements

- [Draftflow](https://draftflow.app) desktop app (Electron-based)
- The Draftflow version must support external plugins (`pluginToolbar` contribution point)

### Steps

1. **Clone or download this repository**

   ```bash
   git clone git@github.com:sameera207/draftflow-mermaid-plugin.git
   ```

2. **Open Draftflow**

3. **Install the plugin via the Draftflow CLI**

   ```bash
   paperclipai plugin install /path/to/draftflow-mermaid-plugin
   ```

   Replace `/path/to/draftflow-mermaid-plugin` with the actual path where you cloned the repo.

4. **Confirm the plugin loaded**

   A **⬡ diagram** button will appear in the Draftflow toolbar. If you don't see it, restart Draftflow.

### Alternative: manual install

If you prefer to install manually without the CLI, copy the plugin folder into Draftflow's plugins directory and restart the app. Check the Draftflow documentation for the exact plugins folder location on your OS.

## Usage

1. Write a Mermaid diagram in your document inside a fenced code block:

   ````markdown
   ```mermaid
   flowchart LR
     A[Write] --> B[Preview]
     B --> C{Happy?}
     C -- yes --> D[Ship it]
     C -- no  --> A
   ```
   ````

2. Click the **⬡ diagram** button in the toolbar (it brightens when diagrams are detected).

3. A preview window opens. From there you can:
   - **Scroll** to zoom in/out
   - **Drag** to pan
   - Press `+` / `-` to zoom, `0` to reset
   - Use `←` / `→` arrow keys to switch between diagrams when multiple are present
   - Click **copy source** to copy the Mermaid source to your clipboard

## File structure

```
draftflow-mermaid-plugin/
├── plugin.json          # Plugin manifest (id, name, permissions)
├── index.js             # Main process + renderer logic
└── diagram-window.html  # Self-contained preview window (Mermaid v10, pan/zoom)
```

## Development

To iterate on the plugin locally against a running Draftflow instance:

```bash
paperclipai plugin install /path/to/draftflow-mermaid-plugin
```

After editing `index.js` or `diagram-window.html`, use the Draftflow developer menu to **reload plugins** (or restart the app) to pick up changes.

## License

MIT
