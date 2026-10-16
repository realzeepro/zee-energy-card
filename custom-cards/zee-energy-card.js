// Zee Energy Card — mobile dashboard modules for Goodwe solar, cameras, and house sensors.
import "./accent-panels.js";
import "./appearance-presets.js";
import "./energy-components.js?v=3";
import "./energy-overview-controls.js";
import "./energy-overview-core.js";
import "./energy-overview.js";
import "./energy-statistics.js";
import "./energy-health-balance.js";
import "./energy-flow-animation.js";
import "./energy-flow-colours.js";
import "./floating-nav-icons.js";
import "./house-scene-base.js";
import "./house-scene-variant-base.js";
import "./house-scene.js";
import "./house-weather.js";
import "./house-weather-variant.js";
import "./power-metrics.js";
const CSS = `
:host{display:block;font-family:Nunito,ui-rounded,system-ui,sans-serif;color:var(--primary-text-color,#e9edf0);--muted:var(--secondary-text-color,#909a9e);--base:var(--card-background-color,#1b2025);--accent:var(--myhome-accent,#d5ab6c)}
*{box-sizing:border-box}
button{font:inherit;color:inherit;cursor:pointer;background:none;border:0;-webkit-tap-highlight-color:transparent}
button:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
h2,p{margin:0}
.panel{padding:15px;border-radius:22px;background:linear-gradient(125deg,color-mix(in srgb,var(--accent) 8%,var(--base)),color-mix(in srgb,var(--base) 55%,transparent));border:1px solid color-mix(in srgb,var(--accent) 13%,transparent);border-top:2px solid color-mix(in srgb,var(--accent) 32%,transparent)}
.eyebrow{font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);font-weight:750}
.head{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:14px}
h2{font-size:20px;font-weight:680;letter-spacing:-.4px}
.sub{font-size:11px;color:var(--muted)}
.facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.fact{text-align:left;min-height:72px;padding:11px 12px;border-radius:16px;background:linear-gradient(115deg,color-mix(in srgb,var(--base) 78%,transparent),transparent);border:1px solid color-mix(in srgb,var(--primary-text-color) 6%,transparent)}
.fact small{display:block;font-size:10px;color:var(--muted);margin-bottom:6px}
.fact strong{display:block;font-size:18px;font-weight:650;letter-spacing:-.4px;line-height:1.2}
.fact em{display:block;margin-top:4px;font-style:normal;font-size:10px;color:var(--accent)}
.cams{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.cam{position:relative;padding:0;border-radius:16px;overflow:hidden;background:#0d1218;min-height:110px;border:1px solid color-mix(in srgb,var(--accent) 16%,transparent)}
.cam img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block}
.cam span{position:absolute;left:8px;bottom:8px;font-size:11px;font-weight:750;padding:4px 8px;border-radius:999px;background:#000a}
.hero{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
.hero button,.wide{width:100%;text-align:left;border-radius:18px;padding:14px;background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 10%,var(--base)),transparent);border:1px solid color-mix(in srgb,var(--accent) 14%,transparent)}
.kicker{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:750}
.temp{font-size:32px;font-weight:680;letter-spacing:-1px;margin:6px 0 2px}
.meta{font-size:11px;color:var(--muted)}
.chip{display:inline-block;margin-top:8px;padding:3px 8px;border-radius:999px;font-size:10px;font-weight:750;background:color-mix(in srgb,var(--accent) 16%,transparent);color:var(--accent)}
.chip.warn{background:#e07a5f22;color:#e7a090}
.row{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-top:8px}
.toggle{min-width:72px;min-height:40px;border-radius:999px;padding:0 14px;font-size:12px;font-weight:750;background:color-mix(in srgb,var(--primary-text-color) 8%,transparent)}
.toggle.on{background:color-mix(in srgb,var(--accent) 28%,transparent);color:var(--primary-text-color)}
.rings{display:flex;gap:16px;justify-content:space-around;margin:6px 0 14px}
.ring{position:relative;width:104px;height:104px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--accent) calc(var(--p)*1%),color-mix(in srgb,var(--muted) 18%,transparent) 0)}
.ring i{position:absolute;inset:9px;border-radius:50%;background:var(--base)}
.ring b,.ring small{position:relative;z-index:1;grid-area:1/1}
.ring b{font-size:18px;font-weight:700;transform:translateY(-8px)}
.ring small{transform:translateY(14px);font-size:9px;color:var(--muted);letter-spacing:.08em;text-transform:uppercase}
@media(max-width:390px){.cams,.hero,.facts{grid-template-columns:1fr}.temp{font-size:28px}}
`;

const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function stateOf(hass, id) {
  const s = hass?.states?.[id];
  if (!s || ["unknown", "unavailable", "none", ""].includes(s.state)) return null;
  return s;
}

function reading(hass, id, digits) {
  const s = stateOf(hass, id);
  if (!s) return "—";
  const n = Number(s.state);
  const unit = s.attributes?.unit_of_measurement || "";
  if (!Number.isFinite(n)) return s.state;
  const dp = digits ?? (Math.abs(n) >= 100 ? 0 : 1);
  return `${n.toFixed(dp)}${unit ? " " + unit : ""}`;
}

