import { Router } from 'express';
import UserController from './store.controller';

export const path = '/stores';
export const router = Router();

router.get('/', new UserController().list);
