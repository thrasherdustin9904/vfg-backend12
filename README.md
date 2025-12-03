# VF Gaming - GitHub-ready backend (mobile upload friendly)

This repo is optimized for uploading directly from a mobile device into GitHub's web UI.
All files live at the repository root so you can select *all files* and upload them in one action.

Quick start (local):
1. Copy `.env.example` -> `.env` and fill values
2. npm install
3. npm start

Deploy to Render:
- Push to GitHub and connect repo to Render
- Configure env vars in Render (MONGODB_URI, JWT_SECRET, STRIPE keys, SENDGRID_API_KEY, EMAIL_FROM, PUBLIC_URL)
