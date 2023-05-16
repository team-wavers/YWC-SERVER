import { Router } from 'express';
import StoreController from './store.controller';

export const path = '/stores';
export const router = Router();

router.get('/', new StoreController().list);
router.get('/nearby', new StoreController().nearbyList);
