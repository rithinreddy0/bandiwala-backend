// models/MenuItem.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  vendorId:{
    type:mongoose.Types.ObjectId,
    ref:"Vendor",
  },
  status:{
    type:String,
    enum:["active","inactive"],
    default:"active"
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage'], // Adjust as needed
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
