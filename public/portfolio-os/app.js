/* ═══════════════════════════════════════════════
   Portfolio OS — app.js
   Adapted from CodePen by Arnelle Balane (oWPQmJ)
   Dark theme + Andrea's portfolio content
   ═══════════════════════════════════════════════ */

// ── GenericTree ───────────────────────────────
function GenericTree() {
  this.root = null;

  this.insert = function(key, parent, properties) {
    if (key === undefined) throw new Error('Missing argument: key');
    parent = parent instanceof Node ? [parent] : this.search(parent);
    var node = new Node(key, properties);
    if (parent === null && !this.root) {
      this.root = node;
    } else if (parent === null && !!this.root) {
      throw new Error('GenericTree already has a root.');
    } else if (!parent.length) {
      throw new Error('Parent node not found.');
    } else {
      parent[0].insert(node);
    }
    return node;
  };

  this.delete = function(node) {
    if (node === undefined) throw new Error('Missing argument: key');
    var targets = node instanceof Node ? [node] : this.search(node);
    if (targets === null || !targets.length) throw new Error('Target node not found.');
    for (var i = 0; i < targets.length; i++) {
      var target = targets[i];
      if (target === this.root) { this.root = null; }
      else { target.parent.delete(target); }
    }
  };

  this.search = function(key) {
    return key !== undefined && this.root ? this.root.search(key) : null;
  };

  this.traverse = function() {
    if (this.root !== null) {
      var queue = [this.root];
      var levels = [], level = [];
      for (var i = 1, j = 0; queue.length;) {
        var pointer = queue.shift();
        level.push(pointer);
        j += pointer.children.length;
        if (!--i) { i = j; j = 0; levels.push(level); level = []; }
        queue = queue.concat(pointer.children);
      }
      return levels;
    }
    return [];
  };
}

