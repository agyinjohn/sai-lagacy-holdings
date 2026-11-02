# Image brief for AI concept images

Eight slots need an image. Generate them with a tool of your choice, name each file after its slot id, put it in `public/images/`, then run:

```bash
npm run images:add -- --tool="Name and version of the tool" --date=2026-11-02
```

The command reads each file's size, points the slot at it, marks it as an AI concept image awaiting review, and regenerates `docs/asset-register.md`. Fill in the prompt reference in each register entry in `src/content/images.ts`, and only set `approvalStatus: 'approved'` once Sai Legacy Holdings has signed the image off.

Every AI concept image is shown with the caption **"Concept for illustration only. Not an approved design or completed facility."** The site adds it automatically and it cannot be switched off.

## Rules for every image

- No real or identifiable people. Use no figures at all, or small distant silhouettes only.
- No text, signs, logos or watermarks inside the image.
- No kente, Adinkra or other cultural patterns, and no depictions of sacred or ceremonial objects. None has been approved.
- Do not show specific buildings as if they are designed. Where a place to stay appears, keep it soft, distant and generic, so the image does not imply an approved design, room counts or facilities.
- Palette: deep green, sage, gold light, soft mist. Calm, warm, editorial. Avoid glossy resort and real-estate rendering looks.
- Format: JPEG or WebP, 1600 px wide or more, roughly the ratio shown below. Anything within about 6 percent is cropped cleanly. Keep each file under about 2 MB. The site optimises delivery.

## Slots

| Slot id | Ratio | Where it appears | Suggested prompt |
|---|---|---|---|
| `home-hero` | 21:9 (2400 x 1028) | Full-width homepage hero, under white headline text | Wide landscape of layered green ridges in the Akuapem hills of Ghana at first light, soft mist between ridges, warm gold sun low on the horizon, calm and quiet, upper third darker and uncluttered for text, no buildings, no people, no text |
| `vision-setting` | 4:3 (1600 x 1200) | Vision page, "The Akuapem setting" | Gentle tropical hillside landscape in southern Ghana, rolling ridges, mature trees and open grassland, soft afternoon light, natural and unspoilt, no buildings, no people, no text |
| `culture-feature` | 3:2 (1800 x 1200) | Homepage culture section and Culture page | Close, warm still life of handmade craft materials on a wooden table: unpatterned woven baskets, clay pots, carved wooden bowls and dyed plain cloth in deep green, ochre and gold, soft window light, shallow depth of field, no people, no text, no printed or woven patterns |
| `hospitality-feature` | 3:2 (1800 x 1200) | Hospitality page | Distant, soft view of a low timber-and-stone retreat set among trees on a ridge at dusk, warm lights glowing, generic and understated architecture, mist in the valley, no people, no signage, no text |
| `wellness-feature` | 3:2 (1800 x 1200) | Wellness page | Quiet open-air garden terrace at sunrise with a still water basin, smooth stone and low planting, mist over distant hills, serene and minimal, no people, no text |
| `later-life-feature` | 3:2 (1800 x 1200) | Later-life page | Shared garden courtyard with shaded seating, mature trees, gentle paths and flowering shrubs in warm afternoon light, welcoming and calm, no people, no text, no medical or care equipment |
| `plots-feature` | 3:2 (1800 x 1200) | Serviced plots page | Open cleared green land on a gentle ridge with a simple earth track and young trees at golden hour, long soft shadows, no buildings, no markers, no signage, no text |
| `investment-feature` | 16:9 (1920 x 1080) | Investment page | Panoramic view of layered ridges and a wide open green courtyard-like clearing at golden hour, serene and dignified, no buildings, no people, no text |

## Before an image goes live

Ask Sai Legacy Holdings to confirm it does not misrepresent what is proposed, and confirm the generating tool's licence permits use on a public website. Record both in the register entry.
