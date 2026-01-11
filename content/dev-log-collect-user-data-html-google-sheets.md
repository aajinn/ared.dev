---
title: "dev log collect user data html google sheets"
date: 2023-08-06T04:52:13.544Z
slug: dev-log-collect-user-data-html-google-sheets
---

# Dev Log: Can I Collect User Data Using Just HTML and Google Sheets?

---

Needed a quick way to collect user input—name, email, feedback—but didn’t want to set up a backend or database. Tried doing it with just HTML and Google Sheets. It worked.

---

Created a Google Form linked to a Google Sheet. Copied the form’s share link and embedded it in the site:

```html
<iframe src="https://docs.google.com/forms/d/e/FORM_ID/viewform?embedded=true" width="100%" height="600" frameborder="0">Loading…</iframe>
```

Data goes straight into the linked Google Sheet. No code, no API.

---

Tested another approach using a script published as a web app from Google Apps Script.
Steps:

1. Open a Google Sheet
2. Go to **Extensions > Apps Script**
3. Pasted this script:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.name, data.email, data.message, new Date()]);
  return ContentService.createTextOutput("Success");
}
```

4. Deployed as a web app (set access to “Anyone”)
5. Got the web app URL and posted to it from HTML:

```html
<form id="form">
  <input name="name" placeholder="Name" required />
  <input name="email" placeholder="Email" required />
  <textarea name="message" placeholder="Message"></textarea>
  <button type="submit">Send</button>
</form>

<script>
  const form = document.getElementById('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    await fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    form.reset();
  });
</script>
```

---

Everything submitted via the form showed up instantly in the sheet. No backend. Just HTML + Google Sheets + a bit of script glue.

Works great for small projects or MVPs. No DB setup, no hosting. 