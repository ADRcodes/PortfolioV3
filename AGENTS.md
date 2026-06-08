Read order (required)

1. docs/spec.md
2. docs/plan.md
3. docs/todo.md
4. memory-bank/progress.md
5. memory-bank/decisions.md

⸻

Project Goal

Build and maintain a personal portfolio website that showcases:

* Full-stack development work
* AI-focused projects and systems
* Technical experimentation
* Consulting capabilities
* Personal brand and professional identity

The portfolio should communicate:

* Thoughtful problem solving
* Strong technical foundations
* Curiosity and experimentation
* Design awareness
* Practical AI expertise

This is not a generic developer portfolio.

The site should feel personal, memorable, and intentional while remaining professional.

⸻

Design Principles

The portfolio should feel:

* Calm
* Technical
* Thoughtful
* Warm
* Slightly playful

Avoid:

* Corporate stock-site aesthetics
* Generic developer portfolio templates
* Excessive AI buzzwords
* Overly dark cyberpunk styling
* Excessive animations
* Visual clutter

A small amount of personality is encouraged.

The goal is subtle uniqueness, not novelty for its own sake.

⸻

Technical Stack

Frontend:

* React
* Vite
* Tailwind CSS v4
* Motion for React
* React Router

Potential future additions:

* AI-powered portfolio assistant
* RAG over portfolio content
* Blog or writing section
* Analytics
* Contact integrations

No backend is required initially.

⸻

Architecture Principles

Prefer:

* Reusable components
* Shared styling primitives
* Consistent design tokens
* Content-driven architecture
* Data-driven navigation and project structures

Avoid:

* Hardcoded repeated content
* Premature abstractions
* Deep component nesting
* Overengineering

The portfolio should be easy to evolve over time.

⸻

Core Pages

Current planned pages:

* Home
* Projects
* AI Consulting
* Playground
* About
* Contact

Future pages may be added.

Navigation labels should be easy to rename.

⸻

Projects Philosophy

Projects should be presented as case studies rather than simple portfolio cards.

Each project should communicate:

* Problem
* Approach
* Technical decisions
* Outcome
* Lessons learned

Focus on clarity and storytelling.

Avoid long technology lists with no context.

⸻

Playground Philosophy

The Playground is intentionally different from the main portfolio.

Purpose:

* Experiments
* Visual explorations
* Prototypes
* Fun side projects
* Small technical curiosities

The Playground should reinforce creativity without reducing professional credibility.

⸻

Animation Principles

Animations should:

* Feel smooth
* Feel intentional
* Support the user experience
* Respect reduced-motion preferences

Prefer:

* Opacity
* Scale
* Transform
* Layout animations
* Spring-based motion

Avoid:

* Distracting motion
* Scroll hijacking
* Excessive parallax
* Animating everything

Motion should enhance the experience, not become the experience.

⸻

Personal Brand Positioning

Current positioning:

Developer, engineer, and AI-focused builder creating thoughtful systems, tools, and web experiences.

The portfolio should emphasize:

* AI systems
* Automation
* Full-stack development
* Product thinking
* System design
* Practical implementation

Avoid portraying the owner as an AI influencer, guru, or thought leader.

Focus on building and shipping.

⸻

Documentation Structure

docs/spec.md

* Product vision
* Brand direction
* User experience goals

docs/plan.md

* Major roadmap
* Future ideas
* Architectural plans

docs/todo.md

* Actionable implementation tasks

memory-bank/progress.md

* Development history
* Completed work

memory-bank/decisions.md

* Important decisions and rationale

⸻

Definition of Done

A feature is complete when:

* Functionality works
* Responsive layouts work
* Styling follows design system
* Accessibility is considered
* Animations feel polished
* Documentation is updated when appropriate

⸻

Mode System

SYNC

* Read documentation and memory-bank files
* Summarize current state
* Recommend next task
* NO code changes

DOCS

* Update documentation only
* NO source code changes

DO

* Implement exactly ONE unchecked TODO item
* Keep changes focused
* Update memory-bank/progress.md
* Update docs/todo.md

NEXT

* Same as DO
* Work on the next unchecked TODO item

FIX: 

* Fix only the reported issue
* Use the smallest reasonable change
* Update memory-bank/progress.md if needed

One thing I’d add for PortfolioV3 that wasn’t as important for hiRAG is a docs/brand.md.

I think you’re getting to the point where your personal brand actually matters. Having a file that records things like:

* voice and tone
* design inspirations
* colours
* typography
* things you like
* things you dislike
* portfolio goals
* examples of sites you admire

would give agents a much better chance of maintaining consistency over time.