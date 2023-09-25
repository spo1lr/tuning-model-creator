const OpenAI = require('openai');
const fs = require("fs");
const axios = require("axios");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function chat(modelName = '') {
    const model = modelName || 'gpt-3.5-turbo';
    const messages = [{role: 'user', content: 'hello'}];

    return openai.chat.completions.create({model, messages});
}

async function createCompletion(model = '', prompt = '') {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        };

        const data = {
            model,
            messages: [
                {
                    "role": "user",
                    "content": `${prompt}`
                }
            ]
        };
        return await axios.post('https://api.openai.com/v1/chat/completions', data, {headers});
    } catch (error) {
        console.error('Error:', error.response.data);
    }
}

async function fineTuningFileUpload() {
    return openai.files.create({
        file: fs.createReadStream(process.env.DATA_SET_PATH + '/test.jsonl'),
        purpose: 'fine-tune'
    });
}

async function createFineTuningJob(trainingFile = '') {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        };

        const data = {
            "training_file": `${trainingFile}`,
            "model": 'gpt-3.5-turbo-0613'
        };
        return await axios.post('https://api.openai.com/v1/fine_tuning/jobs', data, {headers});
    } catch (error) {
        console.error('Error:', error.response.data);
    }
}

async function deleteFineTuningJob(model = '') {
    return openai.fineTunes.cancel(model);
}

async function fineTuningJobList() {
    return openai.fineTunes.list();
}

async function createImage(prompt = '', number = 1) {
    return openai.images.generate({prompt, n: number});
}

async function imageEdit(originPicture, maskedPicture, prompt = '') {
    try {
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        };
        const data = {
            image: fs.createReadStream(originPicture),
            mask: fs.createReadStream(maskedPicture),
            prompt,
        };
        return await axios.post('https://api.openai.com/v1/images/edits', data, {headers});
    } catch (error) {
        console.error('Error:', error.response.data);
    }
}

module.exports = {
    chat,
    fineTuningFileUpload,
    createFineTuningJob,
    FineTuningJobList: fineTuningJobList,
    deleteFineTuningJob,
    createCompletion,
    createImage,
    imageEdit
}