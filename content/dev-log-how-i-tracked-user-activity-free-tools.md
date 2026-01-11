---
title: "dev log how i tracked user activity free tools"
date: 2023-06-17T00:36:23.474Z
slug: dev-log-how-i-tracked-user-activity-free-tools
---

# Dev Log: How I Tracked Website User Activity Using Free Tools

---

Needed to track what users were doing on the site—clicks, scrolls, and maybe some form interactions. Didn’t want to pay for analytics tools or build a custom solution just to get basic data.

Started with Google Analytics (GA4). Created a new property, dropped the script into the site:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
</script>
```

Enabled Enhanced Measurement in GA4 settings—automatically started tracking scrolls, outbound clicks, and more. Didn’t write any custom events.

Added some basic UTM parameters to links in emails and social posts to see which sources were sending traffic.

Then used Microsoft Clarity. Signed up, got a script similar to GA, and added it to the site. Got heatmaps, click maps, and session recordings without doing anything extra.

Realized Clarity was showing things GA wasn’t—like where users rage-clicked or hovered for a long time. Helped find dead spots in the UI.

Also tested a quick custom logger for internal testing:

```js
document.addEventListener('click', (e) => {
  console.log('User clicked:', e.target);
});
```

Didn’t keep it in production, but it helped debug a few flows locally.

End result: full visibility into what users were doing, no cost, minimal setup. Didn’t need to build or maintain anything. Just scripts, settings, and a few minutes of config. 