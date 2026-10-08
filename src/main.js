import './style.css'

const app = document.querySelector('#app')
const money = n => new Intl.NumberFormat('es-PE',{style:'currency',currency:'PEN'}).format(n)
const escapeHtml = v => String(v??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const picture = (p, extra='') => `<img src="${escapeHtml(p.imagen)}" alt="${escapeHtml(p.nombre)}" loading="lazy" ${extra}/>`
let cart = JSON.parse(localStorage.getItem('techstore-cart')||'[]')
let categories = []
let products = []
let promotions = []
let currentSearch = ''
let currentCategory = ''
let sortOrder = ''
let busy = false

async function api(route, options={}) {
 const response = await fetch(`/api${route}`,options)
 let data
 try { data = await response.json() } catch { throw new Error('El servidor devolvió una respuesta inesperada.') }
 if(!response.ok) throw new Error(data.mensaje || `Error HTTP ${response.status}`)
 return data
}
const saveCart = () => { localStorage.setItem('techstore-cart', JSON.stringify(cart)); updateBadge() }
const cartCount = () => cart.reduce((s,item)=>s+item.cantidad,0)
const updateBadge = () => { const n=document.querySelector('#cart-count'); if(n) n.textContent=cartCount() }
const alertUI = (msg, type='ok') => {
 const el=document.querySelector('#toast'); if(!el)return
 el.textContent=msg; el.className=`toast show ${type}`
 clearTimeout(alertUI.timer); alertUI.timer=setTimeout(()=>el.className='toast',3500)
}
const addCart = id => {
 const p=products.find(v=>v.id===Number(id))
 if(!p) return alertUI('Producto no disponible','error')
 const entry=cart.find(v=>v.id===p.id)
 if(entry){ if(entry.cantidad>=p.stock)return alertUI('Stock máximo alcanzado','error');entry.cantidad++ }
 else cart.push({id:p.id,cantidad:1})
 saveCart(); alertUI(`${p.nombre} agregado al carrito`)
}
const paths = ['/', '/productos', '/ofertas', '/nosotros', '/contacto', '/carrito', '/checkout', '/pedidos']
const route=()=>decodeURIComponent(location.pathname)
const nav = (href,title) => `<a class="navlink ${route()===href?'active':''}" href="${href}" data-link>${title}</a>`
function shell() {
 app.innerHTML=`<div class="announcement">🚀 Tecnología a otro nivel <span>•</span> Atención en todo el Perú <span>•</span> Precios en soles</div>
 <header class="site-header"><div class="container topbar"><a class="logo" href="/" data-link><span class="brand-icon">✦</span>Tech<span>Store</span><small>PERÚ</small></a>
 <button class="menu-toggle" id="menu-toggle" aria-label="Abrir menú">☰</button>
 <nav class="nav" id="nav">${nav('/','Inicio')}${nav('/productos','Productos')}${nav('/ofertas','Ofertas')}${nav('/nosotros','Nosotros')}${nav('/contacto','Contacto')}</nav>
 <a href="/carrito" data-link class="cart-shortcut" aria-label="Ver carrito">🛒 <span id="cart-count">0</span></a></div></header>
 <div id="page" class="page"></div>
 <footer class="footer"><div class="container footer-grid"><div><a class="logo footer-logo" href="/" data-link><span class="brand-icon">✦</span>Tech<span>Store</span></a><p>La tecnología que te mueve. Tu tienda digital de productos electrónicos.</p></div><div><h4>Explora</h4><a href="/productos" data-link>Productos</a><a href="/ofertas" data-link>Ofertas</a><a href="/carrito" data-link>Mi carrito</a></div><div><h4>Conócenos</h4><a href="/nosotros" data-link>Nosotros</a><a href="/contacto" data-link>Contacto</a><a href="/pedidos" data-link>Pedidos demo</a></div><div><h4>Información</h4><p>📍 Perú</p><p>✉️ hola@techstore.demo</p><small>Proyecto académico demostrativo; no procesa pagos reales.</small></div></div><div class="copyright">© 2026 TechStore Perú · Proyecto académico de Desarrollo de Aplicaciones Web</div></footer><div id="toast" class="toast" role="status"></div>`
 updateBadge()
 document.querySelector('#menu-toggle').onclick=()=>document.querySelector('#nav').classList.toggle('open')
}
const loading = () => `<div class="loader" role="status"><span class="spinner"></span><p>Cargando información desde nuestra API...</p></div>`
const failure = (err) => `<div class="empty"><span>⚠️</span><h3>No pudimos cargar esta información</h3><p>${escapeHtml(err.message)}</p><button class="btn btn-primary" id="retry">Volver a intentar</button></div>`
const productCard = p => `<article class="product-card"><a href="/producto/${p.id}" data-link class="product-img">${picture(p)}${p.anterior?'<span class="sale-tag">OFERTA</span>':''}</a><div class="product-body"><small>${escapeHtml(p.marca)} · ${escapeHtml(categories.find(c=>c.id===p.categoriaId)?.nombre||'Tecnología')}</small><a href="/producto/${p.id}" data-link class="product-title">${escapeHtml(p.nombre)}</a><div class="stars">★★★★★ <span>Disponible</span></div><div class="price-row"><b>${money(p.precio)}</b>${p.anterior?`<del>${money(p.anterior)}</del>`:''}</div><button class="btn btn-add" data-add="${p.id}">＋ Agregar al carrito</button></div></article>`
const productGrid = items=> items.length?`<div class="product-grid">${items.map(productCard).join('')}</div>`:`<div class="empty"><span>🔎</span><h3>No se encontraron productos</h3><p>Prueba otra búsqueda o categoría.</p></div>`
const heading = (eyebrow,title,detail='') => `<div class="page-heading container"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1>${detail?`<p>${detail}</p>`:''}</div>`
async function loadBase(){ const [a,b,c] = await Promise.all([api('/productos'),api('/categorias'),api('/promociones')]);products=a;categories=b;promotions=c }
async function home(){const page=document.querySelector('#page');page.innerHTML=loading();try {
 await loadBase();page.innerHTML=`<section class="hero"><div class="container hero-layout"><div><div class="hero-kicker">✧ TU MUNDO, MÁS CONECTADO</div><h1>El futuro está <span>en tus manos.</span></h1><p>Explora tecnología para estudiar, crear, jugar y llegar más lejos. Grandes marcas, excelentes precios.</p><div class="hero-actions"><a class="btn btn-light" href="/productos" data-link>Explorar catálogo →</a><a class="btn btn-outline" href="/ofertas" data-link>Ver ofertas</a></div><div class="hero-metrics"><div><b>+9</b><span>Productos</span></div><div><b>5</b><span>Categorías</span></div><div><b>100%</b><span>Online</span></div></div></div><div class="hero-art"><img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1100&q=90" alt="Equipos de tecnología"/><div class="floating-tag">⚡ Descubre tu próximo favorito</div></div></div></section>
 <section class="benefits container"><div>🚚 <span><b>Compra sencilla</b><small>Desde cualquier lugar</small></span></div><div>🔒 <span><b>Proceso claro</b><small>Pedido demostrativo</small></span></div><div>💬 <span><b>Atención cercana</b><small>Estamos para ayudarte</small></span></div><div>✨ <span><b>Últimas tendencias</b><small>Tecnología para ti</small></span></div></section>
 <section class="container section"><div class="section-heading"><div><p class="eyebrow">ENCUENTRA LO QUE BUSCAS</p><h2>Compra por categoría</h2></div><a href="/productos" data-link class="text-link">Ver catálogo →</a></div><div class="category-grid">${categories.map(c=>`<a href="/productos?categoria=${c.id}" data-link class="category-card"><span>${c.icono}</span><b>${escapeHtml(c.nombre)}</b><small>Explorar →</small></a>`).join('')}</div></section>
 <section class="container section"><div class="section-heading"><div><p class="eyebrow">SELECCIONADOS PARA TI</p><h2>Productos destacados</h2></div><a href="/productos" data-link class="text-link">Todos los productos →</a></div>${productGrid(products.filter(p=>p.destacado))}</section>
 <section class="container promo-banner"><div><p class="eyebrow">SEMANA TECH</p><h2>Tu próxima gran compra empieza aquí.</h2><p>Descubre promociones en equipos y accesorios seleccionados.</p><a href="/ofertas" data-link class="btn btn-light">Conoce las ofertas →</a></div><span>⚡</span></section>
 <section class="container section"><div class="section-heading"><div><p class="eyebrow">PARA CADA NECESIDAD</p><h2>Más para descubrir</h2></div></div>${productGrid(products.filter(p=>!p.destacado).slice(0,4))}</section>`
 } catch(err){ page.innerHTML=failure(err); bindRetry() }}
async function catalog(){const page=document.querySelector('#page');page.innerHTML=loading();try{
 await loadBase();const query=new URLSearchParams(location.search); currentCategory=query.get('categoria')||'';currentSearch=query.get('buscar')||'';sortOrder=query.get('ordenar')||'';
 page.innerHTML=`${heading('TIENDA EN LÍNEA','Explora nuestros productos','Encuentra la tecnología ideal para tus necesidades.')}
 <div class="container catalog-layout"><aside class="filters"><h3>Filtrar productos</h3><label for="search">Buscar</label><input id="search" placeholder="¿Qué buscas?" value="${escapeHtml(currentSearch)}"/><label for="category">Categoría</label><select id="category"><option value="">Todas las categorías</option>${categories.map(c=>`<option value="${c.id}" ${String(c.id)===currentCategory?'selected':''}>${escapeHtml(c.nombre)}</option>`).join('')}</select><button class="btn btn-ghost" id="clear">Limpiar filtros</button></aside><section class="catalog-main"><div class="catalog-toolbar"><span id="result-count">Productos</span><label>Ordenar: <select id="sort"><option value="">Recomendados</option><option value="precio_asc" ${sortOrder==='precio_asc'?'selected':''}>Menor precio</option><option value="precio_desc" ${sortOrder==='precio_desc'?'selected':''}>Mayor precio</option></select></label></div><div id="catalog-result">${loading()}</div></section></div>`
 const run=async()=>{
  currentSearch=document.querySelector('#search').value;currentCategory=document.querySelector('#category').value;sortOrder=document.querySelector('#sort').value
  const params=new URLSearchParams(); if(currentSearch)params.set('buscar',currentSearch);if(currentCategory)params.set('categoria',currentCategory);if(sortOrder)params.set('ordenar',sortOrder)
  history.replaceState({},'',`/productos${params.size?'?'+params:''}`)
  const out=document.querySelector('#catalog-result');out.innerHTML=loading()
  try{const found=await api(`/productos?${params}`);out.innerHTML=productGrid(found);document.querySelector('#result-count').textContent=`${found.length} producto(s) encontrado(s)`}catch(err){out.innerHTML=failure(err);bindRetry(run)}
 }
 let timer; document.querySelector('#search').oninput=()=>{clearTimeout(timer);timer=setTimeout(run,300)}
 document.querySelector('#category').onchange=run;document.querySelector('#sort').onchange=run
 document.querySelector('#clear').onclick=()=>{document.querySelector('#search').value='';document.querySelector('#category').value='';document.querySelector('#sort').value='';run()}
 await run()
 }catch(err){page.innerHTML=failure(err);bindRetry()}}
async function detail(id){const page=document.querySelector('#page');page.innerHTML=loading();try{
 await loadBase();const p=await api(`/productos/${encodeURIComponent(id)}`)
 page.innerHTML=`<section class="container section"><a class="breadcrumb" href="/productos" data-link>← Volver a productos</a><div class="detail-layout"><div class="detail-img">${picture(p)}</div><div class="detail-info"><p class="eyebrow">${escapeHtml(p.marca)} · ${escapeHtml(categories.find(c=>c.id===p.categoriaId)?.nombre||'Tecnología')}</p><h1>${escapeHtml(p.nombre)}</h1><p class="stars">★★★★★ <span>Producto disponible</span></p><p class="detail-desc">${escapeHtml(p.descripcion)}</p><div class="detail-pricing">${money(p.precio)} ${p.anterior?`<del>${money(p.anterior)}</del>`:''}</div><p class="in-stock">● En stock: ${p.stock} unidades</p><button class="btn btn-primary btn-wide" data-add="${p.id}">＋ Agregar al carrito</button><div class="features"><h3>Características</h3><ul>${p.especificaciones.map(s=>`<li>✓ ${escapeHtml(s)}</li>`).join('')}</ul></div></div></div></section>`
 }catch(err){page.innerHTML=failure(err);bindRetry()}}
async function offers(){const page=document.querySelector('#page');page.innerHTML=loading();try{await loadBase();page.innerHTML=`${heading('AHORRA CON NOSOTROS','Ofertas especiales','Descubre precios especiales por tiempo limitado.')}
 <section class="container section small-top"><div class="offer-cards">${promotions.map(o=>`<div class="offer-card"><span>⚡</span><div><h3>${escapeHtml(o.titulo)}</h3><p>${escapeHtml(o.descripcion)}</p><small>Código informativo: ${escapeHtml(o.codigo)}</small></div></div>`).join('')}</div><div class="section-heading"><div><p class="eyebrow">PRECIOS ESPECIALES</p><h2>Productos en promoción</h2></div></div>${productGrid(products.filter(p=>p.anterior))}<p class="fine-print">Precios y promociones de demostración; los códigos no se aplican al carrito.</p></section>`}catch(err){page.innerHTML=failure(err);bindRetry()}}
function about(){document.querySelector('#page').innerHTML=`${heading('QUIÉNES SOMOS','Tecnología cerca de ti','Creemos que la tecnología debe ayudarte a descubrir nuevas posibilidades.')}
 <section class="container section about-grid"><div><h2>Bienvenido a TechStore Perú</h2><p>Somos una tienda virtual demostrativa creada como proyecto académico para facilitar la consulta de productos electrónicos desde cualquier dispositivo.</p><p>Nuestra plataforma integra un catálogo conectado a una API REST, categorías, ofertas, búsqueda, carrito y registro de pedidos de prueba.</p><a href="/productos" data-link class="btn btn-primary">Explora el catálogo →</a></div><img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=85" alt="Productos electrónicos sobre una mesa"/></section><section class="container values section"><div><span>🎯</span><h3>Misión</h3><p>Ayudar a encontrar tecnología con información clara y accesible.</p></div><div><span>👁️</span><h3>Visión</h3><p>Ser una experiencia digital simple, útil y confiable.</p></div><div><span>🤝</span><h3>Valores</h3><p>Claridad, accesibilidad e innovación.</p></div></section>`}
function contact(){document.querySelector('#page').innerHTML=`${heading('ESTAMOS PARA AYUDARTE','Contáctanos','¿Tienes alguna pregunta? Cuéntanos en qué podemos ayudarte.')}
 <section class="container contact-grid section"><div class="contact-panel"><h2>Hablemos</h2><p>💬 Resolvemos tus dudas sobre nuestros productos y la demostración de compra.</p><p>📍 Perú</p><p>✉️ hola@techstore.demo</p><div class="contact-note">Este es un proyecto académico. El formulario muestra una confirmación local y no envía correos.</div></div><form id="contact-form" class="form-card"><label>Tu nombre<input name="nombre" required minlength="2" placeholder="Nombre completo"/></label><label>Correo electrónico<input name="email" type="email" required placeholder="correo@ejemplo.com"/></label><label>Mensaje<textarea name="mensaje" required minlength="10" rows="5" placeholder="Escribe tu consulta"></textarea></label><button class="btn btn-primary" type="submit">Enviar mensaje</button></form></section>`
 document.querySelector('#contact-form').onsubmit=e=>{e.preventDefault();alertUI('Mensaje validado. Este formulario es demostrativo.');e.target.reset()}}
function cartPage(){const page=document.querySelector('#page');const entries=cart.map(c=>({...c,product:products.find(p=>p.id===c.id)})).filter(x=>x.product)
 page.innerHTML=`${heading('TU SELECCIÓN','Mi carrito de compras','Revisa los productos antes de continuar.')}
 <section class="container section small-top">${entries.length?`<div class="cart-layout"><div class="cart-list">${entries.map(({product:p,cantidad})=>`<div class="cart-item"><a href="/producto/${p.id}" data-link>${picture(p)}</a><div class="cart-item-info"><a href="/producto/${p.id}" data-link><b>${escapeHtml(p.nombre)}</b></a><p>${money(p.precio)} c/u</p><button class="remove" data-remove="${p.id}">Eliminar</button></div><div class="qty"><button data-dec="${p.id}" aria-label="Quitar uno">−</button><span>${cantidad}</span><button data-inc="${p.id}" aria-label="Añadir uno">＋</button></div><strong>${money(p.precio*cantidad)}</strong></div>`).join('')}</div><aside class="summary"><h3>Resumen del pedido</h3><div><span>Productos (${cartCount()})</span><b>${money(entries.reduce((s,x)=>s+x.product.precio*x.cantidad,0))}</b></div><div><span>Envío</span><span>A coordinar</span></div><div class="summary-total"><span>Subtotal</span><b>${money(entries.reduce((s,x)=>s+x.product.precio*x.cantidad,0))}</b></div><a class="btn btn-primary btn-wide" href="/checkout" data-link>Continuar pedido →</a><small>Esta demo no realiza cobros ni pagos reales.</small></aside></div>`:`<div class="empty"><span>🛒</span><h3>Tu carrito está vacío</h3><p>¡Encuentra algo que te guste en nuestro catálogo!</p><a href="/productos" data-link class="btn btn-primary">Ir a productos →</a></div>`}</section>`
}
function checkout(){ if(!cart.length){cartPage();return}
 const total=cart.reduce((s,c)=>s+(products.find(p=>p.id===c.id)?.precio||0)*c.cantidad,0)
 document.querySelector('#page').innerHTML=`${heading('ÚLTIMO PASO','Finalizar pedido','Completa tus datos para registrar un pedido de demostración.')}
 <section class="container checkout-layout section small-top"><form id="checkout-form" class="form-card"><h2>Datos del cliente</h2><label>Nombre completo<input name="nombre" required minlength="2" placeholder="Tu nombre"/></label><label>Correo electrónico<input type="email" name="email" required placeholder="correo@ejemplo.com"/></label><label>Dirección referencial<input name="direccion" required minlength="5" placeholder="Ciudad y dirección"/></label><div id="checkout-message"></div><button type="submit" class="btn btn-primary btn-wide" id="submit-order">Registrar pedido de prueba</button><small>No introduzcas datos de pago; no se procesa ninguna transacción real.</small></form><aside class="summary"><h3>Tu pedido</h3>${cart.map(c=>{const p=products.find(x=>x.id===c.id);return `<div><span>${escapeHtml(p?.nombre||'Producto')} × ${c.cantidad}</span><b>${money((p?.precio||0)*c.cantidad)}</b></div>`}).join('')}<div class="summary-total"><span>Total</span><b>${money(total)}</b></div></aside></section>`
 document.querySelector('#checkout-form').onsubmit=async e=>{e.preventDefault();if(busy)return;busy=true
 const btn=document.querySelector('#submit-order');btn.disabled=true;btn.textContent='Registrando pedido...';const form=e.target;const data=new FormData(form)
 try{const result=await api('/pedidos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nombre:data.get('nombre'),email:data.get('email'),direccion:data.get('direccion'),articulos:cart})});cart=[];saveCart();document.querySelector('#page').innerHTML=`<section class="container section"><div class="empty success"><span>✅</span><h1>¡Pedido registrado!</h1><p>Tu pedido de demostración <b>#${result.id}</b> se registró por ${money(result.total)}.</p><p>Estado: ${escapeHtml(result.estado)}. No se ha efectuado ningún pago.</p><a href="/productos" data-link class="btn btn-primary">Seguir comprando →</a></div></section>`}catch(err){document.querySelector('#checkout-message').innerHTML=`<p class="error-message">${escapeHtml(err.message)}</p>`;btn.disabled=false;btn.textContent='Registrar pedido de prueba'}finally{busy=false}}
}
async function orders(){const page=document.querySelector('#page');page.innerHTML=loading();try{const entries=await api('/pedidos');page.innerHTML=`${heading('DEMOSTRACIÓN DE API','Pedidos registrados','Consulta los pedidos temporales guardados por este servidor.')}
 <section class="container section small-top">${entries.length?`<div class="orders-list">${entries.map(p=>`<article class="order-card"><div><h3>Pedido #${p.id}</h3><p>${new Date(p.fecha).toLocaleString('es-PE')}</p></div><div><b>${money(p.total)}</b><p>${escapeHtml(p.estado)}</p></div></article>`).join('')}</div>`:`<div class="empty"><span>📦</span><h3>Aún no hay pedidos</h3><p>Los pedidos de prueba aparecerán aquí cuando completes el carrito.</p><a href="/productos" data-link class="btn btn-primary">Explorar productos</a></div>`}<p class="fine-print">El almacenamiento de esta demostración es temporal y puede reiniciarse en Render.</p></section>`}catch(err){page.innerHTML=failure(err);bindRetry()}}
const bindRetry = (fn=navigate) => {const b=document.querySelector('#retry');if(b)b.onclick=fn}
async function navigate(){window.scrollTo(0,0);shell();const url=route()
 if(url==='/')await home()
 else if(url==='/productos')await catalog()
 else if(url.startsWith('/producto/'))await detail(url.split('/')[2])
 else if(url==='/ofertas')await offers()
 else if(url==='/nosotros')about()
 else if(url==='/contacto')contact()
 else if(url==='/carrito'){await ensureProducts();cartPage()}
 else if(url==='/checkout'){await ensureProducts();checkout()}
 else if(url==='/pedidos')await orders()
 else document.querySelector('#page').innerHTML=`<section class="container section"><div class="empty"><span>🧭</span><h1>Página no encontrada</h1><a href="/" data-link class="btn btn-primary">Volver al inicio</a></div></section>`
}
async function ensureProducts(){if(products.length)return;const page=document.querySelector('#page');page.innerHTML=loading();try{await loadBase()}catch(err){page.innerHTML=failure(err);throw err}}
document.addEventListener('click', e=>{
 const add=e.target.closest('[data-add]');if(add){addCart(add.dataset.add);return}
 const remove=e.target.closest('[data-remove]');if(remove){cart=cart.filter(c=>c.id!==Number(remove.dataset.remove));saveCart();cartPage();return}
 const inc=e.target.closest('[data-inc]');if(inc){addCart(inc.dataset.inc);cartPage();return}
 const dec=e.target.closest('[data-dec]');if(dec){const item=cart.find(c=>c.id===Number(dec.dataset.dec));if(item){item.cantidad--;if(!item.cantidad)cart=cart.filter(c=>c!==item);saveCart();cartPage()}return}
 const link=e.target.closest('a[data-link]');if(link&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){e.preventDefault();const url=new URL(link.href);history.pushState({},'',url.pathname+url.search);navigate().catch(err=>{document.querySelector('#page').innerHTML=failure(err);bindRetry()});document.querySelector('#nav')?.classList.remove('open')}
})
window.addEventListener('popstate',()=>navigate().catch(err=>{document.querySelector('#page').innerHTML=failure(err);bindRetry()}))
navigate().catch(err=>{document.querySelector('#page').innerHTML=failure(err);bindRetry()})
