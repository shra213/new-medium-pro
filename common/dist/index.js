"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostInput = exports.signinInput = exports.signupInput = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupInput = zod_1.default.object({
    name: zod_1.default.string(),
    otp: zod_1.default
        .number()
        .int()
        .refine((val) => val >= 1000 && val < 9999, {
        message: "Must be a 4-digit number",
    }),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6, "min 6 letter required"),
});
exports.signinInput = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6, "min 6 letter required"),
});
exports.createPostInput = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.string(),
});
