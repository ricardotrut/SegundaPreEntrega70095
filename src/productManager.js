const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor() {
        this.filePath = path.join(__dirname, 'products.json');
    }

    async showProducts() {
        try {
            const productData = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(productData);
        } catch (error) {
            console.log('Error al leer el archivo:', error);
            return [];
        }
    }

    async addProduct(newProduct) {
        try {
            const products = await this.showProducts();
            
            // Generar el nuevo ID correctamente
            let newId;
            if (products.length > 0) {
                newId = Math.max(...products.map(p => p.id)) + 1; // Encuentra el mayor id y suma 1
            } else {
                newId = 1; // Si no hay productos, el primer id será 1
            }

            const productWithId = { id: newId, ...newProduct };

            products.push(productWithId);
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return productWithId;
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.showProducts();
            const index = products.findIndex(product => product.id === id);
            if (index === -1) {
                throw new Error('Producto no encontrado');
            }
            const deletedProduct = products.splice(index, 1);
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return deletedProduct[0];
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return null;
        }
    }
}

module.exports = ProductManager;