function picture(hass, id) {
  return stateOf(hass, id)?.attributes?.entity_picture || "";
}

class ZeePage extends HTMLElement {
  setConfig(config) {
    this.config = config;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
  }
  set hass(hass) {
    this._hass = hass;
    this.render();
  }
  getCardSize() { return 6; }
  getGridOptions() { return { columns: "full", rows: "auto" }; }
  more(id) {
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true }));
  }
  shell(title, eyebrow, body) {
    this.shadowRoot.innerHTML = `<style>${CSS}</style><section class="panel"><div class="head"><div><div class="eyebrow">${esc(eyebrow)}</div><h2>${esc(title)}</h2></div></div>${body}</section>`;
  }
}

class ZeeMetrics extends ZeePage {
  render() {
    if (!this.config || !this._hass) return;
    const items = this.config.items || [];
    this.shell(this.config.title || "Metrics", this.config.eyebrow || "Energy", `<div class="facts">${items.map((item) => `<button class="fact" data-id="${esc(item.entity)}"><small>${esc(item.name)}</small><strong>${esc(reading(this._hass, item.entity, item.digits))}</strong></button>`).join("")}</div>`);
    this.shadowRoot.querySelectorAll("[data-id]").forEach((button) => { button.onclick = () => this.more(button.dataset.id); });
  }
}

class ZeeCameras extends ZeePage {
  render() {
    if (!this._hass) return;
    const cams = this.config?.cameras || [
      ["camera.embedded_net_dvr_channel_1", "Camera 1"],
      ["camera.embedded_net_dvr_channel_2", "Camera 2"],
      ["camera.embedded_net_dvr_channel_3", "Camera 3"],
      ["camera.embedded_net_dvr_channel_4", "Camera 4"],
    ];
    this.shell("Cameras", "Security", `<div class="cams">${cams.map(([id, name]) => {
      const src = picture(this._hass, id);
      return `<button class="cam" data-id="${esc(id)}" aria-label="${esc(name)}">${src ? `<img alt="" src="${esc(src)}">` : ""}<span>${esc(name)}</span></button>`;
    }).join("")}</div>`);
    this.shadowRoot.querySelectorAll("[data-id]").forEach((button) => { button.onclick = () => this.more(button.dataset.id); });
  }
}

class ZeeAppliances extends ZeePage {
  render() {
    if (!this._hass) return;
    const h = this._hass;
    const door = (id) => { const s = stateOf(h, id); if (!s) return ["—", false]; return [s.state === "on" ? "Open" : "Closed", s.state === "on"]; };
    const [fridgeDoor, fridgeOpen] = door("binary_sensor.zee_refrigerator_fridge_door");
    const [freezerDoor, freezerOpen] = door("binary_sensor.zee_refrigerator_freezer_door");
    const heating = stateOf(h, "binary_sensor.151732606824523_heating");
    const plug = stateOf(h, "switch.ac_smart_plug_socket_1");
    const plugOn = plug?.state === "on";
    this.shell("Appliances", "House", `
      <div class="hero">
        <button data-id="sensor.zee_refrigerator_fridge_temperature"><div class="kicker">Fridge</div><div class="temp">${esc(reading(h, "sensor.zee_refrigerator_fridge_temperature", 1))}</div><div class="meta">Target ${esc(reading(h, "sensor.zee_refrigerator_fridge_target_temperature", 1))}</div><span class="chip${fridgeOpen ? " warn" : ""}">${esc(fridgeDoor)}</span></button>
        <button data-id="sensor.zee_refrigerator_freezer_temperature"><div class="kicker">Freezer</div><div class="temp">${esc(reading(h, "sensor.zee_refrigerator_freezer_temperature", 1))}</div><div class="meta">Target ${esc(reading(h, "sensor.zee_refrigerator_freezer_target_temperature", 1))}</div><span class="chip${freezerOpen ? " warn" : ""}">${esc(freezerDoor)}</span></button>
      </div>
      <button class="wide" data-id="water_heater.151732606824523_water_heater">
        <div class="kicker">Water heater</div>
        <div class="temp">${esc(reading(h, "sensor.151732606824523_current_temperature", 1))}</div>
        <div class="meta">${esc(reading(h, "sensor.151732606824523_heating_power", 0))} · ${esc(reading(h, "sensor.151732606824523_water_consumption", 1))} used</div>
        <span class="chip${heating?.state === "on" ? "" : ""}">${heating?.state === "on" ? "Heating" : "Idle"}${stateOf(h, "sensor.151732606824523_heating_time_remaining") ? " · " + esc(reading(h, "sensor.151732606824523_heating_time_remaining", 0)) : ""}</span>
      </button>
      <div class="wide" style="margin-top:8px">
        <div class="row"><div><div class="kicker">AC plug</div><div class="temp" style="font-size:26px">${esc(reading(h, "sensor.ac_smart_plug_power", 0))}</div><div class="meta">${esc(reading(h, "sensor.ac_smart_plug_voltage", 0))} · ${esc(reading(h, "sensor.ac_smart_plug_current", 2))}</div></div><button class="toggle${plugOn ? " on" : ""}" id="plug">${plugOn ? "On" : "Off"}</button></div>
      </div>`);
    this.shadowRoot.querySelectorAll("[data-id]").forEach((button) => { button.onclick = () => this.more(button.dataset.id); });
    const toggle = this.shadowRoot.querySelector("#plug");
    if (toggle) toggle.onclick = (event) => { event.stopPropagation(); h.callService("switch", "toggle", { entity_id: "switch.ac_smart_plug_socket_1" }); };
  }
}

