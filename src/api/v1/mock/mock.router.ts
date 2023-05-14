import { Router } from 'express';
import MockController from './mock.controller';

export const path = '/mocks';
export const router = Router();

router.get('/stores', new MockController().storeList);
