---
title: "collect user data google forms sheets"
date: 2023-06-19T05:12:06.181Z
slug: collect-user-data-google-forms-sheets
---


---

###  how to collect user data for \$0 using google sheets

---

#### 1. make a form

* go to [forms.google.com](https://forms.google.com)
* click “blank”
* name it something. doesn’t matter
* add fields like:

  * name
  * email
  * feedback
  * rating or whatever you need

---

#### 2. connect it to a sheet

* click on the “responses” tab
* hit the green spreadsheet icon
* pick “create new”
* done. form answers will dump into a sheet now

---

#### 3. share the form

* hit “send” (top right)
* copy the link and send it to people
* or embed it on your site if you care about that
* or email it to your mom

---

#### 4. get data

* open the linked google sheet
* responses come in live, no refresh needed
* want analytics? use `=AVERAGE()`, `=COUNTIF()` or whatever
* or just scroll and squint

---

#### 5. bonus stuff (if you’re feeling fancy)

* auto email on new submission:

  * use “extensions” → “add-ons” → “form notifications”
  * or write a little Apps Script
* want timestamp? already there
* want location? ask the user or build a GPS tracker (jk)

---

and that’s it. zero dollars. no backend. google does the hard work.


