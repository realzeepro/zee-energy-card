// Zee Energy Card - mobile dashboard modules for Goodwe solar, cameras, and house sensors.
import "./accent-panels.js";
import "./appearance-presets.js";
import "./energy-components.js?v=15";
import "./energy-overview-controls.js";
import "./energy-overview-core.js";
import "./energy-overview.js";
import "./energy-statistics.js?v=13";
import "./energy-health-balance.js";
import "./energy-flow-animation.js?v=24";
import "./energy-flow-colours.js?v=24";
import "./floating-nav-icons.js?v=14";
import "./house-scene-base.js?v=24";
import "./house-scene-variant-base.js?v=12";
import "./house-scene.js?v=24";
import "./house-weather.js?v=24";
import "./house-weather-variant.js?v=12";
import "./power-metrics.js?v=13";
const CSS = `
:host{display:block;font-family:Nunito,ui-rounded,system-ui,sans-serif;color:var(--primary-text-color,#e9edf0);--muted:var(--secondary-text-color,#909a9e);--base:var(--card-background-color,#1b2025);--accent:var(--myhome-accent,#d5ab6c)}
*{box-sizing:border-box}
button{font:inherit;color:inherit;cursor:pointer;background:none;border:0;-webkit-tap-highlight-color:transparent}
button:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
h2,p{margin:0}
.panel{position:relative;overflow:hidden;padding:15px;border-radius:22px;background:linear-gradient(125deg,color-mix(in srgb,var(--accent) 8%,var(--base)),color-mix(in srgb,var(--base) 55%,transparent));border:1px solid color-mix(in srgb,var(--accent) 13%,transparent);border-top:2px solid color-mix(in srgb,var(--accent) 32%,transparent)}
.banner{position:absolute;z-index:0;left:-20px;right:-10px;top:-28px;height:148px;background:var(--banner) center 30%/cover no-repeat;opacity:.5;pointer-events:none;mask-image:linear-gradient(#000 20%,transparent 92%);-webkit-mask-image:linear-gradient(#000 20%,transparent 92%)}
.head,.hero,.facts,.cams,.wide,.row,.meta,.lightbox{position:relative;z-index:1}
.eyebrow{font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);font-weight:750}
.head{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:14px}.device-thumb{width:54px;height:54px;object-fit:contain;flex:none;margin-left:auto;filter:drop-shadow(0 4px 8px #0004)}@media(max-width:600px){.device-thumb{width:44px;height:44px}}
h2{font-size:20px;font-weight:680;letter-spacing:-.4px}
.sub{font-size:11px;color:var(--muted)}
.facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.facts.compact{gap:6px}
.facts.compact .fact{min-height:64px;padding:9px 8px}
.facts.compact .fact small{font-size:9px;margin-bottom:4px}
.facts.compact .fact strong{font-size:15px}
.plist{display:flex;flex-direction:column;gap:18px}
.psec h3{margin:0 0 2px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);font-weight:750}
.appliances{display:flex;flex-direction:column;gap:12px;margin-top:10px}
.pgroup{padding:8px 12px 2px;border-radius:16px;background:color-mix(in srgb,var(--base) 72%,transparent);border:1px solid color-mix(in srgb,var(--accent) 18%,transparent)}
.phead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:2px}.phead h3{margin:0}.phead-thumb{width:30px;height:30px;object-fit:contain;flex:none;filter:drop-shadow(0 2px 4px #0004)}.psub{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 2px;padding-top:4px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:750}.psub-thumb{width:28px;height:28px;object-fit:contain;flex:none;filter:drop-shadow(0 2px 4px #0004)}
.prow{display:flex;justify-content:space-between;align-items:baseline;gap:16px;width:100%;min-height:34px;padding:7px 0;border-bottom:1px solid color-mix(in srgb,var(--primary-text-color) 8%,transparent);text-align:left}
.prow span{font-size:13px;color:var(--muted)}
.prow strong{font-size:14px;font-weight:650;letter-spacing:-.2px}
.fact{text-align:left;min-height:72px;padding:11px 12px;border-radius:16px;background:linear-gradient(115deg,color-mix(in srgb,var(--base) 78%,transparent),transparent);border:1px solid color-mix(in srgb,var(--primary-text-color) 6%,transparent)}
.fact small{display:block;font-size:10px;color:var(--muted);margin-bottom:6px}
.fact strong{display:block;font-size:18px;font-weight:650;letter-spacing:-.4px;line-height:1.2}
.fact em{display:block;margin-top:4px;font-style:normal;font-size:10px;color:var(--accent)}
.cams{display:grid;grid-template-columns:1fr;gap:8px}
.cam{position:relative;padding:0;border-radius:16px;overflow:hidden;background:#0d1218;min-height:110px;border:1px solid color-mix(in srgb,var(--accent) 16%,transparent)}
.cam img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block}
.cam .cam-label{position:absolute;left:8px;bottom:8px;font-size:11px;font-weight:750;padding:4px 8px;border-radius:999px;background:#000a}
.cam .cam-motion{position:absolute;top:8px;right:8px;display:none;padding:3px 8px;border-radius:999px;background:#e07a5f;color:#fff;font-size:9px;font-weight:750;letter-spacing:.06em;text-transform:uppercase}
.cam.motion{border-color:#e07a5f;box-shadow:0 0 0 1px #e07a5f55,0 0 18px #e07a5f22}
.cam.recent{border-color:#f0b35a88}
.cam.motion .cam-motion,.cam.recent .cam-motion{display:block}
.cam.recent .cam-motion{background:#f0b35a;color:#1b2025}
.cam-status{font-size:10px;color:var(--muted);margin:0 2px 8px;line-height:1.35}
.cam-status.alert{color:#ff8f7a}
.cam-status.recent{color:#f0b35a}
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
.toggle:disabled,.step:disabled,.mode:disabled{opacity:.35;cursor:default}
.stack{display:flex;flex-direction:column;gap:12px}
.modes{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.mode,.step{min-height:40px;border-radius:999px;padding:0 12px;font-size:12px;font-weight:750;background:color-mix(in srgb,var(--primary-text-color) 8%,transparent)}
.mode.on{background:color-mix(in srgb,var(--accent) 28%,transparent)}
.step{width:42px;padding:0;border-radius:50%;font-size:20px}
.stepper{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:8px}
.target{font-size:28px;font-weight:680;letter-spacing:-.6px}
.group{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:750;margin:12px 0 6px}
.lightbox{position:fixed;inset:0;z-index:40;display:flex;flex-direction:column;gap:12px;padding:16px;background:#0b0e12f2}
.lightbox img{width:100%;flex:1;min-height:0;object-fit:contain;background:#000;border-radius:16px}
.cam-actions{display:flex;flex-wrap:wrap;gap:8px;align-self:flex-start}.back{align-self:flex-start;min-height:40px;padding:0 14px;border-radius:999px;font-size:12px;font-weight:750;background:color-mix(in srgb,var(--accent) 22%,transparent)}
.rings{display:flex;gap:16px;justify-content:space-around;margin:6px 0 14px}
.ring{position:relative;width:104px;height:104px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--accent) calc(var(--p)*1%),color-mix(in srgb,var(--muted) 18%,transparent) 0)}
.ring i{position:absolute;inset:9px;border-radius:50%;background:var(--base)}
.ring b,.ring small{position:relative;z-index:1;grid-area:1/1}
.ring b{font-size:18px;font-weight:700;transform:translateY(-8px)}
.ring small{transform:translateY(14px);font-size:9px;color:var(--muted);letter-spacing:.08em;text-transform:uppercase}
.disks{display:grid;gap:8px;margin:8px 0 0}
.disk{padding:11px 12px;border-radius:16px;background:linear-gradient(115deg,color-mix(in srgb,var(--base) 78%,transparent),transparent);border:1px solid color-mix(in srgb,var(--accent) 12%,transparent)}
.disk-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;font-size:11px;color:var(--muted)}
.disk-head span{font-weight:650;color:var(--primary-text-color)}
.disk-head b{font-size:16px;color:var(--disk,#62d9b5);font-weight:700}
.disk-bar{height:8px;border-radius:6px;background:color-mix(in srgb,var(--muted) 12%,transparent);overflow:hidden;margin:8px 0 6px}
.disk-bar i{display:block;height:100%;border-radius:6px;background:var(--disk,#62d9b5);transition:width .3s}
.disk-meta{display:flex;flex-wrap:wrap;gap:3px 12px;font-size:9px;color:var(--muted)}
.disk-meta span{white-space:nowrap}
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

function rawState(hass, id) {
  return hass?.states?.[id] || null;
}

function dead(entity) {
  return !entity || ["unknown", "unavailable", "none", ""].includes(entity.state);
}

function labelOf(mode) {
  return String(mode || "").replace(/_/g, " ");
}

function uptimeText(hass, id) {
  const entity = rawState(hass, id);
  if (!entity || ["unknown", "unavailable", "none", ""].includes(entity.state)) return "—";
  const raw = String(entity.state).trim();
  let seconds = null;
  if (/^\d+(\.\d+)?$/.test(raw)) {
    const num = Number(raw);
    seconds = raw.replace(".", "").length >= 10 || num > 1e9
      ? Math.max(0, Math.floor((Date.now() - (String(Math.trunc(num)).length <= 10 ? num * 1000 : num)) / 1000))
      : num;
  } else {
    const parsed = new Date(raw.replace(/\s+at\s+/i, " ").replace("T", " "));
    if (!Number.isNaN(parsed.getTime())) seconds = Math.max(0, Math.floor((Date.now() - parsed.getTime()) / 1000));
  }
  if (seconds === null) return raw;
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(days)} Days ${pad(hours)} Hours`;
}

