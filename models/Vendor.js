const mongoose = require('mongoose');
const { Schema } = mongoose;

const vendorSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  restaurantName: {
    type: String,
    required: true,
  },
  logo: {
    type: String, // You can store the URL or path to the image
     
  },
  menuItems: [{
    type: Schema.Types.ObjectId,
    ref: 'MenuItem',
  }],
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order',
  }],
  ratings: [{
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: String,
  }],
  averageRating: { type: Number, default: 0 },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Vendor', vendorSchema);
