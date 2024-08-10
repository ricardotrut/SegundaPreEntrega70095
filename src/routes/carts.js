const { Router } = require('express');
const CartManager = require('../cartManager.js');  // Importar CartManager

const router = Router();
const cartManager = new CartManager();  // Instanciar CartManager

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el carrito' });
    }
});

// Listar productos en un carrito por ID de carrito
router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.json(cart.products);
        } else {
            res.status(400).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al obtener el carrito' });
    }
});

// Agregar un producto al carrito por ID de carrito y producto
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const cart = await cartManager.addProductToCart(cartId, productId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(400).json({ error: 'Carrito no encontrado o producto no agregado' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al agregar el producto al carrito' });
    }
});

module.exports = router;