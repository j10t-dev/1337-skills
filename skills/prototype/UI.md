# UI prototype

Generate several radically different UI variants on one route, switchable from a floating bottom bar. The user compares runnable variants, chooses one or combines parts, then production work reimplements the decision.

For questions about logic or state, use [LOGIC.md](LOGIC.md).

## When this is the right shape

- "What should this page look like?"
- "Show several dashboard directions before we commit to one."
- "Try a different structure for the settings screen."
- Any UI decision that needs concrete alternatives rather than verbal descriptions.

## Choose where to mount the variants

Prefer the existing page. Real navigation, data, authentication, and content density expose design problems that an isolated mock-up hides.

### Existing page

Render each variant on the existing route, selected by a `?variant=` URL search parameter. Keep existing data fetching and route parameters. Swap only the rendered subtree.

A new section, card, or flow step that naturally belongs inside an existing page still uses this approach.

### New prototype route

Use a new route only when the proposed UI has no plausible existing host. Follow the project's routing convention and include `prototype` in its path or filename. Use the same `?variant=` mechanism.

Before creating the route, confirm that embedding the variants in an existing page would misrepresent the question.

## Process

### 1. State the question and variant count

Default to three variants and cap the set at five. Put a one-line plan in the prototype location or a top-of-file comment:

> Three variants of the settings page, switchable through `?variant=`, on the existing `/settings` route.

### 2. Build structurally different variants

Each variant must respect:

- the page's purpose and available data;
- the project's component library and styling system;
- a clear exported component name, such as `VariantA`, `VariantB`, or `VariantC`.

Make the variants disagree about layout, information hierarchy, or primary interaction. Differences limited to colour, type, spacing, or copy do not test a design direction. Redo any pair that has the same structure.

### 3. Wire them together

Use one switcher at the rendering boundary. Adapt this pseudocode to the project's framework:

```tsx
const variant = searchParams.get("variant") ?? "A";

return (
  <>
    {variant === "A" && <VariantA {...data} />}
    {variant === "B" && <VariantB {...data} />}
    {variant === "C" && <VariantC {...data} />}
    <PrototypeSwitcher variants={["A", "B", "C"]} current={variant} />
  </>
);
```

On an existing page, retain data fetching above this boundary. On a new page, mount the same switcher under the temporary prototype route.

### 4. Build the floating switcher

Place a small, fixed bar at the bottom centre of the viewport with:

- a left control that cycles to the previous variant and wraps;
- the current key and a short structural name, such as `B, sidebar layout`;
- a right control that cycles forward and wraps.

Clicking a control must update the URL through the framework's router so each variant remains shareable and stable across reloads. Left and right arrow keys must also cycle. Ignore those keys while an `input`, `textarea`, or editable element has focus.

Style the switcher as a high-contrast evaluation control rather than part of any variant. Gate it behind the project's development-only mechanism so it cannot appear in a production build.

Keep the switcher in one shared prototype component. Do not force the variants to share their layout.

### 5. Hand it over

Provide the route and all `?variant=` values. Wait for the user to compare them and give a verdict. The user may choose one variant or combine named parts from several. Never choose for them.

When asking for a UI decision, provide the actual runnable variants or captured mock-ups. Do not ask the user to imagine them from prose.

### 6. Capture the answer

Record the selected direction and reasons. Preserve the complete variant set only under the capture rules in [SKILL.md](SKILL.md).

Reimplement the accepted design through the normal production workflow:

- On an existing page, replace its rendering with the accepted design and leave out losing variants and the switcher.
- For a new page, create the production route from the accepted direction and leave out the temporary route and switcher.

Prototype code was written without production tests and hardening. Treat it as evidence, not production code.

## Guardrails

- Make variants structurally different rather than changing only colour or copy.
- Share low-level components where useful, but let every variant own its layout.
- Use read-only data or stubs for mutations unless mutation behaviour is the question.
- Keep the switcher and rejected variants out of the production change.
- Require the user's explicit verdict before ending the prototype session.
