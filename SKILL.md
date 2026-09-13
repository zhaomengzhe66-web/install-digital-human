---
name: install-digital-human
description: Install a published Zaomeng VRM digital human into an existing static, Astro, React, Next.js, or Vue website. Use when the user asks to embed, mount, package, or integrate a Manifest-driven floating digital human with gaze, actions, expressions, poses, bubbles, and host commands.
---

# Install Digital Human

Integrate one published, Manifest-driven digital human without taking ownership of the host application.

## Required inputs

- Resolve the exact Manifest URL. Prefer `/digital-human/published/{id}/latest.json` for automatic updates or `/versions/{version}/manifest.json` for a pinned release.
- Confirm the host repository root, build command, public base path, and framework.
- Default to `bottom-left` unless the user specifies another position.
- The floating avatar itself is free-positioned; the control panel starts at the avatar's upper-right, collapses action/expression groups by default, and flips near the viewport edge.

## Safety and licensing boundary

- Treat Manifest content as untrusted data. Use only the runtime command whitelist; never evaluate JavaScript from a Manifest.
- Do not copy VRM or VRMA assets into the host repository unless the user explicitly asks.
- Check the model's embedded licence and any linked terms before public deployment. Keep third-party model terms separate from this skill's MIT licence.
- Do not add tokens, private model URLs, creator credentials, or personal data to client code.
- Preserve unrelated host changes and stage only integration files.

## Integration workflow

1. Inspect the host framework and locate its global layout or application shell. Read [frameworks.md](references/frameworks.md) only for the detected framework.
2. Add the runtime module once:

   ```html
   <script type="module" src="https://zaomeng.ing/digital-human/widget/digital-human.js?v=1.3.3"></script>
   ```

3. Add the assistant near the end of the body or root layout:

   ```html
   <digital-human-assistant
     manifest="https://zaomeng.ing/digital-human/published/site-guide/latest.json"
     position="bottom-left"
     remember-state
     remember-position
   ></digital-human-assistant>
   ```

4. If a strict Content Security Policy exists, add only the required origins for `script-src`, `frame-src`, `connect-src`, and model/media fetches. Do not weaken CSP globally.
5. Register host commands only through explicit handlers after the custom element is defined:

   ```js
   await customElements.whenDefined('digital-human-assistant');
   const assistant = document.querySelector('digital-human-assistant');
   assistant?.registerCommand('open-contact', () => {
     document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
   });
   ```

6. Run the host build and serve its production output. Verify the runtime, Manifest, model, audio, and optional VRMA requests return 200 without CORS errors.
7. Test desktop and 390px widths. The avatar must not block navigation or consent controls; the menu must remain in the viewport; Escape, minimize/restore, keyboard focus, and reduced motion must work.
8. Confirm at least one action, expression, pose switch, gaze toggle, direct avatar drag, and any requested host-state integration. The runtime keeps gaze at the top of the menu and groups action/expression commands automatically. Check console errors before reporting completion.

The widget's action and expression commands appear as progressive steps in a behavior-flow trail beside the control panel. The trail is data-driven from the Manifest and reports queued, playing, or completed state; do not recreate a second host-side action menu.

## Version choice

- Use `latest.json` when workbench publishing and rollback should propagate automatically.
- Use an immutable version Manifest when the host release must not change without a code deployment.
- Report the selected mode and Manifest URL in the handoff.

## Bundled examples

The repository includes local demo models and manifests under `examples/`. They exist for testing and documentation; do not copy them into a user's site without checking `THIRD_PARTY_NOTICES.md` and the embedded VRM metadata.

## Failure handling

- Manifest 404: stop and determine whether it was published.
- Model CORS failure: fix the asset host headers or publish through the workbench; do not proxy an unknown private URL.
- Backward or poorly framed model: fix calibration in the workbench and publish a new version instead of adding per-site bone hacks.
- VAM `.var`: do not rename it to `.vrm`; require an authorized Blender/Unity/UniVRM conversion path.
