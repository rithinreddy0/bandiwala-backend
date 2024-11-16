const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  menuItems: [{
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
    },
    quantity: {
      type: Number,
      required: true,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Order Placed', 'Preparing',"On the Way", 'Delivered', 'Cancelled'],
    default: 'Order Placed',
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deliveryAddress:{
    type:String,
    required:true
  },
  mobileNo:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model('Order', orderSchema);
