import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.119.0';

const SUPABASE_URL = 'https://txueuktoagvcidwdxjxe.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_cgK84vg1sY7R1TOxGfsYjw_02uy6ulI';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const $ = (selector) => document.querySelector(selector);
let categories = [], products = [];

$('#year').textContent = new Date().getFullYear();
const message = (selector, text, good=false) => { const node=$(selector); node.textContent=text; node.style.color=good?'#2f5d46':'#a1552a'; };
const slugify = value => value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const money = (value,type) => value==null||type==='quote'?'Quote on request':new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);

async function checkAdmin(){
 const {data:{session}} = await supabase.auth.getSession();
 if(!session){showLogin();return;}
 const {data:userData,error:userError}=await supabase.auth.getUser();
 if(userError||!userData.user){showLogin();return;}
 const {data:role,error}=await supabase.from('admin_users').select('role').eq('user_id',userData.user.id).maybeSingle();
 if(error||!role||!['admin','staff'].includes(role.role)){
  await supabase.auth.signOut();showLogin();
  message('#login-message','This account does not have admin access.');return;
 }
 $('#login-panel').hidden=true;$('#dashboard').hidden=false;$('#signed-in-as').textContent=userData.user.email;
 await loadDashboard();
}
async function loadStoreSettings(){
 const {data,error}=await supabase.from('site_settings').select('key,value').in('key',['upi_id','upi_name','phone','upi_qr_url','business_gstin','business_legal_name','business_address']);
 if(error){message('#settings-message','Could not load settings: '+error.message);return;}
 const settings=Object.fromEntries((data||[]).map(x=>[x.key,x.value]));
 const form=$('#store-settings-form');if(!form)return;
 form.elements.upi_id.value=String(settings.upi_id||'').replace(/^"|"$/g,'');
 form.elements.upi_name.value=String(settings.upi_name||'Rudra Furniture Mart').replace(/^"|"$/g,'');
 form.elements.phone.value=String(settings.phone||'').replace(/^"|"$/g,'');
 form.elements.business_gstin.value=String(settings.business_gstin||'').replace(/^"|"$/g,'');
 form.elements.business_legal_name.value=String(settings.business_legal_name||'Rudra Furniture Mart').replace(/^"|"$/g,'');
 form.elements.business_address.value=String(settings.business_address||'Vishwakarmanagar, Bataubeer, Shahpur Badlapur, Jaunpur, Uttar Pradesh - 222125, India').replace(/^"|"$/g,'');
}
$('#store-settings-form')?.addEventListener('submit',async event=>{
 event.preventDefault();const form=event.currentTarget,button=form.querySelector('button[type=submit]');button.disabled=true;button.textContent='Saving…';
 const values=new FormData(form);
 const entries=[['upi_id',String(values.get('upi_id')).trim()],['upi_name',String(values.get('upi_name')).trim()],['phone',String(values.get('phone')).trim()],['business_gstin',String(values.get('business_gstin')).trim().toUpperCase()],['business_legal_name',String(values.get('business_legal_name')).trim()],['business_address',String(values.get('business_address')).trim()]];
 const qr=form.elements.upi_qr.files[0]; if(qr){if(qr.size>3*1024*1024||!['image/png','image/jpeg','image/webp'].includes(qr.type)){message('#settings-message','QR must be PNG, JPG or WebP under 3 MB.');button.disabled=false;button.textContent='Save store settings';return;}const path='payment/upi-qr-'+Date.now()+'.'+(qr.type==='image/png'?'png':qr.type==='image/webp'?'webp':'jpg');const {error:upErr}=await supabase.storage.from('product-images').upload(path,qr,{contentType:qr.type,upsert:false});if(upErr){message('#settings-message','Could not upload QR: '+upErr.message);button.disabled=false;button.textContent='Save store settings';return;}const {data:pub}=supabase.storage.from('product-images').getPublicUrl(path);entries.push(['upi_qr_url',pub.publicUrl]);}
 for(const [key,value] of entries){const {error}=await supabase.from('site_settings').upsert({key,value:JSON.stringify(value)},{onConflict:'key'});if(error){message('#settings-message','Could not save '+key+': '+error.message);button.disabled=false;button.textContent='Save store settings';return;}}
 message('#settings-message','Payment, QR and billing settings saved.',true);button.disabled=false;button.textContent='Save store settings';
});
function showLogin(){ $('#login-panel').hidden=false;$('#dashboard').hidden=true; }
$('#login-form').addEventListener('submit',async event=>{
 event.preventDefault();const button=event.submitter;button.disabled=true;button.textContent='Signing in…';message('#login-message','');
 const form=new FormData(event.currentTarget);
 const {error}=await supabase.auth.signInWithPassword({email:form.get('email').trim(),password:form.get('password')});
 button.disabled=false;button.textContent='Sign in to dashboard';
 if(error){message('#login-message',error.message);return;}await checkAdmin();
});
$('#forgot-password').addEventListener('click',async()=>{
 const email=$('#login-form [name="email"]').value.trim();
 if(!email){message('#login-message','Enter your admin email first.');return;}
 const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:location.origin+'/admin/'});
 message('#login-message',error?error.message:'If this email is registered, a password reset link has been sent.',!error);
});
$('#logout').addEventListener('click',async()=>{await supabase.auth.signOut();showLogin();});
$('#refresh').addEventListener('click',loadDashboard);
$('#filter-products').addEventListener('input',renderProducts);
$('#reset-form').addEventListener('click',resetForm);

