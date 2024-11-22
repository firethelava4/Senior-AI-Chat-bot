let dictionary = {};

fetch('dictionary.json')
  .then(response => response.json())
  .then(data => {
    dictionary = data;
    console.log('Dictionary loaded:', dictionary);
  })
  .catch(error => console.error('Error loading dictionary:', error));

// Function to display the result
function displayResult(term) {
  const definition = dictionary[term]?.definition;
  const example = dictionary[term]?.example;
  const avoidance = dictionary[term]?.avoidance;

  if (definition && example) {
    let outputHTML = `
      <p><strong>Definition:</strong> ${definition}</p>
      <p><strong>Example:</strong> ${example}</p>
    `;

    // Add avoidance tips if available
    if (avoidance) {
      outputHTML += `
        <p><strong>How to Avoid:</strong> ${avoidance}</p>
      `;
    }

    output.innerHTML = outputHTML;
  } else {
    output.innerHTML = "<p>Sorry, we couldn't find that term.</p>";
  }
}


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
  const avoidance = document.getElementById("avoidance");
  const buttons = document.getElementById("buttons");

  suggestionsDiv.innerHTML = "";
  definition.textContent = "";
  example.textContent = "";
  avoidance.textContent = "";
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
  document.getElementById("avoidance").textContent = `Example: ${output.example}`;
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
   document.getElementById("avoidance").innerHTML = "";
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


