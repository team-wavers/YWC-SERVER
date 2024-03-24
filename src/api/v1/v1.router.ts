import { Router } from 'express';
import * as store from './store/store.router';
import * as mock from './mock/mock.router';
import * as auth from './auth/auth.router';
import * as chatbot from './chatbot/chatbot.router';
import * as rank from './rank/rank.router';

export const path = '/v1';
export const router = Router();

router.use(store.path, store.router);
router.use(mock.path, mock.router);
router.use(auth.path, auth.router);
router.use(chatbot.path, chatbot.router);
router.use(rank.path, rank.router);
