const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());

// Setup Gemini AI API keys
const GEMINI_API_KEY =AIzaSyAYXiJs58dhSv0fp4G82Lyo7BgGRpD_3sE process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://api.gemini.ai/v1/chat';  // Chat API endpoint
const GEMINI_IMAGE_URL = 'https://api.gemini.ai/v1/generate-image';  // Image generation endpoint

// Route to handle messages from Omni AI Assistant (chat)
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).send({ error: 'No message provided' });
    }

    try {
        // Send message to Gemini AI
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GEMINI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();

        if (data && data.response) {
            res.send({ reply: data.response });
        } else {
            res.status(500).send({ error: 'Error processing message' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error communicating with Gemini AI' });
    }
});

// Route to handle image generation
app.post('/generate-image', async (req, res) => {
    const prompt = req.body.prompt;

    if (!prompt) {
        return res.status(400).send({ error: "No prompt provided" });
    }

    try {
        const response = await fetch(GEMINI_IMAGE_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GEMINI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,  // Pass the text prompt to Gemini AI
                n: 1,             // Number of images to generate
                size: '1024x1024' // Image size
            }),
        });

        const data = await response.json();

        if (data && data.image_url) {
            res.send({ imageUrl: data.image_url });
        } else {
            res.status(500).send({ error: 'Error generating image' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error communicating with Gemini AI' });
    }
});

// Task management (Basic Example)
let tasks = [];

app.post('/tasks', (req, res) => {
    const task = req.body.task;
    if (!task) return res.status(400).send({ error: 'Task is required' });

    tasks.push(task);
    res.send({ tasks });
});

app.get('/tasks', (req, res) => {
    res.send({ tasks });
});

// Start the server
app.listen(3000, () => {
    console.log('Omni Assistant server is running on port 3000');
});
