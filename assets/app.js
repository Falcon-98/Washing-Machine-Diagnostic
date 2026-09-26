/* ==========================================================================
   WM Diagnostics — application logic
   Plain ES2019, no framework, no build step. Everything runs offline.
   ========================================================================== */
'use strict';

const APP_VERSION = '1.0.0';

/* ---------------------------------------------------------------- storage */
const KEY = {
  settings: 'wmd.settings',
  favs:     'wmd.favs',
  recents:  'wmd.recents',
  custom:   'wmd.custom',
  checks:   'wmd.checks',
  job:      'wmd.job'
};

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { toast(t('err.storage')); return false; }
  },
  remove(key) { try { localStorage.removeItem(key); } catch (e) {} }
};

/* ------------------------------------------------------------------- i18n */
const STRINGS = {
  'app.tagline':      ['Technician fault-code reference', 'කාර්මික දෝෂ කේත මාර්ගෝපදේශය'],
  'search.ph':        ['Search code, fault or part…', 'කේතය, දෝෂය හෝ කොටස සොයන්න…'],
  'offline':          ['Offline — all data is stored on this device', 'නොබැඳි — සියලු දත්ත මෙම උපාංගයේම ඇත'],
  'install.title':    ['Install on this phone', 'මෙම දුරකථනයේ ස්ථාපනය කරන්න'],
  'install.body':     ['Works fully offline once installed. No app store needed.', 'ස්ථාපනය කළ පසු අන්තර්ජාලයකින් තොරව ක්‍රියා කරයි.'],
  'install.cta':      ['Install', 'ස්ථාපනය'],
  'install.later':    ['Not now', 'පසුව'],
  'model.label':      ['Machine model', 'යන්ත්‍ර මාදිලිය'],
  'model.help':       ['Filters the code list by drum type and is added to the job report.', 'කේත ලැයිස්තුව පෙරහන් කර job report එකට එක් කරයි.'],
  'model.all':        ['— All models —', '— සියලු මාදිලි —'],
  'fav.title':        ['Pinned', 'සුරකින ලද'],
  'recent.title':     ['Recently viewed', 'මෑතක බැලූ'],
  'codes.title':      ['Fault codes', 'දෝෂ කේත'],
  'codes.empty':      ['No codes match that search.', 'ගැළපෙන කේත නොමැත.'],
  'codes.add':        ['+ Add your own code', '+ ඔබේම කේතයක් එක් කරන්න'],
  'codes.count':      ['%n codes', 'කේත %n'],
  'common.title':     ['Common faults', 'සාමාන්‍ය දෝෂ'],
  'check.title':      ['Standard checklist', 'සම්මත පිරික්සුම් ලැයිස්තුව'],
  'check.reset':      ['Reset for next job', 'ඊළඟ job එකට reset කරන්න'],
  'check.done':       ['Checklist cleared', 'ලැයිස්තුව හිස් කරන ලදී'],
  'job.title':        ['Job report', 'Job වාර්තාව'],
  'job.customer':     ['Customer / job ref', 'පාරිභෝගිකයා / Job අංකය'],
  'job.serial':       ['Serial no.', 'Serial අංකය'],
  'job.notes':        ['Notes', 'සටහන්'],
  'job.notes.ph':     ['Parts replaced, readings taken, advice given…', 'මාරු කළ කොටස්, ලබාගත් අගයන්, ලබාදුන් උපදෙස්…'],
  'job.share':        ['Share report', 'වාර්තාව බෙදාගන්න'],
  'job.clear':        ['Clear', 'හිස් කරන්න'],
  'job.cleared':      ['Job report cleared', 'වාර්තාව හිස් කරන ලදී'],
  'disclaimer':       [
    "Independent technician reference tool. Not affiliated with or endorsed by any appliance manufacturer. Code meanings vary between models and control boards — always confirm against the manufacturer's official service manual. Mains-voltage repairs must be carried out by a qualified technician.",
    'ස්වාධීන කාර්මික මාර්ගෝපදේශයකි. කිසිදු නිෂ්පාදකයෙකු හා සම්බන්ධ නැත. කේතවල අර්ථය මාදිලියෙන් මාදිලියට වෙනස් විය හැක — සෑම විටම නිල Service Manual එක සමඟ තහවුරු කරගන්න. විදුලි අලුත්වැඩියා සුදුසුකම්ලත් කාර්මිකයෙකු විසින්ම සිදුකළ යුතුය.'
  ],
  'detail.cause':     ['Cause', 'හේතුව'],
  'detail.checks':    ['Check these', 'පරීක්ෂා කරන්න'],
  'detail.solution':  ['Usual fix', 'විසඳුම'],
  'detail.share':     ['Share', 'බෙදාගන්න'],
  'detail.copy':      ['Copy', 'පිටපත්'],
  'detail.edit':      ['Edit', 'වෙනස් කරන්න'],
  'detail.delete':    ['Delete', 'මකන්න'],
  'detail.custom':    ['Custom', 'ඔබේම'],
  'detail.copied':    ['Copied to clipboard', 'පිටපත් කරන ලදී'],
  'detail.pinned':    ['Pinned', 'සුරකින ලදී'],
  'detail.unpinned':  ['Unpinned', 'ඉවත් කරන ලදී'],
  'detail.deleted':   ['Code deleted', 'කේතය මකන ලදී'],
  'detail.confirmDel':['Delete this custom code?', 'මෙම කේතය මකන්නද?'],
  'set.title':        ['Settings', 'සැකසුම්'],
  'set.theme':        ['Appearance', 'පෙනුම'],
  'set.system':       ['System', 'පද්ධතිය'],
  'set.light':        ['Light', 'ආලෝකය'],
  'set.dark':         ['Dark', 'අඳුරු'],
  'set.text':         ['Text size', 'අකුරු ප්‍රමාණය'],
  'set.lock':         ['PIN lock', 'PIN අගුල'],
  'set.lock.help':    ['Keeps casual eyes off the app. It is not real security — anyone with the device can bypass it.', 'අහඹු පුද්ගලයින්ගෙන් ආවරණයක් පමණි. සැබෑ ආරක්ෂාවක් නොවේ.'],
  'set.lock.ph':      ['4–8 digits, blank to disable', 'ඉලක්කම් 4–8, නවත්වන්න හිස්ව තබන්න'],
  'set.lock.save':    ['Save', 'සුරකින්න'],
  'set.lock.on':      ['PIN lock enabled', 'PIN අගුල සක්‍රියයි'],
  'set.lock.off':     ['PIN lock disabled', 'PIN අගුල අක්‍රියයි'],
  'set.lock.bad':     ['Use 4 to 8 digits', 'ඉලක්කම් 4–8ක් යොදන්න'],
  'set.data':         ['Your data', 'ඔබේ දත්ත'],
  'set.data.help':    ['Custom codes, pins, checklist and job notes live only on this device. Back them up before changing phones.', 'ඔබේ කේත, සටහන් සහ ලැයිස්තු මෙම උපාංගයේ පමණි. දුරකථනය මාරු කිරීමට පෙර backup එකක් ගන්න.'],
  'set.export':       ['Export backup', 'Backup ගන්න'],
  'set.import':       ['Restore backup', 'Backup නැවත ගන්න'],
  'set.reset':        ['Erase everything on this device', 'සියල්ල මකන්න'],
  'set.howinstall':   ['How do I install this?', 'ස්ථාපනය කරන්නේ කෙසේද?'],
  'set.exported':     ['Backup file saved', 'Backup ගොනුව සුරකින ලදී'],
  'set.imported':     ['Backup restored', 'Backup නැවත ලබාගන්නා ලදී'],
  'set.importBad':    ['That file is not a valid backup', 'වලංගු backup ගොනුවක් නොවේ'],
  'set.confirmReset': ['Erase all custom codes, pins, checklist and notes on this device?', 'මෙම උපාංගයේ සියලු දත්ත මකන්නද?'],
  'edit.title':       ['Add a code', 'කේතයක් එක් කරන්න'],
  'edit.titleEdit':   ['Edit code', 'කේතය වෙනස් කරන්න'],
  'edit.code':        ['Code', 'කේතය'],
  'edit.cat':         ['Category', 'ප්‍රවර්ගය'],
  'edit.en':          ['Cause (English)', 'හේතුව (ඉංග්‍රීසි)'],
  'edit.si':          ['Cause (Sinhala)', 'හේතුව (සිංහල)'],
  'edit.checks':      ['Checks — one per line', 'පරීක්ෂාවන් — පේළියකට එකක්'],
  'edit.sol':         ['Usual fix', 'විසඳුම'],
  'edit.save':        ['Save code', 'කේතය සුරකින්න'],
  'edit.saved':       ['Code saved', 'කේතය සුරකින ලදී'],
  'edit.needCode':    ['A code is required', 'කේතයක් අවශ්‍යයි'],
  'edit.needText':    ['Add a cause in at least one language', 'අවම වශයෙන් එක් භාෂාවකින් හේතුව ලියන්න'],
  'edit.dupe':        ['That code already exists', 'එම කේතය දැනටමත් ඇත'],
  'ios.title':        ['Add to home screen', 'මුල් තිරයට එක් කරන්න'],
  'ios.android':      ['Android (Chrome)', 'Android (Chrome)'],
  'ios.androidSteps': ['Menu ⋮ → “Add to Home screen” or “Install app”.', 'Menu ⋮ → “Add to Home screen”.'],
  'ios.ios':          ['iPhone / iPad (Safari)', 'iPhone / iPad (Safari)'],
  'ios.iosSteps':     ['Share button → “Add to Home Screen”. Safari only — Chrome on iOS can\u2019t install web apps.', 'Share → “Add to Home Screen”. Safari පමණක්.'],
  'ios.note':         ['Once installed it opens full screen and works with no signal.', 'ස්ථාපනය කළ පසු සම්පූර්ණ තිරයේ, signal නැතිවද ක්‍රියා කරයි.'],
  'ios.ok':           ['Got it', 'හරි'],
  'lock.title':       ['Enter PIN', 'PIN ඇතුළත් කරන්න'],
  'lock.sub':         ['This device has a PIN set for the app.', 'මෙම යෙදුමට PIN අංකයක් සකසා ඇත.'],
  'lock.wrong':       ['Wrong PIN. Try again.', 'වැරදි PIN අංකයකි.'],
  'lock.unlock':      ['Unlock', 'විවෘත කරන්න'],
  'update.ready':     ['A new version is ready — tap to reload', 'නව අනුවාදයක් ඇත — reload කරන්න'],
  'installed':        ['Installed. Look for the icon on your home screen.', 'ස්ථාපනය විය. මුල් තිරයේ අයිකනය බලන්න.'],
  'err.storage':      ['Could not save — device storage is full or blocked', 'සුරැකීමට නොහැකි විය'],
  'err.share':        ['Sharing is not available on this browser', 'මෙම බ්‍රව්සරයේ share කළ නොහැක']
};

