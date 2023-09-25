const express = require('express');
const router = express.Router();
const openai = require("../provider/openai");
const multer = require('multer');
const fs = require("fs");
const path = require("path");


try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error("uploads folder didn't exist, so we created it.");
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    }, filename(req, file, done) {
        const ext = path.extname(file.originalname);
        done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
});

// 파일 업로드를 처리할 미들웨어 생성
const upload = multer({storage: storage});

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
    const fileUpload = await openai.fineTuningFileUpload();
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

router.post('/image/edit', upload.fields([{name: 'file1'}, {name: 'file2'}]), async (req, res) => {
    if (req.files && req.body.prompt) {
        const originPicture = req.files.file1[0].path;
        const maskedPicture = req.files.file2[0].path;
        const prompt = req.body.prompt; // prompt

        const editResult = await openai.imageEdit(originPicture, maskedPicture, prompt);
        res.json({result: editResult.data});
    } else {
        res.status(400).json({error: 'File upload failed.'});
    }
});


module.exports = router;
