import OpenAI from 'openai';

export default async function callchat(usermessage: string) {
    const client = new OpenAI();

    const assistant = await client.beta.assistants.create({
        name: 'Math Tutor',
        instructions:
            'You are a personal math tutor. Write and run code to answer math questions.',
        tools: [{ type: 'code_interpreter' }],
        model: 'gpt-4-turbo-preview',
    });
    const thread = await client.beta.threads.create();
    const message = await client.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: usermessage,
    });
    const run = client.beta.threads.runs
        .createAndStream(thread.id, {
            assistant_id: assistant.id,
        })
        .on('textCreated', (text) => process.stdout.write('\nassistant > ')) //수정필요
        .on(
            'textDelta',
            (textDelta, snapshot) => process.stdout.write(textDelta.value) //수정필요
        );

    //반환로직 필요
}
