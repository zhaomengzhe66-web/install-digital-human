# Changelog

## 1.3.2 — 2026-09-13

- Keep the drag envelope compact enough for the visible character to reach the lower viewport while preserving an oversized transparent render surface.

## 1.3.1 — 2026-09-13

- Bump the runtime cache key after the free-render hit-area fix so browsers cannot reuse the pre-fix widget bundle.

## 1.3.0 — 2026-09-13

- Decouple the floating avatar render surface from the compact hit area so zoomed models are not clipped by a rectangular frame.
- Keep gaze-follow and wheel zoom active through the host widget boundary.
- Anchor the control panel to the avatar's upper-right by default, flip it near the viewport edge, and keep action/expression groups collapsed until requested.
- Add a progressive behavior-flow trail to the right of the panel; selected actions and expressions report queued, playing, and completed states.
- Refresh the published widget URL and example package version to `1.3.0`.

## 1.2.0 — 2026-09-13

- Restore gaze-follow pointer relay when the host owns avatar drag input.
- Restore mouse-wheel camera zoom through the widget boundary.
- Store free positions against the visible avatar bounds so the character can reach the viewport edges.
- Remove the detached “控制” button and make 动作 / 表情 groups collapsible.

## 1.1.1 — 2026-09-12

- Document the `?v=1.1.0` runtime URL so hosts avoid stale cached widget bundles.
- Record the mobile free-position clamp fix: dragging is bounded by the visible avatar, not the full menu shell.

## 1.1.0 — 2026-09-12

- Document the corrected five-action / six-expression runtime set shared by the bundled VRM examples.
- Document grouped assistant controls, direct avatar dragging, keyboard position nudging, and position persistence.

## 1.0.0 — 2026-09-07

- Publish the standalone `install-digital-human` Codex skill.
- Add framework-specific integration guidance and production QA requirements.
- Add a browser demo with VRM 0.x and VRM 1.0 sample manifests.
- Add deterministic repository and model-integrity validation.
