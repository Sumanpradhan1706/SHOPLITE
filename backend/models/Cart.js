import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Cart must belong to a user'],
      unique: true
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        productName: String,
        price: {
          type: Number,
          required: true
        },
        discountPrice: Number,
        image: String,
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
          max: [999, 'Quantity cannot exceed 999']
        },
        stock: Number,
        category: String,
        subtotal: Number,
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    totalItems: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      default: 0
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
    notes: String,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Calculate cart totals
cartSchema.methods.calculateTotal = function () {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  
  this.subtotal = this.items.reduce((sum, item) => {
    const itemPrice = item.discountPrice || item.price;
    const itemTotal = itemPrice * item.quantity;
    item.subtotal = itemTotal;
    return sum + itemTotal;
  }, 0);

  this.totalPrice = this.subtotal + this.taxAmount + this.shippingCost - this.discountAmount;
};

// Add item to cart
cartSchema.methods.addItem = function (productData) {
  const existingItem = this.items.find(
    (item) => item.productId.toString() === productData.productId.toString()
  );

  if (existingItem) {
    existingItem.quantity += productData.quantity || 1;
    existingItem.addedAt = new Date();
  } else {
    this.items.push({
      productId: productData.productId,
      productName: productData.productName,
      price: productData.price,
      discountPrice: productData.discountPrice,
      image: productData.image,
      quantity: productData.quantity || 1,
      stock: productData.stock,
      category: productData.category
    });
  }

  this.calculateTotal();
};

// Remove item from cart
cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );
  this.calculateTotal();
};

// Update item quantity
cartSchema.methods.updateItemQuantity = function (productId, quantity) {
  const item = this.items.find(
    (item) => item.productId.toString() === productId.toString()
  );

  if (item) {
    if (quantity <= 0) {
      this.removeItem(productId);
    } else {
      item.quantity = quantity;
      this.calculateTotal();
    }
    return true;
  }
  return false;
};

// Clear cart
cartSchema.methods.clearCart = function () {
  this.items = [];
  this.totalItems = 0;
  this.subtotal = 0;
  this.totalPrice = 0;
  this.taxAmount = 0;
  this.shippingCost = 0;
  this.discountAmount = 0;
  this.couponCode = null;
};

// Check if item exists
cartSchema.methods.hasItem = function (productId) {
  return this.items.some(
    (item) => item.productId.toString() === productId.toString()
  );
};

// Get item count
cartSchema.methods.getItemCount = function () {
  return this.items.reduce((count, item) => count + item.quantity, 0);
};

// Index for faster queries
cartSchema.index({ user: 1 });
cartSchema.index({ 'items.productId': 1 });

export default mongoose.model('Cart', cartSchema);
