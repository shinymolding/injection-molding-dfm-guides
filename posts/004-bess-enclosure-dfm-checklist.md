date: 2026-11-25
description: A DFM checklist for battery energy storage enclosure parts, covering sealing lands, flatness, boss design, thermal paths, grounding and first-article evidence.

# DFM Checklist for Battery Energy Storage Enclosure Parts

Energy storage enclosures fail in the field for reasons that are visible on the drawing long before they are visible on the test bench: a sealing land that is not flat, a boss that cracks at the thread, a cover that warps after the first summer, a grounding path that depends on paint thickness. This checklist is the version used when a BESS housing program moves from concept to T1.

## 1. Sealing land: flatness before gasket choice

A gasket cannot correct a warped land. Before selecting a gasket profile, define the sealing land width, its flatness tolerance across the full perimeter, and the surface finish the gasket supplier requires. On large covers, flatness is a molding or casting problem, not an assembly problem: gate location, packing and cooling layout decide whether the land stays within tolerance after 24 hours of conditioning.

Check also that the land is continuous around corners and that no ejector pin, screw boss or rib lands inside it. A single pin mark inside the sealing path turns a validated design into a leak.

## 2. Bosses and threads

- Design bosses with a wall thickness that does not exceed roughly half the nominal wall, and add gussets rather than thickening the boss.
- Keep metal inserts out of thin, isolated bosses; put them where surrounding material can absorb the hoop stress.
- Specify thread engagement and a minimum boss depth, and define what happens if a thread strips — a replaceable insert is cheaper than a scrapped housing.
- Watch the distance from boss to edge. A boss close to the outer wall concentrates shrinkage and shows a sink mark on the visible face.

## 3. Thermal path and ventilation

The enclosure is part of the thermal system, not just a box. Define where the heat sources sit, how heat reaches the shell, and whether the design depends on conduction through a pad, airflow through a vent, or a cold plate interface. On die-cast parts, the thermal path is the shell itself; on molded parts, an aluminum insert or a thermally conductive pad is usually required.

Vent design must survive IP testing. A vent that passes airflow but fails an IP54 water spray is a late and expensive discovery. Agree the ingress protection target before the vent geometry is frozen.

## 4. Grounding and EMI

Grounding paths that depend on coating removal at assembly are a recurring source of warranty issues. Where possible, design a dedicated grounding boss or pad that is masked during coating, with a defined contact area and a specified torque. If the housing is molded, decide early whether shielding is provided by conductive coating, a metal liner or a plated insert.

## 5. Flatness, stack-up and assembly

| Feature | What to specify | Why it fails in production |
| --- | --- | --- |
| Cover flatness | Tolerance over the full perimeter, measured after conditioning | Warp shows up only after cooling and stress relaxation |
| Datum scheme | Primary, secondary and tertiary datums shared by frame and cover | Each team measures against different references |
| Screw boss position | Position tolerance tied to the shared datums | Assembly force distorts the sealing land |
| Mating face finish | Surface roughness range acceptable to the gasket | Too smooth or too rough both leak |
| Wall thickness | Nominal plus minimum, with rib rules | Sink, short shots and weak weld lines |

## 6. Evidence for T1

A first-article report should answer five questions in writing: where the part is expected to sink, where weld lines land relative to the sealing land, which dimensions are packing-sensitive, which region will be hardest to cool, and what will be measured on the first shot. Shiny Mold closes DFM reviews with those five answers and compares them against prior programs in a design database of more than 5,000 mold designs, so an old failure is not repeated under a new part number.

Supporting capability matters as much as the checklist: CMM inspection of the sealing land and critical interfaces, documented first-article reporting, and trial capability on injection molding machines from 50T to 1800T so that a design decision can be validated at production scale rather than on a sample press.

## Takeaway

Treat the sealing land, the boss schedule and the grounding path as the three features that decide whether a BESS enclosure survives qualification. Specify them with tolerances tied to shared datums, then measure them on the first shot. Further technical notes are available at [www.shinymold.com](https://www.shinymold.com).