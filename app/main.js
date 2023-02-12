const { BrowserWindow, ipcMain, app, Menu } = require('electron')
const { ipcRenderer } = require('electron');
const Product = require('./models/Product')

let win; 
let secondaryWin; 
let thirdWin;
let about; 


function createWindow() {
     win = new BrowserWindow({
        width: 1280,
        height: 700, 
        frame: false,   
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            enableRemoteModule: true
        },
        transparent: true,
        icon: '/favicon.ico'
    })
    win.loadFile('app/index.html')
    const mainMenu = Menu.buildFromTemplate(templateMenu)
    Menu.setApplicationMenu(mainMenu)
    createSecondaryWindow()
}

function createSecondaryWindow() {
     secondaryWin = new BrowserWindow({
        width: 300,
        height: 720,
        // frame: false,
        // autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            enableRemoteModule: true
        },
        maximizable: false
    })
    secondaryWin.loadFile('app/views/new-product.html')
    secondaryWin.setMenu(null)
}

function createThirdWindow() {
    const thirdWin = new BrowserWindow({
        width: 300,
        height: 720,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            enableRemoteModule: true
        },
        maximizable: false
    })
    thirdWin.loadFile('app/views/edit-product.html')
}



// New product backend response 
// It has to be async because otherwise it's going to throw an error of serialization

// We add JSON.Stringify so the object that we received it's converted to a string 

ipcMain.on('new-product', async (e, args) =>{
    const newProduct = new Product(args); 
    const productSaved = await newProduct.save()
    console.log(productSaved)
    e.reply('new-product-created', JSON.stringify(productSaved))
    
})


// Update product backend response 

ipcMain.on('update-stock', async (e, args) =>{
    console.log(args)
    const updatedStock = await Product.findByIdAndUpdate(
        args.idProductToUpdate,{
        stock: args.stock
    },
    {new: true}
    )
    e.reply('update-stock', JSON.stringify(updatedStock))
})


// Edit product 
ipcMain.on('update-product', async (e,args) =>{
    const updatedProduct = await Product.findByIdAndUpdate(
        args.idProductToUpdate, {
        category: args.category,
        brand: args.brand,
        product: args.product,
        stock: args.stock,
        minStock: args.minStock,
        dateOff: args.dateOff,
        },
        {
        new:true
        });
    e.reply('update-product', JSON.stringify(updatedProduct))
})


// Render function. 
// We apply the find method to render all the products. 

ipcMain.on('get-products', async (e,args) =>{
    const products = await Product.find()
    // TouchEvent, we use e.reply so we had it on the mainWindow
    // The process are called the same but they're two different behaviors: 
    // one is receiving and the other it's replying 
    // We listen the 'get-products event', then, we consult to the db and then we reply through this process
    // We reply sending the products that we request on the db as a stringify
    e.reply('get-products', JSON.stringify(products))
})

// Delete function 
ipcMain.on('delete-product', async(e,args) =>{
   const productDeleted =  await Product.findByIdAndDelete(args)
//    Once the product it's deleted
    e.reply('delete-product', JSON.stringify(productDeleted))

})


// Menu

const templateMenu = [
            {
                label: "Crear producto",
                accelerator: "F1",
                click(){
                    createSecondaryWindow()
                }
            },
            {
                label: 'Actualizar',
                accelerator: 'F5',
                 click() {
                    win.reload()
                 }
            },
            {
                label: 'DevTools',
                submenu: [
                    {
                        label: 'Show/Hide Dev Tools',
                        click(item, focusedWindow){
                            focusedWindow.toggleDevTools(); 
                        }
                    },
                   {
                    role: 'reload'
                }
                ]           
            },
            {
                label: "Salir",
                accelerator: "Esc",
                click(){
                    app.quit()
                }
            }
]
    
    


module.exports = { createWindow, createSecondaryWindow, createThirdWindow }