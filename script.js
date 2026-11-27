import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.119.0';
const supabase = createClient('https://txueuktoagvcidwdxjxe.supabase.co','sb_publishable_cgK84vg1sY7R1TOxGfsYjw_02uy6ulI');
// Rudra Furniture Mart — Phase 1 product catalogue
// Replace temporary photo URLs with your own uploaded files when ready.
// Prices are not shown on the website; every product offers Call (दाम पूछें) and WhatsApp.
// Labels are Hindi-first for customers who don't read English.

const ROOMS = [
 {key:'Living',name:'Living room',hi:'बैठक / ड्राइंग रूम',hiItems:'सोफ़ा, सेंटर टेबल, टीवी यूनिट',items:'Sofas, centre tables, TV units',image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop&q=80'},
 {key:'Bedroom',name:'Bedroom',hi:'बेडरूम',hiItems:'पलंग, अलमारी, ड्रेसिंग टेबल',items:'Beds, wardrobes, dressers',image:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop&q=80'},
 {key:'Dining',name:'Dining',hi:'डाइनिंग',hiItems:'4, 6 और 8 कुर्सी वाले सेट',items:'4, 6 and 8-seater sets',image:'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&auto=format&fit=crop&q=80'},
 {key:'Office',name:'Office',hi:'ऑफिस',hiItems:'मेज़, कुर्सी, रैक',items:'Desks, chairs, storage',image:'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80'},
 {key:'Kids',name:'Kids room',hi:'बच्चों का कमरा',hiItems:'सिंगल बेड, पढ़ाई की टेबल, अलमारी',items:'Single beds, study tables, almirahs',image:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop&q=80'},
 {key:'Doors',name:'Doors & woodwork',hi:'दरवाज़े व लकड़ी का काम',hiItems:'मेन गेट, कमरों के दरवाज़े, नक्काशी',items:'Main doors, room doors, custom work',image:'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900&auto=format&fit=crop&q=80'}
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


const DEMO_PRODUCT_IMAGES = {
 'l-shape-corner-sofa':'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&auto=format&fit=crop&q=85',
 'classic-3-1-1-sofa-set':'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=1000&auto=format&fit=crop&q=85',
 'wooden-centre-table':'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=1000&auto=format&fit=crop&q=85',
 'king-size-wooden-bed':'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&auto=format&fit=crop&q=85',
 'bed-with-storage':'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1000&auto=format&fit=crop&q=85',
 'wooden-wardrobe':'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1000&auto=format&fit=crop&q=85',
 '6-seater-dining-set':'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1000&auto=format&fit=crop&q=85',
 'wooden-dining-table':'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=1000&auto=format&fit=crop&q=85',
 'office-desk':'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1000&auto=format&fit=crop&q=85',
 'office-chair':'https://images.unsplash.com/photo-1503602642458-232111445657?w=1000&auto=format&fit=crop&q=85',
 'kids-single-bed':'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&auto=format&fit=crop&q=85',
 'custom-wooden-door':'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1000&auto=format&fit=crop&q=85',
 'outdoor-4-seater-patio-set':'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&auto=format&fit=crop&q=85',
 'garden-bench':'https://images.unsplash.com/photo-1598300056393-4aac492f4344?w=1000&auto=format&fit=crop&q=85',
 'outdoor-lounge-chair':'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&auto=format&fit=crop&q=85',
 'balcony-bistro-set':'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1000&auto=format&fit=crop&q=85',
 'wooden-garden-swing':'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=85',
 'outdoor-coffee-table':'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&auto=format&fit=crop&q=85',
 'kids-bunk-bed':'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&auto=format&fit=crop&q=85',
 'kids-study-table-chair':'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1000&auto=format&fit=crop&q=85',
 'kids-wardrobe':'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1000&auto=format&fit=crop&q=85',
 'kids-bookshelf':'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1000&auto=format&fit=crop&q=85',
 'toy-storage-cabinet':'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1000&auto=format&fit=crop&q=85'
};

const TABS=['All',...ROOMS.map(room=>room.key)];
let activeRoom='All',activeSpace='all',searchTerm='',sortMode='featured';

// ---- Hindi labels ----
const SHOP_PHONE='+919451713626',SHOP_WA='919451713626';
const ROOM_HI={All:'सभी',Living:'बैठक',Bedroom:'बेडरूम',Dining:'डाइनिंग',Office:'ऑफिस',Kids:'बच्चों का',Doors:'दरवाज़े'};
const ROOM_EN={All:'All',Living:'Living',Bedroom:'Bedroom',Dining:'Dining',Office:'Office',Kids:'Kids',Doors:'Doors'};
// Hindi name for a product type, picked from words in its English name.
const TYPE_HI=[[/bunk/,'बंक बेड (दो मंज़िला पलंग)'],[/sofa|couch/,'सोफ़ा'],[/mattress/,'गद्दा'],[/bed|cot|palang/,'पलंग / बेड'],[/wardrobe|almirah|almari/,'अलमारी'],[/dining/,'डाइनिंग सेट'],[/dressing|dresser/,'ड्रेसिंग टेबल'],[/study/,'पढ़ाई की टेबल'],[/desk/,'ऑफिस मेज़'],[/centre table|center table|coffee table/,'सेंटर टेबल'],[/tv/,'टीवी यूनिट'],[/table/,'मेज़ / टेबल'],[/chair/,'कुर्सी'],[/door/,'लकड़ी का दरवाज़ा'],[/swing|jhula/,'झूला'],[/bench/,'बेंच'],[/book|shelf|rack/,'रैक / शेल्फ़'],[/cabinet|storage/,'कैबिनेट'],[/patio|bistro|garden|outdoor/,'बगीचे का फ़र्नीचर']];
function hindiType(product){const n=(product.name+' '+(product.category||'')).toLowerCase();for(const [re,hi] of TYPE_HI)if(re.test(n))return hi;return 'फ़र्नीचर';}
const BADGE_HI={Bestseller:'सबसे ज़्यादा बिका',Featured:'ख़ास पसंद',Customisable:'मनचाहा साइज़',Popular:'लोकप्रिय','Made to order':'ऑर्डर पर बनता है','Family favourite':'परिवार की पसंद','Custom work':'कस्टम काम'};
function waLink(text){return 'https://wa.me/'+SHOP_WA+'?text='+encodeURIComponent(text);}
function productUrl(product){return 'https://rudrafurnituremart.com/?product='+encodeURIComponent(product.slug||product.id||product.name);}
function productWaText(product){return 'नमस्ते Rudra Furniture Mart 🙏\nमुझे इस सामान का दाम और जानकारी चाहिए:\n'+hindiType(product)+' — '+product.name+(product.slug||product.id?'\n'+productUrl(product):'');}
const DEFAULT_WA_TEXT='नमस्ते Rudra Furniture Mart 🙏 मुझे फ़र्नीचर के बारे में जानकारी चाहिए।';
function initWhatsAppLinks(){document.querySelectorAll('[data-wa]').forEach(a=>{a.href=waLink(a.dataset.waText||DEFAULT_WA_TEXT);});}

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
 const fallback=()=>{wrap.replaceChildren();wrap.classList.add('photo-fallback');wrap.append(el('span',{class:'photo-fallback__mark',text:'R'}),el('span',{class:'photo-fallback__text',text:'Rudra Furniture Mart'}));};
 if(image){const img=el('img',{src:image,alt,loading:'lazy'});img.addEventListener('error',fallback,{once:true});wrap.append(img);}
 else fallback();
 return wrap;
}
function initLaunchBanner(){
 const slides=[...document.querySelectorAll('.launch-slide')],dots=[...document.querySelectorAll('#launch-dots button')];
 if(!slides.length)return;let active=0,timer=null;
 const show=index=>{active=(index+slides.length)%slides.length;slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===active);slide.setAttribute('aria-hidden',String(i!==active));});dots.forEach((dot,i)=>{dot.classList.toggle('is-active',i===active);dot.setAttribute('aria-pressed',String(i===active));});document.getElementById('launch-counter').textContent=String(active+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');};
 const restart=()=>{if(timer)clearInterval(timer);timer=setInterval(()=>show(active+1),6500);};
 document.getElementById('launch-prev').addEventListener('click',()=>{show(active-1);restart();});
 document.getElementById('launch-next').addEventListener('click',()=>{show(active+1);restart();});
 dots.forEach((dot,i)=>dot.addEventListener('click',()=>{show(i);restart();}));
 document.querySelectorAll('[data-room-link]').forEach(link=>link.addEventListener('click',()=>{const room=link.dataset.roomLink;if(ROOMS.some(x=>x.key===room))setRoom(room);}));
 const banner=document.querySelector('.launch-banner');banner.addEventListener('mouseenter',()=>clearInterval(timer));banner.addEventListener('mouseleave',restart);
 show(0);restart();
}
function arrow(){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('aria-hidden','true');svg.setAttribute('width','22');svg.setAttribute('height','22');svg.setAttribute('viewBox','0 0 24 24');
 svg.innerHTML='<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="#2F5D46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
 return svg;
}
function renderRooms(){
 const root=document.getElementById('rooms');
 root.replaceChildren(...ROOMS.map(room=>el('button',{type:'button',class:'room','aria-label':room.hi+' ('+room.name+') का फ़र्नीचर देखें',onclick:()=>{
  setRoom(room.key);document.getElementById('products').scrollIntoView({behavior:'smooth'});
 }},[photo(room.image,room.hi,'room__photo'),el('span',{class:'room__body'},[
  el('span',{},[el('span',{class:'room__name',text:room.hi}),el('span',{class:'room__en',lang:'en',text:room.name}),el('span',{class:'room__items',text:room.hiItems})]),el('span',{class:'room__go',text:'देखें →'})
 ])])));
}
function renderTabs(){
 const root=document.getElementById('tabs');
 root.replaceChildren(...TABS.map(key=>el('button',{type:'button',class:'tab','aria-pressed':String(key===activeRoom),onclick:()=>setRoom(key)},[ROOM_HI[key]||key,' ',el('small',{lang:'en',text:ROOM_EN[key]||key})])));
}
function formatPrice(price){
 if(price==null)return 'Request a quote';
 return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(price);
}
// Prices are never shown on the website: customers call or WhatsApp to ask.
function displayProductPrice(){return '💬 दाम के लिए कॉल / WhatsApp करें';}
function callButton(extraClass){return el('a',{class:'btn btn--call'+(extraClass?' '+extraClass:''),href:'tel:'+SHOP_PHONE,text:'📞 दाम पूछें','aria-label':'दाम पूछने के लिए कॉल करें (Call for price)'});}
function waButton(product,extraClass){return el('a',{class:'btn btn--wa'+(extraClass?' '+extraClass:''),href:waLink(productWaText(product)),target:'_blank',rel:'noopener',text:'💬 WhatsApp','aria-label':product.name+' के बारे में WhatsApp पर पूछें'});}
function productEnquiry(product){
 const select=document.querySelector('#quote-form select[name="interest"]');
 const details=document.querySelector('#quote-form textarea[name="details"]');
 if(select){const t=hindiType(product);const v=/सोफ़ा/.test(t)?'Sofa':/पलंग|बेड/.test(t)?'Bed':/अलमारी/.test(t)?'Wardrobe':/डाइनिंग/.test(t)?'Dining set':/दरवाज़ा/.test(t)?'Door':product.room==='Office'?'Office furniture':'Something else';select.value=v;}
 if(details)details.value='सामान (Product): '+product.name+'\nकृपया दाम और उपलब्धता बताएँ। (Please share price and availability.)';
 document.getElementById('contact').scrollIntoView({behavior:'smooth'});
 const nameField=document.querySelector('#quote-form input[name="name"]');
 if(nameField)nameField.focus({preventScroll:true});
}
function visibleProducts(){
 let list=PRODUCTS.filter(product=>{
  const roomMatch=activeRoom==='All'||product.room===activeRoom;
  const text=(product.name+' '+product.room+' '+(ROOM_HI[product.room]||'')+' '+hindiType(product)+' '+product.detail+' '+product.material+' '+(product.category||'')).toLowerCase();
  const spaceMatch=activeSpace==='all'||activeSpace===product.space_type||product.space_type==='both';
  return roomMatch&&spaceMatch&&text.includes(searchTerm);
 });
 if(sortMode==='name')list.sort((a,b)=>a.name.localeCompare(b.name));
 return list;
}
async function sharePublicProduct(product){
 const url=productUrl(product);
 const payload={title:product.name,text:'रुद्र फ़र्नीचर मार्ट पर देखें: '+hindiType(product)+' — '+product.name,url};
 try{
  if(navigator.share){await navigator.share(payload);return;}
  if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);alert('लिंक कॉपी हो गया। अब इसे किसी को भी भेजें।');return;}
  window.prompt('यह लिंक कॉपी करें:',url);
 }catch(error){if(error.name!=='AbortError')window.prompt('यह लिंक कॉपी करें:',url);}
}
function renderProducts(){
 const root=document.getElementById('product-grid'),list=visibleProducts(),count=document.getElementById('product-count');
 if(count)count.textContent=list.length+' सामान';
 if(!list.length){root.replaceChildren(el('div',{class:'product-empty'},['😕 ऐसा कोई सामान नहीं मिला। दूसरा शब्द लिखें या ',el('a',{href:'tel:'+SHOP_PHONE,text:'हमें कॉल करें'}),' — दुकान पर और भी डिज़ाइन हैं।']));return;}
 root.replaceChildren(...list.map(product=>{
  const image=photo(product.image,product.name,'product__photo');
  if(product.badge)image.append(el('span',{class:'product__badge',text:BADGE_HI[product.badge]||product.badge}));
  image.append(el('span',{class:'product__zoom','aria-hidden':'true',text:'🔍 बड़ा देखें'}));
  image.classList.add('product__photo-clickable');image.setAttribute('role','button');image.setAttribute('tabindex','0');image.setAttribute('aria-label',product.name+' की फ़ोटो और जानकारी देखें');image.addEventListener('click',()=>openProductDetail(product));image.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openProductDetail(product);}});
  return el('article',{class:'product'},[image,el('div',{class:'product__body'},[
   el('span',{class:'product__hi',text:hindiType(product)+(product.space_type==='outdoor'?' · बाहर के लिए':'')}),
   el('h3',{lang:'en',text:product.name}),
   el('span',{class:'product__detail',text:product.detail}),
   el('span',{class:'product__price',text:displayProductPrice(product)}),
   el('div',{class:'product__actions'},[callButton(),waButton(product)]),
   el('div',{class:'product__more'},[
    el('button',{type:'button',text:'पूरी जानकारी',onclick:()=>openProductDetail(product)}),
    el('button',{type:'button','aria-label':product.name+' शेयर करें',text:'↗ शेयर करें',onclick:()=>sharePublicProduct(product)})
   ])
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
  const {data,error}=await supabase.from('products').select('id,name,slug,short_description,description,material,dimensions,colors,customization,delivery_estimate,price,price_type,price_tier,sales_mode,size_options,space_type,is_featured,is_bestseller,categories(name),product_images(url,alt,sort_order)').eq('is_active',true).order('is_featured',{ascending:false}).order('created_at',{ascending:false});
  if(error)throw error;
  if(!data?.length){PRODUCTS.splice(0,PRODUCTS.length);renderProducts();return;}
  const categoryRoom = name => {const n=(name||'').toLowerCase();if(/kid|child/.test(n))return 'Kids';if(/sofa|chair|living/.test(n))return 'Living';if(/bed|wardrobe/.test(n))return 'Bedroom';if(/dining|table/.test(n))return 'Dining';if(/office/.test(n))return 'Office';if(/door/.test(n))return 'Doors';if(/outdoor|garden|patio|balcony/.test(n))return 'Living';return 'All';};
  const live=data.map(p=>({id:p.id,name:p.name,slug:p.slug,room:categoryRoom(p.categories?.name),category:p.categories?.name||'Furniture',space_type:p.space_type||'indoor',detail:p.short_description||p.description||'Contact us for product details',description:p.description||p.short_description||'Contact our showroom for complete product details.',material:p.material||'Please enquire',dimensions:p.dimensions||'Made to suit your space',colors:Array.isArray(p.colors)?p.colors:[],customization:p.customization||'Please enquire about customisation.',delivery_estimate:p.delivery_estimate||'To be confirmed by showroom',price_type:p.price_type,price:p.price_type==='quote'?null:p.price,sales_mode:p.sales_mode||'enquiry',size_options:Array.isArray(p.size_options)?p.size_options:[],image:p.product_images?.sort((a,b)=>(a.sort_order||0)-(b.sort_order||0))[0]?.url||DEMO_PRODUCT_IMAGES[p.slug]||null,images:p.product_images?.sort((a,b)=>(a.sort_order||0)-(b.sort_order||0))||[],badge:p.is_bestseller?'Bestseller':p.is_featured?'Featured':''}));
  PRODUCTS.splice(0,PRODUCTS.length,...live);
  renderProducts();
  const sharedSlug=new URLSearchParams(window.location.search).get('product');
  if(sharedSlug){const sharedProduct=PRODUCTS.find(item=>item.slug===sharedSlug||item.id===sharedSlug);if(sharedProduct){openProductDetail(sharedProduct);document.getElementById('products')?.scrollIntoView({behavior:'smooth',block:'start'});}}
 }catch(error){console.warn('Could not load live catalogue; showing starter catalogue.',error);}
}
function initForm(){
 const form=document.getElementById('quote-form'),thanks=document.getElementById('thanks'),submit=form.querySelector('button[type="submit"]');
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  const values=new FormData(form),name=String(values.get('name')||'').trim(),phone=String(values.get('phone')||'').trim();
  const phoneDigits=phone.replace(/\D/g,'');
  if(phoneDigits.length<10||phoneDigits.length>15){alert('कृपया सही मोबाइल नंबर लिखें (10 अंक)।\nPlease enter a valid phone number.');form.querySelector('input[name="phone"]').focus();return;}
  const submitHtml=submit.innerHTML;submit.disabled=true;submit.textContent='भेजा जा रहा है… (Sending)';
  const {error}=await supabase.from('custom_inquiries').insert({name,phone,furniture_type:String(values.get('interest')||'Other'),requirements:String(values.get('details')||'').trim()||null,status:'new'});
  submit.disabled=false;submit.innerHTML=submitHtml;
  if(error){alert('माफ़ कीजिए, अभी जानकारी नहीं भेज पाए। कृपया दोबारा कोशिश करें या 94517 13626 पर कॉल करें।');console.error(error);return;}
  form.hidden=true;thanks.hidden=false;form.reset();thanks.scrollIntoView({behavior:'smooth',block:'center'});
 });
 document.getElementById('send-another').addEventListener('click',()=>{thanks.hidden=true;form.hidden=false;});
}
const CART_KEY='rudra_furniture_cart_v1';
let cart=[];
// upi_is_merchant: set to true in site_settings only for a BUSINESS UPI ID (PhonePe/Paytm/GPay Business).
// UPI apps decline website pay links to personal UPI IDs, so the direct 'open app' button stays hidden otherwise.
// upi_mc: merchant category code from the business QR (e.g. 0000 for PhonePe Business); added to pay links.
let storePayment={upi_id:'',upi_name:'Rudra Furniture Mart',upi_qr_url:'',upi_is_merchant:'',upi_mc:''};



// Hide the full mobile header while browsing down; reveal it on upward scroll.
let lastScrollY=window.scrollY||0,scrollFrame=false;
function updateMobileHeaderScroll(){
 const header=document.querySelector('.header');if(!header)return;
 const mobile=window.matchMedia('(max-width: 680px)').matches;
 if(!mobile){header.classList.remove('header--scroll-hidden');return;}
 const y=window.scrollY||0,delta=y-lastScrollY;
 if(y<70||delta<-7)header.classList.remove('header--scroll-hidden');
 else if(delta>7)header.classList.add('header--scroll-hidden');
 lastScrollY=y;scrollFrame=false;
}
window.addEventListener('scroll',()=>{if(!scrollFrame){scrollFrame=true;requestAnimationFrame(updateMobileHeaderScroll);}},{passive:true});
window.addEventListener('resize',updateMobileHeaderScroll);

// Accessible collapsible navigation for mobile screens
const mobileMenuToggle=document.getElementById('mobile-menu-toggle');
const primaryNavigation=document.getElementById('primary-navigation');
if(mobileMenuToggle&&primaryNavigation){
 mobileMenuToggle.addEventListener('click',()=>{
  const expanded=mobileMenuToggle.getAttribute('aria-expanded')==='true';
  mobileMenuToggle.setAttribute('aria-expanded',String(!expanded));
  primaryNavigation.classList.toggle('is-open',!expanded);
  mobileMenuToggle.querySelector('.mobile-menu-icon').textContent=expanded?'☰':'✕';
  mobileMenuToggle.querySelector('.mobile-menu-label').textContent=expanded?'मेनू':'बंद करें';
 });
 primaryNavigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  primaryNavigation.classList.remove('is-open');
  mobileMenuToggle.setAttribute('aria-expanded','false');
  mobileMenuToggle.querySelector('.mobile-menu-icon').textContent='☰';
  mobileMenuToggle.querySelector('.mobile-menu-label').textContent='मेनू';
 }));
}

