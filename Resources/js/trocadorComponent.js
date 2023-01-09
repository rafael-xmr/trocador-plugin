function getUrl(that) {
  const { model, markupPercentage, referralCode } = that;
  const { fiatDenominated } = window.trocadorProps || that;

  const {
    storeName,
    itemDesc,
    paymentMethodId: toCurrency,
    btcDue,
    btcAddress: toCurrencyAddress,
    customerEmail,
    brandColor,
    orderAmountFiat,
  } = model;

  const toCurrencyDue = markupPercentage
    ? btcDue * (1 + markupPercentage / 100)
    : btcDue;

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
  let amount = toCurrencyDue && toCurrencyDue;
  const fromPreset = "&ticker_from=xmr" + "&network_from=Mainnet"; // todo: setting

  const btcPayGreen = "51b13e";
  const buttonBgColor = `&buttonbgcolor=${
    brandColor ? brandColor.replace("#", "") : btcPayGreen
  }`;

  const colorPreset = "&buttonbgcolor=blue";

  let fiatCurrency;

  if (fiatDenominated) {
    const orderRegex = /(\d+\.\d+)/;
    const orderMatch = orderRegex.exec(orderAmountFiat);

    amount = orderMatch && orderMatch[0];

    const currencyRegex = /([A-Z]{3})/;
    const currencyMatch = currencyRegex.exec(orderAmountFiat);
    fiatCurrency = currencyMatch && currencyMatch[0];
  }

  let donation;

  if (!amount || amount === "0.00") {
    amount = null;
    donation = true;
  }

  const url =
    "https://trocador.app/anonpay/?" +
    `ticker_to=${tickerTo}` +
    `&network_to=${networkTo}` +
    `&address=${toCurrencyAddress}` +
    (amount ? `&amount=${amount}` : "") +
    (storeName ? `&name=${storeName}` : "") +
    (itemDesc ? `&description=${itemDesc}` : "") +
    fromPreset +
    (customerEmail ? `&email=${customerEmail}` : "") +
    buttonBgColor +
    (fiatCurrency ? `&fiat_equiv=${fiatCurrency}` : "") +
    (donation ? "&donation=True" : "") +
    (referralCode ? `&ref=${referralCode}` : "");

  return url;
}

const PROPS = ["model", "markupPercentage", "fiatDenominated"];

// -- Classic Checkout --
Vue.component("trocador", {
  props: PROPS,
  data() {
    return {
      shown: false,
    };
  },
  computed: {
    url() {
      return getUrl(this);
    },
  },
});

// -- Checkout v2 --
Vue.component("TrocadorCheckout", {
  template: "#trocador-checkout-template",
  props: PROPS,
  computed: {
    url() {
      return getUrl(this);
    },
  },
});
