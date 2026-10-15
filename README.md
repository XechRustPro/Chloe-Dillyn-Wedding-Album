# Chloe & Dillyn's Wedding Album

A romantic, responsive wedding album landing page built with plain HTML, CSS, and JavaScript. Designed for guests to open from a QR code on their phones.

## What's included

- Responsive layout for phones, tablets, and desktops
- Wedding-themed illustrations, subtle reveal animations, and reduced-motion support
- Photo picker with previews, drag-and-drop, multiple image selection, and optional guest name/note
- Optional Cloudinary upload integration
- No build step or framework required

## Important: photo uploads need storage

GitHub Pages only hosts static files. It does **not** accept or store guest uploads. The upload form is intentionally not shown as successful until a storage provider is configured.

This project is prepared to upload images directly to Cloudinary using an **unsigned upload preset**. Configure it before sharing the QR code.

### Connect Cloudinary uploads

1. Create a Cloudinary account at https://cloudinary.com/.
2. In the Cloudinary console, open **Settings → Upload** and find **Upload presets**. Create a preset and set its signing mode to **Unsigned**.
3. Restrict the preset to image uploads, and configure sensible limits and any available abuse-prevention settings. The front end also limits each submission to 10 photos and 10 MB per file.
4. Open `config.js`.
5. Replace `YOUR_CLOUD_NAME` with the Cloudinary cloud name and `YOUR_UNSIGNED_UPLOAD_PRESET` with the exact unsigned preset name.
6. Save and commit the file to GitHub.
7. Test a photo upload on the published site before generating/printing the QR code.

**Never add a Cloudinary API secret or other private key to this project.** The cloud name and unsigned preset are public by design. An unsigned preset can be abused if left unrestricted, so review Cloudinary's available restrictions and usage limits. For a high-traffic event or stricter privacy needs, use a backend-mediated upload service instead.

### Privacy note

The website tells guests that their photos are being shared with the couple. Be clear with guests about who can view the images. Cloudinary uploads may be accessible by URL depending on your account and delivery settings; do not promise that photos are private unless you configure and test private access. Consider deleting the photos from the storage account after the couple has downloaded them.

## Publish with GitHub Pages (free)

1. Sign in or create an account at https://github.com/.
2. Click **New repository**.
3. Name it `chloe-dillyn-wedding-album`.
4. Choose **Public** (GitHub Pages is available for public repositories on free accounts), then create the repository.
5. Upload `index.html`, `styles.css`, `script.js`, `config.js`, and `README.md` to the repository root. You can use **Add file → Upload files** on GitHub.
6. Open the repository's **Settings → Pages**.
7. Under **Build and deployment**, choose **Deploy from a branch**.
8. Select branch `main` and folder `/(root)`, then click **Save**.
9. Wait a minute or two. The published URL should look like:
   `https://YOUR-GITHUB-USERNAME.github.io/chloe-dillyn-wedding-album/`
10. Open the URL on a phone and test the menu, photo selection, and configured upload. Do not print the QR code until uploads have been tested.

If GitHub shows a different URL, use the exact URL shown in **Settings → Pages**.

## Make a QR code

After the site is published and tested, create a QR code that points to the full GitHub Pages URL, including the trailing project path. Test the QR code with at least two phones before printing.

## Editing later

Edit `index.html` for wording/content, `styles.css` for appearance, `script.js` for interactions, and `config.js` for upload settings. Commit changes to `main`; GitHub Pages republishes automatically.

## Known limitations

- The site does not display a public gallery of submitted images; it sends images to the configured Cloudinary account.
- Guest name/note are stored as upload context metadata where supported by Cloudinary; this is not a full guestbook or database.
- A static site cannot securely enforce private album access by itself.
