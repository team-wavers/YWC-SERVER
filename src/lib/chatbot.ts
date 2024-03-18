import OpenAI from 'openai';
import env from '../env';

export default async function callchat(usermessage: string) {
    const client = new OpenAI({ apiKey: env.app.gptapi.key });
    let msgResponse = '';

    const thread = await client.beta.threads.create();
    const message = await client.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: usermessage,
    });
    //작업생성 확인필요
    let run = await client.beta.threads.runs.create(thread.id, {
        assistant_id: env.app.gptapi.assistant_id,
    });
    while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
        run = await client.beta.threads.runs.retrieve(run.thread_id, run.id);
    }
    const results = [];
    if (run.status === 'completed') {
        const messages = await client.beta.threads.messages.list(run.thread_id);
        for (const message of messages.data) {
            if (message.role === 'user') {
                break;
            }
            results.push(message);
        }
    } else {
        console.log(run.status);
    }
    const text = results
        .reverse()
        .map((result) => result.content[0].text.value)
        .join('\n');

    return text;
}
