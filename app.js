
const PAIR_MAP = {
  'EUR/USD': 'EURUSD', 'USD/JPY': 'USDJPY', 'GBP/USD': 'GBPUSD', 'AUD/NZD': 'AUDNZD',
  'AUD/JPY': 'AUDJPY', 'EUR/JPY': 'EURJPY', 'NZD/USD': 'NZDUSD', 'USD/CHF': 'USDCHF',
  'CAD/JPY': 'CADJPY', 'GBP/JPY': 'GBPJPY', 'EUR/GBP': 'EURGBP', 'EUR/AUD': 'EURAUD',
  'AUD/CAD': 'AUDCAD', 'GBP/AUD': 'GBPAUD', 'NZD/JPY': 'NZDJPY', 'EUR/CHF': 'EURCHF',
  'USD/CAD': 'USDCAD', 'AUD/USD': 'AUDUSD', 'CHF/JPY': 'CHFJPY', 'GBP/CHF': 'GBPCHF',
  'NZD/CAD': 'NZDCAD', 'USD/SGD': 'USDSGD', 'EUR/NZD': 'EURNZD', 'GBP/NZD': 'GBPNZD',
  'CAD/CHF': 'CADCHF'
};

function ambilDataMyfxbook() {
  fetch("https://tradersharing.github.io/Tradersharing/index_V2.html")
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const jsonText = doc.querySelector("#json-export")?.textContent;
      if (!jsonText) throw new Error("Data sinyal tidak ditemukan");

      const data = JSON.parse(jsonText);

      // === KOTAK SINYAL HARI INI ===
      const sinyalValid = data.filter(p => p.signal);
      document.getElementById("signal-output").innerHTML = sinyalValid.map(p => `
        <b>${p.name}</b>: ${p.signal} <br>
        Buy: ${p.buy}% | Sell: ${p.sell}%
        <hr style="opacity:0.1">
      `).join("") || "<i>Belum ada sinyal saat ini.</i>";

      // === KOTAK ANOMALI ===
      const pairSelected = document.getElementById("pair").value;
      const pairKey = PAIR_MAP[pairSelected] || pairSelected.replace("/", "");
      const found = data.find(p => p.name === pairKey);
      const anomaliOutput = document.getElementById("anomali-output");

      if (found) {
        const tujuan = found.buy > found.sell ? "SELL" : "BUY";
        const anomali = found.buy > found.sell ? "BUY" : "SELL";
        anomaliOutput.innerHTML = `
          Pair: <b>${found.name}</b><br>
          Buy: ${found.buy}% / Sell: ${found.sell}%<br>
          <b>Anomali:</b> ${anomali}<br>
          <b>Tujuan:</b> ${tujuan}<br>
          <small>Data dari Myfxbook</small>
        `;
      } else {
        anomaliOutput.innerHTML = "Pair tidak ditemukan di data.";
      }
    })
    .catch(err => {
      document.getElementById("signal-output").innerText = "Gagal ambil sinyal.";
      document.getElementById("anomali-output").innerText = "Gagal ambil anomali.";
      console.error(err);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("pair").addEventListener("change", ambilDataMyfxbook);
  ambilDataMyfxbook();
});
