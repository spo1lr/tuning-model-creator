const express = require('express');
const router = express.Router();
const openai = require("../provider/openai");

router.post('/chat/completion', async (req, res) => {
    const model = req.body.model;
    const prompt = req.body.prompt;

    const completionChat = await openai.createCompletion(model, prompt);
    console.log(completionChat.data.choices);
    console.log(completionChat.choices);

    // const message = completionChat.choices[0].message;

    return res.send('ok');
});

router.post('/chat', async (req, res) => {
    const chat = await openai.chat();
    const message = chat.choices[0].message;

    return res.json(message);
});

router.post('/fine-tuning', async (req, res) => {
    const fileUpload = await openai.fileUpload();
    return res.json(fileUpload);
});

router.post('/fine-tuning/jobs', async (req, res) => {

    const id = req.body.id;
    if (!id) return res.status(400).json({result: 'fail', message: 'Please enter your id.'});

    const fineTune = await openai.createFineTuningJob(id);
    console.log(fineTune)
    return res.json(fineTune);
});

router.post('/fine-tuning/jobs/delete', async (req, res) => {
    const model = req.body.id;
    if (!model) return res.status(400).json({result: 'fail', message: 'Please enter your model name.'});

    const fineTune = await openai.deleteFineTuningJob(model);
    console.log(fineTune)
    return res.json(fineTune);
});

router.get('/fine-tuning/jobs', async (req, res) => {
    const fineTune = await openai.FineTuningJobList();
    console.log(fineTune)
    return res.json({status: fineTune.status, message: fineTune.statusText});
});

router.post('/image', async (req, res) => {
    const prompt = req.body.prompt;
    const number = req.body.number || 1;
    if (!prompt) return res.status(400).json({result: 'fail', message: 'Please enter prompt.'});

    const response = await openai.createImage(prompt, number);
    console.log(response);
    return res.json(response);
});


module.exports = router;
