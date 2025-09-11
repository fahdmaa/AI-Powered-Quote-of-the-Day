const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');
const saveFavoriteBtn = document.getElementById('save-favorite-btn');
const favoritesList = document.getElementById('favorites-list');

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
  const currentQuote = {
    quote: quoteText.textContent,
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

// On load
getQuote();
displayFavorites();

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
saveFavoriteBtn.addEventListener('click', saveFavorite);
