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
 const [catResult,prodResult]=await Promise.all([
  supabase.from('categories').select('id,name').eq('is_active',true).order('sort_order'),
  supabase.from('products').select('id,category_id,name,slug,short_description,description,material,dimensions,colors,price_type,price,is_featured,is_bestseller,is_active,product_images(id,url,alt,sort_order),categories(name)').order('created_at',{ascending:false})
 ]);
 if(catResult.error){message('#form-message','Could not load categories: '+catResult.error.message);return;}
 if(prodResult.error){$('#product-list').textContent='Could not load products: '+prodResult.error.message;return;}
 categories=catResult.data||[];products=prodResult.data||[];
 $('#category-total').textContent=categories.length;$('#product-total').textContent=products.length;$('#active-total').textContent=products.filter(p=>p.is_active).length;
 const select=$('#category-select'),selected=select.value;
 select.replaceChildren(new Option('Choose a category',''),...categories.map(c=>new Option(c.name,c.id)));
 if(selected)select.value=selected;
 renderProducts();
}
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
  const detail=document.createElement('p');detail.textContent=(p.categories?.name||'Uncategorised')+' · '+money(p.price,p.price_type)+' · '+(p.is_active?'Visible':'Hidden');
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
 for(const key of ['id','name','category_id','short_description','description','material','dimensions','colors','customization','delivery_estimate','price_type','price'])form.elements[key].value=p[key]??'';
 for(const key of ['is_featured','is_bestseller','is_active'])form.elements[key].checked=!!p[key];
 form.elements.photo.value='';$('#editor-title').textContent='Edit product';$('#save-product').textContent='Update product';message('#form-message','Editing '+p.name,true);
 form.scrollIntoView({behavior:'smooth',block:'start'});
}
$('#product-form').addEventListener('submit',async event=>{
 event.preventDefault();const button=$('#save-product');button.disabled=true;button.textContent='Saving…';message('#form-message','');
 try{
  const form=new FormData(event.currentTarget),id=form.get('id'),name=String(form.get('name')).trim(),priceType=form.get('price_type'),rawPrice=form.get('price');
  const payload={name,slug:slugify(name),category_id:form.get('category_id'),short_description:form.get('short_description')||null,description:form.get('description')||null,material:form.get('material')||null,dimensions:form.get('dimensions')||null,colors:String(form.get('colors')||'').split(',').map(x=>x.trim()).filter(Boolean),customization:form.get('customization')||null,delivery_estimate:form.get('delivery_estimate')||null,price_type:priceType,price:rawPrice===''?null:Number(rawPrice),is_featured:form.has('is_featured'),is_bestseller:form.has('is_bestseller'),is_active:form.has('is_active')};
  if(priceType==='quote')payload.price=null;
  if(id){const {error}=await supabase.from('products').update(payload).eq('id',id);if(error)throw error;}
  else{const {data,error}=await supabase.from('products').insert(payload).select('id').single();if(error)throw error;payload.id=data.id;}
  const productId=id||payload.id,photo=form.get('photo');
  if(photo&&photo.size){
   if(photo.size>5*1024*1024)throw new Error('Photo must be 5 MB or smaller.');
   if(!['image/jpeg','image/png','image/webp'].includes(photo.type))throw new Error('Use a JPG, PNG or WebP photo.');
   const safeName=slugify(photo.name.replace(/\.[^.]+$/,''))||'product-photo';
   const path=productId+'/'+Date.now()+'-'+safeName+'.'+photo.type.split('/')[1].replace('jpeg','jpg');
   const {error:uploadError}=await supabase.storage.from('product-images').upload(path,photo,{contentType:photo.type,upsert:false});
   if(uploadError)throw uploadError;
   const {data:publicUrl}=supabase.storage.from('product-images').getPublicUrl(path);
   const {error:imageError}=await supabase.from('product_images').insert({product_id:productId,url:publicUrl.publicUrl,alt:name,sort_order:0});
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
