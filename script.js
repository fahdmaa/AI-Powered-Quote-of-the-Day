const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');

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

// Get Quote on load
getQuote();

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
