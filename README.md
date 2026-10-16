# Zee Energy Card

Mobile Home Assistant dashboard for a Goodwe solar system, house sensors, cameras, and a few appliances. The layout and animated energy scene are adapted from [narayanvs/homeassistant-dashboard](https://github.com/narayanvs/homeassistant-dashboard) (MyHome). Entity IDs are this household’s Goodwe, Zee refrigerator, water heater, AC plug, room sensors, DVR cameras, and localhost host metrics.

This is a dashboard bundle, not an installer. Copy the files into Home Assistant, register the script, and paste the dashboard.

## Views

Phone navigation (icon bar, hide/show):

| View | What it shows |
|---|---|
| Home | Weather-reactive house scene, forecast, live power |
| Energy | Flow map, statistics, power chart, battery health, PV strings |
| Cameras | Four DVR channels |
| Appliances | Fridge, freezer, water heater, AC smart plug |
| Climate | Two room temperature / humidity sensors |
| System | Inverter status and Home Assistant host gauges |

Dashboard URL path: `dashboard-zee-energy`.

## Install

1. Install these HACS frontend cards:
   - [mini-graph-card](https://github.com/kalkih/mini-graph-card)
   - [clock-weather-card](https://github.com/pkissling/clock-weather-card)
2. Copy `custom-cards/` to `/config/www/custom-cards/`.
3. Copy the contents of `images/` into `/config/www/` so paths like `/local/myhome-scene-v1/` resolve. The artwork filenames are unchanged from the MyHome reference.
4. Add a Lovelace resource (Settings → Dashboards → Resources):

   `/local/custom-cards/zee-energy-card.js` as a JavaScript module.

   Also add the two HACS module URLs listed in `resources/resources.json` if they are not already registered.
5. Create a dashboard with URL `dashboard-zee-energy`, take control, and paste `dashboard/zee-energy-dashboard.yaml` into the raw configuration editor.
6. Hard-refresh the phone browser after the first load so the new module is picked up.

## Sensors

The full list is in [resources/entity-map.md](resources/entity-map.md). Battery power and grid power are sign-flipped in the energy cards (`invert_battery_power` and `invert_grid_power` from the existing Zee card config). Positive battery power is treated as charging. Positive grid power is treated as import.

There is no separate daily grid-export sensor in that config. Lifetime export uses `sensor.goodwe_meter_total_energy_export`. Solar forecast, tariff, and self-sufficiency cards from MyHome are not included.

## Credit

Scene artwork, energy flow, statistics, and power-metric cards come from the MyHome dashboard export. Third-party cards keep their own licenses.