async function loadDashboard(){
 const productRoot=$('#product-list');
 productRoot.textContent='Loading products…';
 const tasks=await Promise.allSettled([
  supabase.from('categories').select('id,name').eq('is_active',true).order('sort_order'),
  supabase.from('products').select('id,category_id,name,slug,short_description,description,material,dimensions,colors,price_type,price,price_tier,size_options,space_type,is_featured,is_bestseller,is_active,product_images(id,url,alt,sort_order),categories(name)').order('created_at',{ascending:false})
 ]);
 const catResult=tasks[0].status==='fulfilled'?tasks[0].value:{error:tasks[0].reason};
 const prodResult=tasks[1].status==='fulfilled'?tasks[1].value:{error:tasks[1].reason};
 if(catResult.error){message('#form-message','Could not load categories: '+(catResult.error.message||catResult.error));$('#category-total').textContent='—';}
 else{
  categories=catResult.data||[];
  const select=$('#category-select'),selected=select.value;
  select.replaceChildren(new Option('Choose a category',''),...categories.map(c=>new Option(c.name,c.id)));
  if(selected)select.value=selected;
  $('#category-total').textContent=categories.length;
 }
 if(prodResult.error){productRoot.textContent='Could not load products: '+(prodResult.error.message||prodResult.error);$('#product-total').textContent='—';$('#active-total').textContent='—';}
 else{
  products=prodResult.data||[];
  $('#product-total').textContent=products.length;
  $('#active-total').textContent=products.filter(p=>p.is_active).length;
  renderProducts();
 }
 await Promise.allSettled([loadInquiries(),loadOrders(),loadStoreSettings(),loadBillRequests(),loadReviews(),loadWorkerMonths()]);
}

async function loadInquiries(){
 const root=$('#inquiry-list');root.textContent='Loading enquiries…';
 try{
 const {data,error}=await supabase.from('custom_inquiries').select('id,name,phone,furniture_type,dimensions,material,budget,requirements,status,created_at').order('created_at',{ascending:false}).limit(40);
 if(error){root.textContent='Could not load enquiries: '+error.message;return;}
 root.replaceChildren();
 if(!data?.length){const p=document.createElement('p');p.className='subtle';p.textContent='No customer enquiries yet.';root.append(p);return;}
 data.forEach(item=>{
  const row=document.createElement('article');row.className='inquiry-row';
  const info=document.createElement('div');const title=document.createElement('h3');title.textContent=item.name+' · '+item.furniture_type;
  const phone=document.createElement('p');phone.textContent=item.phone;
  const detail=document.createElement('p');detail.textContent=[item.dimensions,item.material,item.budget,item.requirements].filter(Boolean).join(' · ')||'No additional details';
  const date=document.createElement('small');date.textContent=new Date(item.created_at).toLocaleString('en-IN');
  info.append(title,phone,detail,date);
  const controls=document.createElement('div');controls.className='inquiry-controls';
  const status=document.createElement('select');['new','contacted','quoted','closed'].forEach(v=>status.add(new Option(v[0].toUpperCase()+v.slice(1),v)));status.value=item.status||'new';
  status.addEventListener('change',async()=>{const {error}=await supabase.from('custom_inquiries').update({status:status.value}).eq('id',item.id);if(error){alert('Could not update enquiry: '+error.message);status.value=item.status||'new';}else item.status=status.value;});
  const call=document.createElement('a');call.href='tel:'+item.phone.replace(/[^+0-9]/g,'');call.textContent='Call';call.className='secondary-btn';
  const wa=document.createElement('a');wa.href='https://wa.me/'+item.phone.replace(/[^0-9]/g,'');wa.target='_blank';wa.rel='noopener';wa.textContent='WhatsApp';wa.className='secondary-btn';
  controls.append(status,call,wa);row.append(info,controls);root.append(row);
 });
 }catch(error){root.textContent='Enquiry loading failed: '+(error?.message||String(error));}
}
$('#refresh-inquiries')?.addEventListener('click',loadInquiries);


function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function printInvoice(order){
 const rows=(order.order_items||[]).map((item,i)=>'<tr><td>'+(i+1)+'</td><td>'+escapeHtml(item.product_name)+'</td><td>'+item.quantity+'</td><td>'+money(item.unit_price,'fixed')+'</td><td>'+money(item.line_total,'fixed')+'</td></tr>').join('');
 const doc='<!doctype html><html><head><meta charset="utf-8"><title>Invoice '+escapeHtml(order.order_number)+'</title><style>body{font:14px Arial,sans-serif;color:#222;margin:32px}header{display:flex;justify-content:space-between;border-bottom:2px solid #2f5d46;padding-bottom:16px}h1{color:#1e3f2f;margin:0}small{color:#666}.meta{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:24px 0}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{border:1px solid #ddd;padding:10px;text-align:left}th{background:#edf2ed}.totals{margin-left:auto;width:280px}.totals div{display:flex;justify-content:space-between;padding:6px}.grand{font-size:18px;font-weight:bold;border-top:2px solid #2f5d46}.foot{margin-top:50px;border-top:1px solid #ddd;padding-top:14px;color:#666}@media print{button{display:none}body{margin:15mm}}</style></head><body><header><div><h1>Rudra Furniture Mart</h1><p>Shahpur Badlapur, Jaunpur, Uttar Pradesh</p><p>Phone: +91 94517 13626</p></div><div><h2>INVOICE / ORDER BILL</h2><strong>'+escapeHtml(order.order_number)+'</strong><p>'+new Date(order.created_at).toLocaleDateString('en-IN')+'</p></div></header><div class="meta"><div><strong>Bill to</strong><p>'+escapeHtml(order.customer_name)+'<br>'+escapeHtml(order.phone)+'<br>'+escapeHtml(order.email||'')+'</p><p>'+escapeHtml(order.address_line)+'<br>'+escapeHtml(order.city)+', '+escapeHtml(order.state)+' - '+escapeHtml(order.pincode)+'</p></div><div><strong>Payment details</strong><p>Method: '+escapeHtml(String(order.payment_method||'').toUpperCase())+'<br>Status: '+escapeHtml(order.payment_status)+'<br>Order status: '+escapeHtml(order.status)+'</p></div></div><table><thead><tr><th>#</th><th>Product</th><th>Qty</th><th>Unit price</th><th>Amount</th></tr></thead><tbody>'+rows+'</tbody></table><div class="totals"><div><span>Subtotal</span><strong>'+money(order.subtotal,'fixed')+'</strong></div><div><span>Delivery</span><strong>'+money(order.delivery_charge,'fixed')+'</strong></div><div><span>Discount</span><strong>- '+money(order.discount,'fixed')+'</strong></div><div class="grand"><span>Total</span><strong>'+money(order.total,'fixed')+'</strong></div></div><p class="foot">Thank you for choosing Rudra Furniture Mart. Please retain this bill for your records. This is a computer-generated order bill.</p><script>window.onload=()=>window.print()</script></body></html>';
 const win=window.open('','_blank','width=900,height=700');if(!win){alert('Please allow pop-ups to generate the bill.');return;}win.document.open();win.document.write(doc);win.document.close();
}


