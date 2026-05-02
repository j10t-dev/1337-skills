---
name: brainstorming
description: Use when creating or developing, before writing code or implementation plans. Not for clear 'mechanical' processes
---

# Brainstorming Ideas Into Designs

## Overview

Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

<HARD-GATE>
Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it.
</HARD-GATE>

**Announce at start:** "I'm using the brainstorming skill to refine your idea into a design."

Start by understanding the current project context, then ask questions one at a time to refine the idea. Once you understand what you're building, present the design in manageable sections, checking after each section whether it looks right so far.

## The Process

**Understanding the idea:**
- Check out the current project state first (files, docs, recent changes)
- Ask questions one at a time to refine the idea
- Prefer open-ended questions that include 2-4 concrete suggestions or examples to help the user respond
- Only one question per message - if a topic needs more exploration, break it into multiple questions
- Focus on understanding: purpose, constraints, success criteria, common gotchas and footguns

**Exploring approaches:**
- Propose 2-3 different approaches with trade-offs
- Present options conversationally with your recommendation and reasoning
- Lead with your recommended option and explain why

**Presenting the design:**
- Once you believe you understand what you're building, present the design
- Break it into digestible sections
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing
- Be ready to go back and clarify if something doesn't make sense

## After the Design

**Documentation:**
- Design and plan documents always live in an external docs repo, separate from the code repo
- `$DOCS_ROOT` is the docs repo root. Use the `DOCS_ROOT` environment variable if set; otherwise default to `~/dev/j10t-docs`
- Designs: `$DOCS_ROOT/$projectName/designs/`
- Plans: `$DOCS_ROOT/$projectName/plans/`
- Determine `$projectName` from the repo directory name unless the user specifies a different docs project name
- Determine the document slug:
  - If the current jj bookmark or change description is a good semantic identifier, you may reuse its slug
  - Otherwise ask the user for a feature/design slug
- Design file: `$DOCS_ROOT/$projectName/designs/<slug>.md`
- Create the target directory if it doesn't exist
- Write the validated design to that filename
- VCS for the docs repo is the user's responsibility. Do not run jj/git commands in `$DOCS_ROOT` unless the user explicitly asks

**Design review (before sharing with user):**
Review the design yourself before sharing it.

**Inline self-review checklist:**
- **Completeness:** Purpose, constraints, success criteria, architecture, components, data flow, error handling, and testing are covered.
- **Internal consistency:** The design does not contradict itself across sections.
- **Scope control:** The design is focused enough for one implementation plan; unrelated subsystems are split out or marked as future work.
- **Ambiguity:** Open questions are explicit; assumptions are labelled.
- **No placeholders:** Remove `TBD`, `TODO`, vague component names, and undefined references.
- **Implementation readiness:** A plan writer can turn the design into concrete tasks without session history.

Fix any issues inline before sharing the design with the user.

**Implementation (if continuing):**
- Ask: "Ready to proceed to implementation planning?"
- Use the `writing-plans` skill to create the detailed implementation plan

## Key Principles

- **One question at a time** - Don't overwhelm with multiple questions in one message
- **Open-ended with concrete suggestions** - Give 2-4 examples or likely options to make answering easier
- **Incremental validation** - Present design in sections, validate each before continuing
- **YAGNI ruthlessly** - Remove unnecessary features from all designs
- **Explore alternatives** - Always propose 2-3 approaches before settling
- **Be flexible** - Go back and clarify when something doesn't make sense
