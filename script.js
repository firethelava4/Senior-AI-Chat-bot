// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const PORT = 3000;

// Configure OpenAI with API key from environment variables
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // API key is securely loaded from .env
});
const openai = new OpenAIApi(configuration);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body; // Extract user message
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const aiResponse = await openai.createChatCompletion({
      model: "gpt-4", // Use GPT-4 for better responses
      messages: [
        { role: "system", content: "You are a helpful assistant specialized in scams and fraud prevention." },
        { role: "user", content: message },
      ],
      max_tokens: 300, // Limit response length
      temperature: 0.7, // Adjust creativity
    });

    const reply = aiResponse.data.choices[0].message.content.trim();
    res.json({ reply }); // Return the AI-generated response to the frontend
  } catch (error) {
    console.error("Error communicating with OpenAI:", error.message);
    res.status(500).json({ error: "Failed to generate a response." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