async function loadCustomerPayments(){
 const root=$('#customer-payment-list');if(!root)return;root.textContent='Loading payment submissions…';
 const {data,error}=await supabase.from('customer_payment_submissions').select('*,orders(order_number,customer_name,phone,total)').order('submitted_at',{ascending:false});
 if(error){root.textContent='Could not load payment submissions: '+error.message;return;}
 root.replaceChildren();const pending=(data||[]).filter(p=>p.status==='pending');
 if(!pending.length){root.textContent='No UPI payment submissions awaiting verification.';return;}
 pending.forEach(p=>{const row=document.createElement('article');row.className='inquiry-row';const info=document.createElement('div');const title=document.createElement('h3');title.textContent=(p.orders?.order_number||'Order')+' · '+Number(p.amount).toLocaleString('en-IN',{style:'currency',currency:'INR'});const details=document.createElement('p');details.textContent=(p.orders?.customer_name||'Customer')+' · '+p.phone+' · UTR: '+p.transaction_reference;info.append(title,details);const controls=document.createElement('div');controls.className='inquiry-controls';['verified','rejected'].forEach(status=>{const btn=document.createElement('button');btn.className='secondary-btn';btn.textContent=status==='verified'?'Verify payment':'Reject';btn.addEventListener('click',async()=>{if(!confirm('Mark this payment as '+status+'?'))return;const {error}=await supabase.from('customer_payment_submissions').update({status}).eq('id',p.id);if(error){alert(error.message);return;}if(status==='verified'){const {error:oe}=await supabase.from('orders').update({payment_status:'paid'}).eq('id',p.order_id);if(oe){alert('Payment record updated, but order status failed: '+oe.message);return;}}loadCustomerPayments();loadOrders?.();});controls.append(btn);});row.append(info,controls);root.append(row);});
}
$('#refresh-customer-payments')?.addEventListener('click',loadCustomerPayments);

async function loadOrders(){
 const root=$('#order-list');root.textContent='Loading orders…';
 try{
 const {data,error}=await supabase.from('orders').select('id,order_number,customer_name,phone,address_line,city,state,pincode,subtotal,delivery_charge,total,payment_method,payment_status,status,created_at,order_items(product_name,quantity,unit_price,line_total)').order('created_at',{ascending:false}).limit(100);
 if(error){root.textContent='Could not load orders: '+error.message;return;}
 root.replaceChildren();
 if(!data?.length){const p=document.createElement('p');p.className='subtle';p.textContent='No orders received yet.';root.append(p);return;}
 const statuses=['received','confirmed','design_approved','manufacturing','finishing','ready_for_delivery','out_for_delivery','delivered','cancelled'];
 data.forEach(order=>{
  const row=document.createElement('article');row.className='inquiry-row order-row';
  const info=document.createElement('div');const title=document.createElement('h3');title.textContent=order.order_number+' · '+order.customer_name;
  const items=document.createElement('p');items.textContent=(order.order_items||[]).map(i=>i.product_name+' × '+i.quantity).join(' · ');
  const address=document.createElement('p');address.textContent=order.address_line+', '+order.city+', '+order.state+' - '+order.pincode;
  const total=document.createElement('p');total.textContent='Total: '+money(order.total,'fixed')+' · '+String(order.payment_method||'').toUpperCase()+' · Payment: '+order.payment_status;
  const date=document.createElement('small');date.textContent=new Date(order.created_at).toLocaleString('en-IN');
  info.append(title,items,address,total,date);
  const controls=document.createElement('div');controls.className='inquiry-controls';
  const status=document.createElement('select');statuses.forEach(v=>status.add(new Option(v.replaceAll('_',' '),v)));status.value=order.status;
  status.addEventListener('change',async()=>{const {error}=await supabase.from('orders').update({status:status.value}).eq('id',order.id);if(error){alert('Could not update order: '+error.message);status.value=order.status;}else order.status=status.value;});
  const call=document.createElement('a');call.href='tel:'+order.phone;call.textContent='Call';call.className='secondary-btn';
  const payment=document.createElement('select');[['pending','Payment pending'],['paid','Payment received'],['failed','Payment failed'],['refunded','Refunded']].forEach(([v,label])=>payment.add(new Option(label,v)));payment.value=order.payment_status||'pending';payment.addEventListener('change',async()=>{const {error}=await supabase.from('orders').update({payment_status:payment.value}).eq('id',order.id);if(error){alert('Could not update payment status: '+error.message);payment.value=order.payment_status||'pending';}else order.payment_status=payment.value;});
  const wa=document.createElement('a');wa.href='https://wa.me/91'+order.phone+'?text='+encodeURIComponent('Hello '+order.customer_name+', regarding your Rudra Furniture Mart order '+order.order_number+'.');wa.target='_blank';wa.rel='noopener';wa.textContent='WhatsApp';wa.className='secondary-btn';
  const bill=document.createElement('button');bill.type='button';bill.className='secondary-btn';bill.textContent='Generate bill';bill.addEventListener('click',()=>printInvoice(order));
  controls.append(status,payment,call,wa,bill);row.append(info,controls);root.append(row);
 });
 }catch(error){root.textContent='Order loading failed: '+(error?.message||String(error));}
}
$('#refresh-orders')?.addEventListener('click',loadOrders);

