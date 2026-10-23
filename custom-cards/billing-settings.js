const BILLING_KEY = 'myhome.energy.billing.v1';
const DEFAULT_RATE = 55;
const IMPORT_SENSOR = 'sensor.goodwe_today_import_meter_calculated';
const EXPORT_SENSOR = 'sensor.goodwe_today_export_meter_calculated';

const pad = (n) => String(n).padStart(2, '0');
const tzOf = (hass) => hass?.config?.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

function dateParts(time, tz) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date(time));
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day };
}

function normalizeMonth(y, m) {
  while (m < 1) { m += 12; y -= 1; }
  while (m > 12) { m -= 12; y += 1; }
  return { y, m };
}

function fmtDate(y, m, d) {
  const n = normalizeMonth(y, m);
  return `${n.y}-${pad(n.m)}-${pad(d)}`;
}

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
}

function addDays(day, days) {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

function midnight(day, tz) {
  const [y, m, d] = day.split('-').map(Number);
  const target = Date.UTC(y, m - 1, d);
  let t = target;
  for (let i = 0; i < 3; i += 1) {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
      timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date(t)).map((x) => [x.type, x.value]));
    t += target - Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  }
  return t;
}

export function currentBillingRange(hass) {
  const { y, m, d } = dateParts(Date.now(), tzOf(hass));
  const startMonth = d >= 24 ? m : m - 1;
  const endMonth = d >= 24 ? m + 1 : m;
  return { start: fmtDate(y, startMonth, 24), end: fmtDate(y, endMonth, 23) };
}

export function getBillingSettings(hass) {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(BILLING_KEY) || '{}') || {}; } catch (e) { saved = {}; }
  const fallback = currentBillingRange(hass);
  let rate = Number(saved.rate);
  if (!Number.isFinite(rate) || rate < 0) rate = DEFAULT_RATE;
  let start = validDate(saved.start) ? saved.start : fallback.start;
  let end = validDate(saved.end) ? saved.end : fallback.end;
  if (start > end) { const swap = start; start = end; end = swap; }
  return { rate, start, end };
}

export function saveBillingSettings(settings, hass) {
  const base = getBillingSettings(hass);
  let rate = Number(settings?.rate);
  if (!Number.isFinite(rate) || rate < 0) rate = base.rate;
  let start = validDate(settings?.start) ? settings.start : base.start;
  let end = validDate(settings?.end) ? settings.end : base.end;
  if (start > end) { const swap = start; start = end; end = swap; }
  const out = { rate, start, end };
  try { localStorage.setItem(BILLING_KEY, JSON.stringify(out)); } catch (e) { /* ignore */ }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('myhome-billing-change', { detail: { ...out } }));
  }
  return out;
}

export function billingRangeTimestamps(settings, hass) {
  const tz = tzOf(hass);
  return {
    from: midnight(settings.start, tz),
    to: midnight(addDays(settings.end, 1), tz)
  };
}

export function formatBillingRange(settings) {
  const nowYear = new Date().getFullYear();
  const startYear = new Date(`${settings.start}T12:00:00`).getFullYear();
  const endYear = new Date(`${settings.end}T12:00:00`).getFullYear();
  const includeYear = startYear !== nowYear || endYear !== nowYear;
  const fmt = (day) => new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', ...(includeYear ? { year: 'numeric' } : {})
  }).format(new Date(`${day}T12:00:00`));
  return `${fmt(settings.start)} – ${fmt(settings.end)}`;
}

export function formatPKR(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 'PKR —';
  return `PKR ${Math.round(n).toLocaleString('en-PK')}`;
}

export async function loadBillingEnergy(hass, settings) {
  if (!hass?.callWS) throw new Error('Home Assistant connection unavailable');
  const { from, to } = billingRangeTimestamps(settings, hass);
  const result = await hass.callWS({
    type: 'recorder/statistics_during_period',
    start_time: new Date(from).toISOString(),
    end_time: new Date(to).toISOString(),
    statistic_ids: [IMPORT_SENSOR, EXPORT_SENSOR],
    period: 'day',
    types: ['change'],
    units: { energy: 'kWh' }
  });
  const sum = (id) => {
    const rows = result?.[id];
    if (!Array.isArray(rows) || !rows.length) return null;
    return rows.reduce((total, row) => total + (Number.isFinite(row.change) && row.change > 0 ? row.change : 0), 0);
  };
  const importKwh = sum(IMPORT_SENSOR);
  const exportKwh = sum(EXPORT_SENSOR);
  if (importKwh === null && exportKwh === null) throw new Error('No billing statistics');
  const imported = importKwh ?? 0;
  const exported = exportKwh ?? 0;
  const rate = Number(settings.rate);
  const safeRate = Number.isFinite(rate) && rate >= 0 ? rate : DEFAULT_RATE;
  return {
    importKwh: imported,
    exportKwh: exported,
    cost: (imported + exported) * safeRate,
    rate: safeRate,
    start: settings.start,
    end: settings.end,
    label: formatBillingRange(settings)
  };
}
