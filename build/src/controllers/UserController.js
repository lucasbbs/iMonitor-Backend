"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = require("jsonwebtoken");
const connection_1 = __importDefault(require("../database/connection"));
class UserController {
    async auth(request, response) {
        const { email, password } = request.body;
        const user = await (0, connection_1.default)('users').where({ email });
        if (!user) {
            return response.status(401).json('Invalid email or password');
        }
        if (bcryptjs_1.default.compareSync(password, user[0].password)) {
            const token = (0, jsonwebtoken_1.sign)({}, '2e247e2eb505c42b362e80ed4d05b078', {
                subject: String(user[0].id),
                expiresIn: '1d',
            });
            return response.json({
                token,
                user: {
                    id: user[0].id,
                    name: user[0].name,
                    avatar: user[0].avatar,
                    whatsapp: user[0].whatsapp,
                    bio: user[0].bio,
                    email: user[0].email,
                    isMonitor: user[0].isMonitor,
                },
            });
        }
        return response.status(401).json('Invalid email or password');
    }
    async create(request, response) {
        const { name, avatar, whatsapp, bio, email, password } = request.body;
        if (!name || !whatsapp || !bio || !email || !password) {
            return response
                .status(400)
                .json({ message: 'All required fields must be informed' });
        }
        const user = await (0, connection_1.default)('users').where({ email });
        if (user.length) {
            return response.status(400).json({ message: 'User already exists' });
        }
        if (password && password.trim().length < 6) {
            return response
                .status(400)
                .json({ message: 'Your password must be at least 6 characters long' });
        }
        await (0, connection_1.default)('users').insert({
            name,
            avatar,
            whatsapp,
            bio,
            email,
            password: bcryptjs_1.default.hashSync(password, 10),
        });
        return response.status(201).send();
    }
    async update(request, response) {
        const { user_id } = request.params;
        const { name, avatar, whatsapp, bio, email, password } = request.body;
        if (!name || !whatsapp || !bio) {
            return response
                .status(400)
                .json({ message: 'All required fields must be informed' });
        }
        if (password && password.trim().length < 6) {
            return response
                .status(400)
                .json({ message: 'Your password must be at least 6 characters long' });
        }
        if (password) {
            await (0, connection_1.default)('users')
                .where({ id: user_id })
                .update({
                name,
                avatar,
                whatsapp,
                bio,
                password: bcryptjs_1.default.hashSync(password, 10),
            });
        }
        else {
            await (0, connection_1.default)('users').where({ id: user_id }).update({
                name,
                avatar,
                whatsapp,
                bio,
            });
        }
        return response.status(200).send();
    }
}
exports.default = UserController;
