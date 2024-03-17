import callchat from 'src/lib/chatbot';

export default class ChatbotService {
    message = async (message: string) => {
        const response = await callchat(message);
        return {
            message: "Hello, I'm a chatbot!",
        };
    };
}
