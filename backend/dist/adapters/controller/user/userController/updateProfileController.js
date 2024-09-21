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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (dependencies) => {
    const { updateProfileUseCase } = dependencies.useCase;
    const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = req.body;
        console.log(data);
        const executionFunction = yield updateProfileUseCase(dependencies);
        console.log(executionFunction);
        const response = yield executionFunction.executionFunction(data);
        if (response.status) {
            const _a = response.data.toObject
                ? response.data.toObject()
                : response.data, { password } = _a, sanitizedData = __rest(_a, ["password"]);
            res.json({ status: true, data: sanitizedData });
        }
        else {
            res.json({ status: false, message: 'Profile updation failed' });
        }
    });
    return updateProfile;
};
