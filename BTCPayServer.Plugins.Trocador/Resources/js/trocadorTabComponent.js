// -- Classic Checkout --
Vue.component("TrocadorTab", {
    props: ["switchTab", "currentTab", "shouldSwitch"],
    data() {
        return {
            didSwitch: false,
        };
    },
    mounted() {
        if (this.shouldSwitch) {
            this.switchTab();
        }
    },
    watch: {
        currentTab() {
            if (!this.didSwitch && this.shouldSwitch) {
                this.switchTab();
                this.didSwitch = true;
            }
        },
    },
});
