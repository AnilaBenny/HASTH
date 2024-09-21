"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: Number,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: ['creative', 'user'],
        default: 'user',
    },
    skills: {
        type: String,
    },
    education: {
        type: String,
    },
    specification: {
        type: String,
    },
    address: [
        {
            street: {
                type: String,
            },
            city: {
                type: String,
            },
            state: {
                type: String,
            },
            zipCode: {
                type: String,
            },
        },
    ],
    supercoin: {
        balance: {
            type: Number,
            default: 0
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.User = User;
