import fetch from 'node-fetch';

export class CoinGecko {
  private request(url: string) {
    return fetch(
      `https://api.coingecko.com/api/v3/${
        !url.startsWith('/') ? '/' : ''
      }${url}`,
    ).then((res) => res.json());
  }

  getList() {
    return this.request('/list');
  }

  getMarkets(ids: string[] = []) {
    const idsString: string = ids.length
      ? `&ids=${ids.join('%2C')}`
      : '&per_page=100&page=1';
    return this.request(
      `coins/markets?vs_currency=usd&order=market_cap_desc${idsString}`,
    );
  }
}
