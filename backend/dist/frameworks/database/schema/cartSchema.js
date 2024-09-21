"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const CartItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
});
const CartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [CartItemSchema],
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    }
}, {
    timestamps: true
});
CartSchema.pre('save', function (next) {
    this.totalPrice = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    next();
});
const Cart = mongoose_1.default.model('Cart', CartSchema);
exports.Cart = Cart;
