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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../../../logger"));
exports.default = (dependencies) => {
    const creatorFindController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { getCreatorUseCase } = dependencies.useCase;
            const response = yield getCreatorUseCase(dependencies).executeFunction();
            console.log(response, '.....njb');
            if (response && response.status) {
                const sanitizedData = Array.isArray(response.data)
                    ? response.data.map((_a) => {
                        var { password } = _a, rest = __rest(_a, ["password"]);
                        return rest;
                    })
                    : response.data;
                console.log(sanitizedData);
                return res.status(200).json({ status: true, data: sanitizedData });
            }
            else {
                return res.status(404).json({ status: false, message: "Data not found" });
            }
        }
        catch (error) {
            logger_1.default.error("Error in getAll creator:", error);
            return res.status(500).json({ status: false, message: "Internal server error" });
        }
    });
    return creatorFindController;
};
