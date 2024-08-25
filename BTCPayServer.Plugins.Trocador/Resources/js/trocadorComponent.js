function isZeroAmount(str) {
  const regex = /^0+\.?0+$/;
  return regex.test(str);
}

function getUrl(that) {
  const { model, markupPercentage, address, orderAmount } = that;
  const {
    fiatDenominated,
    defaultPaymentMethodId,
    referralCode,
    preselectedCoin,
  } = window.trocadorProps || that;

  const {
    storeName,
    itemDesc,
    paymentMethodId,
    btcDue,
    btcAddress: toCurrencyAddress,
    customerEmail,
    brandColor,
    orderAmountFiat,
  } = model;

  const toCurrency =
    defaultPaymentMethodId && defaultPaymentMethodId !== "Auto"
      ? defaultPaymentMethodId
      : paymentMethodId;

  const toCurrencyDue = markupPercentage
    ? btcDue * (1 + markupPercentage / 100)
    : btcDue;

  // -- Required Params --
  let tickerTo = toCurrency;
  let networkTo = "Mainnet";

  if (tickerTo.includes("Lightning") || tickerTo.includes("LNURL")) {
    tickerTo = "btc";
    networkTo = "Lightning";
  } else {
    tickerTo = tickerTo
      .replace("_BTCLike", "")
      .replace("_MoneroLike", "")
      .replace("_ZcashLike", "")
      .replace(/-.*/g, "")
      .toLowerCase();
  }

  // -- Optional Params --
  let amount = orderAmount || toCurrencyDue;

  let fromPreset = "&ticker_from=xmr&network_from=Mainnet";

  if (preselectedCoin) {
    const [tickerFrom, networkFrom = "Mainnet"] = preselectedCoin.split("-");

    fromPreset = `&ticker_from=${tickerFrom.toLowerCase()}&network_from=${networkFrom}`;
  }

  const btcPayGreen = "51b13e";
  const buttonBgColor = `&buttonbgcolor=${
    brandColor ? brandColor.replace("#", "") : btcPayGreen
  }`;

  let fiatCurrency;

  if (fiatDenominated) {
    const amountRegex = /([\d,.]+)/;
    const amountMatch = orderAmountFiat.replace(/[  ]/g, "").match(amountRegex);
    const formattedAmount = amountMatch && amountMatch[0];

    const commaDecimal = formattedAmount.lastIndexOf(",");
    const pointDecimal = formattedAmount.lastIndexOf(".");
    const decimalSeparatorIndex =
      commaDecimal > pointDecimal
        ? commaDecimal
        : commaDecimal === pointDecimal
        ? formattedAmount.length
        : pointDecimal;

    const integerAmount = formattedAmount.substring(0, decimalSeparatorIndex);
    const decimals =
      decimalSeparatorIndex < formattedAmount.length
        ? "." +
          formattedAmount.substring(
            decimalSeparatorIndex + 1,
            formattedAmount.length
          )
        : "";

    amount = integerAmount.replace(/[,.]/g, "") + decimals;

    const currencyRegex = /([A-Z]{3})/;
    const currencyMatch = orderAmountFiat.match(currencyRegex);
    fiatCurrency = currencyMatch && currencyMatch[0];
  }

  let donation;

  if (!amount || isZeroAmount(amount)) {
    amount = null;
    donation = true;
  }

  // Where the checkout page will open
  const checkoutTarget = "&target=blank";

  const url =
    "https://trocador.app/anonpay/?" +
    `ticker_to=${tickerTo}` +
    `&network_to=${networkTo}` +
    `&address=${address || toCurrencyAddress}` +
    (amount ? `&amount=${amount}` : "") +
    (storeName ? `&name=${storeName}` : "") +
    (itemDesc ? `&description=${itemDesc}` : "") +
    fromPreset +
    (customerEmail ? `&email=${customerEmail}` : "") +
    buttonBgColor +
    (fiatCurrency ? `&fiat_equiv=${fiatCurrency}` : "") +
    (donation ? "&donation=True" : "") +
    (referralCode ? `&ref=${referralCode}` : "") +
    checkoutTarget;

  return url;
}

const PROPS = [
  "model",
  "markupPercentage",
  "referralCode",
  "fiatDenominated",
  "defaultPaymentMethodId",
  "preselectedCoin",
];

Vue.component("TrocadorCheckout", {
  template: "#trocador-checkout-template",
  props: PROPS,
  data() {
    return {
      address: undefined,
      orderAmount: undefined,
      shown: false,
    };
  },
  computed: {
    url() {
      return getUrl(this);
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const defaultPaymentMethodId =
        this.defaultPaymentMethodId ||
        window.trocadorProps?.defaultPaymentMethodId;

      if (defaultPaymentMethodId && defaultPaymentMethodId !== "Auto") {
        const url = `/i/${this.model.invoiceId}/status?invoiceId=${this.model.invoiceId}&paymentMethodId=${defaultPaymentMethodId}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          this.updateData(data);
        }
      }
    },
    updateData(data) {
      const { invoiceBitcoinUrl, orderAmount } = data;

      this.address = invoiceBitcoinUrl.substring(
        invoiceBitcoinUrl.indexOf(":") > -1
          ? invoiceBitcoinUrl.indexOf(":") + 1
          : 0,
        invoiceBitcoinUrl.indexOf("?") > -1
          ? invoiceBitcoinUrl.indexOf("?")
          : invoiceBitcoinUrl.length
      );
      this.orderAmount = orderAmount;
    },
  },
});
