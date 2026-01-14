---
title: "Real-Time Internet Speed Monitor"
date: 2024-12-04T00:00:00.000Z
slug: real-time-internet-speed-monitor
tech: "Chrome Extension (Manifest V3), JavaScript"
liveUrl: "https://chromewebstore.google.com/detail/real-time-internet-speed/baffnjfijbgpjchgdmbnpkloeccnhenl"
github: "https://github.com/aajinn/real-time-internet-speed"
---

## Real-Time Internet Speed Monitoring Chrome Extension

A lightweight Chrome extension that continuously monitors and displays your internet speed in real time directly in the browser toolbar. Built to eliminate the need for external speed test websites and provide instant visibility into connection performance.

### Features

- **Live Speed Tracking**: Automatically measures internet speed at adaptive intervals
- **Toolbar Badge Display**: Shows current speed (Mbps/Kbps) directly on the Chrome toolbar
- **Speed History**: View recent speed test results inside the extension popup
- **Smart Detection**: Handles offline states and unstable connections gracefully
- **Manual Testing**: Trigger instant speed tests via click or keyboard shortcut
- **Privacy-First**: No user data collection or tracking

### Tech Stack

- **Platform**: Chrome Extension (Manifest V3)
- **Language**: Vanilla JavaScript
- **APIs**: Chrome Extensions API (badge, storage, background scripts)
- **UI**: Minimal popup interface optimized for speed and clarity

### Development Process

This project was built with a focus on performance, simplicity, and real-world usability:
- Background service worker for continuous monitoring
- Adaptive polling logic to reduce unnecessary network usage
- Clean badge updates without flicker or UI noise
- Popup UI for detailed speed breakdown and history
- Careful permission scoping to maintain user trust

### Use Case

Designed for:
- Remote workers monitoring connection stability
- Developers and streamers who need constant speed visibility
- Users who want instant feedback without opening new tabs

### Distribution

- Published and publicly available on the **Chrome Web Store**
- One-click install with no setup required
- Actively maintained and compatible with modern Chrome versions

### Future Enhancements

- Customizable refresh intervals
- Upload vs download speed separation
- Visual charts for long-term speed trends
- Optional alerts for speed drops or disconnections
