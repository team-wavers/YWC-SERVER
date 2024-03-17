import OpenAI from 'openai';
import env from '../env';

export default async function callchat(usermessage: string) {
    const client = new OpenAI({ apiKey: env.app.gptapi.key });
    let msgResponse = '';

    const assistant = await client.beta.assistants.retrieve(
        'asst_FPg6Rlt9WKrgjROV07Du4joO'
    );
    const thread = await client.beta.threads.create();
    const message = await client.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: usermessage,
    });
    //작업생성 확인필요
    let run = await client.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
    });
    while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
        run = await client.beta.threads.runs.retrieve(run.thread_id, run.id);
    }
    if (run.status === 'completed') {
        const messages = await client.beta.threads.messages.list(run.thread_id);
        for (const message of messages.data.reverse()) {
            // console.log(`${message.role} > ${message.content[0].text.value}`);
        }
    } else {
        console.log(run.status);
    }

    //반환로직 필요
    return msgResponse;
}