function Node(key, properties) {
  this.key = key;
  this.parent = null;
  this.children = [];
  properties = properties && typeof properties === 'object' ? properties : {};
  for (var i in properties) { this[i] = properties[i]; }

  this.insert = function(child) { this.children.push(child); child.parent = this; };
  this.delete = function(child) { this.children.splice(this.children.indexOf(child), 1); };
  this.search = function(key) {
    var results = this.key.match('^' + key.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$') ? [this] : [];
    for (var i in this.children) { results = results.concat(this.children[i].search(key)); }
    return results;
  };
  this.find = function(key) {
    var results = [];
    for (var i in this.children) {
      if (this.children[i].key.match('^' + key.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$')) {
        results.push(this.children[i]);
      }
    }
    return results;
  };
}

// ── VirtualFileSystem ─────────────────────────
function VirtualFileSystem() {
  this.tree = new GenericTree();
  this.tree.insert('', null, { type: 'directory' });
  this.pointer = this.tree.root;

  this.mkdir = function(path) {
    if (path === undefined) throw new Error('Missing argument: path');
    var segments = path.replace(/\/+$/g, '').split('/');
    var parent = this._resolve_path(segments.slice(0, segments.length - 1).join('/'));
    var name = segments[segments.length - 1];
    if (parent.find(name).length) throw new Error('Name already taken: ' + name);
    this.tree.insert(name, parent, { type: 'directory' });
  };

  this.rmdir = function(path) {
    if (path === undefined) throw new Error('Missing argument: path');
    var node = this._resolve_path(path.replace(/\/+$/g, ''));
    if (node === this.tree.root) throw new Error('You cannot delete the root directory.');
    if (node.type !== 'directory') throw new Error('Not a directory: ' + node.key);
    this.tree.delete(node);
  };

  this.cd = function(path) {
    if (path === undefined) throw new Error('Missing argument: path');
    this.pointer = this._resolve_path(path);
    return this.pointer;
  };

  this.cat = function(mode, path, contents) {
    if (path === undefined) throw new Error('Missing argument: path');
    var segments = path.replace(/\/+$/g, '').split('/');
    var parent = this._resolve_path(segments.slice(0, segments.length - 1).join('/'));
    var name = segments[segments.length - 1];
    var node = parent.find(name)[0];
    if (node && node.type !== 'file') throw new Error('Not a file: ' + path);
    if (mode.length) {
      if (node === undefined) {
        node = this.tree.insert(name, parent, { type: 'file', contents: '' });
      }
      node.contents = mode === '>' ? contents : node.contents + contents;
    } else {
      if (node === undefined) throw new Error('File not found: ' + path);
      return node.contents;
    }
  };

  this.rm = function(path) {
    if (path === undefined) throw new Error('Missing argument: path');
    var node = this._resolve_path(path.replace(/\/+$/g, ''));
    if (node.type !== 'file') throw new Error('Not a file: ' + node.key);
    this.tree.delete(node);
  };

  this.rn = function(path, name) {
    if (path === undefined) throw new Error('Missing argument: path');
    if (name === undefined) throw new Error('Missing argument: name');
    var node = this._resolve_path(path);
    if (node === this.tree.root) throw new Error('You cannot rename the root directory.');
    var search = node.parent.find(name)[0];
    if (search && search.type === node.type) throw new Error('Rename failed. Name already taken.');
    node.key = name;
  };

  this.cp = function(target, destination) {
    if (target === undefined) throw new Error('Missing argument: target');
    if (destination === undefined) throw new Error('Missing argument: destination');
    target = typeof target === 'object' ? target : this._resolve_path(target);
    destination = typeof destination === 'object' ? destination : this._resolve_path(destination);
    var properties = { type: target.type };
    if (properties.type === 'file') properties.contents = target.contents;
    var node = this.tree.insert(target.key, destination, properties);
    for (var i = 0; i < target.children.length; i++) { this.cp(target.children[i], node); }
    return node;
  };

  this.mv = function(target, destination) {
    if (target === undefined) throw new Error('Missing argument: target');
    if (destination === undefined) throw new Error('Missing argument: destination');
    target = typeof target === 'object' ? target : this._resolve_path(target);
    destination = typeof destination === 'object' ? destination : this._resolve_path(destination);
    this.tree.delete(target);
    return this.cp.call(this, target, destination);
  };

  this.ls = function(path) {
    var node = path === undefined ? this.pointer : this._resolve_path(path);
    if (node.type === 'directory') return node.children;
    throw new Error('Not a directory: ' + path);
  };

  this.whereis = function(query) {
    if (query === undefined) throw new Error('Missing argument: query');
    return this.tree.search(query);
  };

  this._resolve_path = function(path) {
    path = path.match('^/') ? path : './' + path;
    path = path.split('/');
    var parent = path[0].length ? this.pointer : this.tree.root;
    for (var i = !path[0].length ? 1 : 0; i < path.length; i++) {
      if (path[i] === '..') {
        if (parent === this.tree.root) throw new Error('No more directories beyond root directory.');
        parent = parent.parent;
      } else if (path[i] !== '.' && path[i].length) {
        parent = parent.find(path[i])[0];
        if (parent === undefined) throw new Error('Path not found: ' + path.slice(0, i + 1).join('/'));
      }
    }
    return parent;
  };

  this._absolute_path = function(node) {
    var path = [];
    while (node !== null) { path.unshift(node.key); node = node.parent; }
    return path.join('/');
  };
}

// ── Boot Sequence ─────────────────────────────

var COMMAND = 'sudo apt install andrea-avila-portfolio';
var INSTALL_LINES = [
  { text: 'Reading package lists... Done', color: '' },
  { text: 'Building dependency tree... Done', color: '' },
  { text: 'The following NEW packages will be installed:', color: '#e8e6e3' },
  { text: '  react typescript next.js three.js gsap tailwind', color: '#00E5FF' },
  { text: '  c++ arduino laravel sql mongodb node.js', color: '#00E5FF' },
  { text: '  vscode cursor figma blender claude-code git', color: '#7B2FFF' },
  { text: '0 upgraded, 18 newly installed, 0 to remove.', color: '#e8e6e3' },
  { text: 'Need to get 42.0 MB of archives.', color: '#e8e6e3' },
  { text: '', color: '' },
  { text: 'Get:1 https://registry.npmjs.org react 19.1.0 [2,847 kB]', color: '' },
  { text: 'Get:2 https://registry.npmjs.org typescript 5.8.0 [5,112 kB]', color: '' },
  { text: 'Get:3 https://registry.npmjs.org next 16.0.0 [8,934 kB]', color: '' },
  { text: 'Get:4 https://registry.npmjs.org three 0.175.0 [4,221 kB]', color: '' },
  { text: 'Get:5 https://registry.npmjs.org gsap 3.14.2 [1,856 kB]', color: '' },
  { text: 'Get:6 https://registry.npmjs.org tailwindcss 4.2.1 [3,442 kB]', color: '' },
  { text: 'Fetched 42.0 MB in 3s (14.0 MB/s)', color: '#e8e6e3' },
  { text: '', color: '' },
  { text: 'Setting up react (19.1.0) ...', color: '' },
  { text: 'Setting up typescript (5.8.0) ...', color: '' },
  { text: 'Setting up next (16.0.0) ...', color: '' },
  { text: 'Setting up three (0.175.0) ...', color: '' },
  { text: 'Setting up gsap (3.14.2) ...', color: '' },
  { text: 'Setting up tailwindcss (4.2.1) ...', color: '' },
  { text: '', color: '' },
  { text: 'Processing triggers for engineer-andrea ...', color: '' },
];
var INFO_LINES = [
  { text: '══════════════════════════════════════════════', color: '#333340' },
  { text: '  ANDREA AVILA — PORTFOLIO INSTALLED', color: '#fff' },
  { text: '══════════════════════════════════════════════', color: '#333340' },
  { text: '', color: '' },
  { text: '  Name        : Andrea Avila', color: '#e8e6e3' },
  { text: '  Role        : Full-Stack Developer', color: '#e8e6e3' },
  { text: '  Location    : Madrid, Spain', color: '#e8e6e3' },
  { text: '  Origin      : Mexico', color: '#e8e6e3' },
  { text: '  Education   : UDIT Madrid — 4th semester', color: '#e8e6e3' },
  { text: '', color: '' },
  { text: '  Stack       : React · TypeScript · C++ · Three.js', color: '#00E5FF' },
  { text: '  Tools       : VS Code · Cursor · Figma · Claude', color: '#7B2FFF' },
  { text: '  Databases   : SQL · MongoDB', color: '#BEFF00' },
  { text: '', color: '' },
  { text: '  Status      : Open to work', color: '#FF2D9B' },
  { text: '  Projects    : 5 loaded', color: '#BEFF00' },
];

function sleep(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

// Fullscreen boot sequence
async function runBootSequence() {
  var el = document.getElementById('boot-terminal');

  function addLine(html, color) {
    var div = document.createElement('div');
    div.className = 'line';
    div.innerHTML = html || '&nbsp;';
    if (color) div.style.color = color;
    el.appendChild(div);
    el.parentElement.scrollTop = el.parentElement.scrollHeight;
  }

  // Prompt
  var promptHtml = '<span style="color:#BEFF00">andrea</span><span style="color:rgba(255,255,255,0.3)">@</span><span style="color:#00E5FF">portfolio</span><span style="color:rgba(255,255,255,0.3)"> ~ $ </span>';

  // Type command
  var cmdDiv = document.createElement('div');
  cmdDiv.className = 'line';
  el.appendChild(cmdDiv);
  var typed = '';
  for (var i = 0; i < COMMAND.length; i++) {
    typed += COMMAND[i];
    cmdDiv.innerHTML = promptHtml + typed + '<span style="color:#BEFF00;animation:blink 1s step-end infinite">\u2588</span>';
    await sleep(25 + Math.random() * 35);
  }
  cmdDiv.innerHTML = promptHtml + COMMAND;
  await sleep(400);

  addLine('[sudo] password for andrea: \u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022', '#6B6B7B');
  await sleep(300);

  // Progress bar
  var pDiv = document.createElement('div');
  pDiv.className = 'line';
  pDiv.style.color = '#00E5FF';
  el.appendChild(pDiv);
  for (var p = 0; p <= 100; p += Math.random() * 8 + 2) {
    var pct = Math.min(100, Math.round(p));
    var filled = Math.round((pct / 100) * 35);
    pDiv.textContent = '[' + '\u2588'.repeat(filled) + '\u2591'.repeat(35 - filled) + '] ' + pct + '%';
    el.parentElement.scrollTop = el.parentElement.scrollHeight;
    await sleep(30);
  }
  pDiv.textContent = '[' + '\u2588'.repeat(35) + '] 100%';
  await sleep(200);

  // Install lines
  for (var j = 0; j < INSTALL_LINES.length; j++) {
    addLine(INSTALL_LINES[j].text, INSTALL_LINES[j].color || '#6B6B7B');
    await sleep(18 + Math.random() * 12);
  }
  await sleep(300);

  // Info reveal
  for (var k = 0; k < INFO_LINES.length; k++) {
    addLine(INFO_LINES[k].text, INFO_LINES[k].color);
    await sleep(60);
  }
  await sleep(500);

  addLine('');
  addLine('<span style="color:#BEFF00">\u2714 andrea-avila-portfolio installed successfully.</span>');
  await sleep(1000);
  addLine('<span style="color:#BEFF00">Starting desktop...</span>');
  await sleep(1200);

  // Transition: fade out boot → show desktop
  document.getElementById('boot-screen').classList.add('hidden');
  await sleep(500);
  document.getElementById('boot-screen').style.display = 'none';
  document.getElementById('desktop').classList.add('active');

  // Pre-load portfolio and show browser when ready
  preloadPortfolio();
}

// Pre-load portfolio iframe hidden, then show browser window when ready
var browserOpened = false;
function preloadPortfolio() {
  if (browserOpened) return;
  browserOpened = true;

  // Show browser window fullscreen
  var key = Object.keys(windows.instances).length;
  var w = window.innerWidth;
  var h = window.innerHeight;

  var win = $(
    '<section class="window browser" data-title="Portfolio — andrea.dev">' +
    '  <header>' +
    '    <span class="action close"></span>' +
    '    <span class="action minimize"></span>' +
    '    <span class="action maximize"></span>' +
    '    <span class="browser-url">portfolio://andrea.dev</span>' +
    '  </header>' +
    '  <main>' +
    '    <div id="portfolio-frame-container" style="width:100%;height:100%"></div>' +
    '  </main>' +
    '</section>'
  );

  win.attr('data-instance', key);
  win.css({ top: '0px', left: '0px', width: w + 'px', height: h + 'px' });
  win.addClass('maximized');
  windows.desktop.append(win);

  // Create iframe via DOM API
  var iframe = document.createElement('iframe');
  iframe.id = 'portfolio-frame';
  iframe.style.cssText = 'width:100%;height:100%;border:none;background:#000';
  iframe.src = '/portfolio?autostart=true';
  document.getElementById('portfolio-frame-container').appendChild(iframe);

  var instance = {
    dom: win,
    min_width: w, min_height: h,
    max_width: window.innerWidth - 20, max_height: window.innerHeight - 20,
    focus: function() {},
    keyboard_handler: function() {},
    textarea_handler: function() {},
    icons_handler: function() {},
    huds_handler: function() {},
    minimize: Window.prototype.minimize,
    maximize: function() {
      if (!this.dom.hasClass('maximized')) {
        this.dom.animate({ top: '0px', left: '0px', width: this.max_width + 'px', height: this.max_height + 'px' }, 150).addClass('maximized');
      }
    }
  };
  windows.instances[key] = instance;
  windows.focus(instance);

  // Override close: minimize to bottom-right corner instead of destroying
  win.find('.action.close').off('mousedown').on('mousedown', function(e) {
    e.stopPropagation();
    win.animate({
      top: (window.innerHeight - 120) + 'px',
      left: (window.innerWidth - 180) + 'px',
      width: '160px',
      height: '100px',
      opacity: 0.8,
    }, 300).removeClass('maximized');
  });

  // Double-click minimized window to restore fullscreen
  win.on('dblclick', function() {
    if (win.width() < 300) {
      win.animate({
        top: '0px', left: '0px',
        width: window.innerWidth + 'px',
        height: window.innerHeight + 'px',
        opacity: 1,
      }, 300).addClass('maximized');
    }
  });
}

function showBrowserWindow(iframe) {
  var w = Math.round(window.innerWidth * 0.88);
  var h = Math.round(window.innerHeight * 0.9);
  var x = Math.round((window.innerWidth - w) / 2);
  var y = Math.round((window.innerHeight - h) / 3);

  // Use the window system properly — create via template-like approach
  var key = Object.keys(windows.instances).length;

  var win = $(
    '<section class="window browser" data-title="">' +
    '  <header>' +
    '    <span class="action close"></span>' +
    '    <span class="action minimize"></span>' +
    '    <span class="action maximize"></span>' +
    '    <span class="browser-url">portfolio://andrea.dev</span>' +
    '  </header>' +
    '  <main>' +
    '    <div id="portfolio-frame-container" style="width:100%;height:100%"></div>' +
    '  </main>' +
    '</section>'
  );

  win.attr('data-instance', key);
  win.css({ top: y + 'px', left: x + 'px', width: w + 'px', height: h + 'px' });
  windows.desktop.append(win);

  // Move the loaded iframe into the browser window
  iframe.style.cssText = 'width:100%;height:100%;border:none;background:#0a0a0f';
  document.getElementById('portfolio-frame-container').appendChild(iframe);

  // Override close to also remove the iframe
  var origClose = windows.close;
  var instance = {
    dom: win,
    min_width: w, min_height: h,
    max_width: window.innerWidth - 20, max_height: window.innerHeight - 20,
    focus: function() {},
    keyboard_handler: function() {},
    textarea_handler: function() {},
    icons_handler: function() {},
    huds_handler: function() {},
    minimize: Window.prototype.minimize,
    maximize: function() {
      if (!this.dom.hasClass('maximized')) {
        this.dom.animate({ top: '0px', left: '0px', width: this.max_width + 'px', height: this.max_height + 'px' }, 150).addClass('maximized');
      }
    }
  };
  windows.instances[key] = instance;
  windows.focus(instance);

  // Clean up: when close button is clicked, also remove any orphan iframes
  win.find('.action.close').on('mousedown', function() {
    var orphanFrame = document.getElementById('portfolio-frame');
    if (orphanFrame && !document.getElementById('portfolio-frame-container')) {
      orphanFrame.remove();
    }
    browserOpened = false;
  });
}

// ── jQuery-based OS (from CodePen) ────────────

$(document).ready(function() {
  loadTemplates();
  windows.desktop = $('#desktop');
  filesystemManager.initialize();
  windows.initialize();
  components.initialize();
  system.initialize();

  function startOS() {
    runBootSequence();
  }

  var isStandalone = window.self === window.top;
  if (isStandalone) {
    setTimeout(startOS, 300);
  } else {
    window.addEventListener('message', function handler(e) {
      if (e.data && e.data.type === 'boot') {
        window.removeEventListener('message', handler);
        setTimeout(startOS, 200);
      }
    });
  }
});

var filesystemManager = {
  instance: new VirtualFileSystem(),
  initialize: function() {
    var fs = filesystemManager.instance;
    // Andrea's portfolio filesystem
    fs.mkdir('Projects');
    fs.mkdir('About');
    fs.mkdir('Contact');
    fs.mkdir('Skills');
    fs.mkdir('Projects/clara-civicaid');
    fs.mkdir('Projects/capturing-moments');
    fs.mkdir('Projects/asti-robotics');
    fs.mkdir('Projects/task-dashboard');
    fs.mkdir('Projects/kernel-sim');

    fs.cat('>', 'Projects/clara-civicaid/README.md',
      '# CLARA — CIVICAID\n## AI Voice Assistant\n\nAsistente de voz IA multilingue para conectar poblaciones vulnerables con tramites gubernamentales.\nSoporte en 8 idiomas con voz y texto.\n\nHackathon OdiseIA4Good 2026 — 300+ participantes.\nLidere equipo de 4 personas.\n\nHighlights:\n  * 1er lugar — OdiseIA4Good 2026\n  * Lider de proyecto\n  * 469+ tests automatizados\n  * Arquitectura: React + Python + Gemini + ElevenLabs\n\nTags: React, TypeScript, Python, Gemini, ElevenLabs\n\nLinks:\n  [demo] https://andreavilaro0.github.io/civicaid-voice/\n  [code] https://github.com/Andreavilaro0/civicaid-voice');

    fs.cat('>', 'Projects/capturing-moments/README.md',
      '# CAPTURING MOMENTS\n## Photography\n\nPortfolio editorial de street photography con diseno responsive,\nanimaciones scroll-based y galeria dinamica.\n\nHighlights:\n  * Diseno y desarrollo completo\n  * GSAP scroll animations\n\nTags: HTML/CSS, JavaScript, GSAP\n\nLinks:\n  [view] https://andreavilaro0.github.io/plantilla/');

    fs.cat('>', 'Projects/asti-robotics/README.md',
      '# ASTI ROBOTICS\n## Zumo 32U4\n\nRobot autonomo Zumo 32U4 para competencia nacional.\nPrograme el software completo: navegacion, sensores y estrategia.\n\nHighlights:\n  * Finalista nacional — ASTI Robotics Challenge\n  * Software del robot completo en C++\n  * 50+ equipos universitarios\n\nTags: C++, Arduino');

    fs.cat('>', 'Projects/task-dashboard/README.md',
      '# TASK DASHBOARD\n## Productivity App\n\nDashboard de tareas con widgets interactivos: mapa, calendario,\nestados, prioridades y filtros.\n\nSprint 6 — Frontend I, UDIT Madrid\n\nHighlights:\n  * Dashboard con widgets dinamicos\n  * Mapa interactivo integrado\n  * Filtros por estado y prioridad\n\nTags: JavaScript, HTML, CSS\n\nLinks:\n  [demo] https://andreavilaro0.github.io/todo-list-dashboard/\n  [code] https://github.com/Andreavilaro0/todo-list-dashboard');

    fs.cat('>', 'Projects/kernel-sim/README.md',
      '# KERNEL SIM\n## OS Simulation\n\nSimulador de sistema operativo con gestion de procesos y memoria.\nFIFO, SJF y Round Robin compitiendo en tiempo real.\n\nHighlights:\n  * Simulacion completa de scheduling\n  * Visualizacion en tiempo real\n\nTags: C, Sistemas\n\nLinks:\n  [code] https://github.com/gabrielcclv/SistemasOperativos');

    fs.cat('>', 'About/andrea.txt',
      'Name     : Andrea Avila\nRole     : Full-Stack Developer\nLocation : Madrid, Spain\nOrigin   : Mexico\nStudies  : UDIT Madrid — 4th semester\nGrad     : 2028\n\nI build things that live at the intersection\nof code, design, and hardware.');

    fs.cat('>', 'Contact/email.txt',
      'Email    : andrea15one@icloud.com\nGitHub   : github.com/Andreavilaro0\nLinkedIn : linkedin.com/in/andrea-avila-dev\n\nLanguages: Spanish (native), English (fluent)\nStatus   : Open to work');

    fs.cat('>', 'Skills/stack.txt',
      'LANGUAGES & FRAMEWORKS\n  React / Next.js     ██████████░  90%\n  TypeScript          █████████░░  85%\n  Python              ████████░░░  80%\n  Three.js / R3F      ███████░░░░  75%\n  C++ / Arduino       ███████░░░░  70%\n  GSAP                ███████░░░░  75%\n\nTOOLS\n  VS Code, Cursor, Figma, Blender, Claude Code, Git\n\nDATABASES\n  SQL, MongoDB');

    Window.favorites = ['/Projects', '/About', '/Contact', '/Skills'];
  },
  resolve_path: function(path) {
    return path === undefined ? filesystemManager.instance.tree.root : filesystemManager.instance._resolve_path(path);
  },
  absolute_path: function(path) {
    return this.instance._absolute_path(path);
  }
};

var components = {
  initialize: function() {
    components.icons();
    components.textareas();
    components.huds();
  },
  icons: function() {
    windows.desktop.on('mousedown', '.icon', function(e) {
      if (e.ctrlKey) { $(this).toggleClass('highlighted'); }
      else { $('.icon').removeClass('highlighted'); $(this).addClass('highlighted'); }
      var target = $(this).closest('.window');
      if (target.length) windows.focus(windows.instance(target));
    });
    windows.desktop.on('dblclick', '.icon[data-application]', function() {
      $(this).removeClass('highlighted');
      windows.spawn($(this).data('application'));
    });
    windows.desktop.on('dblclick', '.window .icon', function(e) {
      $(this).removeClass('highlighted');
      var target = windows.instance($(this).closest('.window'));
      target.icons_handler(e);
    });
    windows.desktop.on('mousedown', function(e) {
      if (!$(e.target).hasClass('icon')) $('.icon').removeClass('highlighted');
      if (!$(e.target).closest('.contextmenu').length) $('.contextmenu').addClass('hidden');
    });
  },
  textareas: function() {
    windows.desktop.on('keydown', 'textarea', function(e) {
      var target = windows.instance($(this).closest('.window'));
      if (!target) return;
      if (e.keyCode === 9) {
        e.preventDefault();
      } else if (e.keyCode === 13 && $(this).attr('data-capture-enter') === 'true') {
        e.preventDefault();
        target.textarea_handler(e);
      } else if (e.ctrlKey && (e.keyCode === 76 || e.keyCode === 68 || e.keyCode === 83)) {
        e.preventDefault();
        target.keyboard_handler(e);
      } else if (e.keyCode === 27) {
        target.keyboard_handler(e);
      } else if ($(this).hasClass('autosize')) {
        target.textarea_handler(e);
      }
    });
    windows.desktop.on('blur', '.window .icon textarea', function(e) {
      var target = windows.instance($(this).closest('.window'));
      if (target) target.textarea_handler(e);
    });
  },
  huds: function() {
    windows.desktop.on('mousedown', '.window .action-button', function(e) {
      $('.icon').removeClass('highlighted');
      var target = windows.instance($(this).closest('.window'));
      if (target) target.huds_handler(e);
    });
    windows.desktop.on('focus', '.window input', function() {
      $(this).attr('data-value', $(this).val());
    });
    windows.desktop.on('keydown', '.window input', function(e) {
      $(this).removeClass('error');
      if (e.keyCode === 27) {
        $(this).val($(this).data('value')).trigger('blur');
      } else if (e.keyCode === 13) {
        $(this).trigger('blur');
        var target = windows.instance($(this).closest('.window'));
        if (target) target.huds_handler(e);
      }
    });
  }
};

var windows = {
  desktop: $('#dummy'),
  instances: {},
  initialize: function() {
    windows.desktop = $('#desktop');
    windows.focus();
    windows.draggable();
    windows.actions();
    windows.desktop.on('click', '.favorites li', function() {
      var target = windows.instance($(this).closest('.window'));
      var node = filesystemManager.resolve_path($(this).data('path'));
      target.location(node);
    });
  },
  spawn: function(application, path) {
    application = applications[application](path);
    var key = $('.window').length;
    windows.instances[key] = application;
    application.dom.attr('data-instance', key);
    windows.desktop.append(application.dom);
    windows.focus(application);
    return application;
  },
  focus: function(target) {
    if (target === undefined) {
      windows.desktop.on('mousedown', '.window', function() {
        windows.focus(windows.instance($(this)));
      });
    } else {
      if (!target.dom.hasClass('focused')) {
        $('.window').removeClass('focused');
        target.dom.addClass('focused');
        windows.desktop.append(target.dom);
        if (target.hasOwnProperty('pointer')) {
          filesystemManager.instance.pointer = target.pointer;
        }
        setTimeout(function() { target.focus(); }, 0);
      }
    }
  },
  draggable: function() {
    var target = null, start = {x:0,y:0}, origin = {x:0,y:0};
    windows.desktop.on('mousedown', '.window header', function(e) {
      target = $(this).closest('.window');
      start = { x: e.pageX, y: e.pageY };
      origin = { x: target.offset().left, y: target.offset().top };
    });
    windows.desktop.on('mousemove', function(e) {
      if (target !== null) {
        target.css({ top: origin.y + (e.pageY - start.y) + 'px', left: origin.x + (e.pageX - start.x) + 'px' });
      }
    });
    windows.desktop.on('mouseup', function() { target = null; });
    windows.desktop.on('mousedown', '.window header .action-bar > *', function(e) { e.stopPropagation(); });
  },
  close: function(target) {
    target.dom.remove();
    var last = windows.desktop.find('.window').last();
    if (last.length) windows.focus(windows.instance(last));
    $('.overlay').remove();
  },
  actions: function() {
    windows.desktop.on('mousedown', '.window .action', function(e) {
      e.stopPropagation();
      var target = windows.instance($(this).closest('.window'));
      windows.focus(target);
      if ($(this).hasClass('close')) windows.close(target);
      else if ($(this).hasClass('minimize')) target.minimize();
      else if ($(this).hasClass('maximize')) target.maximize();
    });
  },
  instance: function(target) {
    return windows.instances[target.data('instance')];
  }
};

var system = {
  clipboard: [],
  clipboard_sources: [],
  clipboard_operation: null,
  clipboard_operations: { 67: 'cp', 88: 'mv' },
  contextmenu: null,
  contextmenu_target: null,
  initialize: function() {
    system.contextmenu = $('.contextmenu');
    $(document).on('keyup', function(e) {
      if (e.keyCode === 67 || e.keyCode === 88 || e.keyCode === 86) system.invoke_clipboard(e.keyCode);
      else if (e.keyCode === 46) system.invoke_deletion();
    });
    $(document).on('contextmenu', function(e) { e.preventDefault(); system.invoke_contextmenu(e); });
    $('.contextmenu .rename').on('click', function(e) {
      var target = windows.instance(system.contextmenu_target.closest('.window'));
      target.icons_handler(e);
    });
  },
  invoke_clipboard: function(code) {
    if (code === 67 || code === 88) {
      system.clipboard = [];
      system.clipboard_operation = system.clipboard_operations[code];
      $('.window .icon.highlighted').each(function() {
        system.clipboard.push($(this).data('path'));
        var parent = windows.instance($(this).closest('.window'));
        if (system.clipboard_sources.indexOf(parent) < 0) system.clipboard_sources.push(parent);
      });
    } else {
      var target = windows.instance($('.window.focused'));
      if (target && target instanceof Finder) {
        for (var i = 0; i < system.clipboard.length; i++) {
          filesystemManager.instance[system.clipboard_operation](system.clipboard[i], target.pointer);
        }
        target.refresh();
        for (var j = 0; j < system.clipboard_sources.length; j++) system.clipboard_sources[j].refresh();
        system.clipboard = [];
        system.clipboard_sources = [];
      }
    }
  },
  invoke_deletion: function() {
    $('.window .icon.highlighted').each(function() {
      var target = windows.instance($(this).closest('.window'));
      if ($(this).hasClass('documents')) filesystemManager.instance.rmdir($(this).data('path'));
      else if ($(this).hasClass('sublimetext')) filesystemManager.instance.rm($(this).data('path'));
      $(this).remove();
      target.refresh();
    });
  },
  invoke_contextmenu: function(e) {
    var target = $(e.target);
    if (target.closest('.finder').length) {
      system.contextmenu_target = $('.icon.highlighted');
      if (system.contextmenu_target.length) {
        system.contextmenu.css({ top: e.pageY + 'px', left: e.pageX + 'px' }).removeClass('hidden');
      }
    }
  }
};

var applications = {
  finder: function(path) { return new Finder(filesystemManager.resolve_path(path)); },
  terminal: function(path) { return new Terminal(filesystemManager.resolve_path(path)); },
  textedit: function(path) { return new TextEdit(path ? filesystemManager.resolve_path(path) : path); },
  filebrowser: function(path) { return new FileBrowser(filesystemManager.resolve_path(path)); }
};

var templates = {
  finder: '',
  terminal: '',
  textedit: '',
  alert: '',
  filebrowser: ''
};

function loadTemplates() {
  templates.finder = $('#tmpl-finder').html();
  templates.terminal = $('#tmpl-terminal').html();
  templates.textedit = $('#tmpl-textedit').html();
  templates.alert = $('#tmpl-alert').html();
  templates.filebrowser = $('#tmpl-filebrowser').html();
}

var util = {
  autosize: function(target) {
    target.css('height', 'auto');
    target.css('height', target[0].scrollHeight + 'px');
  },
  alert: function(message) {
    $('.window').removeClass('focused');
    var template = $(templates.alert);
    var overlay = $('<div class="overlay"></div>');
    template.find('p').text(message);
    windows.desktop.append(overlay);
    windows.desktop.append(template);
    template.css({
      top: (window.innerHeight - 3 * template.height()) / 2 + 'px',
      left: (window.innerWidth - template.width()) / 2 + 'px'
    });
    template.find('.action').on('mousedown', function(e) {
      e.stopPropagation();
      overlay.remove();
      template.remove();
      windows.desktop.find('.window').last().addClass('focused');
    });
  }
};

// ── Class System ──────────────────────────────

function Class() {}
Class.extend = function(child) {
  var instance = new this();
  for (var property in instance) {
    if (!child.prototype.hasOwnProperty(property)) child.prototype[property] = instance[property];
  }
  for (var property in this) {
    if (!child.hasOwnProperty(property)) child[property] = this[property];
  }
};

function Window() {}
Class.extend(Window);
Window.prototype.focus = function() {};
Window.prototype.keyboard_handler = function() {};
Window.prototype.textarea_handler = function() {};
Window.prototype.icons_handler = function() {};
Window.prototype.huds_handler = function() {};
Window.prototype.minimize = function(callback) {
  if (this.dom.hasClass('maximized')) {
    this.dom.animate({
      top: this.dom.offset().top + (this.max_height - this.min_height) / 2 + 'px',
      left: this.dom.offset().left + (this.max_width - this.min_width) / 2 + 'px',
      width: this.min_width + 'px', height: this.min_height + 'px'
    }, 150, callback).removeClass('maximized');
  }
};
Window.prototype.maximize = function(callback) {
  if (!this.dom.hasClass('maximized')) {
    this.dom.animate({
      top: this.dom.offset().top - (this.max_height - this.min_height) / 2 + 'px',
      left: this.dom.offset().left - (this.max_width - this.min_width) / 2 + 'px',
      width: this.max_width + 'px', height: this.max_height + 'px'
    }, 150, callback).addClass('maximized');
  }
};
Window.favorites = [];

// ── Finder ────────────────────────────────────

function Finder(pointer) {
  this.min_width = 700;
  this.min_height = 400;
  this.max_width = window.innerWidth - 60;
  this.max_height = window.innerHeight - 60;
  this.history = [];
  this.cursor = -1;
  this.dom = $(templates.finder);
  this.address_bar = this.dom.find('input[name="path"]');
  this.search_bar = this.dom.find('input[name="search"]');
  this.pointer = null;
  this.location(pointer);
}
Window.extend(Finder);

Finder.prototype.maximize = function() {
  if (!this.dom.hasClass('maximized')) {
    this.dom.animate({
      top: '20px', left: '20px',
      width: this.max_width + 'px', height: this.max_height + 'px'
    }, 150).addClass('maximized');
  }
};

Finder.prototype.location = function(location) {
  this.pointer = location;
  this.history = this.history.slice(0, Math.max(this.cursor, -1) + 1);
  var last = this.history[this.history.length - 1];
  if (this.pointer !== last) { this.history.push(this.pointer); this.cursor++; }
  this.refresh();
};

Finder.prototype.navigate = function(direction) {
  if (direction === 'back') this.pointer = this.history[--this.cursor];
  else if (direction === 'forward') this.pointer = this.history[++this.cursor];
  this.refresh();
};

Finder.prototype.refresh = function() {
  this.dom.attr('data-title', 'Finder — ' + (this.pointer.key ? this.pointer.key : '/'));
  var path = filesystemManager.absolute_path(this.pointer);
  this.address_bar.val(path ? path : '/');
  this.dom.find('main').empty();
  this.dom.find('.favorites').empty();
  this.pointer.children.sort(function(a, b) {
    if (a.type === 'directory' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'directory') return 1;
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });
  for (var i = 0; i < this.pointer.children.length; i++) this.insert(this.pointer.children[i]);
  for (var j = 0; j < Window.favorites.length; j++) {
    try {
      var favorite = filesystemManager.resolve_path(Window.favorites[j]);
      this.dom.find('.favorites').append('<li data-path="' + Window.favorites[j] + '">' + favorite.key + '</li>');
    } catch (e) {}
  }
  this.dom.find('.action-button.folder, .action-button.file').removeClass('disabled');
  if (this.cursor === 0) this.dom.find('.action-button.back').addClass('disabled');
  else this.dom.find('.action-button.back').removeClass('disabled');
  if (this.cursor === this.history.length - 1) this.dom.find('.action-button.forward').addClass('disabled');
  else this.dom.find('.action-button.forward').removeClass('disabled');
};

Finder.prototype.insert = function(node) {
  var element = $('<div class="icon" data-path="' + filesystemManager.absolute_path(node) + '">' + node.key + '</div>');
  if (node.type === 'directory') element.addClass('documents');
  else if (node.type === 'file') element.addClass('sublimetext');
  this.dom.find('main').append(element);
};

Finder.prototype.create = function(type) {
  var node = $('<div class="icon highlighted"><textarea name="node" class="autosize" data-new="true"></textarea></div>');
  node.attr('data-capture-enter', 'true');
  if (type === 'directory') node.addClass('documents');
  else if (type === 'file') node.addClass('sublimetext');
  this.dom.find('main').append(node);
  setTimeout(function() { node.find('textarea').trigger('focus'); }, 0);
};

Finder.prototype.keyboard_handler = function(e) {
  if (e.keyCode === 27) $(e.target).trigger('blur');
};

Finder.prototype.textarea_handler = function(e) {
  var target = $(e.target);
  if (e.type === 'keydown' && target.hasClass('autosize')) {
    if (e.keyCode === 13) {
      this.dom.find('textarea').trigger('blur');
    } else {
      var self = this;
      setTimeout(function() { util.autosize(self.dom.find('textarea')); }, 0);
    }
  } else if (e.type === 'blur' || e.type === 'focusout') {
    var path = filesystemManager.absolute_path(this.pointer);
    if (!target.val().length) {
      target.parent().remove();
    } else if (target.attr('data-new') === 'true') {
      if (target.parent().hasClass('documents')) {
        try { filesystemManager.instance.mkdir(path + '/' + target.val()); }
        catch (err) { target.parent().remove(); util.alert(err.message); }
      } else if (target.parent().hasClass('sublimetext')) {
        if (this.pointer.find(target.val()).length) {
          target.parent().remove(); util.alert('Name already taken: ' + target.val());
        } else {
          filesystemManager.instance.cat('>', path + '/' + target.val(), '');
        }
      }
    } else {
      try { filesystemManager.instance.rn(target.attr('data-new'), target.val()); }
      catch (err) { util.alert(err.message); }
    }
    this.refresh();
  }
};

Finder.prototype.icons_handler = function(e) {
  var target = $(e.target);
  if (target.hasClass('documents')) {
    this.location(filesystemManager.resolve_path(target.data('path')));
  } else if (target.hasClass('sublimetext')) {
    var editor = windows.spawn('textedit', target.data('path'));
    editor.dom.attr('data-path', filesystemManager.absolute_path(editor.pointer));
  } else if (e.type === 'click') {
    system.contextmenu.addClass('hidden');
    target = system.contextmenu_target;
    var node = filesystemManager.resolve_path(target.data('path'));
    target.html('<textarea name="node" class="autosize" data-new="' + filesystemManager.absolute_path(node) + '">' + node.key + '</textarea>');
    target.addClass('highlighted').find('textarea').trigger('focus');
  }
};

Finder.prototype.huds_handler = function(e) {
  var target = $(e.target);
  if (target.hasClass('back') && !target.hasClass('disabled')) this.navigate('back');
  else if (target.hasClass('forward') && !target.hasClass('disabled')) this.navigate('forward');
  else if (target.is('[name="path"]')) {
    try { this.location(filesystemManager.resolve_path(target.val())); }
    catch (err) { target.addClass('error').trigger('focus'); }
  } else if (target.is('[name="search"]')) {
    var results = filesystemManager.instance.whereis(target.val());
    this.dom.find('main').empty();
    this.dom.find('.action-button.folder, .action-button.file').addClass('disabled');
    for (var i = 0; i < results.length; i++) {
      this.cursor++;
      this.dom.find('.action-bar .action-button').addClass('disabled');
      this.dom.find('.action-bar .action-button.back').removeClass('disabled');
      var node = results[i];
      var path = filesystemManager.absolute_path(node);
      var result = $('<div class="icon" data-path="' + path + '" title="' + path + '">' + node.key + '</div>');
      if (node.type === 'directory') result.addClass('documents');
      else if (node.type === 'file') result.addClass('sublimetext');
      this.dom.find('main').append(result);
    }
    if (!results.length) this.dom.find('main').append('<p>No results found.</p>');
  } else if (target.is('.action-button.folder') && !target.hasClass('disabled')) {
    this.create('directory');
  } else if (target.is('.action-button.file') && !target.hasClass('disabled')) {
    this.create('file');
  }
};

// ── Terminal ──────────────────────────────────

function Terminal(pointer) {
  this.min_width = 520;
  this.min_height = 320;
  this.max_width = 800;
  this.max_height = 500;
  this.dom = $(templates.terminal);
  this.prompt = this.dom.find('.prompt span');
  this.input = this.dom.find('textarea');
  this.buffer = null;
  this.pointer = pointer;
  var self = this;

  this.intercepts = {
    ls: function(path) {
      var results = filesystemManager.instance.ls(path || filesystemManager.absolute_path(this.pointer));
      var width = 0;
      results.forEach(function(item) { width = Math.max(width, item.key.length); });
      width += 5;
      var columns = ~~(this.min_width / 7 / width);
      var line = '';
      for (var i = 0, j = columns; i < results.length; i++) {
        line += results[i].key;
        for (var k = 0; k < width - results[i].key.length; k++) line += '\u00a0';
        if (--j === 0) { this.log(line); line = ''; j = columns; }
      }
      this.log(line);
    },
    cd: function(path) { this.location(filesystemManager.instance.cd(path)); },
    cat: function(params) {
      params = Array.prototype.slice.call(arguments);
      if (params[0].match('^(>|>>)$') && params.length < 3) {
        params[0] = params[0] === '>>' ? '' : params[0];
        execute.call(this, params);
        params[0] = '>';
        execute.call(this, params);
        this.buffer = 'cat ' + params.join(' ');
        this.input.attr('data-capture-enter', 'false');
        this.prompt.addClass('hidden');
      } else {
        if (!params[0].match('^(>|>>)$')) params.unshift('');
        execute.call(this, params);
        this.buffer = null;
        this.input.attr('data-capture-enter', 'true');
        this.prompt.removeClass('hidden');
      }
      function execute(params) {
        var output = filesystemManager.instance.cat.apply(filesystemManager.instance, params);
        if (output !== undefined) {
          output = output.split(/\r?\n/g);
          for (var i = 0; i < output.length; i++) this.log(output[i]);
        }
      }
    },
    edit: function(path) { this.intercepts.cat.apply(this, ['>>', path]); },
    show: function(path) { this.intercepts.cat.apply(this, [path]); },
    whereis: function(query) {
      var results = filesystemManager.instance.whereis(query);
      if (results.length) {
        for (var i = 0; i < results.length; i++) this.log(filesystemManager.absolute_path(results[i]));
      } else {
        this.log('No results found: ' + query, 'red');
      }
    },
    // Custom commands for Andrea's portfolio
    whoami: function() {
      this.log('');
      this.log('<span style="color:#BEFF00;font-weight:700">  andrea</span><span style="color:#6B6B7B">@</span><span style="color:#00E5FF">portfolio-os</span>');
      this.log('  ─────────────────────', 'muted');
      this.log('  OS        : andrea-os v1.0');
      this.log('  Host      : portfolio.andrea.dev');
      this.log('  Shell     : bash 5.2.0');
      this.log('  CPU       : Full-Stack Developer');
      this.log('  Memory    : UDIT Madrid 4th sem');
      this.log('  Uptime    : Since 2004');
      this.log('');
    },
    help: function() {
      this.log('<span style="color:#BEFF00;font-weight:600">Available commands:</span>');
      this.log('  <span style="color:#00E5FF">ls [dir]</span>           List files and directories');
      this.log('  <span style="color:#00E5FF">cd &lt;dir&gt;</span>           Change directory');
      this.log('  <span style="color:#00E5FF">cat &lt;file&gt;</span>         Read file contents');
      this.log('  <span style="color:#00E5FF">edit &lt;file&gt;</span>        Edit a file');
      this.log('  <span style="color:#00E5FF">mkdir &lt;name&gt;</span>       Create a directory');
      this.log('  <span style="color:#00E5FF">whereis &lt;query&gt;</span>    Search for files');
      this.log('  <span style="color:#00E5FF">whoami</span>             System info');
      this.log('  <span style="color:#00E5FF">clear</span>              Clear terminal');
      this.log('  <span style="color:#00E5FF">exit</span>               Close terminal');
    },
    clear: function() { this.dom.find('main p').remove(); },
    exit: function() { windows.close(this); }
  };

  this.location(this.pointer);
  this.dom.on('click', this.focus.bind(this));
}
Window.extend(Terminal);

Terminal.prototype.focus = function() { this.dom.find('textarea').focus(); };

Terminal.prototype.minimize = function() {
  var self = this;
  Window.prototype.minimize.call(self, function() { util.autosize(self.input); });
};

Terminal.prototype.maximize = function() {
  var self = this;
  Window.prototype.maximize.call(self, function() { util.autosize(self.input); });
};

Terminal.prototype.keyboard_handler = function(e) {
  if (e.ctrlKey) {
    if (e.keyCode === 83) {
      this.execute(this.buffer + ' "' + this.input.val() + '"');
    } else if (e.keyCode === 76) { this.intercepts.clear.apply(this); }
    else if (e.keyCode === 68) { this.intercepts.exit.apply(this); }
  }
};

Terminal.prototype.textarea_handler = function(e) {
  var target = $(e.target);
  if (e.keyCode === 13 && target.attr('data-capture-enter') === 'true') {
    this.execute();
  } else if (target.hasClass('autosize')) {
    if (e === undefined) util.autosize(this.input);
    else setTimeout(util.autosize, 0, this.input);
    if (this.dom.find('.contents').height() > this.dom.find('main').height()) {
      this.dom.find('.contents').addClass('overflow');
    } else { this.dom.find('.contents').removeClass('overflow'); }
  }
};

Terminal.prototype.log = function(message, color) {
  message = $('<p class="' + (color || '') + '">' + message + '</p>');
  this.input.parent().before(message);
  if (this.dom.find('.contents').height() > this.dom.find('main').height()) {
    this.dom.find('.contents').addClass('overflow');
  } else { this.dom.find('.contents').removeClass('overflow'); }
};

Terminal.prototype.location = function(location) {
  var self = this;
  self.pointer = location;
  self.prompt.text(filesystemManager.absolute_path(location) || '/');
  self.dom.attr('data-title', 'Terminal — ' + (location.key ? location.key : '/'));
  setTimeout(function() {
    self.input.css('text-indent', (self.prompt.width() / 7 + 1) * 7 - 0.5 + 'px');
  }, 0);
};

Terminal.prototype.execute = function(input) {
  input = input === undefined ? this.input.val().trim() : input;
  if (input.length) {
    var command = input;
    var params = [];
    var index = command.indexOf(' ');
    if (index >= 0) {
      var buffer = '', inside = false;
      for (var i = index + 1; i < input.length; i++) {
        var character = input.charAt(i);
        if (character === ' ' && !inside) {
          params.push(buffer.replace(/(^["']|["']$)/g, ''));
          buffer = '';
          continue;
        } else if (character === '"' || character === "'") { inside = !inside; }
        buffer += character;
      }
      params.push(buffer.replace(/(^["']|["']$)/g, ''));
      command = input.substring(0, index);
    }
    if (this.buffer === null) {
      this.log(this.prompt.text() + ' $ ' + input);
    } else {
      var buf = this.input.val().split(/\r?\n/g);
      for (var j = 0; j < buf.length; j++) this.log(buf[j]);
    }
    this.input.val('');
    try {
      if (this.intercepts.hasOwnProperty(command)) {
        this.intercepts[command].apply(this, params);
      } else if (filesystemManager.instance.hasOwnProperty(command)) {
        filesystemManager.instance[command].apply(filesystemManager.instance, params);
      } else {
        throw new Error('Command not found: ' + command);
      }
    } catch (err) { this.log(err.message, 'red'); }
  } else {
    this.log(this.prompt.text() + ' $');
  }
};

// ── TextEdit ──────────────────────────────────

function TextEdit(pointer) {
  this.min_width = 420;
  this.min_height = 320;
  this.max_width = 500;
  this.max_height = 550;
  this.dom = $(templates.textedit);
  this.pointer = null;
  if (pointer !== undefined) this.open(pointer);
}
Window.extend(TextEdit);

TextEdit.prototype.focus = function() { this.dom.find('textarea').focus(); };

TextEdit.prototype.open = function(file) {
  file = typeof file === 'object' ? file : filesystemManager.resolve_path(file);
  this.pointer = file;
  this.dom.attr('data-title', 'TextEdit — ' + file.key);
  this.dom.find('textarea').val(file.contents);
};

TextEdit.prototype.save = function() {
  var path = this.dom.data('path');
  try {
    var node = filesystemManager.resolve_path(path);
    node.contents = this.dom.find('textarea').val();
  } catch (e) {
    filesystemManager.instance.cat('>', path, this.dom.find('textarea').val());
  }
  this.open(path);
};

TextEdit.prototype.keyboard_handler = function(e) {
  if (e.ctrlKey && e.keyCode === 83) {
    e.preventDefault();
    if (this.pointer === null) {
      windows.desktop.append('<div class="overlay"></div>');
      var filebrowser = windows.spawn('filebrowser');
      filebrowser.target(this);
    } else {
      this.dom.attr('data-path', filesystemManager.absolute_path(this.pointer));
      this.save();
    }
  }
};

// ── FileBrowser ───────────────────────────────

function FileBrowser(pointer) {
  this.dom = $(templates.filebrowser);
  this.application = null;
  this.pointer = null;
  this.location(pointer);
}
Window.extend(FileBrowser);

FileBrowser.prototype.focus = function() { this.dom.find('input').trigger('focus'); };

FileBrowser.prototype.location = function(location) {
  this.pointer = location;
  var list = this.dom.find('ul').empty();
  if (this.pointer.parent !== null) {
    var path = filesystemManager.absolute_path(this.pointer.parent);
    list.append('<div class="icon list" data-path="' + (path.length ? path : '/') + '">(up one directory)</div>');
  }
  for (var i = 0; i < this.pointer.children.length; i++) {
    var child = this.pointer.children[i];
    if (child.type === 'directory') {
      list.append('<div class="icon list" data-path="' + filesystemManager.absolute_path(child) + '">' + child.key + '</div>');
    }
  }
};

FileBrowser.prototype.target = function(application) {
  this.application = application;
  this.dom.css({
    top: this.application.dom.offset().top + (this.application.dom.height() - this.dom.height()) / 2 + 'px',
    left: this.application.dom.offset().left + (this.application.dom.width() - this.dom.width()) / 2 + 'px'
  });
};

FileBrowser.prototype.icons_handler = function(e) {
  this.location(filesystemManager.resolve_path($(e.target).data('path')));
};

FileBrowser.prototype.huds_handler = function(e) {
  e.stopPropagation();
  var filename = this.dom.find('input').val().trim();
  if (!filename.length) { util.alert('Please enter a name for the file.'); }
  else if (this.pointer.find(filename).length) { util.alert('Name already taken: ' + filename); }
  else {
    this.application.dom.attr('data-path', filesystemManager.absolute_path(this.pointer) + '/' + filename);
    this.application.save();
    windows.close(this);
  }
};