class ZeeClimate extends ZeePage {
  room(name, temp, humidity, battery) {
    const h = this._hass;
    const level = stateOf(h, battery);
    const n = level ? Number(level.state) : null;
    return `<button data-id="${esc(temp)}"><div class="kicker">${esc(name)}</div><div class="temp">${esc(reading(h, temp, 1))}</div><div class="meta">${esc(reading(h, humidity, 0))} humidity</div><span class="chip">Battery ${n === null || Number.isNaN(n) ? "—" : Math.round(n) + "%"}</span></button>`;
  }
  render() {
    if (!this._hass) return;
    this.shell("Climate", "Rooms", `<div class="hero">${this.room("Room 1", "sensor.temperature_sensor_temperature", "sensor.temperature_sensor_humidity", "sensor.temperature_sensor_battery")}${this.room("Room 2", "sensor.temperature_sensor_2_temperature", "sensor.temperature_sensor_2_humidity", "sensor.temperature_sensor_2_battery")}</div>`);
    this.shadowRoot.querySelectorAll("[data-id]").forEach((button) => { button.onclick = () => this.more(button.dataset.id); });
  }
}

class ZeeSystem extends ZeePage {
  percent(id) {
    const s = stateOf(this._hass, id);
    const n = s ? Number(s.state) : null;
    if (n === null || Number.isNaN(n)) return null;
    return Math.max(0, Math.min(100, n));
  }
  facts(items) {
    return `<div class="facts">${items.map(([name, id, digits]) => `<button class="fact" data-id="${esc(id)}"><small>${esc(name)}</small><strong>${esc(reading(this._hass, id, digits))}</strong></button>`).join("")}</div>`;
  }
  render() {
    if (!this._hass) return;
    const cpu = this.percent("sensor.localhost_cpu_usage");
    const mem = this.percent("sensor.localhost_memory_usage");
    const ring = (value, label) => `<div class="ring" style="--p:${value ?? 0}"><i></i><b>${value === null ? "—" : Math.round(value) + "%"}</b><small>${label}</small></div>`;
    this.shell("System", "Goodwe / host", `
      <div class="rings">${ring(cpu, "CPU")}${ring(mem, "Memory")}</div>
      <p class="sub" style="margin:0 2px 10px">Inverter</p>
      ${this.facts([
        ["Work mode", "sensor.goodwe_work_mode"],
        ["Status", "sensor.goodwe_diag_status"],
        ["Air temp", "sensor.goodwe_inverter_temperature_air", 1],
        ["Radiator", "sensor.goodwe_inverter_temperature_radiator", 1],
        ["Grid voltage", "sensor.goodwe_on_grid_l1_voltage", 1],
        ["Frequency", "sensor.goodwe_on_grid_l1_frequency", 2],
        ["Backup voltage", "sensor.goodwe_back_up_l1_voltage", 1],
        ["Running hours", "sensor.goodwe_hours_total", 0],
        ["Export limit", "number.goodwe_grid_export_limit", 0],
        ["DoD on grid", "number.goodwe_depth_of_discharge_on_grid", 0],
      ])}
      <p class="sub" style="margin:14px 2px 10px">Home Assistant host</p>
      ${this.facts([
        ["Uptime", "sensor.localhost_uptime", 0],
        ["Disk", "sensor.localhost_etc_hostname_disk_usage", 0],
        ["Core 0", "sensor.localhost_core_0_temperature", 1],
        ["Core 1", "sensor.localhost_core_1_temperature", 1],
        ["Package", "sensor.localhost_package_id_0_temperature", 1],
        ["Errors", "sensor.goodwe_errors"],
        ["Ethernet RX", "sensor.localhost_eth0_rx", 1],
        ["Ethernet TX", "sensor.localhost_eth0_tx", 1],
      ])}`);
    this.shadowRoot.querySelectorAll("[data-id]").forEach((button) => { button.onclick = () => this.more(button.dataset.id); });
  }
}

const tags = [
  ["zee-metric-board", ZeeMetrics],
  ["zee-cameras", ZeeCameras],
  ["zee-appliances", ZeeAppliances],
  ["zee-climate", ZeeClimate],
  ["zee-system", ZeeSystem],
];
for (const [tag, cls] of tags) {
  if (!customElements.get(tag)) customElements.define(tag, cls);
}
