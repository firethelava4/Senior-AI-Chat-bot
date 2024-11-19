const dictionary = {
  "phishing": {
    definition: "A type of cyberattack where attackers impersonate legitimate organizations to trick individuals into providing sensitive information.",
    example: "Example: An attacker sends an email that looks like it's from your bank, asking you to verify your account details."
  },
  "malware": {
    definition: "Malicious software designed to harm, exploit, or otherwise compromise a computer system.",
    example: "Example: A virus that encrypts your files and demands a ransom to unlock them."
  },
  "ransomware": {
    definition: "A type of malware that encrypts a victim's files and demands payment to restore access.",
    example: "Example: A hospital's database is locked by attackers who demand a ransom for the decryption key."
  },
  "social engineering": {
    definition: "Manipulating people into divulging confidential information or performing actions that compromise security.",
    example: "Example: An attacker calls pretending to be IT support, asking for your password to fix a fake issue."
  },
  "firewall": {
    definition: "A network security system that monitors and controls incoming and outgoing network traffic.",
    example: "Example: A firewall blocks unauthorized access to your computer while allowing legitimate traffic."
  },
  "encryption": {
    definition: "The process of converting data into a coded format to prevent unauthorized access.",
    example: "Example: Messages sent over WhatsApp are encrypted to ensure only the sender and receiver can read them."
  },
  "deepfake": {
    definition: "A media technology that uses AI to create highly realistic fake videos or audio.",
    example: "Example: A fake video showing a politician saying something they never actually said."
  },
  "adware": {
    definition: "Software that automatically displays or downloads advertisements, often without the user's consent.",
    example: "Example: A program that opens pop-up ads every time you open your browser."
  },
  "backdoor": {
    definition: "A method of bypassing normal authentication to access a system or network.",
    example: "Example: An attacker installs a backdoor on your server to access it remotely whenever they want."
  },
  "catfishing": {
    definition: "The act of creating a fake online identity to deceive others.",
    example: "Example: Someone pretends to be a wealthy individual to scam victims out of money on dating apps."
  },
  "cookie": {
    definition: "A small piece of data stored on your computer by a website to track your online activities.",
    example: "Example: A website uses cookies to remember your login information and preferences."
  },
  "cryptojacking": {
    definition: "The unauthorized use of someone's computer to mine cryptocurrency.",
    example: "Example: A malicious script runs in the background of your browser, using your computer's resources to mine Bitcoin."
  },
  "hacker": {
    definition: "An individual skilled in using computers to gain unauthorized access to systems or networks.",
    example: "Example: A hacker breaches a company's database to steal sensitive customer information."
  },
  "scamming": {
    definition: "Fraudulent schemes designed to deceive individuals into giving away money or personal information.",
    example: "Example: An email claims you've won a lottery and asks for your bank details to transfer the prize."
  }
};


let suggestedWord = null;

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("dictionary-screen").classList.remove("hidden");
});

function showSuggestions() {
  const input = document.getElementById("term-input").value.toLowerCase();
  const suggestionsDiv = document.getElementById("suggestions");
  const output = document.getElementById("output");
  const definition = document.getElementById("definition");
  const example = document.getElementById("example");
  const buttons = document.getElementById("buttons");

  suggestionsDiv.innerHTML = "";
  definition.textContent = "";
  example.textContent = "";
  buttons.innerHTML = "";

  if (!input) return;

  const matches = Object.keys(dictionary).filter((term) =>
    term.includes(input)
  );

  matches.slice(0, 3).forEach((term) => {
    const suggestion = document.createElement("div");
    suggestion.textContent = term;
    suggestion.onclick = () => defineTerm(term);
    suggestionsDiv.appendChild(suggestion);
  });

  if (!dictionary[input]) {
    const closestMatch = findClosestMatch(input);
    if (closestMatch) {
      suggestedWord = closestMatch;
      definition.textContent = `Did you mean "${closestMatch}"?`;
      createYesNoButtons();
    }
    return;
  }

  suggestedWord = null;
  defineTerm(input);
}

function defineTerm(term) {
  const output = dictionary[term];
  document.getElementById("definition").textContent = `Definition: ${output.definition}`;
  document.getElementById("example").textContent = `Example: ${output.example}`;
  document.getElementById("term-input").value = term;
  document.getElementById("suggestions").innerHTML = "";
}

function teachMe() {
  const terms = Object.keys(dictionary);
  const randomTerm = terms[Math.floor(Math.random() * terms.length)];
  defineTerm(randomTerm);
}

function findClosestMatch(input) {
  const words = Object.keys(dictionary);
  let closest = null;
  let shortestDistance = Infinity;

  words.forEach((word) => {
    const distance = levenshteinDistance(input, word);
    if (distance < shortestDistance && distance <= 2) {
      closest = word;
      shortestDistance = distance;
    }
  });

  return closest;
}

function createYesNoButtons() {
  const buttonsDiv = document.getElementById("buttons");
  const yesButton = document.createElement("button");
  yesButton.textContent = "Yes";
  yesButton.onclick = () => defineTerm(suggestedWord);

  const noButton = document.createElement("button");
  noButton.textContent = "No";
  noButton.onclick = resetGreeting;

  buttonsDiv.appendChild(yesButton);
  buttonsDiv.appendChild(noButton);
}

function resetGreeting() {
  document.getElementById("definition").textContent = "Type a term to learn more!";
  document.getElementById("example").textContent = "";
  document.getElementById("buttons").innerHTML = "";
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

