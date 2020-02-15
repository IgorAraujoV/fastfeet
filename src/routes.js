import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

import auth from './app/middlewares/auth';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.use(auth);

routes.post('/recipients', RecipientController.store);

export default routes;
