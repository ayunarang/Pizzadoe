const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const mongoose= require('mongoose')
const mongoURI= process.env.MONGO

const mongoDb=async()=>{
    try {
        await mongoose.connect(mongoURI);
        console.log('Database working successfully');
        const fetcheddata= await mongoose.connection.db.collection("pizza_items");
        const inventorydata= await mongoose.connection.db.collection("inventory");
        const pastorders= await mongoose.connection.db.collection("NewOrders");
        const custompizza=await mongoose.connection.db.collection("Custompizza");
        const admindata= await inventorydata.find({}).toArray();
        const data= await fetcheddata.find({}).toArray();
        const orders= await pastorders.find({}).toArray();
        const customdata= await custompizza.find({}).toArray();
        

        global.food_items= data;
        global.admin_items= admindata;
        global.neworders=orders;
        global.CustomPizza_data=customdata;
      } catch (error) {
        console.error('Error connecting to the database:', error.message);
      }
}

module.exports= mongoDb;