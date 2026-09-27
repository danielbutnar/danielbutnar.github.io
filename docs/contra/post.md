# Contra post: Portfolio on React and Firebase

Images in this folder, in order. 01 is the cover.

## Title

My portfolio, built as a working React + Firebase app

## Short description

Case studies in English, German and Romanian, an inquiry form on Firestore with a live status page, and a private inbox. Prerendered for GitHub Pages.

## Description

My new portfolio is also a real React + Firebase app, so the stack it talks about is the stack it runs on.

What visitors get:

- Six case studies with the hard parts explained: a client booking site with Stripe, a Contra × Lovable challenge entry, two concept sites and an accessibility study of 44 online shops.
- The whole site in English, German and Romanian.
- An inquiry form that adapts to the topic (a project, a job, something else) and checks each field as you type.
- A status page that changes on its own when I read and answer the inquiry.

What's underneath:

- React 19 and React Router 8, every public page prerendered to HTML for GitHub Pages.
- Firebase Auth (anonymous for visitors, Google for my inbox) and Cloud Firestore in the EU.
- Security rules as the backend: exact fields and lengths, server timestamps, one inquiry per minute per browser through a batched write and getAfter().
- Firebase loads only when someone presses Send: the home page ships none of it.
- 29 security-rule tests against the Firestore emulator, 65 unit tests, and an end-to-end test in Chrome against the emulators, all in GitHub Actions on every push.

Designed in Claude Design and built with Claude Code.

Live: https://danielbutnar.github.io/
Code: https://github.com/danielbutnar/danielbutnar.github.io

## Tools and skills

React, TypeScript, Firebase, Cloud Firestore, Firebase Authentication, React Router, Vite, Vitest, Playwright, GitHub Actions, Web accessibility, Internationalization

## Link

https://danielbutnar.github.io/

## Image captions

- 01-home: The home page: the work list reads like a timetable.
- 02-work-table: Six projects with what they are, what they are built with and their status.
- 03-case-study: A case study: the job, what I built, the hard parts and measured results.
- 04-firebase-flow: How an inquiry travels, from the form through the security rules to my inbox.
- 05-inquiry-form: The inquiry form changes with the topic and checks each field as you type.
- 06-status-page: After sending, the page follows the inquiry live (sample data).
- 07-inbox: The private inbox, owner only (sample data).
- 08-phone-home: On a phone.
- 09-phone-german: The same page in German.

## Short feed post (if you post in the feed instead of, or as well as, a project)

My portfolio is live, and it's a working React + Firebase app: case studies in English, German and Romanian, an inquiry form on Firestore, and a status page that updates the moment I read your message. Security rules do the backend's job, with 29 tests against the emulator. Built in Claude Design and Claude Code.

https://danielbutnar.github.io/
