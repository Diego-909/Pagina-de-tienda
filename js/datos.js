// R3 · Catálogo de productos (array de objetos)
function imagen(emoji, color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="${color}"/><text x="150" y="190" font-size="110" text-anchor="middle">${emoji}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const PRODUCTOS = [
  { id: 1, nombre: 'Audífonos Bluetooth', precio: 129.9, categoria: 'Audio', imagen: imagen('🎧', '#e8dcf5'), stock: 12, descripcion: 'Inalámbricos, con 30 horas de batería.' },
  { id: 2, nombre: 'Parlante Portátil', precio: 89.5, categoria: 'Audio', imagen: imagen('🔊', '#dcecf5'), stock: 20, descripcion: 'Resistente al agua y con sonido potente.' },
  { id: 3, nombre: 'Micrófono USB', precio: 159, categoria: 'Audio', imagen: imagen('🎙️', '#f5e4dc'), stock: 6, descripcion: 'Ideal para streaming y videollamadas.' },
  { id: 4, nombre: 'Laptop 14"', precio: 2499, categoria: 'Cómputo', imagen: imagen('💻', '#dcf5e4'), stock: 5, descripcion: '16 GB de RAM y SSD de 512 GB.' },
  { id: 5, nombre: 'Monitor 24"', precio: 549.9, categoria: 'Cómputo', imagen: imagen('🖥️', '#f5f0dc'), stock: 8, descripcion: 'Pantalla IPS Full HD de 75 Hz.' },
  { id: 6, nombre: 'Disco SSD 1 TB', precio: 349, categoria: 'Cómputo', imagen: imagen('💾', '#dce4f5'), stock: 10, descripcion: 'Unidad NVMe de alta velocidad.' },
  { id: 7, nombre: 'Teclado Mecánico', precio: 199, categoria: 'Accesorios', imagen: imagen('⌨️', '#ecdcf5'), stock: 15, descripcion: 'Retroiluminado, con switches rojos.' },
  { id: 8, nombre: 'Mouse Inalámbrico', precio: 59.9, categoria: 'Accesorios', imagen: imagen('🖱️', '#dcf5f0'), stock: 30, descripcion: 'Ergonómico, de 1600 DPI.' },
  { id: 9, nombre: 'Webcam HD', precio: 99, categoria: 'Accesorios', imagen: imagen('📷', '#f5dcdc'), stock: 0, descripcion: 'Cámara 1080p con micrófono.' }
];

const CUPONES = { DESC10: 0.10, BIENVENIDO: 0.05 };
