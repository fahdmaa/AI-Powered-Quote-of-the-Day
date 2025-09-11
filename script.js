// DOM Elements
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');
const saveFavoriteBtn = document.getElementById('save-favorite-btn');
const showFavoritesBtn = document.getElementById('show-favorites-btn');
const showFavoritesText = document.getElementById('show-favorites-text');
const clearFavoritesBtn = document.getElementById('clear-favorites-btn');
const favoritesList = document.getElementById('favorites-list');
const favoritesSection = document.querySelector('.favorites-section');
const categoryFilter = document.getElementById('category-filter');
const favoriteSearch = document.getElementById('favorite-search');

// Share Elements
const shareBtn = document.getElementById('share-btn');
const shareOptions = document.getElementById('share-options');
const shareWhatsapp = document.getElementById('share-whatsapp');
const shareLinkedin = document.getElementById('share-linkedin');
const shareFacebook = document.getElementById('share-facebook');

// Modal Elements
const modal = document.getElementById('custom-modal');
const modalMessage = document.getElementById('modal-message');
const modalConfirmBtn = document.getElementById('modal-confirm-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');

// State
let onConfirmCallback = null;
let currentCategory = '';

// --- API and Core Functions ---

async function getQuote() {
  // Add fade-out animation
  quoteText.classList.add('fade-out');
  quoteAuthor.classList.add('fade-out');

  // Wait for fade-out to complete
  await new Promise(resolve => setTimeout(resolve, 300));

  let apiUrl = 'https://api.api-ninjas.com/v1/quotes';
  if (currentCategory) {
    apiUrl += `?category=${currentCategory}`;
  }
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
    displayQuote([]); // Display error message
  } finally {
    // Fade in new content
    quoteText.classList.remove('fade-out');
    quoteAuthor.classList.remove('fade-out');
    quoteText.classList.add('fade-in');
    quoteAuthor.classList.add('fade-in');
  }
}

function displayQuote(quotes) {
  if (!quotes || quotes.length === 0) {
    quoteText.textContent = 'No quotes found in this category. Try another!';
    quoteAuthor.textContent = '';
    return;
  }

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

// --- Share Logic ---
function shareQuote(platform, event) {
  event.preventDefault();
  const quote = quoteText.textContent;
  const author = quoteAuthor.textContent;
  const websiteUrl = 'https://ai-powered-quote-of-the-day.netlify.app/';
  const shareText = `Check out this quote: "${quote}" - ${author}. Find more inspiration here:`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(websiteUrl);
  let finalUrl = '';

  switch (platform) {
    case 'whatsapp':
      finalUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
      break;
    case 'linkedin':
      finalUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}%20${encodedUrl}`;
      break;
    case 'facebook':
      finalUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
      break;
  }

  window.open(finalUrl, '_blank');
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
    showFavoritesText.textContent = 'Hide Favorites';
  } else {
    showFavoritesText.textContent = 'Show Favorites';
  }
});

shareBtn.addEventListener('click', () => {
    shareOptions.classList.toggle('show');
});

categoryFilter.addEventListener('change', (e) => {
    currentCategory = e.target.value;
    getQuote();
});

favoriteSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const favoriteItems = favoritesList.querySelectorAll('li');

    favoriteItems.forEach(item => {
        const itemText = item.textContent.toLowerCase();
        if (itemText.includes(searchTerm)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
});

shareWhatsapp.addEventListener('click', (e) => shareQuote('whatsapp', e));
shareLinkedin.addEventListener('click', (e) => shareQuote('linkedin', e));
shareFacebook.addEventListener('click', (e) => shareQuote('facebook', e));

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
