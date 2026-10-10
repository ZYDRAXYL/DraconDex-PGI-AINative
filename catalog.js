// Same content as catalog.json, as a plain JS assignment instead of a fetched
// file: a file://-loaded plugin window cannot fetch() or XMLHttpRequest a
// sibling file at all (Chromium treats a file:// page as an opaque "null"
// origin and refuses both APIs outright — confirmed against the real
// Electron plugin window, not just a theoretical CORS rule) but CAN load a
// <script src> same as app.js/style.css already do. Keep this identical to
// catalog.json — everything after 'window.CATALOG = ' up to the trailing
// `;` must stay valid JSON on its own, so scripts/check-catalog-sync.mjs can
// verify the two never drift apart without a JS parser.
window.CATALOG = {
  "catalogVersion": "1.1.0",
  "forApp": "DraconDex",
  "forAppMinVersion": "4.7.0",
  "updated": "2026-10-10",
  "app": {
    "name": "DraconDex",
    "tagline": "Novel & world-building data manager",
    "description": "An Electron desktop app for organizing world-building data for novels: characters, places, timelines, relationships, game/story design, and Obsidian-style markdown notes with [[wikilinks]]."
  },
  "features": [
    { "id": "nexus", "name": "Nexus", "description": "Vault home and the module tree: a user-buildable tree of nodes, each picking one of 15 kinds (collector, manager, inspector, classifier, locator, chronicler, wanderer, narrator, author, scribe, drafter, viewer, connector, sketcher, designer)." },
    { "id": "scribe", "name": "Scribe", "description": "Markdown notes with Obsidian-style [[wikilinks]] and automatic backlinks." },
    { "id": "ide_shell", "name": "IDE Shell", "description": "Explorer tree, status bar, keyboard shortcuts, and a quick switcher for jumping to any note, character or chapter." },
    { "id": "director", "name": "Director", "description": "Novel-data module: chapters and characters, plus the project tools below once a project is open." },
    { "id": "director_tools", "name": "Project tools", "description": "Timeline, a relations graph, a map, tags/colors, and full-text search, scoped to the open Director project." },
    { "id": "navigator", "name": "Navigator", "description": "World-building module: places, lore, and world structure." },
    { "id": "hero", "name": "Hero", "description": "Game/story design module: collections, elements, conversations and dialogue graphs." },
    { "id": "writer", "name": "Writer", "description": "Long-form writing workspace." },
    { "id": "sage", "name": "Sage", "description": "Statistics and analysis over a project's data." },
    { "id": "artisan", "name": "Artisan", "description": "Create new modules from templates." },
    { "id": "graph_view", "name": "Graph view", "description": "Visual graph of notes and entries linked by wikilinks or relations." },
    { "id": "drive_backup", "name": "Google Drive backup", "description": "Optional backup of the layout profile and/or database to the user's own Google Drive." },
    { "id": "pages", "name": "Pages (v5)", "description": "Every module page is a stack of blocks — Properties (description, tags, typed property blocks), the kind's own view, and Related links — that the user can rearrange, adding text, headings, dividers, images, columns and components." },
    { "id": "side_panel", "name": "Side panel (v5)", "description": "A panel beside the page, outside it, holding version history or one plugin panel at a time; it stays open while the user moves between pages." },
    { "id": "plugins", "name": "Plugins", "description": "Sandboxed third-party windows installed by pasting a git repo link. Each gets its own SQLite table(s), and no access to the app's data or other plugins' data. This catalog is published by one such plugin." }
  ],
  "moduleKinds": [
    "collector", "manager", "inspector", "classifier", "locator", "chronicler",
    "wanderer", "narrator", "author", "scribe", "drafter", "viewer",
    "connector", "sketcher", "designer"
  ],
  "pluginCapabilities": {
    "summary": "What a DraconDex plugin can and cannot do. Full architecture and honest security notes: https://github.com/ZYDRAXYL/DraconDex-APP/blob/main/docs/PLUGINS.md",
    "can": [
      "Store rows in its own SQLite table(s), declared in its manifest — window.pluginApi.table.{query,insert,update,delete,getSchema}",
      "Call the network, only to origins its own manifest lists in permissions.net — window.pluginApi.net.{fetch,stream}",
      "Run OAuth 2.0 + PKCE against an endpoint its manifest allows — window.pluginApi.oauth.authorize",
      "Open as a panel in the side panel (DraconDex 5; it replaced the Module Inspector dock) and receive the open module's id/name/kind — again on every page change — if its manifest declares permissions.context: [\"module\"]",
      "Declare other plugins as a manifest \"dependencies\" list, so they install automatically the first time this plugin is installed"
    ],
    "cannot": [
      "Read or write the main app's own data — window.api does not exist in a plugin window",
      "Read or write another plugin's table(s) or files, even one listed as a dependency",
      "Run raw SQL, or use any column/table type beyond TEXT/INTEGER/REAL",
      "Reach any network origin it did not declare up front"
    ]
  }
};
