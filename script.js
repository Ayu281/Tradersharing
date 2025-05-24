
const allPairs = [
  "EUR/USD","GBP/USD","USD/JPY","USD/CHF","AUD/USD","NZD/USD","USD/CAD",
  "EUR/JPY","EUR/GBP","EUR/CHF","GBP/JPY","AUD/JPY","CAD/JPY",
  "NZD/JPY","CHF/JPY","GBP/CHF","AUD/CAD","NZD/CAD","AUD/NZD","EUR/AUD"
];

const allIndicators = [
  "RSI", "MACD", "Stochastic", "Bollinger Bands", "MA", "EMA", "ADX", "CCI",
  "Ichimoku", "ATR", "Envelopes", "Fractals", "Parabolic SAR", "Momentum"
];

function populateDropdowns() {
  const pairSelect = document.getElementById('pair');
  allPairs.forEach(pair => {
    const opt = document.createElement('option');
    opt.textContent = pair;
    pairSelect.appendChild(opt);
  });

  ["indi1","indi2","indi3","indi4"].forEach(id => {
    const sel = document.getElementById(id);
    allIndicators.forEach(indi => {
      const opt = document.createElement('option');
      opt.textContent = indi;
      sel.appendChild(opt);
    });
  });
}
populateDropdowns();

function generateSignal() {
  const indi = ["indi1","indi2","indi3","indi4"].map(id => document.getElementById(id).value).filter(i => i);
  if (indi.length === 0) return document.getElementById("signal-output").innerHTML = "<p>Silakan pilih minimal satu indikator.</p>";
  const buy = Math.floor(Math.random() * 100);
  const sell = 100 - buy;
  const cat = (v) => v >= 70 ? "Kuat" : v >= 40 ? "Sedang" : v >= 10 ? "Lemah" : "Netral";
  document.getElementById("signal-output").innerHTML = `<p>Buy: ${buy}% (${cat(buy)})<br>Sell: ${sell}% (${cat(sell)})</p>`;
}

function fetchAnomali() {
  fetch("sentiment.json")
    .then(res => res.json())
    .then(data => {
      const buyer = parseInt(data.buyer || 50);
      const seller = 100 - buyer;
      const anomali = buyer > seller ? "Sell" : "Buy";
      const tujuan = buyer > seller ? "Buy" : "Sell";
      document.getElementById("anomali-output").textContent = `Anomali = ${anomali}`;
      document.getElementById("tujuan-output").textContent = `Tujuan = ${tujuan}`;
      document.getElementById("sumber-output").innerHTML = `
        <small>
          Myfxbook ${data.myfxbook_buy}% / ${data.myfxbook_sell}%<br>
          FXBlue ${data.fxblue_buy}% / ${data.fxblue_sell}%<br>
          TradingView ${data.tv_buy}% / ${data.tv_sell}%
        </small>`;
    })
    .catch(() => {
      document.getElementById("anomali-output").textContent = "Gagal memuat data";
      document.getElementById("tujuan-output").textContent = "";
    });
}

function fetchNews() {
  fetch("news.json")
    .then(res => res.json())
    .then(news => {
      const list = document.getElementById("news-list");
      list.innerHTML = "";
      if (!news.length) {
        list.innerHTML = "<li>Tidak ada berita penting</li>";
      } else {
        news.forEach(item => {
          const li = document.createElement("li");
          li.textContent = `${item.currency}: ${item.event} (${item.date})`;
          list.appendChild(li);
        });
      }
    });
}

fetchAnomali();
fetchNews();
