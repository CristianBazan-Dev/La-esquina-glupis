const { ipcRenderer, app } = require('electron')

const editModal = document.querySelector('#edit-modal-container')

const editForm = document.querySelector('#editForm')

const editCategory = document.querySelector('#editCategory')
const editBrand = document.querySelector('#editBrand')
const editProduct = document.querySelector('#editProduct')
const editStock = document.querySelector('#editStock')
const editMinStock = document.querySelector('#editMinStock')
const editDateOff = document.querySelector('#editDateOff')


// Creating an array for products so they can refresh automatically once we create a new one 
// This is going to be the state of the app. The data that we modified and process. 
// We apply this so in the render function it can be filled by the products that we received from the db 

let products = [];

// Updatestatus variable it's going to be used by the form that's going to show the data
// This it's going to be ok if we're adding a edit page 

let updateStatus = false; 

// We're adding another variable that's going to be the id of the product to update. 
// It's going to be filled by the id of the product that we're updating 
let idProductToUpdate = ''

// Date function




// Render products 
const productsBody = document.querySelector('#productsBody')

function renderProducts(products){
    productsBody.innerHTML = ''
    products.map(p =>{
        const date = new Date(p.dateOff).toLocaleDateString("es-AR",  {timezone: "UTC-3"});
       

        productsBody.innerHTML += `
        <tr class="table-light">
                <td  data-label="Categoría" id="category">${p.category}</td>
                <td data-label="Marca" id="brand">${p.brand}</td>
                <td data-label="Producto" id="name">${p.product}</td>
               
                
                <form id="updateForm">
                    <td data-label="Stock">
                        <input class="stock"id="stockUpt" type="number" onclick="updateStock('${p._id}')" name="${p._id}" class="input-table" value="${p.stock}">
                    </td>
                    <td data-label="Venc.">${date}</td>
                    <td data-label="Acciones" class="btn-table-actions">
                    
                        <div class="button-container two">
                        <button onClick="editProducts('${p._id}')" class="btn btn-primary">Editar</button>
                            <button onClick="deleteProduct('${p._id}')" class="btn btn-danger">Eliminar</button>
                        </div>              
                            
                        
                    </td>
                </form>
                
                
            </tr> 

        `
        
    })
}


// Delete function
// We pass the id so it showed to us. 
// We're sending an event to tell the main process that we're requesting to the db

function deleteProduct(id){
    const result = confirm('¿Está seguro de querer eliminar el producto?')
    if(result){
        ipcRenderer.send('delete-product', id);
    }
    return; 
}

// Edit function 

function editProducts(id){
    editModal.classList.add('active')
    updateStatus = true;
    idProductToUpdate = id;
    const product = products.find((product) => product._id === id);
    editCategory.value = product.category;
    editBrand.value = product.brand;
    editProduct.value = product.product;
    editStock.value = product.stock;
    editMinStock.value = product.minStock;
    editDateOff.value = product.dateOff;

    
}

// Edit product 



 editForm.addEventListener('submit', async (e)=>{
 
   const editProductForm = {
             category: editCategory.value,
            brand: editBrand.value,
             product: editProduct.value, 
             stock: editStock.value,
            minStock: editMinStock.value,
             dateOff: editDateOff.value
         };
         ipcRenderer.send('update-product', { ...editProductForm, idProductToUpdate})
    });

// Update stock function 
function updateStock(id){
         idProductToUpdate = id
         const stockButtons = document.getElementsByName(id)

         Array.from(stockButtons).forEach(stockButton =>{
            stockButton.addEventListener('change', ()=>{
                const product = products.find((product) => product._id === id);
                const stockUpdate = {
                    stock: stockButton.value
                }
                console.log(stockButton.name + " " + stockButton.value)
                ipcRenderer.send('update-stock', { ...stockUpdate, idProductToUpdate})
            })
         })
    
}



       


    





ipcRenderer.send('get-products')


// We convert the string object that we received in a json.
// Here we're executing the render function sending it
ipcRenderer.on('get-products', (e,args) =>{
    const productsReceived = JSON.parse(args);
    products = productsReceived;
    renderProducts(productsReceived)
})

// Receiving the data from the delete process of the main 
ipcRenderer.on('delete-product', (e,args)=>{
    const deletedProduct = JSON.parse(args); 
    // Searching and taking it off from the render.
    // We're saying that it's going to search for all the tasks that are different of the deleted one 
    const newProducts = products.filter(t =>{
        return t._id !== deletedProduct._id;
    });
    // Updating the list
    products = newProducts;
    renderProducts(products)
})

// Listening to the updated products 

ipcRenderer.on('update-product', (e,args)=>{
    const updatedProduct = JSON.parse(args);
    const products = products.map(p => {
        if (p._id === updatedProduct._id){
            p.category = updatedProduct.category; 
            p.brand = updatedProduct.brand; 
            p.product = updatedProduct.product; 
            p.stock = updatedProduct.stock; 
            p.minStock = updatedProduct.minStock;
            p.dateOff = updatedProduct.dateOff 
        }
        return p; 
    }) 
    renderProducts(products)
})


// Listening to the updated stock
ipcRenderer.on('update-stock', (e,args)=>{
    const updatedProduct = JSON.parse(args);
    const products = products.map(p => {
        if (p._id === updatedProduct._id){
            p.stock = updatedProduct.stock; 
        }
        return p; 
    }) 
    renderProducts(products)
})