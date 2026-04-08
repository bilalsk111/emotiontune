const mongoose = require('mongoose')


async function connectToDB(){
   try{
      await mongoose.connect(process.env.MONGO_URI)
      console.log('database connected');  
   }catch(err){
      console.log('database not connected');
   }
}

module.exports = connectToDB