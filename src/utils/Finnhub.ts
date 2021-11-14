import { fetch } from 'node-fetch';
export class Finnhub {
  constructor(private apiKey: string) {}
  private request(url: string) {
    return fetch(
      `https://finnhub.io/api/v1${!url.startsWith('/') ? '/' : ''}${url}`,
    ).then((res) => res.json());
  }
  async getCurrentPrice(symbol: string): Promise<number> {
    return (await this.request(`quote?symbol=${symbol}&token=${this.apiKey}`))
      ?.c;
  }
}
