const dictionary = {
  "phishing": {
    definition: "A type of cyberattack where attackers pretend to be a trustworthy entity to steal sensitive information.",
    example: "Example: An attacker sends an email pretending to be your bank, asking for your login details."
  },
  "malware": {
    definition: "Malicious software designed to disrupt, damage, or gain unauthorized access to systems.",
    example: "Example: A virus that encrypts your files and demands payment to unlock them is a type of malware."
  },
  "firewall": {
    definition: "A network security device or software that monitors and filters incoming and outgoing traffic based on security rules.",
    example: "Example: A company uses a firewall to block access to malicious websites."
  },
  "ransomware": {
    definition: "A type of malware that encrypts a victim's data and demands payment for the decryption key.",
    example: "Example: An attacker encrypts your personal files and asks for $500 to unlock them."
  },
  "encryption": {
    definition: "The process of converting data into a coded form to prevent unauthorized access.",
    example: "Example: Emails can be encrypted so only the recipient can read them."
  },
  "scamming": {
    definition: "The act of deceiving someone to gain money, information, or other benefits through fraudulent means.",
    example: "Example: A scammer pretends to be a technical support representative and tricks you into paying for fake services."
  },
  "deepfake": {
    definition: "A synthetic media technology that uses AI to create convincing fake videos or images of real people.",
    example: "Example: A deepfake video might show a celebrity saying something they never actually said."
  },
  "adware": {
    definition: "Software that displays unwanted advertisements on your device, often bundled with legitimate software.",
    example: "Example: Adware might show pop-up ads in your browser after you install a free game."
  },
  "backdoor": {
    definition: "A hidden method for bypassing normal authentication or security in a system, often used by attackers.",
    example: "Example: An attacker installs a backdoor to access a company's server without detection."
  },
  "catfishing": {
    definition: "The act of creating a fake online identity to deceive others, often for fraudulent purposes.",
    example: "Example: Someone pretending to be a friend on social media to extract personal details is catfishing."
  },
  "cookie": {
    definition: "A small piece of data stored on a user's device by a website to remember information about the user.",
    example: "Example: A website uses cookies to keep you logged in or remember your shopping cart items."
  },
  "cryptojacking": {
    definition: "Unauthorized use of someone's device to mine cryptocurrency without their consent.",
    example: "Example: A malicious website runs cryptojacking scripts in your browser, slowing down your device."
  },
  "hacker": {
    definition: "An individual who uses technical skills to gain unauthorized access to systems or data.",
    example: "Example: A hacker breaks into a company's network to steal confidential information."
  }
};

let suggestedWord = null;

function showSuggestions() {
  const input = document.getElementById("term-input").value.toLowerCase();
  const suggestions = document.getElementById("suggestions");
  const output = document.getElementById("output");
  const definition = document.getElementById("definition");
  const example = document.getElementById("example");

  // Clear previous output
  suggestions.innerHTML = "";
  definition.textContent = "";
  example.textContent = "";

  if (input === "teach me") {
    teachMe();
    return;
  }

  if (!dictionary[input]) {
    const closestMatch = findClosestMatch(input);
    if (closestMatch) {
      suggestedWord = closestMatch;
      definition.textContent = `Did you mean "${closestMatch}"? Type "yes" or "no".`;
      example.textContent = "";
    } else {
      definition.textContent = "Sorry, I couldn't find that term in my database.";
      example.textContent = "";
    }
    return;
  }

  // If the word is found in the dictionary
  suggestedWord = null;
  defineTerm(input);
}

function defineTerm(term) {
  const output = dictionary[term];
  document.getElementById("definition").textContent = `Definition: ${output.definition}`;
  document.getElementById("example").textContent = `Example: ${output.example}`;
  document.getElementById("suggestions").style.display = "none";
}

function findClosestMatch(input) {
  const words = Object.keys(dictionary);
  let closest = null;
  let shortestDistance = Infinity;

  words.forEach((word) => {
    const distance = levenshteinDistance(input, word);
    if (distance < shortestDistance && distance <= 2) { // Allow a max distance of 2
      closest = word;
      shortestDistance = distance;
    }
  });

  return closest;
}

function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function handleResponse(input) {
  if (input === "yes" && suggestedWord) {
    defineTerm(suggestedWord);
  } else if (input === "no") {
    resetGreeting();
  } else {
    showSuggestions();
  }
}

function resetGreeting() {
  document.getElementById("definition").textContent =
    "Hello! Type a cybersecurity term to get started.";
  document.getElementById("example").textContent = "";
}

function teachMe() {
  const terms = Object.keys(dictionary);
  const randomTerm = terms[Math.floor(Math.random() * terms.length)];
  defineTerm(randomTerm);
}


