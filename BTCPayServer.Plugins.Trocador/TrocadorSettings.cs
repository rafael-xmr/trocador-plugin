using System.Collections.Generic;
namespace BTCPayServer.Plugins.Trocador
{
    public class TrocadorSettings
    {
        public bool Enabled { get; set; }
        public decimal AmountMarkupPercentage { get; set; } = 0;
        public bool FiatDenominated { get; set; }
        public string DefaultPaymentMethodId { get; set; } = "Auto";
        public string ReferralCode { get; set; }
        public string PaymentMethodId { get; set; }
        public Dictionary<string, string> PaymentMethods { get; set; }
        public string PreselectedCoin { get; set; } = "XMR";
        public bool ShowFirst { get; set; } = false;
    }
}
