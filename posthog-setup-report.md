# PostHog post-wizard report

The wizard completed a targeted PostHog integration for this Next.js App Router project. The browser and Node.js SDKs are installed, client analytics and exception capture initialize from environment variables, and the server client flushes events in short-lived route handlers. Autocapture and session recording remain enabled at their defaults. Reader engagement, navigation, filtering, administrative API outcomes, and server exceptions are now tracked. Signed-in Clerk users are identified with their stable user ID, while personal details remain person properties rather than event properties.

| Event | Description | File |
|---|---|---|
| `article_opened` | A reader selected an article from the home news feed. | `components/home/HomeNewsCard.tsx` |
| `related_story_selected` | A reader selected a related story from an article page. | `components/article/RelatedStories.tsx` |
| `newsletter_subscribed` | A reader submitted the newsletter subscription form without sending the email as an event property. | `components/article/NewsletterBanner.tsx` |
| `ai_summary_feedback_requested` | A reader requested to provide feedback on an AI-generated article summary. | `components/article/SidebarAiSummary.tsx` |
| `category_filter_changed` | A reader selected or cleared a news category filter. | `components/home/CategoryBar.tsx` |
| `navigation_tab_selected` | A reader selected a primary navigation tab. | `components/home/HomeNavbar.tsx` |
| `scrape_pipeline_completed` | An authorized article scraping pipeline request completed successfully. | `app/api/scrape/route.ts` |
| `ai_analysis_pipeline_completed` | An authorized AI article analysis pipeline request completed successfully. | `app/api/analyze/route.ts` |
| `sources_loaded` | The active source API returned the available source catalog. | `app/api/sources/route.ts` |
| `logs_loaded` | The administrative logs API returned recent pipeline logs. | `app/api/logs/route.ts` |

## Next steps

A dashboard was created for the analytics contract. The new custom events have not yet been ingested, so insights were not created against unverified schema entries. Trigger the instrumented flows, confirm ingestion, and then add trend and conversion insights using these exact event names.

- [Analytics basics (wizard)](https://us.posthog.com/project/521784/dashboard/1880796)

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code. The wizard build currently passes.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to each deployment environment.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the deployment bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm a returning signed-in Clerk session calls `identify` with the same stable user ID.
- [ ] Trigger all ten custom events and confirm they arrive before creating saved insights.

### Agent skill

An agent skill folder remains in the project at `.claude/skills/integration-nextjs-app-router`. It provides current framework-specific context for further PostHog development with Claude Code.
