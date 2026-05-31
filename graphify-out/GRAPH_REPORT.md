# Graph Report - C:\Projects\ared.dev  (2026-05-31)

## Corpus Check
- Corpus is ~14,747 words - fits in a single context window. You may not need a graph.

## Summary
- 58 nodes · 22 edges · 40 communities (3 shown, 37 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.88)
- Token cost: 1,250 input · 1,485 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Personal Profile & Projects|Personal Profile & Projects]]
- [[_COMMUNITY_Tech Stack & Portfolio Site|Tech Stack & Portfolio Site]]
- [[_COMMUNITY_Dev Setup & Agent Rules|Dev Setup & Agent Rules]]
- [[_COMMUNITY_App Foundation & Framework|App Foundation & Framework]]
- [[_COMMUNITY_Root Layout Component|Root Layout Component]]
- [[_COMMUNITY_Contact API Route|Contact API Route]]
- [[_COMMUNITY_Content API GET|Content API GET]]
- [[_COMMUNITY_Content API PUT|Content API PUT]]
- [[_COMMUNITY_Storage API GET|Storage API GET]]
- [[_COMMUNITY_Storage API POST|Storage API POST]]
- [[_COMMUNITY_Storage API DELETE|Storage API DELETE]]
- [[_COMMUNITY_ContactForm Component|ContactForm Component]]
- [[_COMMUNITY_HireMeButton Component|HireMeButton Component]]
- [[_COMMUNITY_MarkdownContent Component|MarkdownContent Component]]
- [[_COMMUNITY_ReviewScroll Component|ReviewScroll Component]]
- [[_COMMUNITY_SkillCategory Type|SkillCategory Type]]
- [[_COMMUNITY_ExperienceItem Type|ExperienceItem Type]]
- [[_COMMUNITY_Experience Content|Experience Content]]
- [[_COMMUNITY_ProjectItem Type|ProjectItem Type]]
- [[_COMMUNITY_Project Content|Project Content]]
- [[_COMMUNITY_Hero Section|Hero Section]]
- [[_COMMUNITY_Social Links|Social Links]]
- [[_COMMUNITY_Email Config|Email Config]]
- [[_COMMUNITY_Review Type|Review Type]]
- [[_COMMUNITY_Footer Section|Footer Section]]
- [[_COMMUNITY_Theme Config|Theme Config]]
- [[_COMMUNITY_Page Type|Page Type]]
- [[_COMMUNITY_Section Config|Section Config]]
- [[_COMMUNITY_Layout Config|Layout Config]]
- [[_COMMUNITY_Site Content Type|Site Content Type]]
- [[_COMMUNITY_Default Content Initializer|Default Content Initializer]]
- [[_COMMUNITY_Data GetAllContent|Data GetAllContent]]
- [[_COMMUNITY_Data GetContentSection|Data GetContentSection]]
- [[_COMMUNITY_Data GetTheme|Data GetTheme]]
- [[_COMMUNITY_Data GetLayout|Data GetLayout]]
- [[_COMMUNITY_Data GetPages|Data GetPages]]
- [[_COMMUNITY_Data UpdateContent|Data UpdateContent]]
- [[_COMMUNITY_Supabase Public Client|Supabase Public Client]]
- [[_COMMUNITY_Supabase Admin Client|Supabase Admin Client]]
- [[_COMMUNITY_Google Verification File|Google Verification File]]

## God Nodes (most connected - your core abstractions)
1. `Ajin Varghese Chandy` - 8 edges
2. `ared.dev Portfolio` - 8 edges
3. `Next.js` - 3 edges
4. `create-next-app` - 1 edges
5. `Geist Font` - 1 edges
6. `Vercel` - 1 edges
7. `Tailwind CSS` - 1 edges
8. `Supabase` - 1 edges
9. `PostgreSQL` - 1 edges
10. `Nodemailer` - 1 edges

## Surprising Connections (you probably didn't know these)
- `ared.dev Portfolio` --implements--> `Next.js`  [EXTRACTED]
  public/llms.txt → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **ared.dev Tech Stack** — ared_dev, Next.js, Tailwind_CSS, Supabase, PostgreSQL, Nodemailer, Node.js [EXTRACTED 1.00]
- **Ajin Varghese Chandy Projects** — Ajin_Varghese_Chandy, TaskFlow, RealTime_Speed_Monitor, MongooseNet [EXTRACTED 1.00]

## Communities (40 total, 37 thin omitted)

### Community 0 - "Personal Profile & Projects"
Cohesion: 0.29
Nodes (7): Ajin Varghese Chandy, GitHub, LinkedIn, MongooseNet, Real-Time Internet Speed Monitor, TaskFlow, X/Twitter

### Community 1 - "Tech Stack & Portfolio Site"
Cohesion: 0.29
Nodes (6): Node.js, Nodemailer, PostgreSQL, Supabase, Tailwind CSS, ared.dev Portfolio

### Community 3 - "App Foundation & Framework"
Cohesion: 0.50
Nodes (3): Geist Font, Vercel, create-next-app

## Knowledge Gaps
- **51 isolated node(s):** `RootLayout`, `POST`, `GET`, `PUT`, `GET` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ared.dev Portfolio` connect `Tech Stack & Portfolio Site` to `Personal Profile & Projects`, `Dev Setup & Agent Rules`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `Next.js` connect `Dev Setup & Agent Rules` to `Tech Stack & Portfolio Site`, `App Foundation & Framework`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `Ajin Varghese Chandy` connect `Personal Profile & Projects` to `Tech Stack & Portfolio Site`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ared.dev Portfolio` (e.g. with `Ajin Varghese Chandy` and `Node.js`) actually correct?**
  _`ared.dev Portfolio` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RootLayout`, `POST`, `GET` to the rest of the system?**
  _51 weakly-connected nodes found - possible documentation gaps or missing edges._