function renderProducts(){
 const query=$('#filter-products').value.trim().toLowerCase();
 const list=products.filter(p=>(p.name+' '+(p.categories?.name||'')).toLowerCase().includes(query));
 $('#list-count').textContent=list.length+' items';
 const root=$('#product-list');root.replaceChildren();
 if(!list.length){const p=document.createElement('p');p.className='subtle';p.textContent='No products found. Add your first product using the form.';root.append(p);return;}
 list.forEach(p=>{
  const row=document.createElement('article');row.className='product-row';
  const img=p.product_images?.[0]?.url;
  if(img){const image=document.createElement('img');image.src=img;image.alt=p.name;row.append(image);}
  else{const placeholder=document.createElement('div');placeholder.className='product-placeholder';row.append(placeholder);}
  const info=document.createElement('div');const title=document.createElement('h3');title.textContent=p.name;
  const detail=document.createElement('p');detail.textContent=(p.categories?.name||'Uncategorised')+' · '+(p.space_type||'indoor')+' · '+money(p.price,p.price_type)+' · '+(p.is_active?'Visible':'Hidden')+' · '+(p.product_images?.length||0)+' photo(s)';
  info.append(title,detail);row.append(info);
  const actions=document.createElement('div');actions.className='product-actions';
  const edit=document.createElement('button');edit.type='button';edit.textContent='Edit';edit.addEventListener('click',()=>editProduct(p));
  const del=document.createElement('button');del.type='button';del.textContent='Delete';del.addEventListener('click',()=>deleteProduct(p));
  actions.append(edit,del);row.append(actions);root.append(row);
 });
}
function resetForm(){
 $('#product-form').reset();$('#product-form [name="id"]').value='';$('#editor-title').textContent='Add a product';$('#save-product').textContent='Save product';message('#form-message','');
}
function editProduct(p){
 const form=$('#product-form');
 for(const key of ['id','name','category_id','short_description','description','material','dimensions','colors','size_options','customization','delivery_estimate','price_type','price','price_tier','space_type'])form.elements[key].value=p[key]??'';
 for(const key of ['is_featured','is_bestseller','is_active'])form.elements[key].checked=!!p[key];
 form.elements.photo.value='';if(form.elements.size_options)form.elements.size_options.value=(p.size_options||[]).join('\n');$('#editor-title').textContent='Edit product';$('#save-product').textContent='Update product';message('#form-message','Editing '+p.name,true);
 form.scrollIntoView({behavior:'smooth',block:'start'});
}
$('#product-form').addEventListener('submit',async event=>{
 event.preventDefault();const button=$('#save-product');button.disabled=true;button.textContent='Saving…';message('#form-message','');
 try{
  const form=new FormData(event.currentTarget),id=form.get('id'),name=String(form.get('name')).trim(),priceType=form.get('price_type'),rawPrice=form.get('price');
  const payload={name,slug:slugify(name),category_id:form.get('category_id'),space_type:form.get('space_type')||'indoor',short_description:form.get('short_description')||null,description:form.get('description')||null,material:form.get('material')||null,dimensions:form.get('dimensions')||null,colors:String(form.get('colors')||'').split(',').map(x=>x.trim()).filter(Boolean),size_options:String(form.get('size_options')||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean),customization:form.get('customization')||null,delivery_estimate:form.get('delivery_estimate')||null,price_type:priceType,price:rawPrice===''?null:Number(rawPrice),price_tier:form.get('price_tier')||'general',is_featured:form.has('is_featured'),is_bestseller:form.has('is_bestseller'),is_active:form.has('is_active')};
  if(priceType==='quote')payload.price=null;
  if(id){const {error}=await supabase.from('products').update(payload).eq('id',id);if(error)throw error;}
  else{const {data,error}=await supabase.from('products').insert(payload).select('id').single();if(error)throw error;payload.id=data.id;}
  const productId=id||payload.id,photos=Array.from(form.getAll('photo')).filter(file=>file&&file.size);
  if(photos.length>10)throw new Error('Please upload no more than 10 photos at a time.');
  for(let index=0;index<photos.length;index++){
   const photo=photos[index];
   if(photo.size>5*1024*1024)throw new Error(photo.name+' is larger than 5 MB.');
   if(!['image/jpeg','image/png','image/webp'].includes(photo.type))throw new Error('Use JPG, PNG or WebP photos only.');
   const safeName=slugify(photo.name.replace(/\.[^.]+$/,''))||'product-photo';
   const ext=photo.type.split('/')[1].replace('jpeg','jpg');
   const path=productId+'/'+Date.now()+'-'+index+'-'+safeName+'.'+ext;
   const {error:uploadError}=await supabase.storage.from('product-images').upload(path,photo,{contentType:photo.type,upsert:false});
   if(uploadError)throw uploadError;
   const {data:publicUrl}=supabase.storage.from('product-images').getPublicUrl(path);
   const {error:imageError}=await supabase.from('product_images').insert({product_id:productId,url:publicUrl.publicUrl,alt:name,sort_order:index});
   if(imageError)throw imageError;
  }
  message('#form-message',id?'Product updated successfully.':'Product added successfully.',true);resetForm();await loadDashboard();
 }catch(error){message('#form-message',error.message||'Could not save product.');}
 finally{button.disabled=false;button.textContent=$('#product-form [name="id"]').value?'Update product':'Save product';}
});
async function deleteProduct(p){
 if(!confirm('Delete “'+p.name+'”? This will remove the product from your catalogue.'))return;
 const {error:imageError}=await supabase.from('product_images').delete().eq('product_id',p.id);
 if(imageError){alert('Could not remove product images: '+imageError.message);return;}
 const {error}=await supabase.from('products').delete().eq('id',p.id);
 if(error){alert('Could not delete product: '+error.message);return;}
 if($('#product-form [name="id"]').value===p.id)resetForm();
 await loadDashboard();
}
supabase.auth.onAuthStateChange((_event,session)=>{if(!session)showLogin();});
checkAdmin();


