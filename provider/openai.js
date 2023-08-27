const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function chat() {
    return openai.chat.completions.create({
        messages: [{role: 'user', 'content': '안녕하세요.'}],
        model: 'gpt-3.5-turbo'
    });
}


module.exports = {chat}