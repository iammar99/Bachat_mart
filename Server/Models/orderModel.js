const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    }
  }],
  shippingInfo: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  paymentInfo: {
    cardNumber: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    cvv: {
      type: String,
      required: true,
    },
    nameOnCard: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal'],
      required: true,
    },
  },
  billingInfo: {
    sameAsShipping: {
      type: Boolean,
      default: true,
    },
    firstName: {
      type: String,
      required: function () {
        return !this.billingInfo.sameAsShipping;
      },
    },
    lastName: {
      type: String,
      required: function () {
        return !this.billingInfo.sameAsShipping;
      },
    },
    address: {
      type: String,
      required: function () {
        return !this.billingInfo.sameAsShipping;
      },
    },
    city: {
      type: String,
      required: function () {
        return !this.billingInfo.sameAsShipping;
      },
    },
    state: {
      type: String,
      required: function () {
        return !this.billingInfo.sameAsShipping;
      },
    },
    zipCode: {
      type: String,
      required: function () {
        return !this.billingInfo.sameAsShipping;
      },
    },
    country: {
      type: String,
      required: function () {
        return !this.billingInfo.sameAsShipping;
      },
    },
  },
  subtotal: {
    type: String,
    required: true,
  },
  tax: {
    type: String,
    required: true,
  },
  total: {
    type: String,
    required: true,
  },
  status : {
    type: String,
    default :"pending"
  }
}, { timestamps: true });

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