function t(key, vars) {
  const pair = STRINGS[key];
  let s = pair ? (state.lang === 'si' ? pair[1] : pair[0]) : key;
  if (vars) Object.keys(vars).forEach(k => { s = s.replace('%' + k, vars[k]); });
  return s;
}

/* ------------------------------------------------------------------ state */
const settings = Object.assign(
  { lang: 'en', theme: 'system', textSize: 'base', pin: '', installDismissed: false },
  store.get(KEY.settings, {})
);

const state = {
  lang: settings.lang === 'si' ? 'si' : 'en',
  cat: 'all',
  query: '',
  model: '',
  load: 'any',
  favs: store.get(KEY.favs, []),
  recents: store.get(KEY.recents, []),
  custom: store.get(KEY.custom, []),
  openCode: null
};

const $  = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

function saveSettings() { store.set(KEY.settings, settings); }
function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms || 8); } catch (e) {} }

/* ------------------------------------------------------------------ toast */
let toastTimer;
function toast(msg, action) {
  const box = $('#toast');
  const el = document.createElement('div');
  el.className = 'toast-item flex items-center gap-3';
  el.setAttribute('role', 'status');
  const span = document.createElement('span');
  span.className = 'flex-1';
  span.textContent = msg;
  el.appendChild(span);
  if (action) {
    const b = document.createElement('button');
    b.className = 'shrink-0 font-bold text-brand-light';
    b.textContent = action.label;
    b.addEventListener('click', action.onClick);
    el.appendChild(b);
  }
  box.appendChild(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { box.innerHTML = ''; }, action ? 12000 : 2600);
}

