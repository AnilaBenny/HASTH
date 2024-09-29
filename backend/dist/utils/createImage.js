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
const sharp_1 = __importDefault(require("sharp"));
const canvas_1 = require("canvas");
const path_1 = __importDefault(require("path"));
const node_fs_1 = __importDefault(require("node:fs"));
exports.default = (name) => __awaiter(void 0, void 0, void 0, function* () {
    let firstName = name.split(' ')[0];
    let secondName = name.split(' ')[1];
    function getInitials() {
        if (!firstName)
            return '';
        if (!secondName)
            return `${firstName.charAt(0).toUpperCase()}`;
        return `${firstName.charAt(0).toUpperCase()}${secondName.charAt(0).toUpperCase()}`;
    }
    const initials = getInitials();
    const canvas = (0, canvas_1.createCanvas)(300, 300);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 300, 300);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 150px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 150, 150);
    const buffer = canvas.toBuffer('image/png');
    const image = yield (0, sharp_1.default)(buffer).png().toBuffer();
    const filePath = path_1.default.join(__dirname, '..', 'uploads');
    if (!node_fs_1.default.existsSync(filePath)) {
        node_fs_1.default.mkdirSync(filePath, { recursive: true });
    }
    const fileName = `${name.replace(/ /g, '_')}.png`;
    node_fs_1.default.writeFileSync(path_1.default.join(filePath, fileName), image);
    return fileName;
});
