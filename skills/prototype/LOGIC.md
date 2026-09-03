# Logic prototype

Build a single, self-contained HTML file that lets anyone drive a state model by clicking buttons. Use this branch for questions about business logic, state transitions, or data shape: cases that look reasonable on paper but feel wrong once exercised.

The file must require nothing to install. A designer, product manager, or domain expert should be able to open it and test the model without reading code. Use domain language throughout.

## When this is the right shape

- "Does this state machine handle X followed by Y?"
- "Can this data model represent this edge case?"
- "What should this API feel like before we implement it?"
- Any question answered by pressing buttons and watching state change.

For questions about appearance, use [UI.md](UI.md).

## Process

### 1. State the question

Put one paragraph at the top of the visible demo naming the state model and the exact question. The user must be able to check that the demo answered the intended question.

### 2. Isolate the logic in a portable module

Put the logic in one `<script>` block as a small, pure module that could be rewritten cleanly in the production codebase after validation. Keep the page as a thin caller.

Choose the shape that fits the question:

- **Pure reducer:** `(state, action) => state`, for discrete events over one state value.
- **State machine:** explicit states and transitions, when legal actions depend on the current state.
- **Pure functions over plain data:** when there is no implicit current state.
- **Class or module with a small method interface:** when the logic genuinely owns ongoing internal state.

Keep DOM access and event handlers outside the logic module. The page calls the logic; the logic never calls the page.

### 3. Build the shareable HTML file

Use one plain HTML, CSS, and JavaScript file. Use no framework, bundler, server, or external dependency. It must open directly and remain usable when sent to another person.

Lay it out from top to bottom:

1. **Question.** Show the title and one-line explanation from step 1.
2. **Current state.** Render every relevant field with domain labels. Refresh it after every action and identify the latest change where useful.
3. **Free play.** Provide one always-available button per action so the user can exercise the model in any order.
4. **Guided walkthroughs.** Put each scenario in a separate tab. Explain the setup and what to observe, then provide the ordered action buttons. Starting a walkthrough resets the model to a known state.

Cover the happy path, the awkward edge cases, and an action that should be illegal. Use restrained typography, spacing, and one accent colour. Keep attention on state and controls.

### 4. Hand it over

Provide the file and simple opening instructions. Wait for the user or relevant domain expert to exercise it. Treat reactions such as "that should not be possible" or "I assumed this behaved differently" as findings about the proposed model.

Add actions or scenarios only when they help answer the original question. Split the question if the prototype expands beyond one sitting.

### 5. Capture the answer

Record the question and verdict where the production work tracks decisions. Preserve the demo only under the capture rules in [SKILL.md](SKILL.md). Reimplement validated logic through the normal production workflow rather than copying prototype code without tests and hardening.

## Guardrails

- Keep the demo test-free and in memory unless the question specifically concerns persistence.
- Keep the scope to one question rather than generalising for possible future cases.
- Keep the logic independent of the DOM.
- Use one directly opened file rather than a framework or server.
- Keep the HTML shell out of production. Reimplement any validated logic under the project's normal engineering standards.
