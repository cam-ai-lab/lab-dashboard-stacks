# Low-Code Comparison Notes

Retool, Appsmith, ToolJet, and Budibase are evaluated separately because their primary artifact is a configured application rather than this Git-deployed source tree.

## Common test app

Build a dashboard with a four-card widget list, add-widget form, refresh button, configuration-status panel, and activity table. Connect it to a disposable Postgres database containing the `widgets` schema from the Render app. Use a mocked REST resource for refresh and keep all credentials in each product's secret/resource manager.

## Product-specific exercise

| Product | Build | Data connection | Additional screen |
|---|---|---|---|
| Retool | Web app with queries and event handlers | Retool Database or Postgres resource | Admin query/debug panel |
| Appsmith | Drag-and-drop dashboard with JS Objects | Postgres datasource and mock REST API | Datasource status page |
| ToolJet | Dashboard using query manager | ToolJet DB or Postgres | Run-history table |
| Budibase | App generated from data, then customized | Built-in DB or external Postgres | Form and automation history |

## Compare

Measure first-run time, Git/version-control fidelity, reusable components, query debugging, secret visibility, role-based access, audit logs, scheduled automation, self-hosting effort, responsive UI control, testability, backup/export quality, and pricing at the expected user count.

Code-first stacks provide stronger local tests, reviewable diffs, portability, and arbitrary backend behavior. Low-code platforms usually deliver internal CRUD, permissions, and datasource integration faster, but introduce platform-specific state, less precise code review, and a different deployment/rollback model.
