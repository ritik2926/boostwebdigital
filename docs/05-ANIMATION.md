# Animation

Superseded by **[12-DESIGN-STANDARDS.md §6–7](12-DESIGN-STANDARDS.md)** — the Motion System and Interaction System sections there are the authoritative spec (library decision tree, easing/duration/stagger values, cursor/magnetic physics). Read that before implementing any animation.

This file stays as a short pointer plus the reasoning worth keeping in mind:

- **Why Framer Motion is the default, not a restriction:** this project is hand-copied from AI-generated code into VS Code by a non-programmer. Every additional library is a real transcription-risk cost (missing imports, wrong file, unsaved edits), not a free choice — see the "Lessons already paid for" section in [CLAUDE.md](../CLAUDE.md). When introducing a library for the first time on a feature, be explicit about the new setup it requires and confirm the file actually saved.
- **The cursor-lerp precedent:** Framer Motion's `useSpring` wrapping a raw cursor `useMotionValue` (spring `stiffness:60, damping:20, mass:0.8`) was evaluated directly against a GSAP-based implementation for the classic cursor-glide effect and covered the need without a second library. This is the baseline cursor-physics value now formalized in [12-DESIGN-STANDARDS.md §7](12-DESIGN-STANDARDS.md).
- Tooling itself is open (Framer Motion, GSAP/ScrollTrigger, Three.js/R3F, Canvas, SVG, WebGL) per [CLAUDE.md](../CLAUDE.md) — pick the right tool per the decision tree in the Design System, never by default or by trend.
