Vue.component("trocador", {
  props: [
    "toCurrency",
    "toCurrencyDue",
    "toCurrencyAddress",
    "customerEmail",
    "brandColor",
  ],
  data() {
    return {
      shown: false,
    };
  },
  computed: {
    url() {
      // -- Required Params --
      let tickerTo = this.toCurrency;
      let networkTo = "Mainnet";

      if (tickerTo.endsWith("LightningLike") || tickerTo.endsWith("LNURLPay")) {
        tickerTo = "btc";
        networkTo = "Lightning";
      } else {
        tickerTo = tickerTo.toLowerCase();
      }

      // -- Optional Params --
      const amount = this.toCurrencyDue ? `&amount=${this.toCurrencyDue}` : "";
      const fromPreset = "&ticker_from=xmr" + "&network_from=Mainnet";
      const email = this.customerEmail ? `&email=${this.customerEmail}` : "";

      const btcPayGreen = "51b13e";
      const buttonBgColor = `&buttonbgcolor=${this.brandColor || btcPayGreen}`;

      const colorPreset = "&buttonbgcolor=blue";

      return (
        "https://trocador.app/anonpay/?" +
        `ticker_to=${tickerTo}` +
        `&network_to=${networkTo}` +
        `&address=${this.toCurrencyAddress}` +
        amount +
        fromPreset +
        email +
        buttonBgColor
      );
    },
  },
});
