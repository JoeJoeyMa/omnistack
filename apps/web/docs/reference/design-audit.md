# Design Audit

Date: 2026-03-15

## Reference Pages Reviewed

- `https://openai.com/`
- `https://openai.com/foundation/`
- `https://openai.com/news/company-announcements/`
- `http://localhost:3000/`

Screenshots saved alongside this note:

- `openai-home.png`
- `openai-foundation.png`
- `openai-news.png`
- `maple-home-before.png`

## What OpenAI Does Well

- Uses a very quiet visual system: soft gradients, large type, generous spacing, minimal chrome.
- Keeps homepage sections simple and repeatable: hero, featured stories, news, stories, research, business, CTA.
- Gives every card somewhere to go. Section overviews and detail pages are both part of the information architecture.
- Long-form pages like `foundation/` use a compact narrative rhythm: short hero, two-column statement block, thematic cards, then resources.
- News index pages stay readable by using lightweight category filters instead of heavy navigation.

## Gaps In The Local MAPLE-GLOBAL Site Before Refactor

- Homepage cards linked back to `/` or placeholder anchors.
- Footer policy links were dead.
- Developer, product, foundation, careers, and policy destinations did not exist.
- About and pricing pages exposed anchor links that had no corresponding sections.
- The homepage resembled the OpenAI layout structurally, but the surrounding site did not have enough supporting pages to make the structure believable.

## Implementation Direction

- Keep the overall editorial rhythm and spacing discipline from the reference pages.
- Do not directly copy OpenAI copy blocks or remote assets into the shipped site.
- Build a content-driven route structure for:
  - news
  - stories
  - research
  - business
  - products
  - developers
  - foundation
  - policies
  - brand
  - careers
- Reuse the existing local images already present in the repository where appropriate, and write original MAPLE-GLOBAL-specific copy around them.
