import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user']
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        productName: String,
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true
        },
        image: String,
        subtotal: {
          type: Number,
          required: true
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: [true, 'Please provide total amount'],
      min: [0, 'Total amount cannot be negative']
    },
    subtotal: Number,
    taxAmount: {
      type: Number,
      default: 0
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    couponCode: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'upi', 'net_banking'],
      required: true
    },
    transactionId: String,
    shippingAddress: {
      name: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      }
    },
    billingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    trackingNumber: String,
    shippingProvider: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    notes: String,
    cancellationReason: String,
    returnReason: String,
    returnDate: Date
  },
  {
    timestamps: true
  }
);

// Generate order number before saving
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

// Calculate total from items
orderSchema.methods.calculateTotal = function () {
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.totalAmount = this.subtotal + this.taxAmount + this.shippingCost - this.discountAmount;
};

// Method to update order status
orderSchema.methods.updateStatus = function (newStatus) {
  const validTransitions = {
    pending: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered', 'returned'],
    delivered: ['returned'],
    cancelled: [],
    returned: []
  };

  if (validTransitions[this.status]?.includes(newStatus)) {
    this.status = newStatus;
    return true;
  }
  return false;
};

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });

export default mongoose.model('Order', orderSchema);
