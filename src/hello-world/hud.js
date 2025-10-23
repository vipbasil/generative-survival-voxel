const HUD_ID = 'worldgen-hud';
const MAX_ENTRIES = 14;

let hudContainer = null;

export function initHud() {
  if (hudContainer || typeof document === 'undefined') return;
  hudContainer = document.createElement('div');
  hudContainer.id = HUD_ID;
  Object.assign(hudContainer.style, {
    position: 'fixed',
    top: '12px',
    left: '12px',
    maxWidth: '360px',
    fontFamily: 'monospace',
    fontSize: '12px',
    lineHeight: '1.4',
    color: '#f0f0f0',
    background: 'rgba(0, 0, 0, 0.55)',
    padding: '8px 10px',
    borderRadius: '6px',
    zIndex: 9999,
    pointerEvents: 'none',
    boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
    backdropFilter: 'blur(4px)',
  });
  const title = document.createElement('div');
  title.textContent = 'Worldgen Log';
  title.style.fontWeight = '600';
  title.style.marginBottom = '6px';
  hudContainer.appendChild(title);

  document.body.appendChild(hudContainer);
}

export function logHud(message, level = 'info') {
  if (typeof document === 'undefined') return;
  if (!hudContainer) initHud();
  if (!hudContainer) return;

  const entry = document.createElement('div');
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
  entry.textContent = `${timestamp} ${message}`;

  switch (level) {
    case 'warn':
      entry.style.color = '#ffcc66';
      break;
    case 'error':
      entry.style.color = '#ff7b7b';
      break;
    default:
      entry.style.color = '#d8d8d8';
  }

  hudContainer.appendChild(entry);

  while (hudContainer.children.length > MAX_ENTRIES + 1) {
    hudContainer.removeChild(hudContainer.children[1]);
  }

  hudContainer.scrollTop = hudContainer.scrollHeight;
}
