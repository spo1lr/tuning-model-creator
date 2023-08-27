const express = require('express');
const router = express.Router();
const openai = require("../provider/openai");

router.post('/', async (req, res) => {
    const chat = await openai.chat();
    const message = chat.choices[0].message;
    return res.json(message);
});

module.exports = router;
