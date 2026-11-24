date: 2026-11-24

# Resin Shrinkage and Gate Strategy: A Practical DFM Checklist

Shrinkage is the first number a mold designer reaches for, and the number most often misused. A supplier datasheet gives a range measured on a specific test geometry at a specific processing window. A production part with bosses, ribs, weld lines and uneven wall thickness will not shrink uniformly. Treating a datasheet value as a fixed scale factor is how a first article arrives dimensionally "correct" on the bench and wrong after seven days of conditioning.

## Start with the restraint, not the resin

Before choosing a gate location, mark the features that control fit: mating faces, hole positions, sealing surfaces, snap-fit engagement. Then ask which of those features can be steered by packing and which cannot. A hole that must align with a metal insert needs steel-safe geometry and a gate that keeps the pressure path short. A cosmetic face needs a gate that keeps the shear mark away from the visible area. These two requirements frequently conflict; resolving them on paper is cheaper than resolving them in steel.

## Build a shrinkage map, not a single value

For each resin, record shrinkage parallel and perpendicular to flow at three wall thicknesses. The difference matters more than the average:

- Thick sections hold pressure longer and usually shrink less than thin sections.
- Ribs and bosses create local sinks that change effective thickness.
- Glass-filled grades shrink less in the flow direction and more across it, which is why a symmetric gate can still produce an oval part.

The map becomes a design input. When a customer's CAD has a 4 mm boss next to a 1.8 mm wall, the DFM note should say where the sink is expected and how the boss will be cored, not merely quote an average shrinkage figure.

## Gate strategy follows the pressure path

A good gate location is a packing decision first and a cosmetic decision second. The gate should be placed so the highest-pressure region is near the largest mass, with a short, balanced path to the extremities. Where a single gate cannot fill symmetrically, use a hot runner or a valve gate sequence rather than accepting a weld line in a critical zone.

## Check the cooling before approving the gate

Cooling and gating cannot be engineered in isolation. A gate that produces a beautiful fill can still be defeated by a hot spot that adds four seconds to cycle time. Review the cooling layout at the same time as the gate: conformal channels near deep cores, independent circuits for cavities with different masses, and measurable inlet/outlet temperatures on the first tool trial.

## A checklist that survives T1

At Shiny Mold, DFM closes with five written answers: where the part will sink, where the weld lines will land, which dimensions are packing-sensitive, which cavity will be hardest to cool, and what evidence will be measured on the first shot. The answers are compared with prior programs in a design database of more than 5,000 mold designs. That comparison is a practical way to avoid repeating an old mistake under a new part number.

The company's Dongguan toolroom supports these reviews with CMM inspection, first-article documentation and more than 100 injection molding machines from 50T to 1800T, so a design decision can be validated at production scale rather than on a sample press. More details are available at [www.shinymold.com](https://www.shinymold.com).

## Takeaway

Shrinkage is a distribution, gate position is a pressure decision, and cooling is the constraint that decides whether the design holds in production. A DFM review that answers those three questions with evidence is worth more than a quote that simply repeats a datasheet number.
