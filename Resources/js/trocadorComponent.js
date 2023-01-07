Vue.component("trocador", {
  props: [
    "toCurrency",
    "toCurrencyDue",
    "toCurrencyAddress",
    "customerEmail",
    "brandColor",
    "srvModel",
  ],
  data() {
    return {
      shown: false,
    };
  },
  computed: {
    url() {
      console.log(this.srvModel);
      // -- Required Params --
      let tickerTo = this.toCurrency;
      let networkTo = "Mainnet";

      if (tickerTo.endsWith("LightningLike") || tickerTo.endsWith("LNURLPay")) {
        tickerTo = "btc";
        networkTo = "Lightning";
      } else {
        tickerTo = tickerTo.toLowerCase();
      }

      const tempAddress = "18QgDvPFKV5H7JTpwKFk6H3Eo9JcBK52VH";

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
        `&address=${tempAddress}` +
        amount +
        fromPreset +
        email +
        buttonBgColor
      );
    },

    onLoad(e) {
      return console.log(e);
    },
  },
});
