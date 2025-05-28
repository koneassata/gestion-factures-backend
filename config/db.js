const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connecté `);
  } catch (err) {
    console.error(`❌ Erreur MongoDB `);
   
  }
};

module.exports = connectDB;
