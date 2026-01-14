import { Dialog } from 'quasar';

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
};

const HTML_ESCAPE_REGEX = /[&<>"']/g;

function escapeHtml(input: unknown): string {
  if (input === null || input === undefined) return '';
  let s: string;
  if (typeof input === 'object') {
    try {
      s = JSON.stringify(input);
    } catch {
      s = '[object]';
    }
  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    s = String(input);
  } else {
    s = '';
  }
  return s.replaceAll(HTML_ESCAPE_REGEX, (match) => HTML_ENTITIES[match] ?? match);
}

export function showLoreDialog(item: { title?: string; text?: string }, okLabel = 'Продолжить') {
  const title = escapeHtml(item?.title ?? '');
  const text = escapeHtml(item?.text ?? '');

  const message = `
    <div style="max-width:820px;padding:6px 2px;">
      <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#ffffff;">${title}</h2>
      <div style="font-size:16px;line-height:1.55;color:#f6f6f6;">${text}</div>
    </div>
  `;

  return Dialog.create({ message, html: true, ok: { label: okLabel, color: 'secondary' } });
}
