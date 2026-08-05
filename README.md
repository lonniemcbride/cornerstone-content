# Cornerstone

Cornerstone is an installable content operations app with scheduling, ideation, encrypted API/MCP credentials, and collaborative workspaces.

## Install

1. Host this folder on any HTTPS-capable static web host.
2. Open `index.html` from the hosted URL.
3. Choose **Install Cornerstone** in the sidebar or use the browser's **Install app / Add to Home Screen** action.

The included service worker enables offline launch after the first successful visit.

## Invitations

Workspace owners can create pending invitations and copy invite links from the Workspaces screen. The included local implementation is suitable for demos and single-browser testing. Cross-device access control, email delivery, expiration enforcement, authentication, and signed single-use invitations require a hosted backend and identity provider.

## Credential security

API and MCP credentials use AES-256-GCM authenticated encryption with PBKDF2-SHA-256 key derivation. The master password is never stored.