/* --------------------------------------------------------------- code set */
function allCodes() {
  return ERROR_CODES.concat(state.custom.map(c => Object.assign({}, c, { custom: true })));
}
function findCode(code) {
  return allCodes().find(c => c.code === code);
}
function catOf(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
}
function txt(entry, field) {
  return state.lang === 'si' ? (entry[field + '_si'] || entry[field] || '') : (entry[field] || '');
}
function causeOf(c)  { return state.lang === 'si' ? (c.si || c.en) : (c.en || c.si); }
function checksOf(c) { return (state.lang === 'si' ? c.checks_si : c.checks_en) || c.checks_en || c.checks_si || []; }
function solOf(c)    { return (state.lang === 'si' ? c.sol_si : c.sol_en) || c.sol_en || c.sol_si || ''; }

function matches(c) {
  if (state.cat !== 'all' && c.cat !== state.cat) return false;
  if (state.load !== 'any' && c.load && c.load !== 'any' && c.load !== state.load) return false;
  const q = state.query.trim().toLowerCase();
  if (!q) return true;
  const hay = [c.code, c.en, c.si, c.sol_en, c.sol_si]
    .concat(c.checks_en || [], c.checks_si || [])
    .join(' ').toLowerCase();
  return hay.includes(q);
}

/* ------------------------------------------------------------------ i18n render */
function applyI18n() {
  document.documentElement.lang = state.lang === 'si' ? 'si' : 'en';
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $('#langLabel').textContent = state.lang === 'si' ? 'EN' : 'සිං';
  $('#langBtn').setAttribute('aria-label',
    state.lang === 'si' ? 'Switch to English' : 'සිංහල භාෂාවට මාරු වන්න');
}

