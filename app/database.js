const mongoose = require("mongoose"); 
const { ATLAS_URI  } = require("./config"); 

mongoose
    .connect("mongodb+srv://tvboxbazban:mOvr9CvY9CG9NZbe@cluster0.wxbi1ko.mongodb.net/?retryWrites=true&w=majority")

    .then((db) => console.log("DB is connected"))
    .catch((err) => console.log(err))

