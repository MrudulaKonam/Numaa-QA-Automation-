# NuMaa Regression Test Suite

Generated from `Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx` (370 cases).

Each module below has its own Playwright spec file under `tests/`. Agent specs are grouped under `tests/agents/`. Tests that require account state use the `TEST_EMAIL` and `TEST_PASSWORD` environment variables; camera and microphone flows receive browser permissions from Playwright configuration.

## Modules

- **NUT** (`tests/agents/nutrition-agent.spec.ts`) — 27 cases
- **CNT** (`tests/agents/content.spec.ts`) — 25 cases
- **MTM** (`tests/agents/mom-to-mom.spec.ts`) — 25 cases
- **PHYS** (`tests/agents/physical-activity.spec.ts`) — 25 cases
- **KICK** (`tests/agents/kick-counter.spec.ts`) — 22 cases
- **MH** (`tests/agents/mental-health.spec.ts`) — 22 cases
- **MED** (`tests/agents/medication-agent.spec.ts`) — 21 cases
- **ASK** (`tests/agents/ask-numaa.spec.ts`) — 19 cases
- **ABOUT** (`tests/about-page.spec.ts`) — 17 cases
- **LIB** (`tests/library.spec.ts`) — 15 cases
- **TRV** (`tests/agents/travel.spec.ts`) — 14 cases
- **JRN** (`tests/agents/journal.spec.ts`) — 13 cases
- **CHK** (`tests/agents/checklist.spec.ts`) — 12 cases
- **GAME** (`tests/agents/gamifier.spec.ts`) — 11 cases
- **Misc** (`tests/misc.spec.ts`) — 10 cases
- **AUTH** (`tests/auth.spec.ts`) — 5 cases
- **RES** (`tests/resources.spec.ts`) — 8 cases
- **NAV** (`tests/navigation.spec.ts`) — 6 cases
- **FTR** (`tests/footer.spec.ts`) — 5 cases
- **Baby** (`tests/baby.spec.ts`) — 4 cases
- **QUIZ** (`tests/quiz.spec.ts`) — 1 case
- **SVC** (`tests/services.spec.ts`) — 3 cases
- **SVCPG** (`tests/services-page.spec.ts`) — 3 cases
- **BLG** (`tests/blog.spec.ts`) — 2 cases
- **TLS** (`tests/tools.spec.ts`) — 2 cases
- **SEO** (`tests/seo.spec.ts`) — 2 cases
- **BABY** (`tests/baby.spec.ts`) — 2 cases
- **NUTPG** (`tests/nutrition-page.spec.ts`) — 2 cases
- **PAT** (`tests/patterns.spec.ts`) — 2 cases
- **CTA** (`tests/cta.spec.ts`) — 1 cases
- **ERR** (`tests/errors.spec.ts`) — 1 cases
- **HERO** (`tests/hero.spec.ts`) — 1 cases
- **CASE** (`tests/case.spec.ts`) — 1 cases
- **Services** (`tests/services.spec.ts`) — 1 cases
- **Service** (`tests/service.spec.ts`) — 1 cases
- **LOAD** (`tests/loading.spec.ts`) — 1 cases
- **TST** (`tests/test.spec.ts`) — 1 cases
- **FEA** (`tests/features.spec.ts`) — 1 cases

For CI, add `TEST_EMAIL` and `TEST_PASSWORD` as GitHub Actions repository secrets. Backend- or AI-generated workflows still require deterministic API fixtures before they can be enabled safely.
