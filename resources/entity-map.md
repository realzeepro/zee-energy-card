# Entity map

Mapped from the existing Zee skycard configuration. Cards read these entity IDs directly.

## Solar, grid, load

| Reading | Entity | Notes |
|---|---|---|
| PV power | `sensor.goodwe_pv_power` | |
| PV1 power / voltage / current | `sensor.goodwe_pv1_power`, `sensor.goodwe_pv1_voltage`, `sensor.goodwe_pv1_current` | |
| PV2 power / voltage / current | `sensor.goodwe_pv2_power`, `sensor.goodwe_pv2_voltage`, `sensor.goodwe_pv2_current` | |
| House load | `sensor.goodwe_house_consumption` | |
| Grid power | `sensor.goodwe_active_power` | Sign flipped. Positive means import. |
| Grid voltage | `sensor.goodwe_on_grid_l1_voltage` | |
| Grid frequency | `sensor.goodwe_on_grid_l1_frequency` | |
| Backup voltage | `sensor.goodwe_back_up_l1_voltage` | |
| Backup current | `sensor.goodwe_back_up_l1_current` | Used by the home-scene HOME label. |
| Today PV | `sensor.goodwe_today_s_pv_generation` | |
| Today load | `sensor.goodwe_today_load` | |
| Today import | `sensor.goodwe_today_energy_import` | |
| Today import (calculated) | `sensor.goodwe_today_import_meter_calculated` | Used by the home-scene GRID label and the Energy page. |
| Today export (calculated) | `sensor.goodwe_today_export_meter_calculated` | Used by the home-scene GRID label and the Energy page. |
| Lifetime PV | `sensor.goodwe_total_pv_generation` | Used for Total generation on the Solar detail. |
| Lifetime load | `sensor.goodwe_total_load` | |
| Lifetime import | `sensor.goodwe_meter_total_energy_import` | |
| Lifetime export | `sensor.goodwe_meter_total_energy_export` | No separate today-export sensor is configured. |

## Battery

| Reading | Entity | Notes |
|---|---|---|
| Power | `sensor.goodwe_battery_power` | Sign flipped. Positive means charging. |
| State of charge | `sensor.goodwe_battery_state_of_charge` | |
| State of health | `sensor.goodwe_battery_state_of_health` | |
| Battery mode / state | `sensor.goodwe_battery_mode` | |
| Voltage / current | `sensor.goodwe_battery_voltage`, `sensor.goodwe_battery_current` | |
| BMS temperature | `sensor.goodwe_battery_temperature` | |
| BMS software version | `sensor.goodwe_battery_software_version` | |
| Min / max cell voltage | `sensor.goodwe_battery_min_cell_voltage`, `sensor.goodwe_battery_max_cell_voltage` | |
| Min / max cell temperature | `sensor.goodwe_battery_min_cell_temperature`, `sensor.goodwe_battery_max_cell_temperature` | |
| Charged today | `sensor.goodwe_today_battery_charge` | |
| Discharged today | `sensor.goodwe_today_battery_discharge` | |
| Lifetime charge / discharge | `sensor.goodwe_total_battery_charge`, `sensor.goodwe_total_battery_discharge` | |

## Inverter

| Reading | Entity |
|---|---|
| Work mode | `sensor.goodwe_work_mode` |
| Status | `sensor.goodwe_diag_status` |
| Errors | `sensor.goodwe_errors` |
| Air / radiator temperature | `sensor.goodwe_inverter_temperature_air`, `sensor.goodwe_inverter_temperature_radiator` |
| Running hours | `sensor.goodwe_hours_total` |
| Export limit | `number.goodwe_grid_export_limit` |
| Depth of discharge | `number.goodwe_depth_of_discharge_on_grid` |
| Load % | computed | House load divided by the inverter rating (default 8 kW). Override with `inverter_kw` on the energy card. |

## House

| Reading | Entity |
|---|---|
| Weather | `weather.forecast_home` |
| Sun | `sun.sun` |
| Room 1 temp / humidity / battery | `sensor.temperature_sensor_temperature`, `sensor.temperature_sensor_humidity`, `sensor.temperature_sensor_battery` |
| Room 2 temp / humidity / battery | `sensor.temperature_sensor_2_temperature`, `sensor.temperature_sensor_2_humidity`, `sensor.temperature_sensor_2_battery` |
| Cameras | `camera.embedded_net_dvr_channel_1` … `channel_4` |
| Camera motion | `binary_sensor.embedded_net_dvr_channel_1_motion` … `channel_4_motion` |
| Fridge / freezer | `sensor.zee_refrigerator_*`, `binary_sensor.zee_refrigerator_*_door` |
| Water heater | `water_heater.151732606824523_water_heater` and `sensor.151732606824523_*`; alert after 60+ minutes on/heating. |
| AC plug | `switch.ac_smart_plug_socket_1`, `sensor.ac_smart_plug_power`, `sensor.ac_smart_plug_voltage`, `sensor.ac_smart_plug_current` |
| Host CPU / memory / uptime / temps / ethernet | `sensor.localhost_*` |
| ZimaOS HDD size / used / free / usage | `sensor.localhost_etc_hostname_disk_size`, `_used`, `_free`, `_usage` |
| Media HDD size / used / free / usage | `sensor.localhost_media_hdd_disk_size`, `_used`, `_free`, `_usage` |
| `/etc/hosts`, `/etc/resolv.conf` disks | Same filesystem as `/etc/hostname`; not shown separately. |
| Containers active / CPU | Auto-detected from sensors containing `container` and `active` / `cpu` |

## Not mapped

Solcast forecast, energy-learning, and dedicated import-cost/export-credit entities. Grid cost is computed in-card from the PKR tariff entered on the Home scene, so no external cost sensor is required.