/* ------------------------------------------------------------------ render */
function renderChips() {
  const wrap = $('#chips');
  wrap.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', String(state.cat === cat.id));
    b.innerHTML = '<span aria-hidden="true">' + cat.icon + '</span>';
    b.appendChild(document.createTextNode(state.lang === 'si' ? cat.si : cat.en));
    b.addEventListener('click', () => {
      state.cat = cat.id;
      buzz();
      renderChips();
      renderGrid();
    });
    wrap.appendChild(b);
  });
}

function renderModels() {
  const sel = $('#model');
  sel.innerHTML = '';
  const any = new Option(t('model.all'), '');
  sel.appendChild(any);
  MODELS.forEach(group => {
    const og = document.createElement('optgroup');
    og.label = group.group;
    group.items.forEach(name => {
      const o = new Option(name, group.load + '|' + name);
      og.appendChild(o);
    });
    sel.appendChild(og);
  });
  sel.value = state.model;
}

function codeTile(c) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'code-btn';
  b.textContent = c.code;
  b.setAttribute('aria-pressed', String(state.openCode === c.code));
  b.setAttribute('aria-label', c.code + ' — ' + causeOf(c));
  if (state.favs.indexOf(c.code) !== -1) {
    const pin = document.createElement('span');
    pin.className = 'pin';
    pin.textContent = '★';
    pin.setAttribute('aria-hidden', 'true');
    b.appendChild(pin);
  }
  b.addEventListener('click', () => openSheet(c.code));
  return b;
}

function renderGrid() {
  const grid = $('#grid');
  const list = allCodes().filter(matches);
  grid.innerHTML = '';
  list.forEach(c => grid.appendChild(codeTile(c)));
  $('#emptyState').classList.toggle('hidden', list.length > 0);
  $('#codeCount').textContent = t('codes.count', { n: list.length });
}

function renderQuick() {
  const favs = state.favs.map(findCode).filter(Boolean);
  const recents = state.recents.map(findCode).filter(Boolean)
    .filter(c => state.favs.indexOf(c.code) === -1).slice(0, 8);

  const build = (host, items) => {
    host.innerHTML = '';
    items.forEach(c => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pill';
      b.innerHTML = '<span class="text-brand">' + c.code + '</span>';
      const s = document.createElement('span');
      s.className = 'max-w-[9rem] truncate font-medium text-slate-500 dark:text-slate-400';
      s.textContent = causeOf(c);
      b.appendChild(s);
      b.addEventListener('click', () => openSheet(c.code));
      host.appendChild(b);
    });
  };

  build($('#favList'), favs);
  build($('#recentList'), recents);
  $('#favWrap').classList.toggle('hidden', favs.length === 0);
  $('#recentWrap').classList.toggle('hidden', recents.length === 0);
  $('#quickRow').classList.toggle('hidden', favs.length === 0 && recents.length === 0);
}

function renderCommon() {
  const host = $('#commonFaults');
  host.innerHTML = '';
  COMMON_FAULTS.forEach(f => {
    const d = document.createElement('div');
    d.className = 'rounded-xl bg-sky-50 p-3 ring-1 ring-sky-100 dark:bg-sky-500/10 dark:ring-sky-500/20';
    const h = document.createElement('p');
    h.className = 'text-sm font-bold text-sky-900 dark:text-sky-200';
    h.textContent = state.lang === 'si' ? f.si : f.en;
    const p = document.createElement('p');
    p.className = 'mt-0.5 text-[13px] leading-snug text-slate-600 dark:text-slate-300';
    p.textContent = state.lang === 'si' ? f.d_si : f.d_en;
    d.appendChild(h); d.appendChild(p);
    host.appendChild(d);
  });
}

function renderChecklist() {
  const saved = store.get(KEY.checks, {});
  const host = $('#checklist');
  host.innerHTML = '';
  CHECKLIST.forEach(item => {
    const row = document.createElement('label');
    row.className = 'flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 active:bg-slate-50 dark:active:bg-slate-800';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = item.id;
    cb.checked = !!saved[item.id];
    cb.className = 'h-5 w-5 shrink-0 accent-emerald-600';
    const span = document.createElement('span');
    span.className = 'text-[14px] leading-snug';
    span.textContent = state.lang === 'si' ? item.si : item.en;
    if (cb.checked) span.classList.add('line-through', 'text-slate-400');
    cb.addEventListener('change', () => {
      const s = store.get(KEY.checks, {});
      s[item.id] = cb.checked;
      store.set(KEY.checks, s);
      span.classList.toggle('line-through', cb.checked);
      span.classList.toggle('text-slate-400', cb.checked);
      buzz();
      updateCheckProgress();
    });
    row.appendChild(cb); row.appendChild(span);
    host.appendChild(row);
  });
  updateCheckProgress();
}