function mideaAc(hass) {
  const climates = Object.values(hass?.states || {}).filter((entity) => entity.entity_id.startsWith("climate."));
  const score = (entity) => {
    const blob = `${entity.entity_id} ${entity.attributes?.friendly_name || ""}`.toLowerCase();
    let rank = 0;
    if (blob.includes("midea")) rank += 4;
    if (/\bac\b|air.?cond/.test(blob)) rank += 3;
    if (blob.includes("water")) rank -= 6;
    return rank;
  };
  climates.sort((a, b) => score(b) - score(a));
  return climates[0] || null;
}

const WATER_HEATER = "water_heater.151732606824523_water_heater";

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
  shell(title, eyebrow, body, image, thumb) {
    const banner = image ? `<div class="banner" style="--banner:url('${esc(image)}')"></div>` : "";
    const thumbImg = thumb ? `<img class="device-thumb" src="${esc(thumb)}" alt="">` : "";
    this.shadowRoot.innerHTML = `<style>${CSS}</style><section class="panel">${banner}<div class="head"><div><div class="eyebrow">${esc(eyebrow)}</div><h2>${esc(title)}</h2></div>${thumbImg}</div>${body}</section>`;
  }
}

function paramValue(hass, id, kind) {
  if (kind === "uptime") return uptimeText(hass, id);
  const entity = rawState(hass, id);
  if (!entity || ["unknown", "unavailable", "none", ""].includes(entity.state)) return "—";
  if (kind === "door") return entity.state === "on" ? "Open" : "Closed";
  if (kind === "switch") return entity.state === "on" ? "On" : entity.state === "off" ? "Off" : entity.state;
  if (kind === "text") return entity.state;
  return reading(hass, id, kind);
}

