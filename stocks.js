const apiKey = 'qigQbymK4ebiXETIMxzP6UvTSplm4Zz5';
let chart;

function formatDate(date) {
    return date.toISOString().split("T")[0];
}

function fetchStockData(ticker, days) {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    const from = formatDate(start);
    const to = formatDate(end);

    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${apiKey}`;

    return fetch(url).then(res => res.json()); // only one .then
}

async function createChart(ticker, days) {
    const data = await fetchStockData(ticker, days);

    const labels = data.results.map(item =>
        new Date(item.t).toLocaleDateString()
    );

    const prices = data.results.map(item => item.c.toFixed(2));

    const canvas = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');
    canvas.style.display = 'block';

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: `Stock Price`,
                data: prices,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
    });
}

function submitStockForm() {
    const ticker = document.getElementById("ticker").value.toUpperCase();
    const days = parseInt(document.getElementById("days").value);
    createChart(ticker, days);
}

function fetchTopStocks() {
    return fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03').then(res =>
        res.json()
    );
}

async function loadStocksTable() {
    const table = document.getElementById('stocks-table');
    const data = await fetchTopStocks();
    const top5 = data.slice(0, 5);

    top5.forEach((stock) => {
        const row = document.createElement('tr');

        const ticker = document.createElement('td');
        const link = document.createElement('a');
        link.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
        link.textContent = stock.ticker;
        ticker.appendChild(link);

        const comments = document.createElement('td');
        comments.innerHTML = stock.no_of_comments;

        const sentiment = document.createElement('td');
        const icon = document.createElement('img');
        
        if (stock.sentiment == "Bullish") {
            icon.src = 'bullish.png'
            sentiment.appendChild(icon);

        } else if (stock.sentiment == "Bearish") {
            icon.src = 'bearish.png'
            sentiment.appendChild(icon);
        }

        row.appendChild(ticker);
        row.appendChild(comments);
        row.appendChild(sentiment);

        table.appendChild(row);
    });
    addVoiceCommands();
}

function addVoiceCommands() {
    if (annyang) {
        const baseCommands = setupVoiceCommands();
        const commands = { ...baseCommands,
            'look up *name': function (name) {
                const ticker = name.toUpperCase();
                document.getElementById('ticker').value = ticker;
                const days = parseInt(document.getElementById('days').value) || 30;
                createChart(ticker, days);
            }
        };

        annyang.addCommands(commands);
    }
}

window.onload = loadStocksTable;

