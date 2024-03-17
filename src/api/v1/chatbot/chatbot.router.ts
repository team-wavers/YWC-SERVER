import { Router } from 'express';
import ChatbotController from './chatbot.controller';

export const path = '/chatbot';
export const router = Router();

router.post('/', new ChatbotController().message);