function sensorMatch(hass, test) {
  return Object.values(hass?.states || {}).find((entity) => entity.entity_id.startsWith("sensor.") && test(entity.entity_id.toLowerCase(), (entity.attributes?.friendly_name || "").toLowerCase()));
}

class ZeeLive extends ZeePage {
  rows(items) {
    return items.filter(Boolean).map(([name, id, kind]) => `<button class="prow" type="button" data-id="${esc(id)}"><span>${esc(name)}</span><strong>${esc(paramValue(this._hass, id, kind))}</strong></button>`).join("");
  }
  psub(title, thumb) {
    return `<div class="psub"><span>${esc(title)}</span>${thumb ? `<img class="psub-thumb" src="${esc(thumb)}" alt="">` : ""}</div>`;
  }
  block(title, items, sub, thumb) {
    const body = this.rows(items);
    if (!body) return "";
    const tag = sub ? "pgroup" : "psec";
    const heading = sub ? this.psub(title, thumb) : `<div class="phead"><h3>${esc(title)}</h3>${thumb ? `<img class="phead-thumb" src="${esc(thumb)}" alt="">` : ""}</div>`;
    return `<section class="${tag}">${heading}${body}</section>`;
  }
  render() {
    if (!this._hass) return;
    const h = this._hass;
    const plugFreq = sensorMatch(h, (id) => id.includes("ac_smart_plug") && id.includes("freq"));
    const ac = mideaAc(h);
    const acOn = ac && !dead(ac);
    const acId = ac?.entity_id || "";
    const acToken = acOn ? acId.split(".")[1] : "";
    const acSensor = (word) => {
      if (!acOn) return "";
      const named = (ac.attributes?.friendly_name || "").toLowerCase();
      const hit = sensorMatch(h, (id, name) => {
        if (id.includes("temperature") || name.includes("temperature") || id.includes("_temp")) return false;
        const related = id.includes("midea") || name.includes("midea") || (acToken && id.includes(acToken)) || (named && name.includes(named));
        return related && (id.includes(word) || name.includes(word));
      });
      return hit && !dead(hit) ? hit.entity_id : "";
    };
    const acPower = acSensor("power");
    const acCurrent = acSensor("current");
    const acVoltage = acSensor("voltage");
    const heater = rawState(h, WATER_HEATER);
    const heatOn = heater && !dead(heater);
    const heatMode = heatOn ? (heater.attributes?.operation_mode || heater.state) : "";
    const showHeatMode = heatMode && !["unknown", "unavailable", "none", ""].includes(String(heatMode));
    const acHumN = acOn ? Number(ac.attributes?.current_humidity) : NaN;
    const acHum = Number.isFinite(acHumN) ? `${Math.round(acHumN)} %` : "—";
    const acNow = acOn && Number.isFinite(Number(ac.attributes?.current_temperature)) ? `${Number(ac.attributes.current_temperature).toFixed(1)} °C` : "—";
    const acTarget = acOn && Number.isFinite(Number(ac.attributes?.temperature)) ? `${Number(ac.attributes.temperature).toFixed(1)} °C` : "—";
    const heatNow = heatOn && Number.isFinite(Number(heater.attributes?.current_temperature)) ? `${Number(heater.attributes.current_temperature).toFixed(1)} °C` : paramValue(h, "sensor.151732606824523_current_temperature", 1);
    const heatTarget = heatOn && Number.isFinite(Number(heater.attributes?.temperature)) ? `${Number(heater.attributes.temperature).toFixed(0)} °C` : "—";
    const appliances = [
      this.block("Refrigerator", [
        ["Fridge temp", "sensor.zee_refrigerator_fridge_temperature", 1],
        ["Fridge door", "binary_sensor.zee_refrigerator_fridge_door", "door"],
        ["Freezer temp", "sensor.zee_refrigerator_freezer_temperature", 1],
        ["Freezer door", "binary_sensor.zee_refrigerator_freezer_door", "door"],
        ["Mode", "sensor.zee_refrigerator_mode", "text"],
      ], true, "/local/zee-energy-card/images/devices/haier_538_iot_refrigereator.png"),
      this.block("Smart plug", [
        ["Status", "switch.ac_smart_plug_socket_1", "switch"],
        ["Power", "sensor.ac_smart_plug_power", 0],
        ["Current", "sensor.ac_smart_plug_current", 2],
        ["Voltage", "sensor.ac_smart_plug_voltage", 0],
        plugFreq && !dead(plugFreq) ? ["Frequency", plugFreq.entity_id, 1] : null,
      ], true, "/local/zee-energy-card/images/devices/smart_plug.png"),
      acOn ? `<section class="pgroup">${this.psub("Midea AC", "/local/zee-energy-card/images/devices/midea_breezeless_e_ac.png")}${this.rows([
        acPower ? ["Power", acPower, 0] : null,
        acCurrent ? ["Current", acCurrent, 2] : null,
        acVoltage ? ["Voltage", acVoltage, 0] : null,
        ["Current temp", acId, "skip"],
        ["Target temp", acId, "skip"],
        ["Humidity", acId, "skip"],
        ["Mode", acId, "skip"],
      ].filter(Boolean))}</section>` : "",
      heatOn ? `<section class="pgroup">${this.psub("Water heater", "/local/zee-energy-card/images/devices/midea_water_heater.png")}${this.rows([
        ["Current temp", "sensor.151732606824523_current_temperature", 1],
        ["Target temp", WATER_HEATER, "skip"],
        ["Time left", "sensor.151732606824523_heating_time_remaining", 0],
        ["Power", "sensor.151732606824523_heating_power", 0],
        showHeatMode ? ["Mode", WATER_HEATER, "skip"] : null,
      ].filter(Boolean))}</section>` : "",
    ].join("");
    this.shell("Live parameter", "House", `<div class="plist">
      ${this.block("Inverter", [
        ["Air temp", "sensor.goodwe_inverter_temperature_air", 1],
        ["Rad temp", "sensor.goodwe_inverter_temperature_radiator", 1],
        ["Work mode", "sensor.goodwe_work_mode", "text"],
        ["Error", "sensor.goodwe_errors", "text"],
      ], false, "/local/zee-energy-card/images/devices/goodwe_inverter.png")}
      ${this.block("Battery", [
        ["Power", "sensor.goodwe_battery_power", 0],
        ["Voltage", "sensor.goodwe_battery_voltage", 1],
        ["Current", "sensor.goodwe_battery_current", 1],
        ["SoC", "sensor.goodwe_battery_state_of_charge", 0],
        ["Max cell temp", "sensor.goodwe_battery_max_cell_temperature", 1],
        ["Min cell temp", "sensor.goodwe_battery_min_cell_temperature", 1],
        ["Max cell volt", "sensor.goodwe_battery_max_cell_voltage", 3],
        ["Min cell volt", "sensor.goodwe_battery_min_cell_voltage", 3],
      ], false, "/local/zee-energy-card/images/devices/goodwe_battery.png")}
      ${this.block("Grid", [
        ["Power", "sensor.goodwe_active_power", 0],
        ["Voltage", "sensor.goodwe_on_grid_l1_voltage", 1],
        ["Current", "sensor.goodwe_meter_l1_current", 1],
        ["Frequency", "sensor.goodwe_on_grid_l1_frequency", 2],
      ], false, "/local/zee-energy-card/images/devices/grid.png")}
      ${this.block("Load", [
        ["Power", "sensor.goodwe_house_consumption", 0],
        ["Current", "sensor.goodwe_back_up_l1_current", 1],
        ["Voltage", "sensor.goodwe_back_up_l1_voltage", 1],
      ], false, "/local/zee-energy-card/images/devices/load.png")}
      ${this.block("PV", [
        ["PV power", "sensor.goodwe_pv_power", 0],
        ["PV1 voltage", "sensor.goodwe_pv1_voltage", 1],
        ["PV1 current", "sensor.goodwe_pv1_current", 1],
        ["PV2 voltage", "sensor.goodwe_pv2_voltage", 1],
        ["PV2 current", "sensor.goodwe_pv2_current", 1],
      ], false, "/local/zee-energy-card/images/devices/pv.png")}
      ${this.block("System", [
        ["CPU", "sensor.localhost_cpu_usage", 0],
        ["Memory", "sensor.localhost_memory_usage", 0],
        ["ZimaOS HDD", "sensor.localhost_etc_hostname_disk_usage", 1],
        ["Media HDD", "sensor.localhost_media_hdd_disk_usage", 1],
        ["Uptime", "sensor.localhost_uptime", "uptime"],
        ["Package temp", "sensor.localhost_package_id_0_temperature", 1],
      ], false, "/local/zee-energy-card/images/devices/system.png")}
      <section class="psec"><h3>Appliances</h3><div class="appliances">${appliances}</div></section>
    </div>`);
    this.shadowRoot.querySelectorAll("[data-id]").forEach((button) => {
      const id = button.dataset.id;
      const strong = button.querySelector("strong");
      if (id === acId && strong) {
        const label = button.querySelector("span").textContent;
        if (label === "Current temp") strong.textContent = acNow;
        else if (label === "Target temp") strong.textContent = acTarget;
        else if (label === "Humidity") strong.textContent = acHum;
        else if (label === "Mode") strong.textContent = labelOf(ac.state);
      }
      if (id === WATER_HEATER && strong && heatOn) {
        const label = button.querySelector("span").textContent;
        if (label === "Target temp") strong.textContent = heatTarget;
        if (label === "Mode") strong.textContent = labelOf(heatMode);
      }
      if (id === "sensor.151732606824523_current_temperature" && heatNow !== "—" && strong && button.querySelector("span").textContent === "Current temp") strong.textContent = heatNow;
      button.onclick = () => { if (id) this.more(id); };
    });
  }
}

