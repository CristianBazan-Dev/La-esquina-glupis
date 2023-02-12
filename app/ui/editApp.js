const { ipcRenderer } = require('electron')


// New product function
const productForm = document.querySelector('#productForm')
const categoryName = document.querySelector('#category')
const brandName = document.querySelector('#brand')
const productName = document.querySelector('#product')
const stockQty = document.querySelector('#stock')
const minStockQty = document.querySelector('#minStock')
const dateOffQty = document.querySelector('#dateOff')




productForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    const newProduct = {
        category: categoryName.value,
        brand:brandName.value,
        product: productName.value, 
        stock: stockQty.value,
        minStock: minStockQty.value,
        dateOff: dateOffQty.value
    }

    ipcRenderer.send('new-product', newProduct)
    
})

// Receiving data from the backend 

// New task response.
//  Args it's going to be the info of productSaved in the backend route

// We received the object converted in a String, so we apply parse to generate an object again



ipcRenderer.on('new-product-created', (e, args )=>{
    const newProduct = JSON.parse(args)
    
    alert('Producto creado exitosamente!')
    console.log(newProduct)
})


