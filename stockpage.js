///////////// STOCK CHART LOOKUP /////////////


document.getElementById('lookupbutn').addEventListener('click', async () => {
    const ticker = document.querySelector('input').value.trim().toUpperCase();  // gets the stock ticker based from the input field 
    const daysOption = document.getElementById('stockdays').value; // gets the day option from the dropdown 
  
    if (!ticker) return alert('Enter a stock ticker');
  
    const dayCount = { '30days': 30, '60days': 60, '90days': 90 }[daysOption];
    const now = Math.floor(Date.now() / 1000);
    const then = now - dayCount * 86400;   // 86400 seconds in a day 
    const apiKey = 'sdozraX_YryLcxbJImXp7ppRHZYjqIsM';
  
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${then}/${now}?adjusted=true&sort=asc&apiKey=${apiKey}`;
  
    try {
      const res = await fetch(url);   // fetch data 
      const { results } = await res.json();
      const labels = results.map(r => new Date(r.t).toLocaleDateString()); // format the returned timestamps into readable dates 
      const values = results.map(r => r.c);
  
      const ctx = document.getElementById('myChart').getContext('2d');
      if (window.stockChart) window.stockChart.destroy(); 
  
/////////////// CHART ///////////////////////

      window.stockChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: '$ Stock Price',
            data: values,
            borderColor: 'blue',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: 'Date' }},
            y: { title: { display: true, text: 'Price ($)' }}
          }
        }
      });
    } catch (err) {
      console.error('Error loading stock:', err);
      alert('Could not load stock data.');
    }
  });
  
  
  /////////////  REDDIT TOP 5 STOCKS /////////////

  async function loadRedditStocks() {
    try {
      const res = await fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03');   // fetch stock sentiment 
      const data = await res.json();
      const table = document.getElementById('reddittable');
  
      data.slice(0, 5).forEach(stock => { // only takes the first 5 stocks 
        const row = document.createElement('tr');       
        const isBull = stock.sentiment === 'Bullish';
  // sets the inside of the table w/ the sentiment using diff image based on bullish or bearish 
  // links the sentiment to yahoo link w/ the stock ticker 
        row.innerHTML = `
          <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>    
          <td>${stock.no_of_comments}</td>
          <td><img src="${isBull 
            ? 'https://static.thenounproject.com/png/3328202-200.png' 
            : 'https://cdn.iconscout.com/icon/free/png-256/free-bearish-icon-download-in-svg-png-gif-file-formats--downtrend-animal-stocks-finance-investment-pack-business-icons-1570417.png'}" 
            alt="${stock.sentiment}" style="height:200px;" /></td>
        `;
        table.appendChild(row); // add the row to the table

      });
    } catch (err) {
      console.error('Failed to load Reddit stocks:', err);
    }
  }
  
  loadRedditStocks();
  