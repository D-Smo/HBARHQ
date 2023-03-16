async function fetchData() {
    const vsCurrency = "usd";
    const coinIds = [
        "hedera-hashgraph",
        "hbarx",
        "usd-coin",
        "saucerswap",
        "headstarter",
        "calaxy"
    ];
    const coinsUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vsCurrency}&ids=${coinIds.join(',')}`;

    try {
        const response = await fetch(coinsUrl);
        const coinsData = await response.json();
        const dataById = coinsData.reduce((acc, coin) => {
            acc[coin.id] = coin;
            return acc;
        }, {});
        populateTiles(dataById);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function populateTiles(data) {
    const cryptoDataElement = document.getElementById("crypto-data");

    for (const coinId in data) {
        const coin = data[coinId];

        const tile = document.createElement("div");
        tile.className = "crypto-tile";

        const header = document.createElement("div");
        header.className = "crypto-tile-header";
        
        const logo = document.createElement("img");
        logo.src = coin.image;
        logo.alt = `${coin.name} logo`;
        logo.style.width = "24px";
        logo.style.height = "24px";
        logo.style.marginRight = "8px";
        header.appendChild(logo);

        const name = document.createElement("span");
        name.textContent = coin.name;
        header.appendChild(name);

        const price = document.createElement("span");
        price.textContent = `$${coin.current_price.toFixed(2)}`;
        price.style.marginLeft = "8px";
        header.appendChild(price);

        const moreButton = document.createElement("span");
        moreButton.textContent = "+ more";
        moreButton.style.marginLeft = "16px";
        header.appendChild(moreButton);

        const marketCap = coin.market_cap === 0 ? 'N/A' : new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(coin.market_cap);

        const content = document.createElement("div");
        content.className = "crypto-tile-content";
        content.innerHTML = `
            <table>
                <tr>
                    <th>Price</th>
                    <td>$${coin.current_price.toFixed(2)}</td>
                </tr>
                <tr>
                    <th>Market Cap</th>
                    <td>${marketCap}</td>
                </tr>
                <tr>
                    <th>24h Change</th>
                    <td>${coin.price_change_percentage_24h.toFixed(2)}%</td>
                </tr>
            </table>
        `;

        tile.appendChild(header);
        tile.appendChild(content);
        cryptoDataElement.appendChild(tile);

        header.addEventListener("click", () => {
            content.style.display = content.style.display === "block" ? "none" : "block";
        });
    }
}




fetchData();
