# Rudra Furniture Mart — website

A one-page static website for Rudra Furniture Mart: plain HTML, CSS and JavaScript, no build step.

## Files

- `index.html` — page content and sections
- `styles.css` — colours, fonts and layout
- `script.js` — room cards, product list and filter, enquiry form. **Edit `ROOMS` and `PRODUCTS` here** to change what's shown.

## Filling in the details

Search the files for `[` to find every placeholder, for example `[CITY]`, `[PHONE NUMBER]`, `[PRICE]`, `[EMAIL ADDRESS]`, `[GST NUMBER]`.

- Phone and WhatsApp links use `+910000000000`. Replace with the real number (digits only, with country code).
- To add product photos, put them in an `images/` folder and set `image: "images/your-photo.jpg"` on the product in `script.js`.
- Set `price` to a number (e.g. `price: 28000`) to show it as ₹ 28,000.

## Preview locally

Open `index.html` in a browser, or run:

```
python3 -m http.server 8000
```

and visit http://localhost:8000.

## Publish with GitHub Pages

Repository **Settings → Pages → Build and deployment → Deploy from a branch**, choose `main` and `/ (root)`, then save. The site appears at `https://shiv050897.github.io/rudrafurnituremart/`.

## Enquiry form

The form currently shows a thank-you message only. To receive enquiries, connect it to a form service (such as Formspree or Google Forms) or a backend — see the `TODO` in `script.js`.
