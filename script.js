let faqDatabase = []; // Holds FAQ data after being loaded dynamically

// Load FAQs from JSON file
async function loadFaqs() {
  try {
    const response = await fetch("faqDatabase.json");
    faqDatabase = await response.json();
  } catch (error) {
    console.error("Failed to load FAQ database:", error);
  }
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

// Find response using dynamic FAQ data
function findResponse(userInput) {
  const lowerCaseInput = userInput.toLowerCase();

  for (const entry of faqDatabase) {
    if (entry.patterns.some((pattern) => lowerCaseInput.includes(pattern))) {
      return entry.response;
    }
  }

  return "I'm not sure about that. Could you provide more details?";
}

// Append messages to the chat log
function appendMessage(content, className) {
  const message = document.createElement("div");
  message.className = `chat-message ${className}`;
  message.textContent = content;
  document.getElementById("chat-log").appendChild(message);
  document.getElementById("chat-log").scrollTop = document.getElementById("chat-log").scrollHeight;

  // Save to localStorage after every message
  saveChatHistory();
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

// Initialize the chatbot
document.addEventListener("DOMContentLoaded", async () => {
  // Load FAQs and chat history on page load
  await loadFaqs();
  loadChatHistory();
});
