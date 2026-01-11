---
title: "dev log identify fix render blocking resources"
date: 2025-09-28T20:52:00.967Z
slug: dev-log-identify-fix-render-blocking-resources
---

# Dev Log: How to Identify and Fix Render-Blocking Resources

---

**Identification:**

1. Use **Google PageSpeed Insights** or **Lighthouse**.
2. Check the **Opportunities** section for "Eliminate render-blocking resources".
3. Look for **CSS** and **JavaScript** files listed.

**Fixing:**

* **CSS:**

  * Inline critical CSS.
  * Load non-critical CSS with:

    ```html
    <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="styles.css"></noscript>
    ```

* **JavaScript:**

  * Add `defer` to scripts:

    ```html
    <script src="script.js" defer></script>
    ```
  * Or `async` for non-dependent scripts:

    ```html
    <script src="analytics.js" async></script>
    ```

* Use **font-display: swap;** in `@font-face` to prevent font blocking.

* Combine/minify files to reduce the number of requests.

* Use a CDN to reduce latency.

---
