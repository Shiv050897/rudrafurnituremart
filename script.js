import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.119.0';
const supabase = createClient('https://txueuktoagvcidwdxjxe.supabase.co','sb_publishable_cgK84vg1sY7R1TOxGfsYjw_02uy6ulI');
// Rudra Furniture Mart — Phase 1 product catalogue
// Replace temporary photo URLs with your own uploaded files when ready.
// Set price to a number only after the shop confirms it; null means request a quote.

const ROOMS = [
 {key:'Living',name:'Living room',items:'Sofas, centre tables, TV units',image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop&q=80'},
 {key:'Bedroom',name:'Bedroom',items:'Beds, wardrobes, dressers',image:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop&q=80'},
 {key:'Dining',name:'Dining',items:'4, 6 and 8-seater sets',image:'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&auto=format&fit=crop&q=80'},
 {key:'Office',name:'Office',items:'Desks, chairs, storage',image:'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80'},
 {key:'Kids',name:'Kids room',items:'Single beds, study tables, almirahs',image:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop&q=80'},
 {key:'Doors',name:'Doors & woodwork',items:'Main doors, room doors, custom work',image:'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900&auto=format&fit=crop&q=80'}
];

// Temporary professional photos are used initially. Replace image URLs with
// real shop photos from images/products when those photographs are uploaded.
// price: null displays a quote request; a confirmed number displays INR pricing.
const PRODUCTS = [
 {name:'L-shape corner sofa',room:'Living',detail:'Customisable fabric, size and finish',material:'Wood frame · upholstery options',price:null,image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&auto=format&fit=crop&q=85',badge:'Customisable'},
 {name:'Classic 3+1+1 sofa set',room:'Living',detail:'A welcoming set for family living spaces',material:'Wood frame · fabric options',price:null,image:'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=1000&auto=format&fit=crop&q=85',badge:'Popular'},
 {name:'Wooden centre table',room:'Living',detail:'A practical centrepiece for your living room',material:'Wood · finish options',price:null,image:'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=1000&auto=format&fit=crop&q=85'},
 {name:'King size wooden bed',room:'Bedroom',detail:'Made to suit your room and preferred finish',material:'Wood · size options',price:null,image:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&auto=format&fit=crop&q=85',badge:'Made to order'},
 {name:'Bed with storage',room:'Bedroom',detail:'Storage configuration can be discussed',material:'Wood · storage options',price:null,image:'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1000&auto=format&fit=crop&q=85'},
 {name:'Wooden wardrobe',room:'Bedroom',detail:'Choose dimensions and internal layout',material:'Wood · custom dimensions',price:null,image:'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1000&auto=format&fit=crop&q=85'},
 {name:'6-seater dining set',room:'Dining',detail:'Dining table with matching chairs',material:'Wood · finish options',price:null,image:'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1000&auto=format&fit=crop&q=85',badge:'Family favourite'},
 {name:'Wooden dining table',room:'Dining',detail:'Ask about 4, 6 and 8-seater sizes',material:'Wood · made to measure',price:null,image:'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=1000&auto=format&fit=crop&q=85'},
 {name:'Office desk',room:'Office',detail:'Work desk with practical storage options',material:'Wood · size options',price:null,image:'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1000&auto=format&fit=crop&q=85'},
 {name:'Office chair',room:'Office',detail:'Ask us about available styles and finishes',material:'Multiple styles',price:null,image:'https://images.unsplash.com/photo-1503602642458-232111445657?w=1000&auto=format&fit=crop&q=85'},
 {name:'Kids single bed',room:'Kids',detail:'Made to fit your child’s room',material:'Wood · custom dimensions',price:null,image:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&auto=format&fit=crop&q=85'},
 {name:'Custom wooden door',room:'Doors',detail:'Discuss design, dimensions and carving',material:'Wood · design to order',price:null,image:'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1000&auto=format&fit=crop&q=85',badge:'Custom work'}
];

const TABS=['All',...ROOMS.map(room=>room.key)];
let activeRoom='All',activeSpace='all',searchTerm='',sortMode='featured';

function el(tag,attrs={},children=[]){
 const node=document.createElement(tag);
 for(const [key,value] of Object.entries(attrs)){
  if(key==='class')node.className=value;
  else if(key==='text')node.textContent=value;
  else if(key.startsWith('on'))node.addEventListener(key.slice(2),value);
  else node.setAttribute(key,value);
 }
 for(const child of [].concat(children))if(child)node.append(child);
 return node;
}
function photo(image,alt,className=''){
 const wrap=el('div',{class:className});
 if(image)wrap.append(el('img',{src:image,alt,loading:'lazy'}));
 else wrap.textContent='Photo coming soon';
 return wrap;
}
function arrow(){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('aria-hidden','true');svg.setAttribute('width','22');svg.setAttribute('height','22');svg.setAttribute('viewBox','0 0 24 24');
 svg.innerHTML='<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="#2F5D46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
 return svg;
}
function renderRooms(){
 const root=document.getElementById('rooms');
 root.replaceChildren(...ROOMS.map(room=>el('button',{type:'button',class:'room',onclick:()=>{
  setRoom(room.key);document.getElementById('products').scrollIntoView({behavior:'smooth'});
 }},[photo(room.image,room.name,'room__photo'),el('span',{class:'room__body'},[
  el('span',{},[el('span',{class:'room__name',text:room.name}),el('span',{class:'room__items',text:room.items})]),arrow()
 ])])));
}
function renderTabs(){
 const root=document.getElementById('tabs');
 root.replaceChildren(...TABS.map(key=>el('button',{type:'button',class:'tab','aria-pressed':String(key===activeRoom),text:key,onclick:()=>setRoom(key)})));
}
function formatPrice(price){
 if(price==null)return 'Request a quote';
 return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(price);
}
function productEnquiry(product){
 const select=document.querySelector('#quote-form select[name="interest"]');
 const details=document.querySelector('#quote-form textarea[name="details"]');
 if(select){const map={Living:'Sofa',Bedroom:'Bed',Dining:'Dining set',Office:'Office furniture',Kids:'Custom order',Doors:'Custom order'};select.value=map[product.room]||'Something else';}
 if(details)details.value='Product: '+product.name+'\nMaterial/details: '+product.material+'\nPlease share availability and a price quotation.';
 document.getElementById('contact').scrollIntoView({behavior:'smooth'});
 const nameField=document.querySelector('#quote-form input[name="name"]');
 if(nameField)nameField.focus({preventScroll:true});
}
function visibleProducts(){
 let list=PRODUCTS.filter(product=>{
  const roomMatch=activeRoom==='All'||product.room===activeRoom;
  const text=(product.name+' '+product.room+' '+product.detail+' '+product.material).toLowerCase();
  const spaceMatch=activeSpace==='all'||activeSpace===product.space_type||product.space_type==='both';
  return roomMatch&&spaceMatch&&text.includes(searchTerm);
 });
 if(sortMode==='name')list.sort((a,b)=>a.name.localeCompare(b.name));
 if(sortMode==='price-low')list.sort((a,b)=>(a.price??Infinity)-(b.price??Infinity));
 if(sortMode==='price-high')list.sort((a,b)=>(b.price??-Infinity)-(a.price??-Infinity));
 return list;
}
function renderProducts(){
 const root=document.getElementById('product-grid'),list=visibleProducts(),count=document.getElementById('product-count');
 if(count)count.textContent=list.length+' '+(list.length===1?'item':'items');
 if(!list.length){root.replaceChildren(el('div',{class:'product-empty',text:'No matching furniture found. Try another search or category.'}));return;}
 root.replaceChildren(...list.map(product=>{
  const image=photo(product.image,product.name,'product__photo');
  if(product.badge)image.append(el('span',{class:'product__badge',text:product.badge}));
  const price=el('span',{class:product.price==null?'product__price product__price--quote':'product__price',text:formatPrice(product.price)});
  const detail=el('button',{type:'button',class:'btn btn--outline',text:'View details',onclick:()=>openProductDetail(product)});
  const action=product.price!=null&&product.price_type!=='quote'?el('button',{type:'button',class:'btn btn--green',text:'Add to cart',onclick:()=>addToCart(product)}):el('button',{type:'button',class:'btn btn--green',text:'Get a quote',onclick:()=>productEnquiry(product)});
  return el('article',{class:'product'},[image,el('div',{class:'product__body'},[
   el('span',{class:'product__meta',text:(product.space_type==='outdoor'?'Outdoor':product.space_type==='both'?'Indoor & outdoor':'Indoor')+' · '+product.room}),el('h3',{text:product.name}),
   el('span',{class:'product__detail',text:product.detail}),el('span',{class:'product__meta',text:product.material}),
   el('div',{class:'product__foot'},[price]),el('div',{class:'product__actions'},[detail,action])
  ])]);
 }));
}
function setRoom(key){activeRoom=key;renderTabs();renderProducts();}
function initCatalogueControls(){
 const search=document.getElementById('product-search'),sort=document.getElementById('product-sort');
 document.querySelectorAll('#space-tabs [data-space]').forEach(button=>button.addEventListener('click',()=>{activeSpace=button.dataset.space;document.querySelectorAll('#space-tabs [data-space]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));renderProducts();}));
 if(search)search.addEventListener('input',event=>{searchTerm=event.target.value.trim().toLowerCase();renderProducts();});
 if(sort)sort.addEventListener('change',event=>{sortMode=event.target.value;renderProducts();});
}
async function loadStoreProducts(){
 try{
  const {data,error}=await supabase.from('products').select('id,name,slug,short_description,description,material,dimensions,colors,customization,delivery_estimate,price,price_type,space_type,is_featured,is_bestseller,categories(name),product_images(url,alt,sort_order)').eq('is_active',true).order('is_featured',{ascending:false}).order('created_at',{ascending:false});
  if(error)throw error;
  if(!data?.length){PRODUCTS.splice(0,PRODUCTS.length);renderProducts();return;}
  const categoryRoom = name => {const n=(name||'').toLowerCase();if(/sofa|chair|living/.test(n))return 'Living';if(/bed|wardrobe/.test(n))return 'Bedroom';if(/dining|table/.test(n))return 'Dining';if(/office/.test(n))return 'Office';if(/door/.test(n))return 'Doors';if(/outdoor|garden|patio|balcony/.test(n))return 'Living';return 'All';};
  const live=data.map(p=>({id:p.id,name:p.name,slug:p.slug,room:categoryRoom(p.categories?.name),category:p.categories?.name||'Furniture',space_type:p.space_type||'indoor',detail:p.short_description||p.description||'Contact us for product details',description:p.description||p.short_description||'Contact our showroom for complete product details.',material:p.material||'Please enquire',dimensions:p.dimensions||'Made to suit your space',colors:Array.isArray(p.colors)?p.colors:[],customization:p.customization||'Please enquire about customisation.',delivery_estimate:p.delivery_estimate||'To be confirmed by showroom',price_type:p.price_type,price:p.price_type==='quote'?null:p.price,image:p.product_images?.sort((a,b)=>(a.sort_order||0)-(b.sort_order||0))[0]?.url||null,images:p.product_images?.sort((a,b)=>(a.sort_order||0)-(b.sort_order||0))||[],badge:p.is_bestseller?'Bestseller':p.is_featured?'Featured':''}));
  PRODUCTS.splice(0,PRODUCTS.length,...live);
  renderProducts();
 }catch(error){console.warn('Could not load live catalogue; showing starter catalogue.',error);}
}
function initForm(){
 const form=document.getElementById('quote-form'),thanks=document.getElementById('thanks'),submit=form.querySelector('button[type="submit"]');
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  const values=new FormData(form),name=String(values.get('name')||'').trim(),phone=String(values.get('phone')||'').trim();
  const phoneDigits=phone.replace(/\D/g,'');
  if(phoneDigits.length<10||phoneDigits.length>15){alert('Please enter a valid phone number.');return;}
  submit.disabled=true;submit.textContent='Sending enquiry…';
  const {error}=await supabase.from('custom_inquiries').insert({name,phone,furniture_type:String(values.get('interest')||'Other'),requirements:String(values.get('details')||'').trim()||null,status:'new'});
  submit.disabled=false;submit.textContent='Request a call back';
  if(error){alert('We could not submit your enquiry right now. Please try again or contact the showroom.');console.error(error);return;}
  form.hidden=true;thanks.hidden=false;form.reset();
 });
 document.getElementById('send-another').addEventListener('click',()=>{thanks.hidden=true;form.hidden=false;});
}
document.getElementById('year').textContent=new Date().getFullYear();
renderRooms();renderTabs();initCatalogueControls();renderProducts();initForm();initCommerce();loadStoreProducts();


const CART_KEY='rudra_furniture_cart_v1';
let cart=[];
const inr=value=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number(value)||0);
function readCart(){try{cart=JSON.parse(localStorage.getItem(CART_KEY)||'[]').filter(x=>x&&x.id&&Number.isInteger(x.quantity)&&x.quantity>0);}catch{cart=[];}saveCart();}
function saveCart(){localStorage.setItem(CART_KEY,JSON.stringify(cart));const badge=document.getElementById('cart-count');if(badge)badge.textContent=cart.reduce((n,x)=>n+x.quantity,0);}
function openLayer(id){document.getElementById(id).hidden=false;document.body.classList.add('modal-open');}
function closeLayer(id){document.getElementById(id).hidden=true;if(!document.querySelector('.commerce-overlay:not([hidden])'))document.body.classList.remove('modal-open');}
function initCommerce(){
 readCart();
 document.getElementById('open-cart').addEventListener('click',()=>{renderCart();openLayer('cart-modal');});
 document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeLayer(b.dataset.close)));
 document.querySelectorAll('.commerce-overlay').forEach(layer=>layer.addEventListener('click',e=>{if(e.target===layer)closeLayer(layer.id);}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.commerce-overlay:not([hidden])').forEach(layer=>closeLayer(layer.id));});
 document.getElementById('checkout-start').addEventListener('click',startCheckout);
 document.getElementById('checkout-form').addEventListener('submit',placeCodOrder);
}
function addToCart(product){
 if(!product.id||product.price==null||product.price_type==='quote'){productEnquiry(product);return;}
 const found=cart.find(x=>x.id===product.id);if(found)found.quantity=Math.min(100,found.quantity+1);else cart.push({id:product.id,quantity:1});
 saveCart();renderCart();openLayer('cart-modal');
}
function cartProducts(){return cart.map(item=>({...item,product:PRODUCTS.find(p=>p.id===item.id)})).filter(x=>x.product&&x.product.price!=null&&x.product.price_type!=='quote');}
function renderCart(){
 const root=document.getElementById('cart-items'),summary=document.getElementById('cart-summary'),items=cartProducts();root.replaceChildren();summary.replaceChildren();
 if(!items.length){root.append(el('p',{class:'muted',text:'Your cart is empty. Add a fixed-price product to continue.'}));document.getElementById('checkout-start').disabled=true;document.getElementById('checkout-start').textContent='Your cart is empty';return;}
 document.getElementById('checkout-start').disabled=false;document.getElementById('checkout-start').textContent='Proceed to checkout';
 items.forEach(({id,quantity,product})=>root.append(el('article',{class:'cart-line'},[
  photo(product.image,product.name,'cart-line__image'),el('div',{class:'cart-line__info'},[
   el('strong',{text:product.name}),el('span',{class:'muted',text:inr(product.price)+' each'}),
   el('div',{class:'quantity-control'},[
    el('button',{type:'button',text:'−',onclick:()=>changeQuantity(id,quantity-1)}),el('span',{text:String(quantity)}),
    el('button',{type:'button',text:'+',onclick:()=>changeQuantity(id,quantity+1)}),
    el('button',{type:'button',class:'remove-item',text:'Remove',onclick:()=>changeQuantity(id,0)})
   ])
  ]),el('strong',{text:inr(product.price*quantity)})
 ])));
 const subtotal=items.reduce((n,x)=>n+x.product.price*x.quantity,0);
 summary.append(el('div',{class:'cart-total-row'},[el('span',{text:'Subtotal'}),el('strong',{text:inr(subtotal)})]),el('p',{class:'muted',text:'Delivery charges, if any, will be confirmed by the showroom before dispatch.'}));
}
function changeQuantity(id,quantity){if(quantity<=0)cart=cart.filter(x=>x.id!==id);else{const item=cart.find(x=>x.id===id);if(item)item.quantity=Math.min(100,quantity);}saveCart();renderCart();}
function startCheckout(){
 if(!cartProducts().length)return;closeLayer('cart-modal');
 const form=document.getElementById('checkout-form');form.hidden=false;document.getElementById('order-success').hidden=true;document.getElementById('checkout-message').textContent='';
 const subtotal=cartProducts().reduce((n,x)=>n+x.product.price*x.quantity,0);document.getElementById('checkout-total').textContent='Cart subtotal: '+inr(subtotal)+' · Cash on Delivery';
 openLayer('checkout-modal');
}
async function placeCodOrder(event){
 event.preventDefault();const form=event.currentTarget,button=form.querySelector('button[type=submit]'),msg=document.getElementById('checkout-message');
 const values=new FormData(form),phone=String(values.get('phone')||'').replace(/\D/g,'');
 if(phone.length!==10||!/^[6-9]/.test(phone)){msg.textContent='Enter a valid 10-digit Indian mobile number.';return;}
 const items=cartProducts();if(!items.length){msg.textContent='Your cart is empty.';return;}
 button.disabled=true;button.textContent='Placing order…';msg.textContent='';
 const customer={full_name:String(values.get('full_name')).trim(),phone,email:String(values.get('email')||'').trim()||null,address_line:String(values.get('address_line')).trim(),city:String(values.get('city')).trim(),state:String(values.get('state')).trim(),pincode:String(values.get('pincode')).trim(),notes:String(values.get('notes')||'').trim()||null};
 const {data,error}=await supabase.rpc('place_order',{p_customer:customer,p_items:items.map(x=>({product_id:x.id,quantity:x.quantity})),p_payment_method:'cod',p_coupon:null});
 button.disabled=false;button.textContent='Place COD order';
 if(error){msg.textContent=error.message||'We could not place your order. Please check your details and try again.';return;}
 cart=[];saveCart();form.hidden=true;
 const success=document.getElementById('order-success');success.hidden=false;success.replaceChildren(el('div',{class:'order-success'},[
  el('div',{class:'order-success__mark',text:'✓'}),el('h3',{text:'Your order request is received!'}),
  el('p',{text:'Order number: '+data.order_number}),el('p',{text:'Order total: '+inr(data.total)}),
  el('p',{text:'Payment: Cash on Delivery. Our team will call you to confirm your order and delivery.'}),
  el('a',{class:'btn btn--green',href:'https://wa.me/919451713626?text='+encodeURIComponent('Hello Rudra Furniture Mart, I placed order '+data.order_number+'. Please confirm my order.'),target:'_blank',rel:'noopener',text:'Message us on WhatsApp'}),
  el('button',{class:'btn btn--outline',type:'button',text:'Continue shopping',onclick:()=>closeLayer('checkout-modal')})
 ]));
}
function openProductDetail(product){
 const root=document.getElementById('product-detail-content');root.replaceChildren();
 const gallery=el('div',{class:'detail-gallery'}),photos=(product.images||[]).map(x=>x.url).filter(Boolean);
 if(!photos.length&&product.image)photos.push(product.image);
 if(photos.length)photos.forEach((url,i)=>gallery.append(el('img',{src:url,alt:product.name+' photo '+(i+1),loading:'lazy'})));
 else gallery.append(el('div',{class:'detail-no-photo',text:'Product photographs will be added soon'}));
 const buyable=product.price!=null&&product.price_type!=='quote';
 root.append(gallery,el('div',{class:'detail-copy'},[
  el('span',{class:'eyebrow',text:(product.space_type==='outdoor'?'Outdoor':product.space_type==='both'?'Indoor & outdoor':'Indoor')+' · '+(product.category||product.room)}),
  el('h2',{id:'detail-title',text:product.name}),el('p',{class:'detail-price',text:buyable?inr(product.price):'Price on request'}),
  el('p',{text:product.description||product.detail}),
  el('dl',{class:'detail-specs'},[
   el('dt',{text:'Material'}),el('dd',{text:product.material||'Please enquire'}),
   el('dt',{text:'Dimensions'}),el('dd',{text:product.dimensions||'Made to suit your space'}),
   el('dt',{text:'Colours / finishes'}),el('dd',{text:product.colors?.join(', ')||'Please enquire'}),
   el('dt',{text:'Customisation'}),el('dd',{text:product.customization||'Please enquire'}),
   el('dt',{text:'Delivery estimate'}),el('dd',{text:product.delivery_estimate||'To be confirmed'})
  ]),
  buyable?el('button',{class:'btn btn--green btn--lg',type:'button',text:'Add to cart',onclick:()=>{closeLayer('product-modal');addToCart(product);}}):el('button',{class:'btn btn--green btn--lg',type:'button',text:'Request a quote',onclick:()=>{closeLayer('product-modal');productEnquiry(product);}})
 ]));openLayer('product-modal');
}
