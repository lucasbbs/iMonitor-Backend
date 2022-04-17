"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClassesController_1 = __importDefault(require("./controllers/ClassesController"));
const ConnectionsController_1 = __importDefault(require("./controllers/ConnectionsController"));
const UserController_1 = __importDefault(require("./controllers/UserController"));
const SubjectsController_1 = __importDefault(require("./controllers/SubjectsController"));
const routes = (0, express_1.Router)();
const classesController = new ClassesController_1.default();
const connectionsController = new ConnectionsController_1.default();
const userController = new UserController_1.default();
const subjectsController = new SubjectsController_1.default();
routes.get('/classes', classesController.index);
routes.post('/classes', classesController.create);
routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);
routes.post('/users/auth', userController.auth);
routes.post('/users', userController.create);
routes.put('/users/:user_id', userController.update);
routes.get('/subjects', subjectsController.index);
routes.post('/subjects', subjectsController.create);
exports.default = routes;