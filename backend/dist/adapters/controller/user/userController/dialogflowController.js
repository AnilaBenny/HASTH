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
const dialogflow_1 = require("@google-cloud/dialogflow");
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
exports.default = (dependencies) => {
    const dialogflowController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const keyFilename = path_1.default.resolve(__dirname, '../../../../adapters/controller/user/userController/hasthChatbot.json');
        const client = new dialogflow_1.SessionsClient({ keyFilename: keyFilename });
        let sessionId = req.cookies.dialogflowSessionId;
        if (!sessionId) {
            sessionId = (0, uuid_1.v4)();
            res.cookie('dialogflowSessionId', sessionId, {
                httpOnly: true,
                secure: true,
                maxAge: 24 * 60 * 60 * 1000
            });
        }
        const sessionPath = client.projectAgentSessionPath('hasth-xrkj', sessionId);
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: req.body.queryInput.text.text,
                    languageCode: 'en-US',
                },
            },
        };
        try {
            const responses = yield client.detectIntent(request);
            const result = (_a = responses[0]) === null || _a === void 0 ? void 0 : _a.queryResult;
            res.json({ fulfillmentText: result === null || result === void 0 ? void 0 : result.fulfillmentText });
        }
        catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error connecting to Dialogflow');
        }
    });
    return dialogflowController;
};