function updateCheckProgress() {
  const saved = store.get(KEY.checks, {});
  const done = CHECKLIST.filter(i => saved[i.id]).length;
  $('#checkCount').textContent = done + '/' + CHECKLIST.length;
  $('#checkBar').style.width = (done / CHECKLIST.length * 100) + '%';
}

function renderAll() {
  applyI18n();
  renderChips();
  renderModels();
  renderGrid();
  renderQuick();
  renderCommon();
  renderChecklist();
}

/* ------------------------------------------------------- overlays (+ back) */
const OVERLAYS = {
  sheet:    { panel: '#sheet',     backdrop: '#sheetBackdrop' },
  settings: { panel: '#settings',  backdrop: '#settingsBackdrop' },
  edit:     { panel: '#editDlg',   backdrop: '#editBackdrop' },
  ios:      { panel: '#iosBackdrop', backdrop: null }
};
let openOverlayName = null;

function showOverlay(name) {
  if (openOverlayName) hideOverlayNow();
  const o = OVERLAYS[name];
  if (o.backdrop) $(o.backdrop).classList.remove('hidden');
  const panel = $(o.panel);
  panel.classList.remove('hidden');
  if (name === 'ios') panel.classList.add('block');
  requestAnimationFrame(() => panel.classList.remove('translate-y-full'));
  openOverlayName = name;
  document.body.style.overflow = 'hidden';
  history.pushState({ overlay: name }, '');
  const focusable = panel.querySelector('button, input, select, textarea');
  if (focusable) setTimeout(() => focusable.focus({ preventScroll: true }), 60);
}

function hideOverlayNow() {
  if (!openOverlayName) return;
  const o = OVERLAYS[openOverlayName];
  const panel = $(o.panel);
  panel.classList.add('hidden');
  if (openOverlayName === 'sheet') panel.classList.add('translate-y-full');
  if (o.backdrop) $(o.backdrop).classList.add('hidden');
  openOverlayName = null;
  document.body.style.overflow = '';
  state.openCode = null;
  renderGrid();
}

function closeOverlay() {
  if (!openOverlayName) return;
  if (history.state && history.state.overlay) history.back();
  else hideOverlayNow();
}

window.addEventListener('popstate', hideOverlayNow);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && openOverlayName) closeOverlay();
});

/* ------------------------------------------------------------ detail sheet */
function openSheet(code) {
  const c = findCode(code);
  if (!c) return;
  state.openCode = code;
  buzz();

  $('#sheetCode').textContent = c.code;
  $('#sheetTitle').textContent = causeOf(c);
  const cat = catOf(c.cat);
  $('#sheetCat').textContent = (state.lang === 'si' ? cat.si : cat.en);
  $('#sheetCustom').classList.toggle('hidden', !c.custom);
  $('#sheetDesc').textContent = causeOf(c);
  $('#sheetSol').textContent = solOf(c);

  const ul = $('#sheetChecks');
  ul.innerHTML = '';
  checksOf(c).forEach(item => {
    const li = document.createElement('li');
    li.className = 'flex gap-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200';
    li.innerHTML = '<span class="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true"></span>';
    const s = document.createElement('span');
    s.textContent = item;
    li.appendChild(s);
    ul.appendChild(li);
  });

  const isFav = state.favs.indexOf(code) !== -1;
  const favBtn = $('#sheetFav');
  favBtn.setAttribute('aria-pressed', String(isFav));
  favBtn.querySelector('svg').setAttribute('fill', isFav ? 'currentColor' : 'none');
  favBtn.classList.toggle('text-amber-500', isFav);

  $('#sheetEdit').classList.toggle('hidden', !c.custom);
  $('#sheetDelete').classList.toggle('hidden', !c.custom);

  pushRecent(code);
  renderGrid();
  showOverlay('sheet');
}

function pushRecent(code) {
  state.recents = [code].concat(state.recents.filter(x => x !== code)).slice(0, 12);
  store.set(KEY.recents, state.recents);
  renderQuick();
}

function toggleFav(code) {
  const i = state.favs.indexOf(code);
  if (i === -1) { state.favs.push(code); toast(t('detail.pinned')); }
  else { state.favs.splice(i, 1); toast(t('detail.unpinned')); }
  store.set(KEY.favs, state.favs);
  buzz();
  renderQuick();
  renderGrid();
  if (state.openCode === code) {
    const isFav = state.favs.indexOf(code) !== -1;
    const b = $('#sheetFav');
    b.setAttribute('aria-pressed', String(isFav));
    b.querySelector('svg').setAttribute('fill', isFav ? 'currentColor' : 'none');
    b.classList.toggle('text-amber-500', isFav);
  }
}

