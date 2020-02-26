import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliveryManController from './app/controllers/DeliveryManController';

import auth from './app/middlewares/auth';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';
import OrderProblemsController from './app/controllers/OrderProblemsController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store);

routes.use(auth);

routes.post('/recipients', RecipientController.store);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/deliveryman/', DeliveryManController.index);
routes.post('/deliveryman', DeliveryManController.store);
routes.put('/deliveryman/:id', DeliveryManController.update);
routes.delete('/deliveryman/:id', DeliveryManController.delete);

routes.post('/orders', OrderController.store);
routes.get('/orders/problems', OrderController.index);
routes.delete('/orders/:id', OrderController.delete);

routes.get('/orders/:id/deliveries', DeliveryController.index);
routes.post('/orders/:id/start', DeliveryController.store);
routes.delete(
  '/orders/:id/finish',
  upload.single('file'),
  DeliveryController.delete
);

routes.post('/orders/:id/problems', OrderProblemsController.store);
routes.get('/orders/:id/problems', OrderProblemsController.index);
routes.delete('/problem/:id/cancel-delivery', OrderProblemsController.delete);

export default routes;
