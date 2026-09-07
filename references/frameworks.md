# Framework placement reference

Read only the section matching the host project.

## Static HTML

Place the module script before `</head>` or near the end of `body`. Place `<digital-human-assistant>` before `</body>`.

## Astro

Add the module script and custom element to the shared layout. Use `is:inline` only when Astro would otherwise transform the external script. With `ClientRouter`, make initialization idempotent and verify navigation does not create duplicate assistants.

## React or Vite React

Load the module once in the application entry or root HTML. Render the custom element in the top-level application shell. In TypeScript projects, add a JSX intrinsic-element declaration instead of wrapping the runtime unnecessarily.

## Next.js

Load the module with `next/script` or from a client component. Render the custom element on the client if hydration reports an unknown-element mismatch. Put it in the root layout when route changes should preserve state.

## Vue

Load the module once in the application entry. Configure the compiler to treat `digital-human-assistant` as a custom element when Vue warns about component resolution.

## Subpath deployments

The hosted runtime and published Manifest use absolute HTTPS URLs, so the host base path should not be prepended. When self-hosting, build for the actual public subpath and verify every nested asset URL.
