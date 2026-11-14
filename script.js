// Rudra Furniture Mart — page behaviour
// Edit ROOMS and PRODUCTS below to change what the site shows.

const ROOMS = [
  { key: 'Living',   name: 'Living room',       items: 'Sofas, centre tables, TV units' },
  { key: 'Bedroom',  name: 'Bedroom',           items: 'Beds, wardrobes, dressers' },
  { key: 'Dining',   name: 'Dining',            items: '4, 6 and 8-seater sets' },
  { key: 'Office',   name: 'Office',            items: 'Desks, chairs, storage' },
  { key: 'Kids',     name: 'Kids',              items: 'Single beds, study tables, almirahs' },
  { key: 'Mattress', name: 'Mattresses & more', items: 'Mattresses, pillows, decor' },
];

// price: a number in rupees, or null to show "[PRICE]" until filled in.
// image: path to a photo (e.g. "images/corner-sofa.jpg"), or null for a placeholder.
const PRODUCTS = [
  { name: 'L-shape corner sofa',       room: 'Living',   detail: 'Solid wood frame · fabric of your choice', price: null, image: null },
  { name: '3+1+1 sofa set',            room: 'Living',   detail: 'Sheesham wood · cushioned seats',          price: null, image: null },
  { name: 'King size bed with storage', room: 'Bedroom', detail: 'Hydraulic storage · honey finish',         price: null, image: null },
  { name: '3-door wardrobe',           room: 'Bedroom',  detail: 'With mirror and locker',                   price: null, image: null },
  { name: '6-seater dining set',       room: 'Dining',   detail: 'Solid wood table with 6 chairs',           price: null, image: null },
  { name: 'Executive office desk',     room: 'Office',   detail: 'With drawers and cable management',        price: null, image: null },
  { name: 'Kids single bed',           room: 'Kids',     detail: 'Rounded edges · storage drawer',           price: null, image: null },
  { name: 'Orthopaedic mattress',      room: 'Mattress', detail: 'Available in all standard sizes',          price: null, image: null },
];

const TABS = ['All', 'Living', 'Bedroom', 'Dining', 'Office', 'Kids', 'Mattress'];

let activeRoom = 'All';

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) if (c) node.append(c);
  return node;
}

function media(image, alt, tagText, extra) {
  if (image) {
    const wrap = el('div', { class: 'ph', style: 'padding:0' }, [
      el('img', { src: image, alt, loading: 'lazy', style: 'width:100%;height:100%;object-fit:cover' }),
    ]);
    if (extra) wrap.append(extra);
    return wrap;
  }
  return el('div', { class: 'ph' }, [extra, el('span', { class: 'ph__tag', text: tagText })]);
}

const arrow = () => {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('aria-hidden', 'true');
  s.setAttribute('width', '22'); s.setAttribute('height', '22');
  s.setAttribute('viewBox', '0 0 24 24');
  s.innerHTML = '<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="#2F5D46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
  return s;
};

function renderRooms() {
  const root = document.getElementById('rooms');
  root.replaceChildren(...ROOMS.map((r) =>
    el('button', {
      type: 'button',
      class: 'room',
      onclick: () => {
        setRoom(r.key);
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
      },
    }, [
      media(null, r.name, '[PHOTO]'),
      el('span', { class: 'room__body' }, [
        el('span', {}, [
          el('span', { class: 'room__name', text: r.name }),
          el('span', { class: 'room__items', text: r.items }),
        ]),
        arrow(),
      ]),
    ])
  ));
}

function renderTabs() {
  const root = document.getElementById('tabs');
  root.replaceChildren(...TABS.map((k) =>
    el('button', {
      type: 'button',
      class: 'tab',
      'aria-pressed': String(k === activeRoom),
      text: k,
      onclick: () => setRoom(k),
    })
  ));
}

function formatPrice(p) {
  return p == null ? '₹ [PRICE]' : '₹ ' + p.toLocaleString('en-IN');
}

function renderProducts() {
  const root = document.getElementById('product-grid');
  const list = PRODUCTS.filter((p) => activeRoom === 'All' || p.room === activeRoom);
  root.replaceChildren(...list.map((p) =>
    el('article', { class: 'product' }, [
      media(p.image, p.name, '[PHOTO]', el('span', { class: 'product__badge', text: p.room })),
      el('div', { class: 'product__body' }, [
        el('h3', { text: p.name }),
        el('span', { class: 'product__detail', text: p.detail }),
        el('div', { class: 'product__foot' }, [
          el('span', { class: 'product__price', text: formatPrice(p.price) }),
          el('a', {
            href: '#contact',
            text: 'Enquire →',
            onclick: () => {
              const select = document.querySelector('#quote-form select[name="interest"]');
              const details = document.querySelector('#quote-form textarea[name="details"]');
              if (details && !details.value) details.value = 'Interested in: ' + p.name;
              if (select) select.value = 'Something else';
            },
          }),
        ]),
      ]),
    ])
  ));
}

function setRoom(key) {
  activeRoom = key;
  renderTabs();
  renderProducts();
}

function initForm() {
  const form = document.getElementById('quote-form');
  const thanks = document.getElementById('thanks');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO: send the enquiry somewhere (e.g. Formspree, Google Forms, WhatsApp or your own backend).
    form.hidden = true;
    thanks.hidden = false;
    form.reset();
  });
  document.getElementById('send-another').addEventListener('click', () => {
    thanks.hidden = true;
    form.hidden = false;
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
renderRooms();
renderTabs();
renderProducts();
initForm();