class ZeeMetrics extends ZeePage {
  render() {
    if (!this.config || !this._hass) return;
    const items = this.config.items || [];
    const columns = Math.max(1, Math.min(4, Number(this.config.columns) || 2));
    const compact = columns >= 3 ? " compact" : "";
    this.shell(this.config.title || "Metrics", this.config.eyebrow || "Energy", `<div class="facts${compact}" style="grid-template-columns:repeat(${columns},minmax(0,1fr))">${items.map((item) => { const state = rawState(this._hass, item.entity); const value = item.text ? (dead(state) ? "—" : state.state) : reading(this._hass, item.entity, item.digits); return `<button class="fact" data-id="${esc(item.entity)}"><small>${esc(item.name)}</small><strong>${esc(value)}</strong></button>`; }).join("")}</div>`);
    this.shadowRoot.querySelectorAll("[data-id]").forEach((button) => { button.onclick = () => this.more(button.dataset.id); });
  }
}

class ZeeCameras extends ZeePage {
  set hass(hass) {
    this._hass = hass;
    this.refresh();
  }
  refresh() {
    if (!this._hass) return;
    const cams = this.cameras();
    const key = this._open || "";
    if (this._key !== key || !this.shadowRoot?.querySelector(".panel")) {
      this._key = key;
      this.draw(cams);
    }
    this.motion(cams);
    this.streams(cams);
  }
  cameras() {
    return this.config?.cameras || [
      ["camera.embedded_net_dvr_channel_1", "Camera 1"],
      ["camera.embedded_net_dvr_channel_2", "Camera 2"],
      ["camera.embedded_net_dvr_channel_3", "Camera 3"],
      ["camera.embedded_net_dvr_channel_4", "Camera 4"],
    ];
  }
  motionEntity(cam) {
    return cam[2] || `binary_sensor.${cam[0].split(".")[1]}_motion`;
  }
  shortDuration(ms) {
    const s = Math.max(0, Math.round(ms / 1000));
    if (s < 60) return s + "s";
    const m = Math.floor(s / 60);
    if (m < 60) return m + "m";
    return Math.floor(m / 60) + "h" + (m % 60 ? " " + (m % 60) + "m" : "");
  }
  motionState(cam) {
    const entity = this.motionEntity(cam);
    const state = this._hass?.states?.[entity];
    if (!state || ["unavailable", "unknown", "none", ""].includes(state.state)) return { entity, live: false, recent: false, age: null };
    const live = state.state === "on";
    const changed = Date.parse(state.last_changed);
    const age = Number.isFinite(changed) ? Date.now() - changed : null;
    const recent = !live && age !== null && age < 30000;
    return { entity, live, recent, age };
  }
  motion(cams) {
    if (!this.shadowRoot) return;
    const states = cams.map((cam) => ({ cam, ...this.motionState(cam) }));
    const live = states.filter((s) => s.live);
    const recent = states.filter((s) => s.recent);
    const status = this.shadowRoot.querySelector("#cam-status");
    if (status) {
      if (this._open) {
        const open = states.find((s) => s.cam[0] === this._open);
        status.classList.toggle("alert", !!open?.live);
        status.classList.toggle("recent", !!open?.recent);
        status.textContent = !open ? "" : open.live ? `Motion for ${open.age !== null ? this.shortDuration(open.age) : "now"}` : open.recent ? `Clear for ${open.age !== null ? this.shortDuration(open.age) : "now"}` : "Clear";
      } else {
        status.classList.toggle("alert", live.length > 0);
        status.classList.toggle("recent", live.length === 0 && recent.length > 0);
        status.textContent = live.length ? `Motion: ${live.map((s) => s.cam[1]).join(", ")}` : recent.length ? `Recent motion: ${recent.map((s) => s.cam[1]).join(", ")}` : "All cameras clear";
      }
    }
    for (const s of states) {
      const tile = [...this.shadowRoot.querySelectorAll("[data-cam-open]")].find((el) => el.dataset.camOpen === s.cam[0]);
      if (!tile) continue;
      tile.classList.toggle("motion", s.live);
      tile.classList.toggle("recent", s.recent);
      const badge = tile.querySelector(".cam-motion");
      if (badge) badge.textContent = s.live ? "Motion" : s.recent ? "Recent" : "";
      tile.setAttribute("aria-label", `Enlarge ${s.cam[1]}${s.live ? ", motion detected" : s.recent ? ", recent motion" : ""}`);
    }
  }
  async streamUrl(id) {
    const cache = this._streams || (this._streams = {});
    const hit = cache[id];
    if (hit && hit.exp > Date.now() + 15000) return hit.url;
    try {
      const signed = await this._hass.callWS({ type: "auth/sign_path", path: `/api/camera_proxy_stream/${id}`, expires: 300 });
      if (signed?.path) {
        const url = this._hass.hassUrl ? this._hass.hassUrl(signed.path) : signed.path;
        cache[id] = { url, exp: Date.now() + 280000 };
        return url;
      }
    } catch { /* snapshot fallback */ }
    const picture = this._hass.states?.[id]?.attributes?.entity_picture || "";
    if (picture) cache[id] = { url: picture, exp: Date.now() + 4000 };
    return picture;
  }
  draw(cams) {
    const open = cams.find(([id]) => id === this._open);
    const body = open
      ? `<div class="lightbox"><div class="cam-actions"><button class="back" id="cam-back" type="button">Back to cameras</button><button class="back" id="cam-history" type="button">Motion history</button></div><div class="eyebrow">${esc(open[1])}</div><p class="cam-status" id="cam-status"></p><img data-cam="${esc(open[0])}" alt="${esc(open[1])}"></div>`
      : `<p class="cam-status" id="cam-status"></p><div class="cams">${cams.map(([id, name]) => `<button class="cam" data-cam-open="${esc(id)}" type="button" aria-label="Enlarge ${esc(name)}"><img data-cam="${esc(id)}" alt=""><span class="cam-label">${esc(name)}</span><span class="cam-motion"></span></button>`).join("")}</div>`;
    this.shell("Cameras", "Security", body, "/local/zee-energy-card/images/myhome-dashboard-banners/security-v2.png");
    const back = this.shadowRoot.querySelector("#cam-back");
    if (back) back.onclick = () => { this._open = ""; this.refresh(); };
    const history = this.shadowRoot.querySelector("#cam-history");
    if (history && open) history.onclick = () => this.more(this.motionEntity(open));
    this.shadowRoot.querySelectorAll("[data-cam-open]").forEach((button) => {
      button.onclick = () => { this._open = button.dataset.camOpen; this.refresh(); };
    });
  }
  async streams(cams) {
    const token = (this._token = (this._token || 0) + 1);
    const shown = this._open ? cams.filter(([id]) => id === this._open) : cams;
    for (const [id] of shown) {
      const url = await this.streamUrl(id);
      if (token !== this._token || !url) continue;
      const img = this.shadowRoot.querySelector(`img[data-cam="${id}"]`);
      if (img && img.getAttribute("src") !== url) img.setAttribute("src", url);
    }
  }
}

