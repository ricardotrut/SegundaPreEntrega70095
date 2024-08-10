const { Router } = require('express');
const ProductManager = require('../productManager.js');

const router = Router();
const productManager = new ProductManager();

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productManager.showProducts();
        res.json(products);
    } catch (error) {
        res.status(400).json({ error: 'Error al obtener los productos' });
    }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(400).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al obtener el producto' });
    }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || stock === undefined || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
        }
        const newProduct = {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: thumbnails || []
        };
        const addedProduct = await productManager.addProduct(newProduct);
        res.status(201).json(addedProduct);
    } catch (error) {
        res.status(400).json({ error: 'Error al agregar el producto' });
    }
});

// Actualizar un producto por ID
router.put('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const updatedProduct = req.body;
        const product = await productManager.updateProduct(productId, updatedProduct);
        if (product) {
            res.json(product);
        } else {
            res.status(400).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el producto' });
    }
});

// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const deletedProduct = await productManager.deleteProduct(productId);
        if (deletedProduct) {
            res.json(deletedProduct);
        } else {
            res.status(400).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
