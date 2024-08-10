const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const ProductManager = require('./productManager'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const productManager = new ProductManager();

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.showProducts(); 
    res.render('realTimeProducts', { title: 'Agregar Productos', products });
});

app.get('/home', async (req, res) => {
    const products = await productManager.showProducts(); 
    res.render('home', { products });
});

io.on('connection', async (socket) => {
    console.log('Usuario conectado');

    // Emitir productos existentes al conectarse
    const products = await productManager.showProducts();
    socket.emit('products', products);

    socket.on('newProduct', async (product) => {
        const addedProduct = await productManager.addProduct(product);
        if (addedProduct) {
            const updatedProducts = await productManager.showProducts();
            io.emit('products', updatedProducts);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        const deletedProduct = await productManager.deleteProduct(productId);
        if (deletedProduct) {
            const updatedProducts = await productManager.showProducts();
            io.emit('products', updatedProducts);
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

server.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080');
});