class ZeeAppliances extends ZeePage {
  panel(eyebrow, title, body, thumb) {
    const thumbImg = thumb ? `<img class="device-thumb" src="${esc(thumb)}" alt="">` : "";
    return `<section class="panel"><div class="head"><div><div class="eyebrow">${esc(eyebrow)}</div><h2>${esc(title)}</h2></div>${thumbImg}</div>${body}</section>`;
  }
  modes(modes, active, kind, off) {
    return `<div class="modes">${modes.map((mode) => `<button class="mode${mode === active ? " on" : ""}" type="button" data-${kind}="${esc(mode)}"${off ? " disabled" : ""}>${esc(labelOf(mode))}</button>`).join("")}</div>`;
  }
  render() {
    if (!this._hass) return;
    const h = this._hass;
    const door = (id) => { const s = stateOf(h, id); if (!s) return ["—", false]; return [s.state === "on" ? "Open" : "Closed", s.state === "on"]; };
    const [fridgeDoor, fridgeOpen] = door("binary_sensor.zee_refrigerator_fridge_door");
    const [freezerDoor, freezerOpen] = door("binary_sensor.zee_refrigerator_freezer_door");
    const mode = stateOf(h, "sensor.zee_refrigerator_mode");
    const ac = mideaAc(h);
    const acOff = dead(ac);
    const acAttrs = ac?.attributes || {};
    const acModes = acAttrs.hvac_modes?.length ? acAttrs.hvac_modes : ["off", "cool", "heat", "auto", "dry", "fan_only"];
    const acTarget = Number(acAttrs.temperature);
    const acNow = Number(acAttrs.current_temperature);
    const fans = acAttrs.fan_modes || [];
    const heater = rawState(h, WATER_HEATER);
    const heatOff = dead(heater);
    const heatAttrs = heater?.attributes || {};
    const heatModes = (heatAttrs.operation_list || []).filter((m) => m !== "off");
    const heatTarget = Number.isFinite(Number(heatAttrs.temperature)) ? Number(heatAttrs.temperature) : Number(stateOf(h, "sensor.151732606824523_current_temperature")?.state);
    const heatNow = Number.isFinite(Number(heatAttrs.current_temperature)) ? Number(heatAttrs.current_temperature) : null;
    const heatActive = heatOff ? "" : (heatAttrs.operation_mode || heater.state);
    const heating = stateOf(h, "binary_sensor.151732606824523_heating");
    const plug = rawState(h, "switch.ac_smart_plug_socket_1");
    const plugOff = dead(plug);
    const plugOn = plug?.state === "on";
    this.shadowRoot.innerHTML = `<style>${CSS}</style><div class="stack">
      ${this.panel("Kitchen", "Refrigerator", `
        <div class="hero">
          <button data-id="sensor.zee_refrigerator_fridge_temperature" type="button"><div class="kicker">Fridge</div><div class="temp">${esc(reading(h, "sensor.zee_refrigerator_fridge_temperature", 1))}</div><div class="meta">Target ${esc(reading(h, "sensor.zee_refrigerator_fridge_target_temperature", 1))}</div><span class="chip${fridgeOpen ? " warn" : ""}">${esc(fridgeDoor)}</span></button>
          <button data-id="sensor.zee_refrigerator_freezer_temperature" type="button"><div class="kicker">Freezer</div><div class="temp">${esc(reading(h, "sensor.zee_refrigerator_freezer_temperature", 1))}</div><div class="meta">Target ${esc(reading(h, "sensor.zee_refrigerator_freezer_target_temperature", 1))}</div><span class="chip${freezerOpen ? " warn" : ""}">${esc(freezerDoor)}</span></button>
        </div>
        <div class="meta">Mode ${esc(mode ? mode.state : "—")}</div>`, "/local/zee-energy-card/images/devices/haier_538_iot_refrigereator.png")}
      ${this.panel("Climate", "Midea AC", `
        <div class="row"><div><div class="kicker">${esc(ac?.attributes?.friendly_name || "Midea AC")}</div><div class="temp">${acOff || !Number.isFinite(acNow) ? "—" : acNow.toFixed(1) + "°C"}</div><div class="meta">${acOff ? "Unavailable" : esc(labelOf(ac.state))}</div></div><span class="chip${acOff ? " warn" : ""}">${acOff ? "Unavailable" : "Live"}</span></div>
        <div class="row"><div><div class="kicker">Power</div><div class="meta">${acOff ? "Unavailable" : ac.state === "off" ? "Off" : "On"}</div></div><button class="toggle${!acOff && ac.state !== "off" ? " on" : ""}" id="ac-power" type="button"${acOff ? " disabled" : ""}>${acOff ? "Unavailable" : ac.state === "off" ? "Turn on" : "Turn off"}</button></div>
        <div class="stepper"><button class="step" type="button" data-ac-step="-0.5"${acOff ? " disabled" : ""}>−</button><div><div class="kicker">Target</div><div class="target">${Number.isFinite(acTarget) ? acTarget.toFixed(1) + "°C" : "—"}</div></div><button class="step" type="button" data-ac-step="0.5"${acOff ? " disabled" : ""}>+</button></div>
        ${this.modes(acModes, acOff ? "" : ac.state, "ac-mode", acOff)}
        ${fans.length ? `<div class="group">Fan</div>${this.modes(fans, acAttrs.fan_mode, "ac-fan", acOff)}` : ""}`, "/local/zee-energy-card/images/devices/midea_breezeless_e_ac.png")}
      ${this.panel("Water", "Water heater", `
        <div class="row"><div><div class="kicker">Current</div><div class="temp">${heatOff ? "—" : esc(heatNow === null ? reading(h, "sensor.151732606824523_current_temperature", 1) : heatNow.toFixed(1) + "°C")}</div><div class="meta">${heatOff ? "Unavailable" : esc(labelOf(heatActive))}${heating?.state === "on" ? " · Heating" : ""}</div></div><span class="chip${heatOff ? " warn" : ""}">${heatOff ? "Unavailable" : "Live"}</span></div>
        <div class="row"><div><div class="kicker">Power</div><div class="meta">${heatOff ? "Unavailable" : heater.state === "off" ? "Off" : "On"}</div></div><button class="toggle${!heatOff && heater.state !== "off" ? " on" : ""}" id="wh-power" type="button"${heatOff ? " disabled" : ""}>${heatOff ? "Unavailable" : heater.state === "off" ? "Turn on" : "Turn off"}</button></div>
        <div class="stepper"><button class="step" type="button" data-wh-step="-1"${heatOff ? " disabled" : ""}>−</button><div><div class="kicker">Target</div><div class="target">${Number.isFinite(heatTarget) && !heatOff ? heatTarget.toFixed(0) + "°C" : "—"}</div></div><button class="step" type="button" data-wh-step="1"${heatOff ? " disabled" : ""}>+</button></div>
        ${heatModes.length ? this.modes(heatModes, heatActive, "wh-mode", heatOff) : ""}
        <div class="facts" style="margin-top:12px">
          <button class="fact" data-id="sensor.151732606824523_heating_power" type="button"><small>Power</small><strong>${esc(reading(h, "sensor.151732606824523_heating_power", 0))}</strong></button>
          <button class="fact" data-id="sensor.151732606824523_heating_time_remaining" type="button"><small>Time left</small><strong>${esc(reading(h, "sensor.151732606824523_heating_time_remaining", 0))}</strong></button>
          <button class="fact" data-id="sensor.151732606824523_water_consumption" type="button"><small>Water used</small><strong>${esc(reading(h, "sensor.151732606824523_water_consumption", 1))}</strong></button>
          <button class="fact" data-id="${WATER_HEATER}" type="button"><small>Status</small><strong>${heatOff ? "Unavailable" : esc(labelOf(heater.state))}</strong></button>
        </div>`, "/local/zee-energy-card/images/devices/midea_water_heater.png")}
      ${this.panel("Power", "Smart plugs", `
        <div class="row"><div><div class="kicker">AC plug</div><div class="temp" style="font-size:26px">${plugOff ? "Unavailable" : plugOn ? "On" : "Off"}</div></div><button class="toggle${plugOn ? " on" : ""}" id="plug" type="button"${plugOff ? " disabled" : ""}>${plugOn ? "On" : "Off"}</button></div>
        <div class="facts" style="margin-top:12px">
          <button class="fact" data-id="sensor.ac_smart_plug_power" type="button"><small>Power</small><strong>${esc(reading(h, "sensor.ac_smart_plug_power", 0))}</strong></button>
          <button class="fact" data-id="sensor.ac_smart_plug_voltage" type="button"><small>Voltage</small><strong>${esc(reading(h, "sensor.ac_smart_plug_voltage", 0))}</strong></button>
          <button class="fact" data-id="sensor.ac_smart_plug_current" type="button"><small>Current</small><strong>${esc(reading(h, "sensor.ac_smart_plug_current", 2))}</strong></button>
        </div>`, "/local/zee-energy-card/images/devices/smart_plug.png")}
    </div>`;
    this.shadowRoot.querySelectorAll("[data-id]").forEach((button) => { button.onclick = () => this.more(button.dataset.id); });
    const acId = ac?.entity_id;
    this.shadowRoot.querySelectorAll("[data-ac-mode]").forEach((button) => { button.onclick = () => { if (acId) h.callService("climate", "set_hvac_mode", { entity_id: acId, hvac_mode: button.dataset.acMode }); }; });
    this.shadowRoot.querySelectorAll("[data-ac-fan]").forEach((button) => { button.onclick = () => { if (acId) h.callService("climate", "set_fan_mode", { entity_id: acId, fan_mode: button.dataset.acFan }); }; });
    this.shadowRoot.querySelectorAll("[data-ac-step]").forEach((button) => { button.onclick = () => {
      if (!acId || acOff) return;
      const min = Number(acAttrs.min_temp ?? 16), max = Number(acAttrs.max_temp ?? 30);
      const next = Math.round(( (Number.isFinite(acTarget) ? acTarget : 24) + Number(button.dataset.acStep) ) * 2) / 2;
      h.callService("climate", "set_temperature", { entity_id: acId, temperature: Math.max(min, Math.min(max, next)) });
    }; });
    this.shadowRoot.querySelectorAll("[data-wh-mode]").forEach((button) => { button.onclick = () => { if (!heatOff) h.callService("water_heater", "set_operation_mode", { entity_id: WATER_HEATER, operation_mode: button.dataset.whMode }); }; });
    this.shadowRoot.querySelectorAll("[data-wh-step]").forEach((button) => { button.onclick = () => {
      if (heatOff) return;
      const min = Number(heatAttrs.min_temp ?? 30), max = Number(heatAttrs.max_temp ?? 75);
      const base = Number.isFinite(heatTarget) ? heatTarget : 50;
      const next = Math.max(min, Math.min(max, base + Number(button.dataset.whStep)));
      h.callService("water_heater", "set_temperature", { entity_id: WATER_HEATER, temperature: next });
    }; });
    const acPower = this.shadowRoot.querySelector("#ac-power");
    if (acPower) acPower.onclick = () => { if (!acId || acOff) return; h.callService("climate", ac.state === "off" ? "turn_on" : "turn_off", { entity_id: acId }); };
    const whPower = this.shadowRoot.querySelector("#wh-power");
    if (whPower) whPower.onclick = () => { if (heatOff) return; h.callService("water_heater", heater.state === "off" ? "turn_on" : "turn_off", { entity_id: WATER_HEATER }); };
    const toggle = this.shadowRoot.querySelector("#plug");
    if (toggle) toggle.onclick = () => { if (!plugOff) h.callService("switch", "toggle", { entity_id: "switch.ac_smart_plug_socket_1" }); };
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
    this.shell("Climate", "Rooms", `<div class="hero">${this.room("Room 1", "sensor.temperature_sensor_temperature", "sensor.temperature_sensor_humidity", "sensor.temperature_sensor_battery")}${this.room("Room 2", "sensor.temperature_sensor_2_temperature", "sensor.temperature_sensor_2_humidity", "sensor.temperature_sensor_2_battery")}</div>`, null, "/local/zee-energy-card/images/devices/temperature_sensor.png");
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
    return `<div class="facts">${items.map(([name, id, digits]) => `<button class="fact" data-id="${esc(id)}"><small>${esc(name)}</small><strong>${esc(id === "sensor.localhost_uptime" ? uptimeText(this._hass, id) : reading(this._hass, id, digits))}</strong></button>`).join("")}</div>`;
  }
  disk(title, base) {
    const h = this._hass;
    const num = (suffix) => {
      const n = Number(stateOf(h, `${base}_${suffix}`)?.state);
      return Number.isFinite(n) ? n : null;
    };
    const used = num("used"), total = num("size"), pct = num("usage");
    const usage = pct !== null ? Math.max(0, Math.min(100, pct)) : used !== null && total ? Math.max(0, Math.min(100, used / total * 100)) : 0;
    const color = usage >= 90 ? "#ff6b6b" : usage >= 75 ? "#f0b35a" : "#62d9b5";
    const text = (suffix) => reading(h, `${base}_${suffix}`, 1);
    return `<div class="disk" style="--disk:${color}"><div class="disk-head"><span>${esc(title)}</span><b>${usage.toFixed(1)}%</b></div><div class="disk-bar" role="progressbar" aria-label="${esc(title)} usage" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${usage.toFixed(1)}"><i style="width:${usage.toFixed(1)}%"></i></div><div class="disk-meta"><span>${text("used")} used</span><span>${text("free")} free</span><span>${text("size")} total</span></div></div>`;
  }
  render() {
    if (!this._hass) return;
    const cpu = this.percent("sensor.localhost_cpu_usage");
    const mem = this.percent("sensor.localhost_memory_usage");
    const containerSensor = (word) => sensorMatch(this._hass, (id, name) => (id.includes("containers") || name.includes("containers")) && (id.includes(word) || name.includes(word))) || sensorMatch(this._hass, (id, name) => (id.includes("container") || name.includes("container")) && (id.includes(word) || name.includes(word)));
    const containersActive = containerSensor("active");
    const containersCpu = containerSensor("cpu");
    const ring = (value, label) => `<div class="ring" style="--p:${value ?? 0}"><i></i><b>${value === null ? "—" : Math.round(value) + "%"}</b><small>${label}</small></div>`;
    this.shell("System", "Home Assistant host", `
      <div class="rings">${ring(cpu, "CPU")}${ring(mem, "Memory")}</div>
      <p class="sub" style="margin:0 2px 10px">Home Assistant host</p>
      ${this.facts([
        ["Uptime", "sensor.localhost_uptime", 0],
        ["Core 0", "sensor.localhost_core_0_temperature", 1],
        ["Core 1", "sensor.localhost_core_1_temperature", 1],
        ["Package", "sensor.localhost_package_id_0_temperature", 1],
        ["Ethernet RX", "sensor.localhost_eth0_rx", 1],
        ["Ethernet TX", "sensor.localhost_eth0_tx", 1],
      ])}
      <p class="sub" style="margin:14px 2px 10px">Storage</p>
      <div class="disks">${this.disk("ZimaOS HDD", "sensor.localhost_etc_hostname_disk")}${this.disk("Media HDD", "sensor.localhost_media_hdd_disk")}</div>
      ${containersActive || containersCpu ? `<p class="sub" style="margin:14px 2px 10px">Containers</p>${this.facts([
        containersActive ? ["Active", containersActive.entity_id, 0] : null,
        containersCpu ? ["CPU usage", containersCpu.entity_id, 1] : null,
      ].filter(Boolean))}` : ""}
      <p class="sub" style="margin:14px 2px 10px">Inverter</p>
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
        ["Errors", "sensor.goodwe_errors"],
      ])}`, "/local/zee-energy-card/images/myhome-dashboard-banners/lab.png");
    this.shadowRoot.querySelectorAll("[data-id]").forEach((button) => { button.onclick = () => this.more(button.dataset.id); });
  }
}

const tags = [
  ["zee-metric-board", ZeeMetrics],
  ["zee-live-parameters", ZeeLive],
  ["zee-cameras", ZeeCameras],
  ["zee-appliances", ZeeAppliances],
  ["zee-climate", ZeeClimate],
  ["zee-system", ZeeSystem],
];
for (const [tag, cls] of tags) {
  if (!customElements.get(tag)) customElements.define(tag, cls);
}
