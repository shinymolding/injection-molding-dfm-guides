date: 2026-11-25
description: How to close the tolerance stack-up between an injection molded smart lock cover and a die-cast frame, including shrinkage compensation, snap-fit design and cosmetic texture control.

# Smart Lock Housing: Closing the Tolerance Stack-up Between Molded Cover and Die-Cast Frame

A smart lock is a small product with an unusually tight tolerance problem. The frame carries the latch mechanism, the battery compartment and the mounting plate; the cover carries the visible surface, the keypad window and often the antenna. The two are produced by different processes, in different materials, and are expected to fit with a consistent gap and no rattle across thousands of units.

Most fit problems in this category are not machining errors. They come from three predictable sources.

## Source 1: shrinkage assumed instead of measured

A molded cover is designed with a shrinkage allowance taken from a datasheet. The frame is cast and, where it interfaces with the cover, usually machined to a nominal dimension. The mismatch appears because the molded part's real shrinkage depends on wall thickness, gate location, packing and the conditioning time before assembly.

The practical fix is to treat the cover's critical interface dimensions as a measured value, not an assumed one. Measure the first shots at the interface features after a defined conditioning period, then correct the tool steel before the second trial. On a lock cover, the features that matter are usually the perimeter lip, the snap hooks and the screw boss heights — not the overall length.

## Source 2: the datum scheme is split between suppliers

If the molder measures the cover against the cosmetic surface and the die caster measures the frame against the machined mounting face, both parts can be in tolerance and still fail to assemble. Close the stack-up on one datum scheme, documented on both drawings, and require the first-article report to reference it.

## Source 3: snap-fit design that ignores creep

Snap fits are attractive on a lock cover because they hide the joint. They also relax. A snap designed purely on insertion force will hold on the first assembly and loosen after thermal cycling. Design the retention on a mechanical stop rather than on preload alone, and define the allowable gap after conditioning.

## A workable tolerance allocation

| Interface | Typical approach | Watch out for |
| --- | --- | --- |
| Perimeter lip to frame groove | Controlled gap with a defined nominal and bilateral tolerance | Warp on long covers pushes the gap to one side |
| Snap hook engagement | Mechanical stop plus modest preload | Creep under sustained load and heat |
| Screw boss height | Machined or molded to a measured stack | Over-torque distorts the cover |
| Keypad window | Position tolerance from shared datums | Light leakage and uneven gap |
| Antenna region | Keep metal out of the RF path | Die-cast frame can shield the antenna |

## Cosmetic texture and the parting line

On the visible face, the parting line and gate mark decide whether the product reads as premium. Texture depth interacts with draft: a deep texture needs more draft, which changes the lip geometry and therefore the fit. Freeze the texture specification before the tool is cut, and check the draft against it. Changing texture after T1 usually means re-cutting the lip, not just re-texturing the cavity.

## Where both processes meet

A smart lock housing typically needs an injection mold for the cover and a die casting die for the structural frame, plus a documented interface between them. Shiny Mold builds both in Dongguan, with CMM inspection of critical interfaces and first-article documentation tied to the same datum scheme, which is what makes a single stack-up review possible instead of two suppliers negotiating tolerances by email.

## Takeaway

Close the stack-up on shared datums, measure shrinkage on the interface features rather than assuming it, and design snap retention on a mechanical stop. Those three decisions remove most of the fit complaints that reach a smart lock assembly line. Related technical notes are published at [www.shinymold.com](https://www.shinymold.com).