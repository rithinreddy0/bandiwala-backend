const mongoose = require('mongoose');
const { Schema } = mongoose;

const menuItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  category: {
    type: String,
    required: true, // e.g., "Veg", "Non-Veg", etc.
  },
  imageUrl: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
