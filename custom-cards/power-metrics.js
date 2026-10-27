import { getBillingSettings } from './billing-settings.js?v=1';

const PM_SERIES = [
  ['solar', 'Solar', '#f3cf67', 'sensor.goodwe_pv_power'],
  ['battery', 'Battery', '#61d7bf', 'sensor.goodwe_battery_power'],
  ['load', 'Load', '#ca88f7', 'sensor.goodwe_house_consumption'],
  ['grid', 'Grid', '#849dff', 'sensor.goodwe_active_power'],
  ['forecast', 'Forecast', '#b5d8e0', null],
  ['soc', 'SOC', '#f472b6', 'sensor.goodwe_battery_state_of_charge']
];

const pad = (n) => String(n).padStart(2, '0');

class MyHomePowerMetricsV4 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.enabled = new Set(PM_SERIES.map((s) => s[0]));
    this.rows = {};
    this.at = 0;
    this.seq = 0;
    this.periodFrom = null;
    this.periodTo = null;
    this.periodMode = '';
    this.queryPeriod = '5minute';
    this._loadedKey = '';
    this.built = false;
    this.visible = false;
    this.pending = false;
    this.mode = 'day';
    this.date = '';
    this.customStart = '';
    this.customEnd = '';
    this._periodDetail = null;
  }

  setConfig(c) {
    this.config = c;
    if (this.built) return;
    this.built = true;
    this.shadowRoot.innerHTML = `<style>
      :host{display:block;color:var(--primary-text-color,#ecf0f8);font-family:var(--primary-font-family,system-ui)}
      *{box-sizing:border-box}
      .panel{border-radius:24px;padding:20px 16px 16px;background:radial-gradient(ellipse at 0 0,#61d7bf12,transparent 70%),linear-gradient(125deg,color-mix(in srgb,var(--card-background-color,#1b2430) 85%,transparent),color-mix(in srgb,var(--card-background-color,#1b2430) 25%,transparent));border:1px solid #ffffff0b}
      header{display:flex;justify-content:space-between;align-items:center;gap:8px}
      h2{font-size:17px;margin:0}
      .head-actions{display:flex;align-items:center;gap:8px}
      small,.date,.signs,.sun,.status{color:var(--secondary-text-color,#9ca9b8);font-size:11px}
      .date{margin-top:5px}
      .controls{display:flex;align-items:center;gap:8px;margin:10px 0 4px}
      .datebar{display:flex;align-items:center;flex:1;min-width:0;background:#0002;border-radius:12px}
      .datebar[hidden]{display:none}
      .datebar button{width:36px;min-height:42px;border:0;background:none;font-size:20px;padding:0}
      .datebar button:disabled{opacity:.2;cursor:default}
      .datebar label{position:relative;display:flex;justify-content:center;align-items:center;flex:1;min-height:42px;font-size:11px;font-weight:600}
      .datebar input{position:absolute;inset:0;width:100%;opacity:0;cursor:pointer}
      select{min-height:42px;width:98px;border:1px solid #ffffff0b;background:var(--card-background-color,#19232c);border-radius:12px;padding:0 9px;font-size:12px;color:inherit}
      .custombar{display:flex;gap:6px;margin:0 0 6px}
      .custombar[hidden]{display:none}
      .custombar label{flex:1;display:flex;flex-direction:column;gap:4px;min-width:0;font-size:10px;color:var(--secondary-text-color)}
      .custombar input{width:100%;min-height:40px;border:1px solid #ffffff0b;background:var(--card-background-color,#19232c);border-radius:12px;padding:0 8px;font-size:11px;color:inherit}
      .refresh{width:40px;min-height:40px;border:1px solid #ffffff0b;border-radius:12px;background:#ffffff05;color:var(--secondary-text-color);font-size:17px;padding:0}
      .legend{display:flex;flex-wrap:wrap;gap:4px;margin:15px 0 6px}
      button{font:inherit;cursor:pointer;min-height:40px;border:1px solid transparent;border-radius:12px;background:transparent;color:var(--secondary-text-color,#9ca9b8);padding:6px 9px;font-size:12px}
      button[aria-pressed=true]{color:var(--primary-text-color,#fff);background:color-mix(in srgb,var(--c) 12%,transparent);border-color:color-mix(in srgb,var(--c) 20%,transparent)}
      button[aria-pressed=false]{opacity:.45}
      button:focus-visible{outline:2px solid var(--c,#61d7bf)}
      i{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--c);margin-right:6px}
      .chart{width:100%;display:block;touch-action:pan-y;overflow:visible}
      .chart text{font:15px system-ui;fill:var(--secondary-text-color,#9ca9b8)}
      .sun{display:flex;justify-content:space-between;background:#ffffff04;padding:10px;border-radius:12px;margin-top:4px}
      .values{display:flex;flex-wrap:wrap;gap:8px 15px;min-height:47px;margin-top:14px;font-size:11px}
      .values b{font-size:13px;font-weight:600}
      .values span{display:flex;flex-direction:column;gap:3px}
      .signs{font-size:10px;line-height:1.7;margin-top:7px}
      .status{font-size:11px;color:var(--secondary-text-color);margin-top:6px}
    </style>
    <section class="panel">
      <header><h2>Power metrics</h2><div class="head-actions"><small>kW · SOC %</small><button class="refresh" id="refresh" type="button" aria-label="Refresh power metrics">↻</button></div></header>
      <div class="controls"><div class="datebar"><button data-step="-1" type="button" aria-label="Previous period">‹</button><label><span id="date-label"></span><input type="date" id="date-input" aria-label="Choose date"></label><button data-step="1" type="button" aria-label="Next period">›</button></div><select id="period-select" aria-label="Power metrics period">${[['day','Day'],['week','Week'],['month','Month'],['year','Year'],['total','Lifetime'],['custom','Custom']].map(([v,n])=>`<option value="${v}">${n}</option>`).join('')}</select></div>
      <div class="custombar" hidden><label>From<input type="date" id="custom-start"></label><label>To<input type="date" id="custom-end"></label></div>
      <div class="date" id="range-label"></div>
      <div class="legend">${PM_SERIES.map(s=>`<button data-key="${s[0]}" style="--c:${s[2]}" aria-pressed="true"><i></i>${s[1]}</button>`).join('')}</div>
      <svg class="chart" viewBox="0 0 560 290" role="img" aria-label="Solar, battery, load, grid, forecast power and battery state of charge"></svg>
      <div class="sun"></div>
      <div class="values"></div>
      <div class="signs">Battery: + discharge / − charge · Grid: + import / − export · Load: − use · SOC: battery state of charge</div>
      <div class="status"></div>
    </section>`;

    this.shadowRoot.querySelectorAll('button[data-key]').forEach((b) => {
      b.onclick = () => {
        const k = b.dataset.key;
        this.enabled.has(k) ? this.enabled.delete(k) : this.enabled.add(k);
        this.render();
      };
    });
    this.shadowRoot.querySelector('#refresh').onclick = () => {
      this.at = 0;
      this._loadedKey = '';
      this.load();
    };
    this.shadowRoot.querySelector('#period-select').onchange = (e) => {
      this.applyPeriod(e.target.value, this.date, this.customStart, this.customEnd);
    };
    this.shadowRoot.querySelector('#date-input').onchange = (e) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(e.target.value)) {
        this.applyPeriod(this.mode, e.target.value, this.customStart, this.customEnd);
      }
    };
    const cs = this.shadowRoot.querySelector('#custom-start');
    const ce = this.shadowRoot.querySelector('#custom-end');
    cs.onchange = (e) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(e.target.value)) return;
      this.customStart = e.target.value;
      if (this.customStart > this.customEnd) this.customEnd = this.customStart;
      this.applyPeriod('custom', this.date, this.customStart, this.customEnd);
    };
    ce.onchange = (e) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(e.target.value)) return;
      this.customEnd = e.target.value;
      if (this.customEnd < this.customStart) this.customStart = this.customEnd;
      this.applyPeriod('custom', this.date, this.customStart, this.customEnd);
    };
    this.shadowRoot.querySelectorAll('[data-step]').forEach((b) => {
      b.onclick = () => this.step(Number(b.dataset.step));
    });
    const svg = this.shadowRoot.querySelector('svg');
    svg.onclick = (e) => this.inspect(e);
    svg.onpointermove = (e) => { if (e.pointerType === 'mouse') this.inspect(e); };
    svg.onpointerleave = () => {
      this.cursor = null;
      this.values();
      this.shadowRoot.querySelector('#cursor')?.setAttribute('visibility', 'hidden');
    };
    if (!this.date) this.date = this.today();
    if (!this.customStart || !this.customEnd) {
      const billing = getBillingSettings(this.h);
      this.customStart = billing.start;
      this.customEnd = billing.end;
    }
    this.applyPeriod(this.mode, this.date, this.customStart, this.customEnd, { broadcast: true, load: false });
  }

  connectedCallback() {
    this.io = new IntersectionObserver((es) => {
      this.visible = es[0].isIntersecting;
      if (this.visible) {
        this.render();
        this.load();
      }
    }, { rootMargin: '100px' });
    this.io.observe(this);
    if (!this.date) this.date = this.today();
    if (!this.customStart || !this.customEnd) {
      const billing = getBillingSettings(this.h);
      this.customStart = billing.start;
      this.customEnd = billing.end;
    }
    const stored = window.__myhomeEnergyPeriod;
    if (stored && stored.mode) {
      this.applyPeriod(stored.mode, stored.date || this.date, stored.customStart || this.customStart, stored.customEnd || this.customEnd, { broadcast: true, load: false });
    } else {
      this.applyPeriod(this.mode, this.date, this.customStart, this.customEnd, { broadcast: true, load: false });
    }
  }

  disconnectedCallback() {
    this.io?.disconnect();
  }

  set hass(h) {
    this.h = h;
    if (this.visible) this.load();
  }

  getCardSize() { return 8; }
  getGridOptions() { return { columns: 'full', rows: 'auto' }; }

  tz() { return this.h?.config?.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; }

  dateParts(time) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: this.tz(), year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date(time));
    const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
    return { y: +p.year, m: +p.month, d: +p.day };
  }

  today() {
    const { y, m, d } = this.dateParts(Date.now());
    return `${y}-${pad(m)}-${pad(d)}`;
  }

  addDays(day, days) {
    const [y, m, d] = day.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
  }

  addMonths(day, months) {
    const [y, m, d] = day.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1 + months, d)).toISOString().slice(0, 10);
  }

  addYears(day, years) {
    const [y, m, d] = day.split('-').map(Number);
    return new Date(Date.UTC(y + years, m - 1, d)).toISOString().slice(0, 10);
  }

  midnight(day) {
    const [y, m, d] = day.split('-').map(Number);
    const target = Date.UTC(y, m - 1, d);
    let t = target;
    for (let i = 0; i < 3; i += 1) {
      const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
        timeZone: this.tz(), year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
      }).formatToParts(new Date(t)).map((x) => [x.type, x.value]));
      t += target - Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    }
    return t;
  }

  boundsFor(mode, date, customStart, customEnd) {
    if (mode === 'total') {
      return { start: '1970-01-01', end: this.today(), period: 'month', from: 0, to: Date.now() };
    }
    if (mode === 'custom') {
      let start = customStart || date;
      let end = customEnd || date;
      if (start > end) { const swap = start; start = end; end = swap; }
      const days = Math.max(1, Math.round((this.midnight(end) - this.midnight(start)) / 86400000) + 1);
      const period = days <= 62 ? 'hour' : days <= 730 ? 'day' : 'month';
      return { start, end: this.addDays(end, 1), period, from: this.midnight(start), to: this.midnight(this.addDays(end, 1)) };
    }
    let start = date;
    let end;
    let period = 'hour';
    if (mode === 'day') {
      end = this.addDays(start, 1);
    } else if (mode === 'week') {
      const wd = new Date(`${start}T12:00:00Z`).getUTCDay();
      start = this.addDays(start, -((wd + 6) % 7));
      end = this.addDays(start, 7);
    } else if (mode === 'month') {
      start = `${start.slice(0, 7)}-01`;
      end = this.addMonths(start, 1);
    } else {
      start = `${start.slice(0, 4)}-01-01`;
      end = this.addYears(start, 1);
      period = 'day';
    }
    return { start, end, period, from: this.midnight(start), to: this.midnight(end) };
  }

  applyPeriod(mode, date, customStart, customEnd, options = {}) {
    if (!this.built) return;
    const broadcast = options.broadcast !== false;
    const load = options.load !== false;
    mode = ['day', 'week', 'month', 'year', 'total', 'custom'].includes(mode) ? mode : 'day';
    date = date || this.today();
    customStart = customStart || date;
    customEnd = customEnd || date;
    const b = this.boundsFor(mode, date, customStart, customEnd);
    this.mode = mode;
    this.date = date;
    this.customStart = customStart;
    this.customEnd = customEnd;
    this._periodDetail = { ...b, mode, date, customStart, customEnd };
    this.periodFrom = b.from;
    this.periodTo = b.to;
    this.periodMode = mode;
    this.seq += 1;
    this.pending = false;
    this.rows = {};
    this.at = 0;
    this._loadedKey = '';
    this.start = b.from;
    this.end = b.to;
    this.updateControls();
    this.render();
    if (broadcast) this.broadcast();
    if (load && this.visible) this.load();
  }

  updateControls() {
    const r = this.shadowRoot;
    if (!r) return;
    r.querySelector('#period-select').value = this.mode;
    r.querySelector('#date-input').value = this.date;
    r.querySelector('#date-input').max = this.today();
    r.querySelector('#custom-start').value = this.customStart;
    r.querySelector('#custom-end').value = this.customEnd;
    r.querySelector('#custom-start').max = this.customEnd || this.today();
    r.querySelector('#custom-end').max = this.today();
    r.querySelector('.datebar').hidden = this.mode === 'total' || this.mode === 'custom';
    r.querySelector('.custombar').hidden = this.mode !== 'custom';
    r.querySelector('#date-label').textContent = this.fmt(this.midnight(this.date), { day: 'numeric', month: 'short', year: 'numeric' });
    const next = r.querySelector('[data-step="1"]');
    if (next) next.disabled = this._periodDetail.to > Date.now();
  }

  broadcast() {
    if (!this._periodDetail) return;
    const detail = { ...this._periodDetail };
    window.__myhomeEnergyPeriod = detail;
    window.dispatchEvent(new CustomEvent('myhome-energy-period', { detail }));
  }

  step(n) {
    if (this.mode === 'total') return;
    if (this.mode === 'custom') {
      const days = Math.max(1, Math.round((this._periodDetail.to - this._periodDetail.from) / 86400000));
      this.applyPeriod('custom', this.date, this.addDays(this.customStart, days * n), this.addDays(this.customEnd, days * n));
      return;
    }
    let date = this.date;
    if (this.mode === 'day') date = this.addDays(date, n);
    else if (this.mode === 'week') date = this.addDays(date, 7 * n);
    else if (this.mode === 'month') date = this.addMonths(date, n);
    else date = this.addYears(date, n);
    this.applyPeriod(this.mode, date, this.customStart, this.customEnd);
  }

  fmt(t, options) {
    return new Intl.DateTimeFormat('en-GB', { timeZone: this.tz(), ...options }).format(new Date(t));
  }

  time(t) {
    return new Intl.DateTimeFormat('en-GB', { timeZone: this.tz(), hour: '2-digit', minute: '2-digit' }).format(t);
  }

  periodText() {
    const start = this.start;
    const end = this.end;
    if (!Number.isFinite(start) || !Number.isFinite(end)) return 'Selected period';
    const a = start;
    const b = Math.max(start, end - 1);
    const span = end - start;
    if (span <= 86400000) return this.fmt(a, { weekday: 'short', day: 'numeric', month: 'short' });
    if (span <= 90 * 86400000) {
      const opts = this.mode === 'custom' ? { day: 'numeric', month: 'short', year: 'numeric' } : { day: 'numeric', month: 'short' };
      return `${this.fmt(a, opts)} – ${this.fmt(b, opts)}`;
    }
    if (span <= 730 * 86400000) return `${this.fmt(a, { month: 'short', year: 'numeric' })} – ${this.fmt(b, { month: 'short', year: 'numeric' })}`;
    return `${this.fmt(a, { year: 'numeric' })} – ${this.fmt(b, { year: 'numeric' })}`;
  }

  axisLabel(t) {
    const span = this.end - this.start;
    if (span <= 86400000) return this.time(t);
    if (span <= 90 * 86400000) return this.fmt(t, { day: 'numeric', month: 'short' });
    if (span <= 730 * 86400000) return this.fmt(t, { month: 'short', year: '2-digit' });
    return this.fmt(t, { year: 'numeric' });
  }

  chartGap() {
    return this.queryPeriod === '5minute' ? 900000 : this.queryPeriod === 'hour' ? 3600000 : this.queryPeriod === 'day' ? 36 * 3600000 : 32 * 86400000;
  }

  forecast() { return []; }

  async load() {
    if (!this.h || this.pending || !this.visible) return;
    const start = this.periodFrom ?? this.midnight(this.today());
    const end = this.periodTo ?? start + 86400000;
    const key = `${start}|${end}`;
    if (this._loadedKey === key && Date.now() - this.at < 300000) return;
    this.start = start;
    this.end = end;
    const span = end - start;
    const statsPeriod = span <= 2 * 86400000 ? '5minute' : span <= 62 * 86400000 ? 'hour' : span <= 730 * 86400000 ? 'day' : 'month';
    this.queryPeriod = statsPeriod;
    const seq = ++this.seq;
    this.pending = true;
    try {
      const data = await this.h.callWS({
        type: 'recorder/statistics_during_period',
        start_time: new Date(start).toISOString(),
        end_time: new Date(Math.min(end, Date.now())).toISOString(),
        statistic_ids: PM_SERIES.filter((s) => s[3]).map((s) => s[3]),
        period: statsPeriod,
        types: ['mean'],
        units: { power: 'kW' }
      });
      if (seq !== this.seq || !this.isConnected) return;
      this.rows = {};
      for (const s of PM_SERIES.filter((s) => s[3])) {
        this.rows[s[0]] = (data[s[3]] || [])
          .filter((p) => Number.isFinite(p.mean))
          .map((p) => ({ t: Number(p.start), v: (s[0] === 'load' || s[0] === 'grid') ? -p.mean : p.mean }));
      }
      this.error = '';
      this._loadedKey = key;
    } catch (e) {
      if (seq !== this.seq) return;
      this.error = 'Power history unavailable for this period';
      this._loadedKey = key;
    } finally {
      if (seq === this.seq) {
        this.at = Date.now();
        this.pending = false;
        this.render();
      }
    }
  }

  sunTimes() {
    const cfg = this.h.config || {};
    const lat = Number(cfg.latitude);
    const lon = Number(cfg.longitude);
    const date = new Date((this.start + this.end) / 2);
    const calc = (rise) => {
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
      const rad = Math.PI / 180;
      const sin = (x) => Math.sin(x * rad);
      const cos = (x) => Math.cos(x * rad);
      const norm = (x) => (x % 360 + 360) % 360;
      const N = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - Date.UTC(date.getUTCFullYear(), 0, 0)) / 86400000);
      const t = N + ((rise ? 6 : 18) - lon / 15) / 24;
      const M = 0.9856 * t - 3.289;
      const L = norm(M + 1.916 * sin(M) + 0.020 * sin(2 * M) + 282.634);
      let RA = norm(Math.atan(0.91764 * Math.tan(L * rad)) / rad);
      RA = (RA + Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90) / 15;
      const sd = 0.39782 * sin(L);
      const cd = Math.cos(Math.asin(sd));
      const ch = (cos(90.833) - sd * sin(lat)) / (cd * cos(lat));
      if (Math.abs(ch) > 1) return null;
      const H = (rise ? 360 - Math.acos(ch) / rad : Math.acos(ch) / rad) / 15;
      const T = H + RA - 0.06571 * t - 6.622;
      const UT = ((T - lon / 15) % 24 + 24) % 24;
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) + UT * 3600000;
    };
    return ['rising', 'setting'].map((k, i) => {
      const t = Date.parse(this.h.states['sun.sun']?.attributes[`next_${k}`]);
      return t >= this.start && t < this.end ? { t, approx: false } : { t: calc(i === 0), approx: true };
    });
  }

  render() {
    if (!this.built || !this.h) return;
    const r = this.shadowRoot;
    r.querySelector('#range-label').textContent = this.periodText();
    this.rows.forecast = this.forecast();
    r.querySelectorAll('button[data-key]').forEach((b) => b.setAttribute('aria-pressed', this.enabled.has(b.dataset.key)));
    const active = PM_SERIES.filter((s) => s[0] !== 'soc' && this.enabled.has(s[0]));
    const socOn = this.enabled.has('soc');
    const vals = active.flatMap((s) => (this.rows[s[0]] || []).map((p) => p.v));
    const lo = Math.floor(Math.min(0, ...vals));
    const hi = Math.ceil(Math.max(0.5, ...vals));
    const pad = (hi - lo) * 0.12;
    const min = lo - pad;
    const max = hi + pad;
    const X = (t) => 44 + (t - this.start) / (this.end - this.start) * 464;
    const Y = (v) => 249 - (v - min) / (max - min) * 218;
    const YSoc = (v) => 249 - Math.max(0, Math.min(100, v)) / 100 * 218;
    this.scale = { X, Y };
    const path = (ps, fn = Y) => ps.map((p, i) => `${i ? 'L' : 'M'}${X(p.t).toFixed(2)},${fn(p.v).toFixed(2)}`).join(' ');
    let out = '<defs><clipPath id="clip"><rect x="44" y="28" width="464" height="222"/></clipPath></defs>';
    for (let i = 0; i < 5; i += 1) {
      const v = lo + (hi - lo) * i / 4;
      out += `<path d="M44 ${Y(v)}H508" stroke="currentColor" opacity=".08" stroke-dasharray="2 5"/><text x="35" y="${Y(v) + 4}" text-anchor="end">${v.toFixed(1)}</text>`;
    }
    out += `<path d="M44 ${Y(0)}H508" stroke="currentColor" opacity=".22"/>`;
    for (let i = 0; i < 5; i += 1) {
      const t = this.start + (this.end - this.start) * i / 4;
      out += `<text x="${44 + 464 * i / 4}" y="276" text-anchor="${i === 0 ? 'start' : i === 4 ? 'end' : 'middle'}">${i === 4 && this.end - this.start <= 86400000 ? '24:00' : this.axisLabel(t)}</text>`;
    }
    if (socOn) {
      for (let i = 0; i <= 4; i += 1) {
        const v = i * 25;
        const y = YSoc(v);
        out += `<text x="516" y="${y + 3}" style="font-size:10px" text-anchor="start">${v}</text>`;
      }
      out += '<text x="516" y="17" style="font-size:9px;letter-spacing:.08em" text-anchor="start">SOC %</text>';
    }
    const multiDay = this.end - this.start > 2 * 86400000;
    const sun = multiDay ? [] : this.sunTimes();
    sun.forEach((s, i) => {
      if (s.t) out += `<path d="M${X(s.t)} 28V249" stroke="#e7c477" opacity=".35" stroke-dasharray="3 6"/><text x="${X(s.t)}" y="17" text-anchor="middle">${i ? '↓' : '↑'} ${this.time(s.t)}</text>`;
    });
    out += '<g clip-path="url(#clip)">';
    for (const s of active) {
      const chunks = this.chunks(this.rows[s[0]] || []);
      for (const ch of chunks) {
        if (s[0] !== 'forecast' && ch.length > 1) {
          out += `<path data-fill="${s[0]}" d="${path(ch)} L${X(ch.at(-1).t).toFixed(2)},${Y(0).toFixed(2)} L${X(ch[0].t).toFixed(2)},${Y(0).toFixed(2)}Z" fill="${s[2]}" fill-opacity=".22"/>`;
        }
        out += `<path data-series="${s[0]}" d="${path(ch)}" fill="none" stroke="${s[2]}" stroke-width="${s[0] === 'forecast' ? 2 : 2.3}" ${s[0] === 'forecast' ? 'stroke-dasharray="5 5"' : ''} stroke-linejoin="round" stroke-linecap="round"/>`;
      }
    }
    if (socOn) {
      const chunks = this.chunks(this.rows.soc || []);
      for (const ch of chunks) {
        out += `<path data-series="soc" d="${path(ch, YSoc)}" fill="none" stroke="#f472b6" stroke-width="2" stroke-dasharray="5 4" stroke-linejoin="round" stroke-linecap="round" opacity=".95"/>`;
      }
    }
    out += '</g><path id="cursor" visibility="hidden" stroke="currentColor" opacity=".4" stroke-dasharray="3 4"/>';
    r.querySelector('svg').innerHTML = out;
    const sunEl = r.querySelector('.sun');
    sunEl.style.display = multiDay ? 'none' : '';
    sunEl.innerHTML = multiDay ? '' : sun.map((s, i) => `<span>${i ? 'Sunset' : 'Sunrise'} ${s.t ? (s.approx ? '≈ ' : '') + this.time(s.t) : '—'}</span>`).join('');
    r.querySelector('.status').textContent = this.error || (!this.enabled.size ? 'All series hidden' : '');
    this.cursor = null;
    this.values();
  }

  chunks(ps) {
    const chunks = [];
    for (const p of ps) {
      if (!chunks.length || p.t - chunks.at(-1).at(-1).t > this.chartGap()) chunks.push([]);
      chunks.at(-1).push(p);
    }
    return chunks;
  }

  values() {
    const r = this.shadowRoot;
    const t = this.cursor ?? Math.min(Date.now(), this.end - 1);
    const tol = this.queryPeriod === '5minute' ? 900000 : this.queryPeriod === 'hour' ? 3600000 : this.queryPeriod === 'day' ? 26 * 3600000 : 32 * 86400000;
    r.querySelector('.values').innerHTML = PM_SERIES.filter((s) => this.enabled.has(s[0])).map((s) => {
      const ps = this.rows[s[0]] || [];
      const p = ps.length ? (this.cursor ? ps.reduce((a, b) => Math.abs(a.t - t) < Math.abs(b.t - t) ? a : b) : ps.at(-1)) : null;
      const v = p && (!this.cursor || Math.abs(p.t - t) < tol) ? p.v : null;
      const text = v == null ? '—' : s[0] === 'soc' ? `${Math.round(v)}%` : `${v.toFixed(2)} kW`;
      return `<span style="color:${s[2]}">${s[1]}<b>${text}</b></span>`;
    }).join('');
    r.querySelector('#range-label').textContent = this.cursor
      ? (this.end - this.start <= 86400000 ? this.time(t) : this.fmt(t, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))
      : this.periodText();
  }

  inspect(e) {
    if (!this.scale) return;
    const svg = this.shadowRoot.querySelector('svg');
    const b = svg.getBoundingClientRect();
    const x = Math.max(44, Math.min(508, (e.clientX - b.left) / b.width * 560));
    this.cursor = this.start + (x - 44) / 464 * (this.end - this.start);
    const c = svg.querySelector('#cursor');
    c.setAttribute('visibility', 'visible');
    c.setAttribute('d', `M${x} 28V249`);
    this.values();
  }
}

if (!customElements.get('myhome-power-metrics-v4')) customElements.define('myhome-power-metrics-v4', MyHomePowerMetricsV4);
