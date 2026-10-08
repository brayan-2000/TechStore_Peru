export const categorias = [
  { id: 1, nombre: 'Laptops', slug: 'laptops', icono: '💻' },
  { id: 2, nombre: 'Celulares', slug: 'celulares', icono: '📱' },
  { id: 3, nombre: 'Audio', slug: 'audio', icono: '🎧' },
  { id: 4, nombre: 'Accesorios', slug: 'accesorios', icono: '⌨️' },
  { id: 5, nombre: 'Monitores', slug: 'monitores', icono: '🖥️' }
]
const foto = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`
export const productos = [
 { id:1, nombre:'Laptop Pro 14', marca:'TechPro', categoriaId:1, precio:3299, anterior:3799, stock:12, destacado:true, descripcion:'Rendimiento potente para estudiar, trabajar y crear.', especificaciones:['Pantalla 14 pulgadas FHD','16 GB RAM','SSD 512 GB'], imagen:foto('photo-1496181133206-80ce9b88a853') },
 { id:2, nombre:'Smartphone Nova X', marca:'Nova', categoriaId:2, precio:2199, anterior:2499, stock:18, destacado:true, descripcion:'Cámara versátil, batería duradera y diseño moderno.', especificaciones:['Pantalla OLED','Cámara principal 50 MP','128 GB almacenamiento'], imagen:foto('photo-1511707171634-5f897ff02aa9') },
 { id:3, nombre:'Audífonos Studio ANC', marca:'SoundLab', categoriaId:3, precio:349, anterior:429, stock:29, destacado:true, descripcion:'Sonido envolvente con cancelación de ruido.', especificaciones:['Bluetooth','Cancelación de ruido','Estuche de transporte'], imagen:foto('photo-1505740420928-5e560c06d30e') },
 { id:4, nombre:'Teclado Mecánico RGB', marca:'KeyMax', categoriaId:4, precio:289, anterior:null, stock:15, destacado:false, descripcion:'Escritura precisa y cómoda para tus proyectos.', especificaciones:['Switches mecánicos','Iluminación RGB','Conexión USB'], imagen:foto('photo-1541140532154-b024d705b90a') },
 { id:5, nombre:'Monitor Vision 27', marca:'Vision', categoriaId:5, precio:899, anterior:1099, stock:10, destacado:true, descripcion:'Más espacio para trabajar y disfrutar tus contenidos.', especificaciones:['Pantalla 27 pulgadas','Resolución Full HD','Entrada HDMI'], imagen:foto('photo-1527443224154-c4a3942d3acf') },
 { id:6, nombre:'Mouse Inalámbrico', marca:'Click+', categoriaId:4, precio:89, anterior:119, stock:46, destacado:false, descripcion:'Precisión, portabilidad y comodidad diaria.', especificaciones:['Conexión inalámbrica','Diseño ergonómico','Batería de larga duración'], imagen:foto('photo-1527814050087-3793815479db') },
 { id:7, nombre:'Laptop Air 13', marca:'TechPro', categoriaId:1, precio:2699, anterior:null, stock:9, destacado:false, descripcion:'Ligera, rápida y perfecta para llevar a clase.', especificaciones:['Pantalla 13 pulgadas','8 GB RAM','SSD 256 GB'], imagen:foto('photo-1517336714731-489689fd1ca8') },
 { id:8, nombre:'Parlante Bluetooth Mini', marca:'SoundLab', categoriaId:3, precio:179, anterior:219, stock:31, destacado:false, descripcion:'Música a donde vayas con un formato compacto.', especificaciones:['Portátil','Conexión Bluetooth','Carga USB-C'], imagen:foto('photo-1608043152269-423dbba4e7e1') },
 { id:9, nombre:'Smartphone Pixel S', marca:'Pixel', categoriaId:2, precio:1699, anterior:null, stock:14, destacado:false, descripcion:'Fluidez y fotografía para tu día a día.', especificaciones:['Pantalla de alta resolución','128 GB','Carga rápida'], imagen:foto('photo-1592750475338-74b7b21085ab') }
]
export const promociones = [
 { id:1, titulo:'Semana Tech', descripcion:'Descuentos en productos seleccionados', codigo:'TECH10', activa:true },
 { id:2, titulo:'Envíos nacionales', descripcion:'Consulta las condiciones al finalizar tu pedido', codigo:'ENVIO', activa:true }
]
export const pedidos = []
export const clientes = []