function codeAsText(c) {
  const lines = [
    c.code + ' — ' + causeOf(c),
    '',
    t('detail.checks') + ':'
  ];
  checksOf(c).forEach(x => lines.push('• ' + x));
  lines.push('', t('detail.solution') + ': ' + solOf(c));
  return lines.join('\n');
}

async function shareText(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title: title, text: text }); return; }
    catch (e) { if (e && e.name === 'AbortError') return; }
  }
  copyText(text);
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    toast(t('detail.copied'));
  } catch (e) {
    toast(t('err.share'));
  }
}

/* --------------------------------------------------------- job report text */
function jobText() {
  const saved = store.get(KEY.checks, {});
  const job = readJob();
  const modelName = state.model ? state.model.split('|')[1] : '—';
  const lines = [
    'WM DIAGNOSTICS — ' + t('job.title').toUpperCase(),
    new Date().toLocaleString(),
    '',
    t('job.customer') + ': ' + (job.customer || '—'),
    t('model.label') + ': ' + modelName,
    t('job.serial') + ': ' + (job.serial || '—')
  ];
  if (state.openCode) {
    const c = findCode(state.openCode);
    if (c) lines.push('', 'Code: ' + c.code + ' — ' + causeOf(c), 'Fix: ' + solOf(c));
  }
  lines.push('', t('check.title') + ':');
  CHECKLIST.forEach(i => {
    lines.push((saved[i.id] ? '[x] ' : '[ ] ') + (state.lang === 'si' ? i.si : i.en));
  });
  if (job.notes) lines.push('', t('job.notes') + ':', job.notes);
  return lines.join('\n');
}

function readJob() {
  return {
    customer: $('#jobCustomer').value.trim(),
    serial: $('#jobSerial').value.trim(),
    notes: $('#jobNotes').value.trim()
  };
}
function saveJob() { store.set(KEY.job, readJob()); }
function loadJob() {
  const j = store.get(KEY.job, {});
  $('#jobCustomer').value = j.customer || '';
  $('#jobSerial').value = j.serial || '';
  $('#jobNotes').value = j.notes || '';
}

/* -------------------------------------------------------- custom code form */
let editingCode = null;

function openEditor(code) {
  editingCode = code || null;
  const sel = $('#fCat');
  sel.innerHTML = '';
  CATEGORIES.filter(c => c.id !== 'all').forEach(c => {
    sel.appendChild(new Option(state.lang === 'si' ? c.si : c.en, c.id));
  });

  const c = code ? state.custom.find(x => x.code === code) : null;
  $('#editTitle').textContent = c ? t('edit.titleEdit') : t('edit.title');
  $('#fCode').value = c ? c.code : '';
  $('#fCode').disabled = !!c;
  $('#fCat').value = c ? c.cat : 'water';
  $('#fEn').value = c ? (c.en || '') : '';
  $('#fSi').value = c ? (c.si || '') : '';
  $('#fChecks').value = c ? (c.checks_en || []).join('\n') : '';
  $('#fSol').value = c ? (c.sol_en || '') : '';
  $('#editError').classList.add('hidden');
  showOverlay('edit');
}

function saveCustomCode() {
  const code = $('#fCode').value.trim().toUpperCase();
  const en = $('#fEn').value.trim();
  const si = $('#fSi').value.trim();
  const err = msg => {
    const el = $('#editError');
    el.textContent = msg;
    el.classList.remove('hidden');
  };

  if (!code) return err(t('edit.needCode'));
  if (!en && !si) return err(t('edit.needText'));
  if (!editingCode && findCode(code)) return err(t('edit.dupe'));

  const checks = $('#fChecks').value.split('\n').map(s => s.trim()).filter(Boolean);
  const sol = $('#fSol').value.trim();
  const entry = {
    code: code, cat: $('#fCat').value, load: 'any',
    en: en || si, si: si || en,
    checks_en: checks, checks_si: checks,
    sol_en: sol, sol_si: sol
  };

  if (editingCode) {
    state.custom = state.custom.map(c => (c.code === editingCode ? entry : c));
  } else {
    state.custom.push(entry);
  }
  store.set(KEY.custom, state.custom);
  closeOverlay();
  renderGrid();
  renderQuick();
  toast(t('edit.saved'));
}

function deleteCustomCode(code) {
  if (!window.confirm(t('detail.confirmDel'))) return;
  state.custom = state.custom.filter(c => c.code !== code);
  state.favs = state.favs.filter(c => c !== code);
  state.recents = state.recents.filter(c => c !== code);
  store.set(KEY.custom, state.custom);
  store.set(KEY.favs, state.favs);
  store.set(KEY.recents, state.recents);
  closeOverlay();
  renderGrid();
  renderQuick();
  toast(t('detail.deleted'));
}

