using BTCPayServer.Abstractions.Contracts;
using BTCPayServer.Abstractions.Models;
using BTCPayServer.Abstractions.Services;
using Microsoft.Extensions.DependencyInjection;

namespace BTCPayServer.Plugins.Trocador
{
    public class TrocadorPlugin : BaseBTCPayServerPlugin
    {
        public override string Identifier => "BTCPayServer.Plugins.Trocador";
        public override string Name => "Trocador";
        public override string Description =>
            "Allows you to embed a Trocador conversion screen to allow customers to pay with altcoins.";

        public override IBTCPayServerPlugin.PluginDependency[] Dependencies { get; } =
        {
            new() { Identifier = nameof(BTCPayServer), Condition = ">=1.7.0.0" }
        };

        public override void Execute(IServiceCollection services)
        {
            services.AddSingleton<TrocadorService>();

            // Sidebar Nav
            services.AddSingleton<IUIExtension>(new UIExtension("Trocador/TrocadorNav", "store-integrations-nav"));
            // Store Settings Plugins Integration
            services.AddSingleton<IUIExtension>(new UIExtension("Trocador/StoreIntegrationTrocadorOption", "store-integrations-list"));

            // -- Checkout v2 --

            // Tab (Payment Method)
            services.AddSingleton<IUIExtension>(new UIExtension("Trocador/CheckoutV2/CheckoutPaymentMethodExtension", "checkout-payment-method"));
            // Widget
            services.AddSingleton<IUIExtension>(new UIExtension("Trocador/CheckoutV2/CheckoutPaymentExtension", "checkout-payment"));

            // -- Checkout Classic --

            // Tab
            services.AddSingleton<IUIExtension>(new UIExtension("Trocador/CheckoutClassic/CheckoutTabExtension", "checkout-bitcoin-post-tabs"));
            services.AddSingleton<IUIExtension>(new UIExtension("Trocador/CheckoutClassic/CheckoutTabExtension", "checkout-lightning-post-tabs"));
            // Widget
            services.AddSingleton<IUIExtension>(new UIExtension("Trocador/CheckoutClassic/CheckoutContentExtension", "checkout-bitcoin-post-content"));
            services.AddSingleton<IUIExtension>(new UIExtension("Trocador/CheckoutClassic/CheckoutContentExtension", "checkout-lightning-post-content"));

            services.AddSingleton<IUIExtension>(new UIExtension("Trocador/CheckoutEnd", "checkout-end"));

            base.Execute(services);
        }
    }

}
