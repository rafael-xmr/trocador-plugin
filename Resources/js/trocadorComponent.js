function getUrl(model, markupPercentage) {
  const {
    paymentMethodId: toCurrency,
    btcDue,
    btcAddress: toCurrencyAddress,
    customerEmail,
    brandColor,
  } = model;

  const toCurrencyDue = btcDue * (1 + markupPercentage / 100);

  // -- Required Params --
  let tickerTo = toCurrency;
  let networkTo = "Mainnet";

  if (tickerTo.endsWith("LightningLike") || tickerTo.endsWith("LNURLPay")) {
    tickerTo = "btc";
    networkTo = "Lightning";
  } else {
    tickerTo = tickerTo.toLowerCase();
  }

  // -- Optional Params --
  const amount = toCurrencyDue ? `&amount=${toCurrencyDue}` : "";
  const fromPreset = "&ticker_from=xmr" + "&network_from=Mainnet";
  const email = customerEmail ? `&email=${customerEmail}` : "";

  const btcPayGreen = "51b13e";
  const buttonBgColor = `&buttonbgcolor=${
    brandColor ? brandColor.replace("#", "") : btcPayGreen
  }`;

  const colorPreset = "&buttonbgcolor=blue";

  return (
    "https://trocador.app/anonpay/?" +
    `ticker_to=${tickerTo}` +
    `&network_to=${networkTo}` +
    `&address=${toCurrencyAddress}` +
    amount +
    fromPreset +
    email +
    buttonBgColor
  );
}

// -- Classic Checkout --
Vue.component("trocador", {
  props: ["model", "markupPercentage"],
  data() {
    return {
      shown: false,
    };
  },
  computed: {
    url() {
      return getUrl(this.model, this.markupPercentage);
    },
  },
});

// -- Checkout v2 --
Vue.component("TrocadorCheckout", {
  template: "#trocador-checkout-template",
  props: ["model", "markupPercentage"],
  data() {
    return {
      shown: false,
    };
  },
  computed: {
    url() {
      return getUrl(this.model, this.markupPercentage);
    },
  },
});