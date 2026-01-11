---
title: "real time internet speed extension"
date: 2024-08-01T16:09:18.506Z
slug: real-time-internet-speed-extension
---

# Building Real-Time Internet Speed: A Simple Tool for Instant Connection Monitoring

Sometimes you just want to know how fast your internet is *right now*. Not a speed test, not a graph, just a simple, real-time number. That's exactly why I made **Real-Time Internet Speed**.

The idea hit me while I was working late one night. My video calls were lagging, and I wasn't sure if it was just Chrome acting up or my connection being bad again. I didn't want to open a full speed test — I just wanted something *always there*, updating every second, showing me exactly what was going on.

So I built it.

The extension sits in the Chrome toolbar and displays your current internet speed, both download and upload, in real-time. No clicking, no waiting. Just raw numbers, changing live as your connection fluctuates.


The real challenge was keeping it lightweight. I didn't want to build something bloated. It had to be fast, minimal, accurate. I used the Chrome extension APIs to monitor network usage and update the icon with the current speed — just enough info, no distractions.

I also added a simple popup with a bit more detail — like peak speed and a small visual indicator — for people who want to glance at more than just the numbers in the toolbar.

Building this was fun because the problem was small but real. I wasn't reinventing anything, just solving a daily annoyance in a simple, focused way.

Now, whether I'm downloading files, on calls, or just watching YouTube, I always know what's happening with my connection. No more guessing. No more "Is it just me?"

That's what I love about extensions — tiny tools that solve tiny problems in a really satisfying way.

---

**[Try Real-Time Internet Speed Monitor on Chrome Web Store](https://chromewebstore.google.com/detail/real-time-internet-speed/baffnjfijbgpjchgdmbnpkloeccnhenl?authuser=0&hl=en-GB)** 