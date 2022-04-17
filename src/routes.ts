import { Router } from 'express';

import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';
import UserController from './controllers/UserController';
import SubjectsController from './controllers/SubjectsController';

const routes = Router();

const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

const userController = new UserController();
const subjectsController = new SubjectsController();

routes.get('/classes', classesController.index);
routes.post('/classes', classesController.create);

routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);

routes.post('/users/auth', userController.auth);
routes.post('/users', userController.create);
routes.put('/users/:user_id', userController.update);

routes.get('/subjects', subjectsController.index);
routes.post('/subjects', subjectsController.create);

export default routes;
