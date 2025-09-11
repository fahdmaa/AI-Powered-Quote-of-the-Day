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
    console.log(data);
  } catch (error) {
    console.error('Whoops, no quote', error);
  }
}

// Get Quote on load
getQuote();
