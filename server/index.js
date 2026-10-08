import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { categorias, productos, promociones, pedidos, clientes } from './data.js'

const app = express()
app.use(express.json({ limit: '50kb' }))
app.get('/api', (_req,res)=>res.json({ nombre:'TechStore Perú API', endpoints:['/api/productos','/api/categorias','/api/promociones','/api/clientes','/api/pedidos'] }))
app.get('/api/categorias', (_req,res)=>res.json(categorias))
app.get('/api/promociones', (_req,res)=>res.json(promociones))
app.get('/api/productos', (req,res)=>{
 const { buscar='', categoria='', destacados='', ordenar='' } = req.query
 let items=productos.filter(p=>`${p.nombre} ${p.marca}`.toLocaleLowerCase('es').includes(String(buscar).toLocaleLowerCase('es')))
 if (categoria) items=items.filter(p=>String(p.categoriaId)===String(categoria))
 if (destacados==='true') items=items.filter(p=>p.destacado)
 if (ordenar==='precio_asc') items.sort((a,b)=>a.precio-b.precio)
 if (ordenar==='precio_desc') items.sort((a,b)=>b.precio-a.precio)
 return res.json(items)
})
app.get('/api/productos/:id',(req,res)=>{
 const item=productos.find(p=>p.id===Number(req.params.id))
 return item ? res.json(item) : res.status(404).json({mensaje:'Producto no encontrado'})
})
app.get('/api/clientes',(_req,res)=>res.json(clientes.map(({id,nombre})=>({id,nombre}))))
app.get('/api/pedidos',(_req,res)=>res.json(pedidos.map(p=>({id:p.id, fecha:p.fecha, total:p.total, estado:p.estado, articulos:p.articulos}))))
app.post('/api/pedidos',(req,res)=>{
 const { nombre, email, direccion, articulos }=req.body || {}
 if(typeof nombre!=='string'||nombre.trim().length<2||typeof email!=='string'||!/^\S+@\S+\.\S+$/.test(email)||typeof direccion!=='string'||direccion.trim().length<5||!Array.isArray(articulos)||!articulos.length) return res.status(400).json({mensaje:'Completa los datos y agrega al menos un producto.'})
 const lineas=[]
 for (const linea of articulos){
  const prod=productos.find(p=>p.id===Number(linea.id))
  const cantidad=Number(linea.cantidad)
  if(!prod||!Number.isInteger(cantidad)||cantidad<1||cantidad>prod.stock) return res.status(400).json({mensaje:'Uno de los artículos es inválido o supera el stock.'})
  lineas.push({id:prod.id,nombre:prod.nombre,cantidad,precio:prod.precio})
 }
 const total=lineas.reduce((s,p)=>s+p.precio*p.cantidad,0)
 let cliente=clientes.find(c=>c.email===email.trim().toLowerCase())
 if(!cliente){cliente={id:clientes.length+1,nombre:nombre.trim(),email:email.trim().toLowerCase()};clientes.push(cliente)}
 const pedido={id:pedidos.length+1001,clienteId:cliente.id,direccion:direccion.trim(),fecha:new Date().toISOString(),estado:'Recibido (demostración)',articulos:lineas,total}
 pedidos.push(pedido)
 return res.status(201).json({id:pedido.id,total:pedido.total,estado:pedido.estado})
})
const __dirname=path.dirname(fileURLToPath(import.meta.url))
const dist=path.resolve(__dirname,'../dist')
app.use(express.static(dist))
app.get('*',(req,res)=>{
 if(req.path.startsWith('/api/')) return res.status(404).json({mensaje:'Ruta no encontrada'})
 return res.sendFile(path.join(dist,'index.html'),(error)=>{if(error&&!res.headersSent)res.status(404).send('Primero ejecuta npm run build')})
})
const port=Number(process.env.PORT)||3001
const publicUrl=process.env.RENDER_EXTERNAL_URL
const apiUrl=publicUrl ? `${publicUrl.replace(/\/$/,'')}/api` : `http://localhost:${port}/api`
app.listen(port,'0.0.0.0',()=>console.log(`TechStore API en ${apiUrl}`))
