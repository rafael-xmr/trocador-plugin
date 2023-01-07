Vue.component("trocador", {
    props: ["toCurrency", "toCurrencyDue", "toCurrencyAddress"],
    data() {
        return {
            shown: false,
        };
    },
    computed: {
        url() {
            console.log(1);
            return "https://trocador.app/anonpay/?ticker_to=xmr&network_to=Mainnet&amount=0.1&address=89Jb5ZQWpjg5965idsoNA7M5eNDDmqP8jM7cRzJ8xC7cWCNJ5CKjoq7eGxjTqv1wpngNjKuVc7RWJJzpDsxvetiBD1LdB12";
        },
    },
});