document.getElementById('year').textContent=new Date().getFullYear();

// ---- Quick pay (जल्दी भुगतान): name + mobile + product → UPI ----
// Each request is saved as an enquiry (furniture_type "Quick payment — …") so the
// shop sees it in the admin panel, then the customer pays with any UPI app.
let quickPay=null;
function qpStep(n){[1,2,3].forEach(i=>document.getElementById('qp-step-'+i)?.classList.toggle('is-active',i<=n));}
function openQuickPay(productName){
 const form=document.getElementById('quick-pay-form');if(!form)return;
 document.getElementById('quick-pay-step2').hidden=true;document.getElementById('quick-pay-off').hidden=true;form.hidden=false;qpStep(1);
 if(productName)form.querySelector('input[name="product"]').value=productName;
 openLayer('quick-pay-modal');
 setTimeout(()=>form.querySelector(productName?'input[name="name"]':'input[name="name"]')?.focus(),50);
}
function qpUpiUri(){
 if(!storePayment.upi_id||!quickPay)return '';
 const amount=quickPay.amount?'&am='+encodeURIComponent(quickPay.amount.toFixed(2)):'';
 return 'upi://pay?pa='+encodeURIComponent(storePayment.upi_id)+'&pn='+encodeURIComponent(storePayment.upi_name||'Rudra Furniture Mart')+(storePayment.upi_mc?'&mc='+encodeURIComponent(storePayment.upi_mc):'')+amount+'&cu=INR&tn='+encodeURIComponent('Rudra Furniture Mart payment');
}
function qpRefreshConfirm(){
 if(!quickPay)return;
 const ref=document.getElementById('qp-ref').value.trim();
 const text='नमस्ते Rudra Furniture Mart 🙏\nमैंने UPI से भुगतान कर दिया है।\nनाम: '+quickPay.name+'\nमोबाइल: '+quickPay.phone+'\nसामान: '+quickPay.product+(quickPay.amount?'\nरक़म: ₹'+quickPay.amount.toLocaleString('en-IN'):'')+(ref?'\nUPI ट्रांज़ैक्शन नंबर: '+ref:'')+'\nकृपया भुगतान पक्का करें।';
 document.getElementById('qp-confirm').href=waLink(text);
}
function initQuickPay(){
 const form=document.getElementById('quick-pay-form');if(!form)return;
 document.querySelectorAll('[data-quick-pay]').forEach(a=>a.addEventListener('click',event=>{event.preventDefault();
  openQuickPay();}));
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  const v=new FormData(form),submit=form.querySelector('button[type="submit"]');
  const name=String(v.get('name')||'').trim(),product=String(v.get('product')||'').trim();
  let phone=String(v.get('phone')||'').replace(/\D/g,'');if(phone.length===12&&phone.startsWith('91'))phone=phone.slice(2);
  const amount=Number(v.get('amount'))||0;
  if(!name){alert('कृपया अपना नाम लिखें।');return;}
  if(!/^[6-9][0-9]{9}$/.test(phone)){alert('कृपया सही 10 अंकों का मोबाइल नंबर लिखें।\nPlease enter a valid 10-digit mobile number.');form.querySelector('input[name="phone"]').focus();return;}
  if(!product){alert('कृपया सामान का नाम लिखें।');return;}
  if(!storePayment.upi_id){form.hidden=true;document.getElementById('quick-pay-off').hidden=false;return;}
  const html=submit.innerHTML;submit.disabled=true;submit.textContent='एक पल रुकें… (Please wait)';
  quickPay={name,phone,product,amount:amount>0?Math.round(amount):0};
  const {error}=await supabase.from('custom_inquiries').insert({name,phone,furniture_type:('Quick payment — '+product).slice(0,120),budget:quickPay.amount?('₹'+quickPay.amount.toLocaleString('en-IN')).slice(0,80):null,requirements:'जल्दी भुगतान (Quick pay) शुरू किया। UPI से भुगतान की जाँच करें।\nProduct: '+product+(quickPay.amount?'\nAmount: ₹'+quickPay.amount:'\nAmount: customer will enter in UPI app'),status:'new'});
  submit.disabled=false;submit.innerHTML=html;
  if(error)console.error('Quick pay record failed',error); // still let the customer pay
  const uri=qpUpiUri();
  document.getElementById('qp-summary').replaceChildren(
   el('div',{},[el('span',{text:'नाम'}),el('b',{text:name})]),
   el('div',{},[el('span',{text:'मोबाइल'}),el('b',{text:phone})]),
   el('div',{},[el('span',{text:'सामान'}),el('b',{text:product})]),
   el('div',{},[el('span',{text:'रक़म'}),el('b',{text:quickPay.amount?'₹'+quickPay.amount.toLocaleString('en-IN'):'UPI ऐप में भरें'})])
  );
  document.getElementById('qp-upi-link').href=uri;
  document.getElementById('qp-upi-id').textContent=storePayment.upi_id;
  document.getElementById('qp-payee').textContent=storePayment.upi_name||'Rudra Furniture Mart';
  // Prefer the shop's own QR (made by its bank/UPI app, so it is always correct); amount is typed in the app.
  const qrSrc=storePayment.upi_qr_url||('https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data='+encodeURIComponent('upi://pay?pa='+storePayment.upi_id+'&pn='+(storePayment.upi_name||'Rudra Furniture Mart')+'&cu=INR'));
  document.getElementById('qp-qr').src=qrSrc;document.getElementById('qp-qr-save').href=qrSrc;
  document.getElementById('qp-copy').textContent='कॉपी करें';
  document.getElementById('qp-way-app').hidden=String(storePayment.upi_is_merchant).toLowerCase()!=='true';
  const note=document.getElementById('qp-amount-note');note.hidden=!quickPay.amount;if(quickPay.amount)note.textContent='UPI ऐप में रक़म ₹'+quickPay.amount.toLocaleString('en-IN')+' भरें।';
  document.getElementById('qp-ref').value='';qpRefreshConfirm();
  form.hidden=true;document.getElementById('quick-pay-step2').hidden=false;qpStep(2);
  document.querySelector('.quick-pay-panel').scrollTop=0;
 });
 document.getElementById('qp-ref').addEventListener('input',qpRefreshConfirm);
 document.getElementById('qp-confirm').addEventListener('click',()=>{qpRefreshConfirm();qpStep(3);});
 document.getElementById('qp-back').addEventListener('click',()=>{document.getElementById('quick-pay-step2').hidden=true;form.hidden=false;qpStep(1);});
 document.getElementById('qp-copy').addEventListener('click',async()=>{const b=document.getElementById('qp-copy');try{await navigator.clipboard.writeText(storePayment.upi_id);b.textContent='कॉपी हो गया ✓';}catch{window.prompt('UPI ID कॉपी करें:',storePayment.upi_id);}});
 if(location.hash==='#pay'){const name=new URLSearchParams(location.search).get('pay_for');openQuickPay(name||'');}
 window.addEventListener('hashchange',()=>{if(location.hash==='#pay')openQuickPay();});
}

