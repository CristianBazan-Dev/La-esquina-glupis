const { createWindow } = require('./main')
const { app } = require('electron')
const { create } = require('domain')
require('./database')

app.whenReady().then(createWindow)
// Deprecated function  
// app.allowRendererProcessReuse = false; 