/* ---------------------------------------------------------- backup / reset */
function exportBackup() {
  const payload = {
    app: 'wm-diagnostics',
    version: APP_VERSION,
    exported: new Date().toISOString(),
    settings: settings,
    custom: state.custom,
    favs: state.favs,
    recents: state.recents,
    checks: store.get(KEY.checks, {}),
    job: store.get(KEY.job, {})
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wm-diagnostics-backup-' + new Date().toISOString().slice(0, 10) + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(t('set.exported'));
}

function importBackup(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || data.app !== 'wm-diagnostics') throw new Error('bad file');
      if (Array.isArray(data.custom)) { state.custom = data.custom; store.set(KEY.custom, state.custom); }
      if (Array.isArray(data.favs)) { state.favs = data.favs; store.set(KEY.favs, state.favs); }
      if (Array.isArray(data.recents)) { state.recents = data.recents; store.set(KEY.recents, state.recents); }
      if (data.checks) store.set(KEY.checks, data.checks);
      if (data.job) store.set(KEY.job, data.job);
      if (data.settings) {
        Object.assign(settings, data.settings);
        saveSettings();
        state.lang = settings.lang === 'si' ? 'si' : 'en';
        applyTheme();
        applyTextSize();
      }
      loadJob();
      renderAll();
      syncSettingsUI();
      toast(t('set.imported'));
    } catch (e) {
      toast(t('set.importBad'));
    }
  };
  reader.readAsText(file);
}

function eraseAll() {
  if (!window.confirm(t('set.confirmReset'))) return;
  Object.keys(KEY).forEach(k => store.remove(KEY[k]));
  location.reload();
}

/* ---------------------------------------------------------- theme and size */
function applyTheme() {
  const dark = settings.theme === 'dark' ||
    (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
}
function applyTextSize() {
  document.documentElement.dataset.text = settings.textSize;
}
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', () => { if (settings.theme === 'system') applyTheme(); });

function syncSettingsUI() {
  $$('[data-theme]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.theme === settings.theme)));
  $$('[data-text]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.text === settings.textSize)));
  $('#pinSet').value = '';
}

/* ---------------------------------------------------------------- PIN lock */
function maybeLock() {
  if (!settings.pin) return;
  const lock = $('#pinLock');
  lock.classList.remove('hidden');
  lock.classList.add('flex');
  setTimeout(() => $('#pinInput').focus(), 100);
}
function tryUnlock() {
  if ($('#pinInput').value === settings.pin) {
    const lock = $('#pinLock');
    lock.classList.add('hidden');
    lock.classList.remove('flex');
    $('#pinInput').value = '';
    $('#pinError').classList.add('hidden');
  } else {
    $('#pinError').classList.remove('hidden');
    $('#pinInput').value = '';
    buzz(120);
  }
}

/* --------------------------------------------------- service worker + install */
let deferredInstall = null;

function registerSW() {
  if (!('serviceWorker' in navigator)) { $('#swState').textContent = 'no SW support'; return; }
  navigator.serviceWorker.register('sw.js').then(reg => {
    $('#swState').textContent = 'offline ready';
    reg.addEventListener('updatefound', () => {
      const sw = reg.installing;
      if (!sw) return;
      sw.addEventListener('statechange', () => {
        if (sw.state === 'installed' && navigator.serviceWorker.controller) {
          toast(t('update.ready'), {
            label: '↻',
            onClick: () => { sw.postMessage({ type: 'SKIP_WAITING' }); }
          });
        }
      });
    });
  }).catch(() => { $('#swState').textContent = 'offline unavailable'; });

  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    location.reload();
  });
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstall = e;
  if (!settings.installDismissed && !isStandalone()) {
    $('#installCard').classList.remove('hidden');
  }
});

window.addEventListener('appinstalled', () => {
  $('#installCard').classList.add('hidden');
  deferredInstall = null;
  toast(t('installed'));
});