initWhatsAppLinks();
initQuickPay();
loadHomepageReviews();
renderRooms();renderTabs();initCatalogueControls();initLaunchBanner();renderProducts();initForm();initCommerce();loadStoreProducts();


const inr=value=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number(value)||0);
function readCart(){try{cart=JSON.parse(localStorage.getItem(CART_KEY)||'[]').filter(x=>x&&x.id&&Number.isInteger(x.quantity)&&x.quantity>0);}catch{cart=[];}saveCart();}
function saveCart(){localStorage.setItem(CART_KEY,JSON.stringify(cart));const count=cart.reduce((n,x)=>n+x.quantity,0);const badge=document.getElementById('cart-count');if(badge)badge.textContent=count;const floatingCount=document.getElementById('floating-cart-count');if(floatingCount)floatingCount.textContent=count;}
function openLayer(id){document.getElementById(id).hidden=false;document.body.classList.add('modal-open');}
function closeLayer(id){document.getElementById(id).hidden=true;if(!document.querySelector('.commerce-overlay:not([hidden])'))document.body.classList.remove('modal-open');}
function initCommerce(){
 readCart();
 supabase.from('site_settings').select('key,value').in('key',['upi_id','upi_name','upi_qr_url','upi_is_merchant','upi_mc']).then(({data})=>{(data||[]).forEach(x=>storePayment[x.key]=String(x.value||'').replace(/^\"|\"$/g,''));refreshUpiDisplay();});
 document.querySelectorAll('input[name="payment_method"]').forEach(r=>r.addEventListener('change',refreshUpiDisplay));
 document.getElementById('copy-upi')?.addEventListener('click',async()=>{if(!storePayment.upi_id)return;try{await navigator.clipboard.writeText(storePayment.upi_id);document.getElementById('copy-upi').textContent='Copied';}catch{document.getElementById('upi-id-display').textContent=storePayment.upi_id;}});
 const showCart=()=>{renderCart();openLayer('cart-modal');};document.getElementById('open-cart').addEventListener('click',showCart);document.getElementById('floating-cart')?.addEventListener('click',showCart);
 document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeLayer(b.dataset.close)));
 document.querySelectorAll('.commerce-overlay').forEach(layer=>layer.addEventListener('click',e=>{if(e.target===layer)closeLayer(layer.id);}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.commerce-overlay:not([hidden])').forEach(layer=>closeLayer(layer.id));});
 document.getElementById('checkout-start').addEventListener('click',startCheckout);
 document.getElementById('checkout-form').addEventListener('submit',placeCodOrder);
}
function refreshUpiDisplay(){
 const qrWrap=document.getElementById('upi-qr-wrap'),qrImage=document.getElementById('upi-qr-image');
 const chosen=document.querySelector('input[name="payment_method"]:checked')?.value==='upi';
 const panel=document.getElementById('upi-payment-info');if(!panel)return;
 panel.hidden=!chosen;
 const total=cartProducts().reduce((n,x)=>n+x.product.price*x.quantity,0);
 const upiUri=storePayment.upi_id?'upi://pay?pa='+encodeURIComponent(storePayment.upi_id)+'&pn='+encodeURIComponent(storePayment.upi_name)+(storePayment.upi_mc?'&mc='+encodeURIComponent(storePayment.upi_mc):'')+'&am='+encodeURIComponent(total.toFixed(2))+'&cu=INR&tn='+encodeURIComponent('Rudra Furniture Mart order'):'';
 document.getElementById('upi-id-display').textContent=storePayment.upi_id?storePayment.upi_id+' · '+storePayment.upi_name:'UPI payment is not configured yet. Please choose Cash on Delivery or contact the showroom.';
 if(qrWrap&&qrImage){
  qrWrap.hidden=!chosen||!storePayment.upi_id;
  if(chosen&&storePayment.upi_id){
   qrImage.src=storePayment.upi_qr_url||('https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data='+encodeURIComponent(upiUri));
   const caption=document.getElementById('upi-qr-caption');if(caption)caption.textContent=storePayment.upi_qr_url?'Scan Rudra Furniture Mart’s saved UPI QR. Confirm the payable amount in your UPI app.':'Scan this QR to pay '+inr(total)+' to '+storePayment.upi_name+'.';
  }
 }
 const link=document.getElementById('upi-app-link');link.href=upiUri||'#';link.hidden=!storePayment.upi_id||String(storePayment.upi_is_merchant).toLowerCase()!=='true';
}
function addToCart(product,selectedSize='',customDimensions=''){
 if(!product.id||product.price==null||product.price_type!=='fixed'){productEnquiry(product);return;}
 const found=cart.find(x=>x.id===product.id&&x.selected_size===selectedSize&&x.custom_dimensions===customDimensions);if(found)found.quantity=Math.min(100,found.quantity+1);else cart.push({id:product.id,quantity:1,selected_size:selectedSize,custom_dimensions:customDimensions});
 saveCart();renderCart();openLayer('cart-modal');
}
function cartProducts(){return cart.map(item=>({...item,product:PRODUCTS.find(p=>p.id===item.id)})).filter(x=>x.product&&x.product.price!=null&&x.product.price_type==='fixed');}
function renderCart(){
 const root=document.getElementById('cart-items'),summary=document.getElementById('cart-summary'),items=cartProducts();root.replaceChildren();summary.replaceChildren();
 if(!items.length){root.append(el('p',{class:'muted',text:'Your cart is empty. Add a fixed-price product to continue.'}));document.getElementById('checkout-start').disabled=true;document.getElementById('checkout-start').textContent='Your cart is empty';return;}
 document.getElementById('checkout-start').disabled=false;document.getElementById('checkout-start').textContent='Proceed to checkout';
 items.forEach(({id,quantity,product,selected_size,custom_dimensions})=>root.append(el('article',{class:'cart-line'},[
  photo(product.image,product.name,'cart-line__image'),el('div',{class:'cart-line__info'},[
   el('strong',{text:product.name}),el('span',{class:'muted',text:(selected_size?'Size: '+selected_size:'')+(custom_dimensions?' · Custom: '+custom_dimensions:'')}),el('span',{class:'muted',text:inr(product.price)+' each'}),
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
 const subtotal=cartProducts().reduce((n,x)=>n+x.product.price*x.quantity,0);document.getElementById('checkout-total').textContent='Cart subtotal: '+inr(subtotal)+' · Delivery charges confirmed by showroom';refreshUpiDisplay();
 openLayer('checkout-modal');
}
async function placeCodOrder(event){
 event.preventDefault();const form=event.currentTarget,button=form.querySelector('button[type=submit]'),msg=document.getElementById('checkout-message');
 const values=new FormData(form),phone=String(values.get('phone')||'').replace(/\D/g,'');
 if(phone.length!==10||!/^[6-9]/.test(phone)){msg.textContent='Enter a valid 10-digit Indian mobile number.';return;}
 const items=cartProducts();if(!items.length){msg.textContent='Your cart is empty.';return;}
 button.disabled=true;button.textContent='Placing order…';msg.textContent='';
 const method=String(values.get('payment_method')||'cod');if(method==='upi'&&!storePayment.upi_id){button.disabled=false;button.textContent='Place order';msg.textContent='UPI is not configured yet. Please select Cash on Delivery or contact the showroom.';return;}
 const notes=[String(values.get('notes')||'').trim(),method==='upi'&&String(values.get('upi_reference')||'').trim()?'UPI reference: '+String(values.get('upi_reference')).trim():''].filter(Boolean).join(' | ')||null;
 const customer={full_name:String(values.get('full_name')).trim(),phone,email:String(values.get('email')||'').trim()||null,address_line:String(values.get('address_line')).trim(),city:String(values.get('city')).trim(),state:String(values.get('state')).trim(),pincode:String(values.get('pincode')).trim(),notes};
 const {data,error}=await supabase.rpc('place_order',{p_customer:customer,p_items:items.map(x=>({product_id:x.id,quantity:x.quantity,selected_size:x.selected_size||null,custom_dimensions:x.custom_dimensions||null})),p_payment_method:method,p_coupon:null});
 button.disabled=false;button.textContent='Place order';
 if(error){msg.textContent=error.message||'We could not place your order. Please check your details and try again.';return;}
 cart=[];saveCart();form.hidden=true;
 const success=document.getElementById('order-success');success.hidden=false;success.replaceChildren(el('div',{class:'order-success'},[
  el('div',{class:'order-success__mark',text:'✓'}),el('h3',{text:'Your order request is received!'}),
  el('p',{text:'Order number: '+data.order_number}),el('p',{text:'Order total: '+inr(data.total)}),
  el('p',{text:method==='cod'?'Payment: Cash on Delivery. Our team will call you to confirm your order and delivery.':'Payment: UPI selected. Your order is pending payment verification by our showroom.'}),
  el('button',{class:'btn btn--outline',type:'button',text:'Request downloadable bill',onclick:async()=>{const {error}=await supabase.from('bill_requests').insert({order_id:data.order_id,customer_name:customer.full_name,phone:customer.phone,email:customer.email,bill_data:{items:items.map(x=>({name:x.product.name,quantity:x.quantity,unit_price:Number(x.product.price),cgst_rate:0,sgst_rate:0})),delivery_charge:0,discount:0}});if(error){alert('Bill request could not be sent: '+error.message);return;}alert('Bill request sent. Admin will verify payment and approve the bill. You can later check it using your order number and mobile number.');}}),
  el('a',{class:'btn btn--green',href:'https://wa.me/919451713626?text='+encodeURIComponent('Hello Rudra Furniture Mart, I placed order '+data.order_number+'. Please confirm my order.'),target:'_blank',rel:'noopener',text:'Message us on WhatsApp'}),
  el('button',{class:'btn btn--outline',type:'button',text:'Continue shopping',onclick:()=>closeLayer('checkout-modal')})
 ]));
}
function openProductDetail(product){
 const root=document.getElementById('product-detail-content');root.replaceChildren();
 const photos=(product.images||[]).map(x=>x.url).filter(Boolean);
 if(!photos.length&&product.image)photos.push(product.image);
 const gallery=el('div',{class:'detail-gallery'});
 if(photos.length){
  const viewer=el('div',{class:'detail-gallery__viewer'});
  const main=el('img',{src:photos[0],alt:product.name+' main photograph'});
  const imageShare=el('button',{type:'button',class:'detail-gallery__share',text:'↗ शेयर करें',onclick:()=>sharePublicProduct(product)});
  const openPhotoZoom=()=>{
   let zoomIndex=active,touchStartX=0,touchStartY=0;
   const overlay=el('div',{class:'product-photo-lightbox',role:'dialog','aria-modal':'true','aria-label':'Product photo gallery. Swipe to view all photos'});
   const close=el('button',{type:'button',class:'product-photo-lightbox__close',text:'×','aria-label':'बंद करें'});
   const enlarged=el('img',{src:photos[zoomIndex],alt:product.name+' enlarged photo 1'});
   const counter=el('span',{class:'product-photo-lightbox__counter',text:(zoomIndex+1)+' / '+photos.length});
   const previous=el('button',{type:'button',class:'product-photo-lightbox__nav product-photo-lightbox__prev',text:'‹',ariaLabel:'Previous photo'});
   const next=el('button',{type:'button',class:'product-photo-lightbox__nav product-photo-lightbox__next',text:'›',ariaLabel:'Next photo'});
   const updateZoom=index=>{zoomIndex=(index+photos.length)%photos.length;enlarged.src=photos[zoomIndex];enlarged.alt=product.name+' enlarged photo '+(zoomIndex+1);counter.textContent=(zoomIndex+1)+' / '+photos.length;active=zoomIndex;main.src=photos[active];main.alt=product.name+' photo '+(active+1);thumbs.querySelectorAll('button').forEach((b,k)=>b.classList.toggle('is-active',k===active));};
   const closeZoom=()=>{overlay.remove();document.removeEventListener('keydown',onKey);};
   const onKey=event=>{if(event.key==='Escape')closeZoom();else if(event.key==='ArrowLeft')updateZoom(zoomIndex-1);else if(event.key==='ArrowRight')updateZoom(zoomIndex+1);};
   previous.addEventListener('click',()=>updateZoom(zoomIndex-1));next.addEventListener('click',()=>updateZoom(zoomIndex+1));
   enlarged.addEventListener('touchstart',event=>{touchStartX=event.changedTouches[0].clientX;touchStartY=event.changedTouches[0].clientY;},{passive:true});
   enlarged.addEventListener('touchend',event=>{const dx=event.changedTouches[0].clientX-touchStartX,dy=event.changedTouches[0].clientY-touchStartY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))updateZoom(zoomIndex+(dx<0?1:-1));},{passive:true});
   close.addEventListener('click',closeZoom);overlay.addEventListener('click',event=>{if(event.target===overlay)closeZoom();});
   overlay.append(close,previous,enlarged,next,counter);document.body.append(overlay);document.addEventListener('keydown',onKey);
   if(photos.length<2){previous.hidden=true;next.hidden=true;counter.hidden=true;}
  };
  main.addEventListener('click',openPhotoZoom);
  const zoom=el('button',{type:'button',class:'detail-gallery__zoom',text:'⛶ बड़ा देखें',onclick:openPhotoZoom});
  viewer.append(main,zoom,imageShare);
  const thumbs=el('div',{class:'detail-gallery__thumbs'});
  let active=0;
  photos.forEach((url,i)=>{const thumb=el('button',{type:'button',class:'detail-gallery__thumb'+(i===0?' is-active':''),ariaLabel:'View product photo '+(i+1),onclick:()=>{active=i;main.src=url;main.alt=product.name+' photo '+(i+1);thumbs.querySelectorAll('button').forEach((b,k)=>b.classList.toggle('is-active',k===i));}});thumb.append(el('img',{src:url,alt:product.name+' thumbnail '+(i+1),loading:'lazy'}));thumbs.append(thumb);});
  gallery.append(viewer,thumbs);
 }else gallery.append(el('div',{class:'detail-no-photo',text:'फ़ोटो जल्दी ही जोड़ी जाएँगी · Photos coming soon'}));
 const sizeWrap=el('div',{class:'product-size-picker'}),sizeLabel=el('label',{text:'साइज़ चुनें (Choose size)'}),sizeSelect=el('select',{class:'product-size-select'});sizeSelect.append(new Option('— साइज़ चुनें —',''));(product.size_options||[]).forEach(size=>sizeSelect.append(new Option(size,size)));if(!(product.size_options||[]).length)sizeSelect.append(new Option('सामान्य साइज़ (Standard)','Standard size'));sizeLabel.append(sizeSelect);const customLabel=el('label',{text:'अपना साइज़ चाहिए? नाप लिखें (Custom size)'}),customInput=el('input',{type:'text',maxlength:120,placeholder:'जैसे: 6 फ़ुट × 6.5 फ़ुट'});customLabel.append(customInput);sizeWrap.append(sizeLabel,customLabel);
 root.append(gallery,el('div',{class:'detail-copy'},[
  el('span',{class:'product__hi',text:hindiType(product)+' · '+(product.space_type==='outdoor'?'बाहर के लिए':product.space_type==='both'?'अंदर व बाहर':'घर के अंदर')}),
  el('h2',{id:'detail-title',lang:'en',text:product.name}),el('p',{class:'detail-price',text:displayProductPrice(product)}),
  el('p',{text:product.description||product.detail}),sizeWrap,
  el('dl',{class:'detail-specs'},[
   el('dt',{text:'लकड़ी / सामग्री'}),el('dd',{text:product.material||'फ़ोन पर पूछें'}),
   el('dt',{text:'नाप (साइज़)'}),el('dd',{text:product.dimensions||'आपके कमरे के हिसाब से'}),
   el('dt',{text:'रंग / पॉलिश'}),el('dd',{text:product.colors?.join(', ')||'फ़ोन पर पूछें'}),
   el('dt',{text:'अपनी पसंद से बदलाव'}),el('dd',{text:product.customization||'फ़ोन पर पूछें'}),
   el('dt',{text:'डिलीवरी का समय'}),el('dd',{text:product.delivery_estimate||'फ़ोन पर बताया जाएगा'})
  ]),
  el('div',{class:'detail-actions'},[callButton('btn--lg'),(()=>{const wa=waButton(product,'btn--lg');wa.addEventListener('click',()=>{const custom=customInput.value.trim(),chosen=sizeSelect.value;wa.href=waLink(productWaText(product)+(chosen?'\nसाइज़: '+chosen:'')+(custom?'\nमेरा नाप: '+custom:''));});return wa;})(),el('button',{class:'btn btn--outline btn--lg',type:'button',text:'💳 दाम तय हो गया? भुगतान करें',onclick:()=>{closeLayer('product-modal');openQuickPay(product.name);}}),el('button',{class:'btn btn--outline btn--lg',type:'button',text:'📝 फ़ॉर्म भरें — हम कॉल करेंगे',onclick:()=>{const custom=customInput.value.trim(),chosen=sizeSelect.value;closeLayer('product-modal');productEnquiry(product);const details=document.querySelector('#quote-form textarea[name="details"]');if(details&&(chosen||custom))details.value+=(chosen?'\nसाइज़ (Size): '+chosen:'')+(custom?'\nनाप (Custom): '+custom:'');}})])
 ]));openLayer('product-modal');
}

async function renderApprovedBill(payload){
 const req=payload,ord=payload.order,bill=payload.bill_data||{},items=bill.items||[];
 const subtotal=items.reduce((sum,x)=>sum+Number(x.unit_price||0)*Number(x.quantity||0),0);
 let cgst=0,sgst=0;
 const rows=items.map((x,i)=>{const base=Number(x.unit_price||0)*Number(x.quantity||0),c=base*Number(x.cgst_rate||0)/100,s=base*Number(x.sgst_rate||0)/100;cgst+=c;sgst+=s;return '<tr><td>'+(i+1)+'</td><td>'+escapeBill(x.name)+'</td><td>'+x.quantity+'</td><td>'+inr(x.unit_price)+'</td><td>'+Number(x.cgst_rate||0)+'%</td><td>'+inr(c)+'</td><td>'+Number(x.sgst_rate||0)+'%</td><td>'+inr(s)+'</td><td>'+inr(base+c+s)+'</td></tr>';}).join('');
 const total=subtotal+cgst+sgst+Number(bill.delivery_charge||0)-Number(bill.discount||0);
 const doc='<!doctype html><html><head><meta charset="utf-8"><title>'+escapeBill(req.invoice_number)+'</title><style>@page{size:A4;margin:14mm}body{font:13px Arial;color:#30251d}header{padding:22px;background:#2b211b;color:white;border-bottom:5px solid #c49a4a;display:flex;justify-content:space-between}h1{color:#f0d79e;margin:0;font:700 28px Georgia}.meta{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:22px 0}.meta section{background:#f8f3ea;padding:14px}table{width:100%;border-collapse:collapse;font-size:10px}th{background:#4b3525;color:white;padding:8px}td{border:1px solid #ddd;padding:7px}.totals{width:280px;margin:20px 0 0 auto}.totals div{display:flex;justify-content:space-between;padding:6px}.grand{background:#f2e5cd;font-weight:bold;font-size:17px}.foot{margin-top:35px;border-top:2px solid #c49a4a;padding-top:12px;color:#76695d}@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}</style></head><body><header><div><h1>RUDRA</h1><b>F U R N I T U R E M A R T</b><p>Vishwakarmanagar, Bataubeer, Shahpur Badlapur,<br>Jaunpur, Uttar Pradesh – 222125</p><p>+91 94517 13626 · rudrafurnituremartsupport@gmail.com</p>'+(req.business_gstin?'<p>GSTIN: '+escapeBill(req.business_gstin)+'</p>':'')+'</div><div><h2>TAX INVOICE / BILL</h2><b>'+escapeBill(req.invoice_number)+'</b><p>'+new Date().toLocaleDateString('en-IN')+'</p><b>PAYMENT VERIFIED</b></div></header><div class="meta"><section><b>BILL TO</b><p>'+escapeBill(req.customer_name)+'<br>'+escapeBill(req.phone)+'<br>'+escapeBill(req.email||'')+'</p><p>'+escapeBill(ord.address_line)+'<br>'+escapeBill(ord.city)+', '+escapeBill(ord.state)+' - '+escapeBill(ord.pincode)+'</p></section><section><b>ORDER DETAILS</b><p>'+escapeBill(ord.order_number)+'<br>Payment: '+escapeBill(ord.payment_method)+' · Paid</p></section></div><table><thead><tr><th>#</th><th>Product</th><th>Qty</th><th>Rate</th><th>CGST</th><th>CGST amt</th><th>SGST</th><th>SGST amt</th><th>Total</th></tr></thead><tbody>'+rows+'</tbody></table><div class="totals"><div><span>Taxable value</span><b>'+inr(subtotal)+'</b></div><div><span>CGST</span><b>'+inr(cgst)+'</b></div><div><span>SGST</span><b>'+inr(sgst)+'</b></div><div><span>Delivery</span><b>'+inr(bill.delivery_charge)+'</b></div><div><span>Discount</span><b>- '+inr(bill.discount)+'</b></div><div class="grand"><span>Grand total</span><b>'+inr(total)+'</b></div></div><p class="foot">Thank you for choosing Rudra Furniture Mart. This bill has been approved after payment verification. GST particulars apply only where legally applicable.</p><script>window.onload=()=>window.print();window.onafterprint=()=>{document.getElementById(\"rate-after-bill\").hidden=false;}</script><div id="rate-after-bill" hidden style="text-align:center;margin:28px auto;padding:22px;background:#f8f1e5;border:1px solid #c49a4a;border-radius:12px;max-width:650px"><h2>How was your experience with Rudra?</h2><p>Your bill is ready. We would appreciate your feedback.</p><a href="https://rudrafurnituremart.com/feedback.html" style="display:inline-block;padding:13px 24px;background:#3b2b20;color:#fff;text-decoration:none;border-radius:24px;font-weight:bold">Rate your experience</a></div><style>@media print{#rate-after-bill{display:none!important}}</style></body></html>';
 const win=window.open('','_blank','width=1000,height=800');if(!win){alert('Allow pop-ups to download/print the approved bill.');return;}win.document.write(doc);win.document.close();
}
function escapeBill(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
document.getElementById('bill-lookup-form')?.addEventListener('submit',async e=>{
 e.preventDefault();const f=new FormData(e.currentTarget),msg=document.getElementById('bill-lookup-message'),area=document.getElementById('bill-download-area');msg.textContent='Checking…';area.replaceChildren();
 const {data,error}=await supabase.rpc('get_approved_customer_bill',{p_order_number:String(f.get('order_number')).trim(),p_phone:String(f.get('phone')).trim()});
 if(error){msg.textContent='Could not check bill status. Please contact the showroom.';return;}
 if(!data||data.request_status==='not_available'){msg.textContent='No approved bill found yet. If you requested one, please wait for payment verification and admin approval.';return;}
 msg.textContent='Your bill is approved and ready.';
 area.append(el('button',{type:'button',class:'btn btn--green',text:'Download / Print approved bill',onclick:()=>renderApprovedBill(data)}));
});

async function loadHomepageReviews(){
 const average=document.getElementById('home-review-average');if(!average)return;
 const {data,error}=await supabase.from('customer_reviews').select('customer_name,overall_rating,product_quality,design_variety,value_for_money,communication,delivery_experience,comment,created_at').eq('is_approved',true).eq('consent_to_publish',true).order('created_at',{ascending:false}).limit(60);
 if(error){document.getElementById('home-review-cards').textContent='ग्राहकों की राय अभी नहीं दिख रही।';return;}
 const rows=data||[];const avg=rows.length?rows.reduce((n,r)=>n+r.overall_rating,0)/rows.length:0;
 average.textContent=rows.length?avg.toFixed(1)+'/5':'—';
 document.getElementById('home-review-stars').textContent=rows.length?'★'.repeat(Math.round(avg))+'☆'.repeat(5-Math.round(avg)):'☆☆☆☆☆';
 document.getElementById('home-review-count').textContent=rows.length?rows.length+' ग्राहकों की राय':'अभी कोई रेटिंग नहीं';
 const params=[['सामान की क्वालिटी','product_quality'],['डिज़ाइन व वैरायटी','design_variety'],['दाम के हिसाब से','value_for_money'],['स्टाफ़ का व्यवहार','communication'],['डिलीवरी','delivery_experience']];
 const grid=document.getElementById('home-review-parameters');grid.replaceChildren();
 params.forEach(([label,key])=>{const score=rows.length?rows.reduce((n,r)=>n+r[key],0)/rows.length:0;const card=document.createElement('div');card.className='review-parameter';const title=document.createElement('strong');title.textContent=label;const value=document.createElement('b');value.textContent=rows.length?score.toFixed(1)+'/5':'—';card.append(title,value);grid.append(card);});
 const cards=document.getElementById('home-review-cards');cards.replaceChildren();
 if(!rows.length){const p=document.createElement('p');p.className='muted';p.textContent='ग्राहकों की राय जाँच के बाद यहाँ दिखेगी। आप भी अपनी राय दे सकते हैं।';cards.append(p);return;}
 rows.slice(0,3).forEach(r=>{const card=document.createElement('article');card.className='home-review-card';const top=document.createElement('div');top.className='home-review-card__top';const name=document.createElement('strong');name.textContent=r.customer_name;const stars=document.createElement('span');stars.className='home-stars';stars.textContent='★'.repeat(r.overall_rating)+'☆'.repeat(5-r.overall_rating);top.append(name,stars);const comment=document.createElement('p');comment.textContent=r.comment;const date=document.createElement('small');date.textContent=new Date(r.created_at).toLocaleDateString('en-IN');card.append(top,comment,date);cards.append(card);});
}
