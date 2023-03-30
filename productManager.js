const fs = require('fs')
const Product = require('./product.js')

class ProductManager {
  id = 0;
  #path = './products.json'
					
  constructor(path) {
    this.#path = path?path:this.#path
  }

  findProduct(id, products){
    return products.find((product) => product.id === id)
  }

  verifyUniqueness(code, products) {
    if (products.find((product) => product.code === code)) {
      return true;
    } else {
      return false;
    }
  }

  verifyObjectParameters(array, producto) {
    let flags = []
    flags = array.map((parametro) => Object.keys(producto).some(x => x == parametro))
    return flags.includes(false)
}

  async addProduct(producto) {
    const array = ['title', 'description', 'price', 'thumbnail', 'code', 'stock']
    if(this.verifyObjectParameters(array, producto)){
      console.log("Los parametros deben estar completos")
    }else{
        let resultado = await fs.promises.readFile(this.#path, 'utf-8')
        let products = JSON.parse(resultado)
        if (!this.verifyUniqueness(producto.code, products)) {
          this.id++;
          const item = new Product(
            this.id,
            producto.title,
            producto.description,
            producto.price,
            producto.thumbnail,
            producto.code,
            producto.stock
          );
          products.push(item);
          await fs.promises.writeFile(this.#path, JSON.stringify(products))
        } else {
          console.error(
            `El producto con código ${producto.code} ya esta en la lista`
          );
        }
    }
  }

  async deleteProduct(id) {
    let resultado = await fs.promises.readFile(this.#path, 'utf-8')
    let products = JSON.parse(resultado)
    let item = products.find((product) => product.id === id)
    if (item) {
      products = products.filter((product) => product.id !== id)
      if(!(this.findProduct(id, products))){
        await fs.promises.writeFile(this.#path, JSON.stringify(products)) 
        console.log(`the product with id ${id} has been removed`) 
      }  
    } else {
      console.log("Not Found")
    }
  }

  async updateProduct(id, modificador) {
    if (Object.keys(modificador).includes('id')){
      return console.error("It is not allowed to modify the product id")
    }
    let resultado = await fs.promises.readFile(this.#path, 'utf-8')
    let products = JSON.parse(resultado)
    let item = this.findProduct(id, products)
    if (item) {
      try{
        Object.keys(modificador).map((propiedad) => item[propiedad] = modificador[propiedad])  
      } catch(err) {
        console.log(`${err} update failed`)
      }
    } else {
      console.log("Not Found")
    }
    await fs.promises.writeFile(this.#path, JSON.stringify(products))  
  }

  async getProducts() {
    let resultado = await fs.promises.readFile(this.#path, 'utf-8')
    console.log(JSON.parse(resultado))
  }

  async getProductByid(id) {
    let resultado = await fs.promises.readFile(this.#path, 'utf-8')
    let products = JSON.parse(resultado)
    let item = this.findProduct(id, products)
    if (item) {
      console.log(item);
    } else {
      console.log("Not Found");
    }
  }
}

module.exports = ProductManager

