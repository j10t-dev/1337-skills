---
name: brainstorming
description: Use when creating or developing, before writing code or implementation plans - refines rough ideas into fully-formed designs through collaborative questioning, alternative exploration, and incremental validation. Don't use during clear 'mechanical' processes
---

# Brainstorming Ideas Into Designs

## Overview

Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

**Announce at start:** "I'm using the brainstorming skill to refine your idea into a design."

Start by understanding the current project context, then ask questions via the AskUserQuestion tool to refine the idea. Once you understand what you're building, present the design, highlighting uncertainties and pending questions.

## The Process

**Understanding the idea:**
- Check out the current project state first (files, docs, recent commits)
- Ask questions via the AskUserQuestion tool.
- Prefer multiple choice questions when possible, but open-ended is fine too
- If a topic needs more exploration, break it into multiple questions
- Focus on understanding: purpose, constraints, success criteria, common gotchas and footguns.

**Exploring approaches:**
- Propose 2-3 different approaches with trade-offs
- Present options conversationally with your recommendation and reasoning
- Lead with your recommended option and explain why

**Presenting the design:**
- Once you believe you understand what you're building, present the design
- Cover: architecture, components, data flow, error handling, testing
- Be ready to go back and clarify if something doesn't make sense

## After the Design

**Documentation:**
- Write the validated design to `DESIGN.md`

**Implementation (if continuing):**
- Ask: "Ready to proceed to implementation planning?"
- **REQUIRED SUB-SKILL:** Use 1337-skills:writing-plans to create detailed implementation plan

## Key Principles

- **Use AskUserQuestion tool** - Structure questions with multiple choice options to avoid overwhelming the user
- **Multiple choice preferred** - Easier to answer than open-ended when possible
- **YAGNI ruthlessly** - Remove unnecessary features from all designs
- **Explore alternatives** - Always propose 2-3 approaches before settling
- **Be flexible** - Go back and clarify when something doesn't make sense
