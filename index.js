const path = require('path')

module.exports = {

  // ── Phase 1: main process ──────────────────────────────────────────────────

  async initMain(api) {
    const { BrowserWindow } = require('electron')
    let diagramWin = null

    // Re-use the window if already open; otherwise create a new one.
    api.ipc.handle('open-diagram', (sources) => {
      if (diagramWin && !diagramWin.isDestroyed()) {
        diagramWin.focus()
        diagramWin.webContents.executeJavaScript(
          `window.__updateDiagrams(${JSON.stringify(sources)})`
        )
        return
      }

      diagramWin = new BrowserWindow({
        width: 960,
        height: 680,
        minWidth: 480,
        minHeight: 360,
        title: 'Mermaid Diagrams',
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        },
      })

      diagramWin.loadFile(path.join(__dirname, 'diagram-window.html'))

      diagramWin.webContents.once('did-finish-load', () => {
        diagramWin.webContents.executeJavaScript(
          `window.__updateDiagrams(${JSON.stringify(sources)})`
        )
      })

      diagramWin.on('closed', () => { diagramWin = null })
    })

    console.log('[df-mermaid] initMain: open-diagram handler registered')
  },

  // ── Phase 2: renderer ──────────────────────────────────────────────────────

  initRenderer(api) {
    const mount = api.ui.getPluginToolbarMount()

    const btn = document.createElement('button')
    btn.id        = 'df-mermaid-btn'
    btn.className = 'df-plugin-btn'
    btn.innerHTML = _diagramIcon() + ' diagram'
    btn.addEventListener('click', () => _handleClick(api))
    mount.appendChild(btn)

    // Keep button opacity as a live hint: dim when no mermaid blocks present
    const editor = document.getElementById('editor')
    if (editor) editor.addEventListener('input', () => _syncBtn(api))
    api.events.on('app:ready', () => _syncBtn(api))
    api.events.on('file:opened', () => setTimeout(() => _syncBtn(api), 0))
  },

}

// ── Renderer helpers (run in preload context) ─────────────────────────────────

function _handleClick(api) {
  const sources = _extractMermaid(api.editor.getDocument())

  if (sources.length === 0) {
    const btn = document.getElementById('df-mermaid-btn')
    if (btn) {
      btn.style.opacity = '0.35'
      setTimeout(() => { btn.style.opacity = '' }, 400)
    }
    return
  }

  api.ipc.invoke('open-diagram', sources).catch(console.error)
}

function _syncBtn(api) {
  const btn = document.getElementById('df-mermaid-btn')
  if (!btn) return
  const count = _countMermaid(api.editor.getDocument())
  btn.style.opacity = count > 0 ? '1' : '0.45'
  btn.title = count > 0
    ? `Preview ${count} Mermaid diagram${count === 1 ? '' : 's'}`
    : 'No Mermaid diagrams in editor'
}

function _extractMermaid(text) {
  const out = []
  const re  = /```mermaid[ \t]*\n([\s\S]*?)```/g
  let m
  while ((m = re.exec(text)) !== null) {
    const src = m[1].trim()
    if (src) out.push(src)
  }
  return out
}

function _countMermaid(text) {
  return (text.match(/```mermaid[ \t]*\n[\s\S]*?```/g) || []).length
}

function _diagramIcon() {
  return `<svg width="11" height="11" viewBox="0 0 16 16" fill="none"
    stroke="currentColor" stroke-width="1.5" style="vertical-align:-1px">
    <rect x="1" y="6" width="4" height="4" rx="1"/>
    <rect x="11" y="6" width="4" height="4" rx="1"/>
    <rect x="6" y="1" width="4" height="4" rx="1"/>
    <rect x="6" y="11" width="4" height="4" rx="1"/>
    <line x1="5" y1="8" x2="11" y2="8"/>
    <line x1="8" y1="5" x2="8" y2="6"/>
    <line x1="8" y1="10" x2="8" y2="11"/>
  </svg>`
}
