import { Router } from 'express';
import * as store from './store/store.router';

export const path = '/v1';
export const router = Router();

router.use(store.path, store.router);