/* ------------------------------------------------------------------ wiring */
function wire() {
  // language
  $('#langBtn').addEventListener('click', () => {
    state.lang = state.lang === 'si' ? 'en' : 'si';
    settings.lang = state.lang;
    saveSettings();
    buzz();
    renderAll();
    if (state.openCode) openSheet(state.openCode);
  });

  // search
  const search = $('#search');
  search.addEventListener('input', () => {
    state.query = search.value;
    $('#searchClear').classList.toggle('hidden', !search.value);
    $('#searchClear').classList.toggle('grid', !!search.value);
    renderGrid();
  });
  $('#searchClear').addEventListener('click', () => {
    search.value = '';
    state.query = '';
    $('#searchClear').classList.add('hidden');
    search.focus();
    renderGrid();
  });

  // model
  $('#model').addEventListener('change', e => {
    state.model = e.target.value;
    state.load = state.model ? state.model.split('|')[0] : 'any';
    renderGrid();
  });

  // sheet
  $('#sheetClose').addEventListener('click', closeOverlay);
  $('#sheetBackdrop').addEventListener('click', closeOverlay);
  $('#sheetFav').addEventListener('click', () => state.openCode && toggleFav(state.openCode));
  $('#sheetShare').addEventListener('click', () => {
    const c = findCode(state.openCode);
    if (c) shareText(c.code + ' — ' + causeOf(c), codeAsText(c));
  });
  $('#sheetCopy').addEventListener('click', () => {
    const c = findCode(state.openCode);
    if (c) copyText(codeAsText(c));
  });
  $('#sheetEdit').addEventListener('click', () => openEditor(state.openCode));
  $('#sheetDelete').addEventListener('click', () => deleteCustomCode(state.openCode));

  // settings
  $('#settingsBtn').addEventListener('click', () => { syncSettingsUI(); showOverlay('settings'); });
  $('#settingsClose').addEventListener('click', closeOverlay);
  $('#settingsBackdrop').addEventListener('click', closeOverlay);

  $$('[data-theme]').forEach(b => b.addEventListener('click', () => {
    settings.theme = b.dataset.theme;
    saveSettings(); applyTheme(); syncSettingsUI(); buzz();
  }));
  $$('[data-text]').forEach(b => b.addEventListener('click', () => {
    settings.textSize = b.dataset.text;
    saveSettings(); applyTextSize(); syncSettingsUI(); buzz();
  }));

  $('#pinSave').addEventListener('click', () => {
    const v = $('#pinSet').value.trim();
    if (v === '') { settings.pin = ''; saveSettings(); toast(t('set.lock.off')); return; }
    if (!/^\d{4,8}$/.test(v)) { toast(t('set.lock.bad')); return; }
    settings.pin = v; saveSettings(); $('#pinSet').value = ''; toast(t('set.lock.on'));
  });

  $('#exportBtn').addEventListener('click', exportBackup);
  $('#importBtn').addEventListener('click', () => $('#importFile').click());
  $('#importFile').addEventListener('change', e => {
    if (e.target.files && e.target.files[0]) importBackup(e.target.files[0]);
    e.target.value = '';
  });
  $('#resetAll').addEventListener('click', eraseAll);
  $('#iosHelpBtn').addEventListener('click', () => showOverlay('ios'));
  $('#iosClose').addEventListener('click', closeOverlay);
  $('#iosBackdrop').addEventListener('click', e => { if (e.target === $('#iosBackdrop')) closeOverlay(); });

  // custom codes
  $('#addCodeBtn').addEventListener('click', () => openEditor(null));
  $('#editClose').addEventListener('click', closeOverlay);
  $('#editBackdrop').addEventListener('click', closeOverlay);
  $('#editSave').addEventListener('click', saveCustomCode);

  // checklist
  $('#resetCheck').addEventListener('click', () => {
    store.set(KEY.checks, {});
    renderChecklist();
    buzz();
    toast(t('check.done'));
  });

  // job report
  ['#jobCustomer', '#jobSerial', '#jobNotes'].forEach(sel => {
    $(sel).addEventListener('input', saveJob);
  });
  $('#shareJob').addEventListener('click', () => shareText(t('job.title'), jobText()));
  $('#clearJob').addEventListener('click', () => {
    $('#jobCustomer').value = ''; $('#jobSerial').value = ''; $('#jobNotes').value = '';
    saveJob();
    toast(t('job.cleared'));
  });

  // install
  $('#installBtn').addEventListener('click', async () => {
    if (!deferredInstall) { showOverlay('ios'); return; }
    deferredInstall.prompt();
    try { await deferredInstall.userChoice; } catch (e) {}
    deferredInstall = null;
    $('#installCard').classList.add('hidden');
  });
  $('#installDismiss').addEventListener('click', () => {
    settings.installDismissed = true;
    saveSettings();
    $('#installCard').classList.add('hidden');
  });

  // PIN lock screen
  $('#pinSubmit').addEventListener('click', tryUnlock);
  $('#pinInput').addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });

  // connectivity
  const netState = () => $('#offlineBar').classList.toggle('hidden', navigator.onLine);
  window.addEventListener('online', netState);
  window.addEventListener('offline', netState);
  netState();
}

/* -------------------------------------------------------------------- boot */
function init() {
  applyTheme();
  applyTextSize();
  $('#verLabel').textContent = APP_VERSION;
  $$('.verLabel').forEach(el => { el.textContent = APP_VERSION; });
  loadJob();
  renderAll();
  wire();
  maybeLock();
  registerSW();

  // iOS never fires beforeinstallprompt, so offer the manual route instead.
  const iOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (iOS && !isStandalone() && !settings.installDismissed) {
    $('#installCard').classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', init);
