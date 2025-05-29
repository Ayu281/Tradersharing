
const PAIR_MAP = {
  'EUR/USD': 'EURUSD', 'USD/JPY': 'USDJPY', 'GBP/USD': 'GBPUSD', 'AUD/NZD': 'AUDNZD',
  'AUD/JPY': 'AUDJPY', 'EUR/JPY': 'EURJPY', 'NZD/USD': 'NZDUSD', 'USD/CHF': 'USDCHF',
  'CAD/JPY': 'CADJPY', 'GBP/JPY': 'GBPJPY', 'EUR/GBP': 'EURGBP', 'EUR/AUD': 'EURAUD',
  'AUD/CAD': 'AUDCAD', 'GBP/AUD': 'GBPAUD', 'NZD/JPY': 'NZDJPY', 'EUR/CHF': 'EURCHF',
  'USD/CAD': 'USDCAD', 'AUD/USD': 'AUDUSD', 'CHF/JPY': 'CHFJPY', 'GBP/CHF': 'GBPCHF',
  'NZD/CAD': 'NZDCAD', 'USD/SGD': 'USDSGD', 'EUR/NZD': 'EURNZD', 'GBP/NZD': 'GBPNZD',
  'CAD/CHF': 'CADCHF'
};

function scrapeMyfxbook() {
  fetch('https://tradersharing.github.io/Tradersharing/index_V2.html')
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const rows = Array.from(doc.querySelectorAll('table tr'));

      const selectedPair = document.getElementById("pair").value;
      const pairKey = PAIR_MAP[selectedPair] || selectedPair.replace('/', '');

      const results = rows.map(row => {
        const tds = row.querySelectorAll('td');
        if (tds.length < 3) return null;
        const name = tds[0].innerText.trim();
        const buy = parseFloat(tds[1].innerText);
        const sell = parseFloat(tds[2].innerText);
        return { name, buy, sell };
      }).filter(Boolean);

      // === KOTAK SINYAL ===
      const signalBox = document.getElementById("signal-output");
      const valid = results.filter(p => p.buy >= 70 || p.sell >= 70);
      signalBox.innerHTML = valid.length ? valid.map(p => {
        const arah = p.buy >= 70 ? 'BUY 📈' : 'SELL 📉';
        return `<b>${p.name}</b> : ${arah}<br>Buy: ${p.buy}% / Sell: ${p.sell}%<hr style="opacity:0.1">`;
      }).join('') : "<i>Belum ada sinyal saat ini.</i>";

      // === KOTAK ANOMALI ===
      const match = results.find(p => p.name === pairKey);
      const anomaliBox = document.getElementById("anomali-output");
      if (match) {
        const tujuan = match.buy > match.sell ? "SELL" : "BUY";
        const anomali = match.buy > match.sell ? "BUY" : "SELL";
        anomaliBox.innerHTML = `
          Pair: <b>${match.name}</b><br>
          Buy: ${match.buy}% / Sell: ${match.sell}%<br>
          <b>Anomali:</b> ${anomali}<br>
          <b>Tujuan:</b> ${tujuan}<br>
          <small>Data dari Myfxbook</small>
        `;
      } else {
        anomaliBox.innerHTML = "Pair tidak ditemukan di data.";
      }

    })
    .catch(err => {
      document.getElementById("signal-output").innerText = "Gagal mengambil data.";
      document.getElementById("anomali-output").innerText = "Gagal mengambil data.";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("pair").addEventListener("change", scrapeMyfxbook);
  scrapeMyfxbook();
});
