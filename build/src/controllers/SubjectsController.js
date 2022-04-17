"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
class SubjectsController {
    async index(request, response) {
        const subjects = await (0, connection_1.default)('subjects');
        response.json({ subjects });
    }
    async create(request, response) {
        const { subject } = request.body;
        await (0, connection_1.default)('subjects').insert({ subject });
        response.send();
    }
}
exports.default = SubjectsController;
