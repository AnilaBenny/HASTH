"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    collab: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    images: [{
            type: String
        }],
    brand: {
        type: String
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 300
    },
    review: [
        {
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            },
            orderId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Order'
            },
            rating: {
                type: Number,
                default: 0
            },
            reviewdescription: {
                type: String
            }
        },
    ],
    isFeatured: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    popularity: {
        type: Number,
        default: 0
    },
    list: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
const Product = (0, mongoose_1.model)('Product', productSchema);
exports.Product = Product;
