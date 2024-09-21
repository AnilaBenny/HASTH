"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const userSchema_1 = require("../frameworks/database/schema/userSchema");
const database_1 = require("../frameworks/database");
const passportConfig = () => {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: '454780597057-m0hi77khg1hntm0l1qj2bm5as7qvbtng.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: "http://localhost:8080/api/auth/google/callback"
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);
        console.log('Profile:', profile);
        try {
            const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
            let user = yield database_1.databaseSchema.User.findOne({ email: email });
            console.log(user);
            if (user) {
                return done(null, user);
            }
            if (!profile.emails || profile.emails.length === 0) {
                return done(new Error('No emails associated with this account'), undefined);
            }
            const newUser = new userSchema_1.User({
                name: profile.displayName,
                email: profile.emails[0].value
            });
            yield newUser.save();
            done(null, newUser);
        }
        catch (error) {
            console.log(error);
            done(error, undefined);
        }
    })));
    passport_1.default.serializeUser((user, done) => {
        console.log('Serializing User:', user);
        done(null, user.id);
    });
    passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield database_1.databaseSchema.User.findById(id);
            console.log('Deserializing User:', user);
            done(null, user);
        }
        catch (error) {
            done(error, null);
        }
    }));
};
exports.default = passportConfig;
