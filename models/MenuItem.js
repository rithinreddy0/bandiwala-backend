// models/MenuItem.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  vendorId:{
    type:mongoose.Types.ObjectId,
    ref:"Vendor",
  },
  status:{
    type:boolean,
    default:true
  },
  name: {
    type: String,
    required: true,
    
  },
  description: {
    type: String,
    required: true,

  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  
  image: {
    type: String,
    default: '', // Use for image URL if needed
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create the model
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
