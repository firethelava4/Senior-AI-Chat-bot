let faqDatabase = []; // Holds FAQ data after being loaded dynamically

// Function to calculate Levenshtein Distance for fuzzy matching
function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, j) => Array(a.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(matrix[j - 1][i - 1], matrix[j][i - 1], matrix[j - 1][i]) + 1;
      }
    }
  }

  return matrix[b.length][a.length];
}

// Load FAQs from JSON file
async function loadFaqs() {
  try {
    const response = await fetch("faqDatabase.json");
    faqDatabase = await response.json();
  } catch (error) {
    console.error("Failed to load FAQ database:", error);
  }
}

// Find response using improved pattern matching
function findResponse(userInput) {
  const lowerCaseInput = userInput.toLowerCase();
  let bestMatch = null;
  let bestScore = Infinity;

  for (const entry of faqDatabase) {
    for (const pattern of entry.patterns) {
      const score = levenshtein(lowerCaseInput, pattern.toLowerCase());
      if (score < bestScore) {
        bestScore = score;
        bestMatch = entry.response;
      }
    }
  }

  // Define a threshold for matching accuracy
  const accuracyThreshold = 5; // Lower is stricter, adjust as needed
  if (bestScore <= accuracyThreshold) {
    return bestMatch;
  }

  // If no good match, suggest topics
  const suggestedTopics = faqDatabase
    .filter((entry) => entry.patterns.some((pattern) => lowerCaseInput.includes(pattern.split(" ")[0])))
    .map((entry) => entry.patterns[0]);
  const suggestions = suggestedTopics.length > 0 ? `Did you mean: ${suggestedTopics.join(", ")}?` : "";

  return `I'm not sure about that. ${suggestions}`;
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

