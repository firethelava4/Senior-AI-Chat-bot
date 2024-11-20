// Fetch the dictionary JSON
let dictionary = {};

fetch('dictionary.json')
  .then(response => response.json())
  .then(data => {
    dictionary = data;
    console.log('Dictionary loaded:', dictionary);
  })
  .catch(error => console.error('Error loading dictionary:', error));

// DOM Elements
const searchInput = document.getElementById('search-bar');
const output = document.getElementById('output');
const suggestions = document.getElementById('suggestions');
const teachMeButton = document.getElementById('teach-me');
const startScreen = document.getElementById('start-screen');
const dictionaryContainer = document.getElementById('dictionary-container');
const startButton = document.getElementById('start-button');

// Event listener for the search bar
searchInput.addEventListener('input', handleInput);

// Event listener for the teach-me button
teachMeButton.addEventListener('click', teachRandomWord);

// Event listener for the start button
startButton.addEventListener('click', openDictionary);

// Handle user input in the search bar
function handleInput() {
  const userInput = searchInput.value.trim().toLowerCase();
  suggestions.innerHTML = '';

  if (!userInput) {
    output.innerHTML = '';
    return;
  }

  const matchingTerms = Object.keys(dictionary).filter(term =>
    term.startsWith(userInput)
  );

  if (matchingTerms.length === 0) {
    const possibleTerms = Object.keys(dictionary).slice(0, 3);
    suggestions.innerHTML = `
      <p>Did you mean:</p>
      <div>
        ${possibleTerms
          .map(
            term => `<button onclick="autofillSuggestion('${term}')">${term}</button>`
          )
          .join(' ')}
      </div>
    `;
  } else if (matchingTerms.length === 1 && matchingTerms[0] === userInput) {
    displayResult(userInput);
  } else {
    const limitedSuggestions = matchingTerms.slice(0, 3);
    suggestions.innerHTML = `
      <p>Did you mean:</p>
      <div>
        ${limitedSuggestions
          .map(
            term => `<button onclick="autofillSuggestion('${term}')">${term}</button>`
          )
          .join(' ')}
      </div>
    `;
  }
}

// Autofill the suggestion and display the result
function autofillSuggestion(term) {
  searchInput.value = term;
  displayResult(term);
  suggestions.innerHTML = '';
}

// Display the result in the output area
function displayResult(term) {
  const definition = dictionary[term]?.definition;
  const example = dictionary[term]?.example;
  const avoidance = dictionary[term]?.avoidance;

  if (definition && example) {
    let outputHTML = `
      <p><strong>Definition:</strong> ${definition}</p>
      <p><strong>Example:</strong> ${example}</p>
    `;

    if (avoidance) {
      outputHTML += `<p><strong>How to Avoid:</strong> ${avoidance}</p>`;
    }

    output.innerHTML = outputHTML;
  } else {
    output.innerHTML = `<p>Sorry, we couldn't find that term.</p>`;
  }
}

// Teach a random word from the dictionary
function teachRandomWord() {
  const terms = Object.keys(dictionary);
  if (terms.length === 0) {
    output.innerHTML = `<p>Loading dictionary...</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * terms.length);
  const randomTerm = terms[randomIndex];
  displayResult(randomTerm);
}

// Open the dictionary from the start screen
function openDictionary() {
  startScreen.style.display = 'none';
  dictionaryContainer.style.display = 'block';
}