async function loadBillRequests(){
 const root=$('#bill-request-list');if(!root)return;root.textContent='Loading bill requests…';
 const {data,error}=await supabase.from('bill_requests').select('*,orders(order_number,subtotal,delivery_charge,discount,total,payment_method,payment_status,status,created_at,order_items(product_name,quantity,unit_price,line_total))').order('requested_at',{ascending:false}).limit(100);
 if(error){root.textContent='Could not load bill requests: '+error.message;return;}
 root.replaceChildren();
 if(!data?.length){root.textContent='No bill requests yet.';return;}
 data.forEach(req=>{
  const order=req.orders||{}, paid=order.payment_status==='paid';
  const row=document.createElement('article');row.className='inquiry-row';
  const info=document.createElement('div');const title=document.createElement('h3');title.textContent=(order.order_number||'Order')+' · '+req.customer_name;
  const detail=document.createElement('p');detail.textContent=req.phone+' · '+(req.email||'No email')+' · Payment '+(order.payment_status||'unknown');
  const itemText=document.createElement('p');itemText.textContent=(order.order_items||[]).map(x=>x.product_name+' × '+x.quantity).join(' | ');
  const status=document.createElement('small');status.textContent='Bill request: '+req.request_status+' · '+new Date(req.requested_at).toLocaleString('en-IN');
  info.append(title,detail,itemText,status);row.append(info);
  const controls=document.createElement('div');controls.className='inquiry-controls';
  const edit=document.createElement('button');edit.className='secondary-btn';edit.textContent='Edit bill & tax';
  edit.addEventListener('click',async()=>{
   const lines=(req.bill_data?.items?.length?req.bill_data.items:(order.order_items||[]).map(x=>({name:x.product_name,quantity:x.quantity,unit_price:Number(x.unit_price),cgst_rate:0,sgst_rate:0})));
   const bill={items:lines,delivery_charge:Number(req.bill_data?.delivery_charge??order.delivery_charge??0),discount:Number(req.bill_data?.discount??order.discount??0),notes:req.bill_data?.notes||''};
   for(const line of bill.items){
    const name=prompt('Product / description',String(line.name));if(name===null)return;line.name=name.trim()||line.name;
    const qty=prompt('Quantity for '+line.name,String(line.quantity));if(qty===null)return;line.quantity=Math.max(1,Math.min(100,parseInt(qty,10)||1));
    const price=prompt('Unit price for '+line.name+' (₹)',String(line.unit_price));if(price===null)return;line.unit_price=Math.max(0,Number(price)||0);
    const cg=prompt('CGST rate % for '+line.name+' (0 if not applicable)',String(line.cgst_rate||0));if(cg===null)return;line.cgst_rate=Math.max(0,Number(cg)||0);
    const sg=prompt('SGST rate % for '+line.name+' (0 if not applicable)',String(line.sgst_rate||0));if(sg===null)return;line.sgst_rate=Math.max(0,Number(sg)||0);
   }
   const delivery=prompt('Delivery charge (₹)',String(bill.delivery_charge));if(delivery===null)return;bill.delivery_charge=Math.max(0,Number(delivery)||0);
   const discount=prompt('Discount (₹)',String(bill.discount));if(discount===null)return;bill.discount=Math.max(0,Number(discount)||0);
   const {error}=await supabase.from('bill_requests').update({bill_data:bill,updated_at:new Date().toISOString()}).eq('id',req.id);
   if(error){alert('Could not save bill: '+error.message);return;}req.bill_data=bill;alert('Bill details saved.');loadBillRequests();
  });
  const payment=document.createElement('select');[['pending','Payment pending'],['paid','Payment received'],['failed','Payment failed'],['refunded','Refunded']].forEach(([v,l])=>payment.add(new Option(l,v)));payment.value=order.payment_status||'pending';
  payment.addEventListener('change',async()=>{const {error}=await supabase.from('orders').update({payment_status:payment.value}).eq('id',req.order_id);if(error){alert(error.message);payment.value=order.payment_status||'pending';}else{order.payment_status=payment.value;loadBillRequests();}});
  const approve=document.createElement('button');approve.className='primary-btn';approve.textContent=req.request_status==='approved'?'Reprint approved bill':'Approve & release bill';approve.disabled=!paid;
  approve.title=paid?'Approve downloadable bill':'Mark payment received only after checking bank/UPI statement';
  approve.addEventListener('click',async()=>{
   if(order.payment_status!=='paid'){alert('Bill release is blocked until payment is verified.');return;}
   const items=req.bill_data?.items?.length?req.bill_data.items:(order.order_items||[]).map(x=>({name:x.product_name,quantity:x.quantity,unit_price:Number(x.unit_price),cgst_rate:0,sgst_rate:0}));
   const bill={items,delivery_charge:Number(req.bill_data?.delivery_charge??order.delivery_charge??0),discount:Number(req.bill_data?.discount??order.discount??0)};
   const invoice=req.invoice_number||('RFM-BILL-'+String(order.order_number||req.id).replace(/[^A-Za-z0-9-]/g,''));
   const {error}=await supabase.from('bill_requests').update({request_status:'approved',bill_data:bill,invoice_number:invoice,approved_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq('id',req.id);
   if(error){alert('Could not approve bill: '+error.message);return;}
   printCustomerBill(req,order,bill,invoice);loadBillRequests();
  });
  controls.append(payment,edit,approve);row.append(controls);root.append(row);
 });
}
$('#refresh-bills')?.addEventListener('click',loadBillRequests);
function printCustomerBill(req,order,bill,invoice){
 const settings={};const subtotal=bill.items.reduce((sum,x)=>sum+x.unit_price*x.quantity,0);
 let cgst=0,sgst=0;const rows=bill.items.map((x,i)=>{const base=x.unit_price*x.quantity,c=base*(Number(x.cgst_rate)||0)/100,s=base*(Number(x.sgst_rate)||0)/100;cgst+=c;sgst+=s;return '<tr><td>'+(i+1)+'</td><td>'+escapeHtml(x.name)+'</td><td>'+x.quantity+'</td><td>'+money(x.unit_price,'fixed')+'</td><td>'+Number(x.cgst_rate||0).toFixed(2)+'%</td><td>'+money(c,'fixed')+'</td><td>'+Number(x.sgst_rate||0).toFixed(2)+'%</td><td>'+money(s,'fixed')+'</td><td>'+money(base+c+s,'fixed')+'</td></tr>';}).join('');
 const total=Math.max(0,subtotal+cgst+sgst+Number(bill.delivery_charge||0)-Number(bill.discount||0));
 const doc='<!doctype html><html><head><meta charset="utf-8"><title>'+escapeHtml(invoice)+'</title><style>@page{size:A4;margin:14mm}body{font:13px Inter,Arial;color:#30251d;margin:0;background:#fff}header{padding:22px 24px;background:#2b211b;color:#fff;display:flex;justify-content:space-between;border-bottom:5px solid #c49a4a}h1{font:700 27px Georgia;margin:0;color:#f0d79e}header p{margin:5px 0;color:#f1e5d3}.tag{letter-spacing:3px;color:#e6c47d;font-size:10px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:18px;padding:22px 0}.meta section{background:#f8f3ea;padding:14px;border:1px solid #eadcc6;border-radius:8px}table{width:100%;border-collapse:collapse;font-size:10px}th{background:#4b3525;color:#fff;padding:9px 6px}td{border:1px solid #e5dbce;padding:8px 5px}.totals{width:300px;margin:18px 0 0 auto}.totals div{display:flex;justify-content:space-between;padding:5px 8px;border-bottom:1px solid #eee}.grand{background:#f2e5cd;font-size:17px;font-weight:bold}.foot{margin-top:35px;padding-top:14px;border-top:2px solid #c49a4a;color:#76695d;font-size:11px}.stamp{color:#6c4b25;font-weight:bold;letter-spacing:1px}@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}</style></head><body><header><div><div class="tag">CRAFTED FOR YOUR HOME · SINCE 1999</div><h1>RUDRA</h1><strong>F U R N I T U R E&nbsp; M A R T</strong><p>Vishwakarmanagar, Bataubeer, Shahpur Badlapur,<br>Jaunpur, Uttar Pradesh – 222125, India</p><p>+91 94517 13626 · rudrafurnituremartsupport@gmail.com</p></div><div><h2>TAX INVOICE / BILL</h2><h3>'+escapeHtml(invoice)+'</h3><p>'+new Date().toLocaleDateString('en-IN')+'</p><div class="stamp">PAYMENT VERIFIED</div></div></header><div class="meta"><section><b>BILL TO</b><p>'+escapeHtml(req.customer_name)+'<br>'+escapeHtml(req.phone)+'<br>'+escapeHtml(req.email||'')+'</p><p>'+escapeHtml(order.address_line||'')+'<br>'+escapeHtml(order.city||'')+', '+escapeHtml(order.state||'')+' - '+escapeHtml(order.pincode||'')+'</p></section><section><b>ORDER DETAILS</b><p>Order: '+escapeHtml(order.order_number)+'<br>Payment: '+escapeHtml(order.payment_method||'UPI')+' · '+escapeHtml(order.payment_status)+'<br>Bill date: '+new Date().toLocaleDateString('en-IN')+'</p></section></div><table><thead><tr><th>#</th><th>Product</th><th>Qty</th><th>Rate</th><th>CGST</th><th>CGST amt</th><th>SGST</th><th>SGST amt</th><th>Line total</th></tr></thead><tbody>'+rows+'</tbody></table><div class="totals"><div><span>Taxable value</span><b>'+money(subtotal,'fixed')+'</b></div><div><span>CGST</span><b>'+money(cgst,'fixed')+'</b></div><div><span>SGST</span><b>'+money(sgst,'fixed')+'</b></div><div><span>Delivery</span><b>'+money(bill.delivery_charge,'fixed')+'</b></div><div><span>Discount</span><b>- '+money(bill.discount,'fixed')+'</b></div><div class="grand"><span>Grand total</span><b>'+money(total,'fixed')+'</b></div></div><p class="foot">Thank you for choosing Rudra Furniture Mart. This bill was approved by the showroom after payment verification. GST details should be issued only where applicable and supported by the seller’s registration and product classification.</p><script>window.onload=()=>window.print()</script></body></html>';
 const win=window.open('','_blank','width=1000,height=800');if(!win){alert('Please allow pop-ups to print/download the bill.');return;}win.document.open();win.document.write(doc);win.document.close();
}

async function loadReviews(){
 const root=$('#review-list');if(!root)return;root.textContent='Loading customer feedback…';
 const {data,error}=await supabase.from('customer_reviews').select('*').order('created_at',{ascending:false}).limit(200);
 if(error){root.textContent='Could not load reviews: '+error.message;return;}
 root.replaceChildren();if(!data?.length){root.textContent='No feedback submitted yet.';return;}
 data.forEach(review=>{
  const row=document.createElement('article');row.className='inquiry-row';
  const info=document.createElement('div');const title=document.createElement('h3');title.textContent=review.customer_name+' · '+'★'.repeat(review.overall_rating)+'☆'.repeat(5-review.overall_rating);
  const ratings=document.createElement('p');ratings.textContent='Quality '+review.product_quality+'/5 · Design '+review.design_variety+'/5 · Value '+review.value_for_money+'/5 · Communication '+review.communication+'/5 · Delivery '+review.delivery_experience+'/5';
  const comment=document.createElement('p');comment.textContent=review.comment;
  const date=document.createElement('small');date.textContent=new Date(review.created_at).toLocaleString('en-IN')+' · '+(review.email||'No email')+' · '+(review.consent_to_publish?'Publication consent given':'No publication consent');
  info.append(title,ratings,comment,date);
  const controls=document.createElement('div');controls.className='inquiry-controls';
  const approval=document.createElement('select');[['false','Pending / hidden'],['true','Approved / public']].forEach(([v,l])=>approval.add(new Option(l,v)));approval.value=String(review.is_approved);approval.disabled=!review.consent_to_publish;
  approval.addEventListener('change',async()=>{const {error}=await supabase.from('customer_reviews').update({is_approved:approval.value==='true'}).eq('id',review.id);if(error){alert('Could not update review: '+error.message);approval.value=String(review.is_approved);}else{review.is_approved=approval.value==='true';}});
  const edit=document.createElement('button');edit.type='button';edit.className='secondary-btn';edit.textContent='Edit';
  edit.addEventListener('click',async()=>{
   const fields=[['customer_name','Customer name'],['overall_rating','Overall rating (1–5)'],['product_quality','Product quality (1–5)'],['design_variety','Design & variety (1–5)'],['value_for_money','Value for money (1–5)'],['communication','Communication (1–5)'],['delivery_experience','Delivery (1–5)'],['comment','Customer comment']];
   const changes={};
   for(const [key,label] of fields){const value=prompt(label, String(review[key]??''));if(value===null)return;if(key==='customer_name'||key==='comment')changes[key]=value.trim();else changes[key]=Math.max(1,Math.min(5,parseInt(value,10)||1));}
   if(!changes.customer_name||changes.comment.length<10){alert('Name and a comment of at least 10 characters are required.');return;}
   const {error}=await supabase.from('customer_reviews').update(changes).eq('id',review.id);if(error){alert('Could not update rating: '+error.message);return;}loadReviews();
  });
  const feature=document.createElement('button');feature.type='button';feature.className='secondary-btn';feature.textContent=review.is_featured?'Unfeature':'Feature';feature.disabled=!review.is_approved||!review.consent_to_publish;
  feature.addEventListener('click',async()=>{const {error}=await supabase.from('customer_reviews').update({is_featured:!review.is_featured}).eq('id',review.id);if(error){alert(error.message);return;}review.is_featured=!review.is_featured;feature.textContent=review.is_featured?'Unfeature':'Feature';});
  const del=document.createElement('button');del.type='button';del.className='secondary-btn';del.textContent='Delete';del.addEventListener('click',async()=>{if(!confirm('Permanently delete this customer review?'))return;const {error}=await supabase.from('customer_reviews').delete().eq('id',review.id);if(error){alert('Could not delete review: '+error.message);return;}loadReviews();});
  controls.append(approval,edit,feature,del);row.append(info,controls);root.append(row);
 });
}
$('#add-review')?.addEventListener('click',async()=>{
 const name=prompt('Customer name');if(!name)return;
 const email=prompt('Customer email (optional)','')||null;
 const rating=key=>{const v=prompt(key+' rating (1–5)','5');return v===null?null:Math.max(1,Math.min(5,parseInt(v,10)||1));};
 const values={overall_rating:rating('Overall experience'),product_quality:rating('Product quality'),design_variety:rating('Design & variety'),value_for_money:rating('Value for money'),communication:rating('Staff communication'),delivery_experience:rating('Delivery experience')};
 if(Object.values(values).some(v=>v===null))return;
 const comment=prompt('Customer comment (minimum 10 characters)');if(!comment||comment.trim().length<10){alert('Please enter a comment of at least 10 characters.');return;}
 const consent=confirm('Has this customer explicitly agreed that their name, ratings and comment may be published on the website?');
 const {error}=await supabase.from('customer_reviews').insert({customer_name:name.trim(),email,comment:comment.trim(),consent_to_publish:consent,is_approved:consent,...values});
 if(error){alert('Could not add customer rating: '+error.message);return;}alert(consent?'Customer rating added and published.':'Rating saved privately and hidden until publication consent is obtained.');loadReviews();
});
$('#share-review-form')?.addEventListener('click',async()=>{
 const url='https://rudrafurnituremart.com/feedback.html';
 const message='Thank you for shopping with Rudra Furniture Mart! We would love to hear about your experience. Please share your ratings and feedback here: '+url;
 try{await navigator.clipboard.writeText(message);alert('Feedback invitation copied. You can now share it with your customers on WhatsApp.');}
 catch{prompt('Copy this feedback form link and share it with your customer:',message);}
});
$('#refresh-reviews')?.addEventListener('click',loadReviews);

async function loadWorkerMonths(){
 const root=$('#worker-month-list');if(!root)return;root.textContent='Loading monthly surveys…';
 const {data,error}=await supabase.from('worker_feedback_months').select('*').order('created_at',{ascending:false});
 if(error){root.textContent='Could not load worker surveys: '+error.message;return;}
 root.replaceChildren();if(!data?.length){root.textContent='No monthly surveys created yet.';return;}
 data.forEach(month=>{
  const row=document.createElement('article');row.className='inquiry-row';const info=document.createElement('div');
  const title=document.createElement('h3');title.textContent=month.month_label+' · '+(month.is_open?'Open':'Closed');
  const link=document.createElement('p');const url=location.origin+'/worker-feedback.html?month='+encodeURIComponent(month.id)+'&token='+encodeURIComponent(month.public_token);link.textContent=url;
  info.append(title,link);
  const controls=document.createElement('div');controls.className='inquiry-controls';
  const share=document.createElement('button');share.className='secondary-btn';share.textContent='Copy link';share.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(url);alert('Monthly worker feedback link copied.');}catch{prompt('Copy worker feedback link:',url);}});
  const view=document.createElement('button');view.className='secondary-btn';view.textContent='View responses';view.addEventListener('click',()=>loadWorkerResponses(month));
  const toggle=document.createElement('button');toggle.className='secondary-btn';toggle.textContent=month.is_open?'Close form':'Reopen form';toggle.addEventListener('click',async()=>{const {error}=await supabase.from('worker_feedback_months').update({is_open:!month.is_open}).eq('id',month.id);if(error){alert(error.message);return;}loadWorkerMonths();});
  const del=document.createElement('button');del.className='secondary-btn';del.textContent='Delete month';del.addEventListener('click',async()=>{if(!confirm('Delete this monthly form and all its responses permanently?'))return;const {error}=await supabase.from('worker_feedback_months').delete().eq('id',month.id);if(error){alert(error.message);return;}$('#worker-response-list').replaceChildren();loadWorkerMonths();});
  controls.append(share,view,toggle,del);row.append(info,controls);root.append(row);
 });
}
async function loadWorkerResponses(month){
 const root=$('#worker-response-list');root.textContent='Loading responses for '+month.month_label+'…';
 const {data,error}=await supabase.from('worker_feedback_responses').select('*').eq('month_id',month.id).order('submitted_at',{ascending:false});
 if(error){root.textContent='Could not load responses: '+error.message;return;}
 root.replaceChildren();const heading=document.createElement('h3');heading.textContent=month.month_label+' · '+data.length+' responses';root.append(heading);
 if(!data.length){root.append(document.createTextNode('No responses submitted yet.'));return;}
 data.forEach((response,index)=>{
  const card=document.createElement('article');card.className='inquiry-row';const info=document.createElement('div');
  const title=document.createElement('h3');title.textContent=(index+1)+'. '+response.worker_name+' · '+(response.role||'Role not specified');
  const date=document.createElement('small');date.textContent=new Date(response.submitted_at).toLocaleString('en-IN');
  const answers=document.createElement('div');Object.values(response.answers||{}).forEach(a=>{const p=document.createElement('p');p.textContent=(a.question||'Rating')+': '+a.score+'/5';answers.append(p);});
  info.append(title,date,answers);Object.entries(response.comments||{}).forEach(([key,value])=>{if(value){const p=document.createElement('p');p.textContent=({positive:'What is working well',improvements:'Suggested improvements',safety:'Safety / equipment / other'}[key]||key)+': '+value;info.append(p);}});
  card.append(info);root.append(card);
 });
}
$('#worker-month-form')?.addEventListener('submit',async e=>{
 e.preventDefault();const form=e.currentTarget,button=form.querySelector('button'),label=String(new FormData(form).get('month_label')).trim();if(!label)return;button.disabled=true;
 const {error}=await supabase.from('worker_feedback_months').insert({month_label:label,is_open:true});
 button.disabled=false;if(error){$('#worker-month-message').textContent='Could not create survey: '+error.message;return;}form.reset();$('#worker-month-message').textContent='Monthly survey created. Copy and share its link below.';loadWorkerMonths();
});
