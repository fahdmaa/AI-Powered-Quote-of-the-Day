// DOM Elements
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');
const saveFavoriteBtn = document.getElementById('save-favorite-btn');
const showFavoritesBtn = document.getElementById('show-favorites-btn');
const clearFavoritesBtn = document.getElementById('clear-favorites-btn');
const favoritesList = document.getElementById('favorites-list');
const favoritesSection = document.querySelector('.favorites-section');

// Modal Elements
const modal = document.getElementById('custom-modal');
const modalMessage = document.getElementById('modal-message');
const modalConfirmBtn = document.getElementById('modal-confirm-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');

let onConfirmCallback = null;

// --- API and Core Functions ---

async function getQuote() {
  const apiUrl = 'https://api.api-ninjas.com/v1/quotes';
  const apiKey = 'D6gdfnjzjvUtwiotDT0Dbw==ewi5iGdgGP7mwSXY';
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-Api-Key': apiKey
      }
    });
    const data = await response.json();
    displayQuote(data);
  } catch (error) {
    console.error('Whoops, no quote', error);
  }
}

function displayQuote(quotes) {
  const quote = quotes[0];
  quoteText.textContent = quote.quote;

  if (quote.author === null || quote.author === '') {
    quoteAuthor.textContent = 'Unknown';
  } else {
    quoteAuthor.textContent = quote.author;
  }
}

function saveFavorite() {
  const favorites = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
  const currentQuoteText = quoteText.textContent;

  const isDuplicate = favorites.some(fav => fav.quote === currentQuoteText);

  if (isDuplicate) {
    showModal('This quote is already in your favorites!');
    return;
  }

  const currentQuote = {
    quote: currentQuoteText,
    author: quoteAuthor.textContent
  };
  favorites.push(currentQuote);
  localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
  displayFavorites();
}

function displayFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
  favoritesList.innerHTML = ''; // Clear the list first
  favorites.forEach(fav => {
    const li = document.createElement('li');
    li.textContent = `"${fav.quote}" - ${fav.author}`;
    favoritesList.appendChild(li);
  });
}

function clearFavorites() {
  showModal('Are you sure you want to clear all your favorites?', () => {
    localStorage.removeItem('favoriteQuotes');
    displayFavorites();
  });
}

// --- Modal Logic ---

function showModal(message, confirmCallback) {
  modalMessage.textContent = message;
  onConfirmCallback = confirmCallback;

  if (confirmCallback) {
    modalCancelBtn.style.display = 'inline-block';
    modalConfirmBtn.textContent = 'Confirm';
  } else {
    // Alert mode
    modalCancelBtn.style.display = 'none';
    modalConfirmBtn.textContent = 'OK';
  }

  modal.classList.add('active');
}

function hideModal() {
  modal.classList.remove('active');
  onConfirmCallback = null; // Reset callback
}


// --- Event Listeners ---

newQuoteBtn.addEventListener('click', getQuote);
saveFavoriteBtn.addEventListener('click', saveFavorite);
clearFavoritesBtn.addEventListener('click', clearFavorites);

showFavoritesBtn.addEventListener('click', () => {
  favoritesSection.classList.toggle('show');
  if (favoritesSection.classList.contains('show')) {
    showFavoritesBtn.textContent = 'Hide Favorites';
  } else {
    showFavoritesBtn.textContent = 'Show Favorites';
  }
});

modalConfirmBtn.addEventListener('click', () => {
  if (onConfirmCallback) {
    onConfirmCallback();
  }
  hideModal();
});

modalCancelBtn.addEventListener('click', hideModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        hideModal();
    }
});


// --- On load ---
getQuote();
displayFavorites();
