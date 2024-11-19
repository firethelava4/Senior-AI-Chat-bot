let faqDatabase = []; // Holds FAQ data after being loaded dynamically

// Load FAQs from JSON file
async function loadFaqs() {
  try {
    const response = await fetch("faqDatabase.json");
    faqDatabase = await response.json();
    console.log("FAQ Database Loaded:", faqDatabase); // Debugging log
  } catch (error) {
    console.error("Failed to load FAQ database:", error);
  }
}

// Tokenize input into words
function tokenize(input) {
  return input.toLowerCase().split(/\W+/).filter(Boolean); // Split by non-word characters
}

// Find the best response using keyword matching
function findResponse(userInput) {
  const tokens = tokenize(userInput); // Tokenize the user input
  console.log("User Input Tokens:", tokens); // Debugging log

  let bestMatch = null;
  let highestScore = 0;

  // Iterate over the FAQ database to score matches
  for (const entry of faqDatabase) {
    let matchScore = 0;

    for (const pattern of entry.patterns) {
      const patternTokens = tokenize(pattern); // Tokenize the pattern
      const matches = patternTokens.filter((token) => tokens.includes(token));
      matchScore += matches.length; // Increase score for each match
    }

    console.log(`Pattern: ${entry.patterns}, Score: ${matchScore}`); // Debugging log

    // Update best match if the score is higher
    if (matchScore > highestScore) {
      highestScore = matchScore;
      bestMatch = entry.response;
    }
  }

  // Return the best match if a significant score is found
  if (highestScore > 0) {
    console.log("Best Match Found:", bestMatch); // Debugging log
    return bestMatch;
  }

  console.log("No Significant Match Found"); // Debugging log
  return "I'm not sure about that. Could you provide more details?";
}

// Save chat history to localStorage
function saveChatHistory() {
  const chatLogContent = document.getElementById("chat-log").innerHTML;
  localStorage.setItem("chatHistory", chatLogContent);
}

// Load chat history from localStorage
function loadChatHistory() {
  const savedChatHistory = localStorage.getItem("chatHistory");
  if (savedChatHistory) {
    document.getElementById("chat-log").innerHTML = savedChatHistory;
  }
}

// Append messages to the chat log
function appendMessage(content, className) {
  const message = document.createElement("div");
  message.className = `chat-message ${className}`;
  message.textContent = content;
  document.getElementById("chat-log").appendChild(message);
  document.getElementById("chat-log").scrollTop = document.getElementById("chat-log").scrollHeight;

  saveChatHistory(); // Save after every message
}

// Handle user input
document.getElementById("send-button").addEventListener("click", async () => {
  const userInput = document.getElementById("user-message").value.trim();
  if (userInput) {
    appendMessage(userInput, "user");

    // Ensure FAQs are loaded before searching for a response
    if (faqDatabase.length === 0) {
      await loadFaqs();
    }

    const botResponse = findResponse(userInput);
    appendMessage(botResponse, "bot");

    document.getElementById("user-message").value = "";
  }
});

// Initialize chatbot
document.addEventListener("DOMContentLoaded", async () => {
  await loadFaqs();
  loadChatHistory();
});

