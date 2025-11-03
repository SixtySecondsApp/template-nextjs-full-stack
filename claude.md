# Claude Operating Guide – Always Follow Living Cursor Rules

> This file is a pointer. Claude must read and obey the authoritative rule sources on every run so the guidance always stays current.

## Primary Rule Sources
- [cursor-rules.md](cursor-rules.md) – global architecture, naming, testing, and forbidden practices.
- [00-architecture.mdc](.cursor/rules/00-architecture.mdc) – hexagonal architecture overview and dependency flow.
- [10-api-controllers.mdc](.cursor/rules/10-api-controllers.mdc) – Next.js controller rules and error mapping.
- [20-prisma-repositories.mdc](.cursor/rules/20-prisma-repositories.mdc) – repository contracts, soft delete expectations, and Prisma usage.
- [30-mappers.mdc](.cursor/rules/30-mappers.mdc) – mapping rules between domain, DTO, and persistence layers.
- [40-events.mdc](.cursor/rules/40-events.mdc) – domain event publication and handler requirements.
- [50-feature-clients.mdc](.cursor/rules/50-feature-clients.mdc) – reference implementation for end-to-end features.
- [60-errors-validation.mdc](.cursor/rules/60-errors-validation.mdc) – validation schemas and error enum patterns.
- [70-feature-generator.mdc](.cursor/rules/70-feature-generator.mdc) – mandatory checklist for new feature scaffolding.

Keep these links intact. Update the rule files themselves when behaviour changes—`claude.md` should rarely need edits beyond link maintenance.

## Daily Operating Checklist
1. **Identify context** for the requested change (architecture, API route, repository, mapper, domain event, generator) and open the matching rule file(s).
2. **Review `cursor-rules.md`** for any recent changes in global standards before modifying or generating code.
3. **Follow project-wide workflow directives**: maintain `plan.md`, keep diffs focused, run linting/tests when applicable, and never remove user changes without instruction.
4. **Cite and cross-link** relevant rules in responses when clarification helps the user.
5. **Re-check rules** whenever the user attaches, modifies, or references requirement documents to ensure alignment.

## Rule Lookup Table
| Scenario | What to read | Key reminders |
| --- | --- | --- |
| Creating or updating API routes | [10-api-controllers.mdc](.cursor/rules/10-api-controllers.mdc) | Keep controllers thin, validate with `zod`, map errors to 400/404/500. |
| Implementing persistence logic | [20-prisma-repositories.mdc](.cursor/rules/20-prisma-repositories.mdc) | Respect ports, use mappers, enforce soft delete defaults. |
| Working on mappers | [30-mappers.mdc](.cursor/rules/30-mappers.mdc) | Never leak Prisma types outside infrastructure; provide `toDomain`, `toDto`, `toPersistence`. |
| Publishing/handling events | [40-events.mdc](.cursor/rules/40-events.mdc) | Emit immutable domain events; handle side effects in infrastructure. |
| Scaffolding a new feature | [70-feature-generator.mdc](.cursor/rules/70-feature-generator.mdc) | Complete the checklist end-to-end, mirror the Clients feature. |

## Additional Obligations
- Track active objectives in [`plan.md`](plan.md) and update task status as work progresses.
- Honour project-wide guardrails: no secrets, UK English, dependency inversion, soft delete, and clean architecture boundaries.
- Run linting and targeted tests after substantive edits; report results and any gaps.
- Warn the user before introducing dependencies larger than 50 MB to ensure Vercel compatibility.
- Maintain concise, citation-backed communication that references the canonical rule files instead of copying them here.

**Last Reviewed**: 2025-11-03 — Refresh links and summaries whenever new rule files are added or renamed.
