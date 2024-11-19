// Predefined database of FAQs with patterns for matching
const faqDatabase = [
  {
    patterns: ["hello", "hi", "hey"],
    response: "Hello! How can I assist you in avoiding scams today?",
  },
  {
    patterns: ["phishing", "email scam"],
    response:
      "Phishing scams often involve fake emails pretending to be from trusted sources. Never click on links or provide sensitive info without verifying the sender.",
  },
  {
    patterns: ["phone call", "phone scam"],
    response:
      "Be cautious of unsolicited calls asking for payments or personal details. Verify their identity before proceeding.",
  },
  {
    patterns: ["too good to be true", "fake offers"],
    response:
      "If an offer sounds too good to be true, it probably is! Research thoroughly before committing.",
  },
  {
    patterns: ["identity theft", "personal information"],
    response:
      "To prevent identity theft, use strong passwords, avoid sharing sensitive details, and monitor your accounts regularly.",
  },
  {
    patterns: ["suspicious", "unfamiliar email"],
    response:
      "Avoid interacting with unfamiliar emails. Check for poor grammar or odd links, and don't download unexpected attachments.",
  },
];

// Function to match user input to a response
function findResponse(userInput) {
  const lowerCaseInput = userInput.toLowerCase();

  for (const entry of faqDatabase) {
    if (entry.patterns.some((pattern) => lowerCaseInput.includes(pattern))) {
      return entry.response;
    }
  }

  // Default response if no match is found
  return "I'm not sure about that. Could you provide more details?";
}

// DOM elements
const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-message");
const sendButton = document.getElementById("send-button");

// Function to append messages to chat
function appendMessage(content, className) {
  const message = document.createElement("div");
  message.className = `chat-message ${className}`;
  message.textContent = content;
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Event listener for the send button
sendButton.addEventListener("click", () => {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    appendMessage(userMessage, "user");

    // Get bot response and add to chat
    const botResponse = findResponse(userMessage);
    appendMessage(botResponse, "bot");

    // Clear user input
    userInput.value = "";
  }
});
