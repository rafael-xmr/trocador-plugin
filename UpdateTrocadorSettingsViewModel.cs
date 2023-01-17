using System.Collections.Generic;
namespace BTCPayServer.Plugins.Trocador
{
    public class UpdateTrocadorSettingsViewModel
    {
        public bool Enabled { get; set; }
        public string StoreName { get; set; }
        public bool FiatDenominated { get; set; }
        public string DefaultPaymentMethodId { get; set; }
        public string ReferralCode { get; set; }
        public string PaymentMethodId { get; set; }
        public Dictionary<string, string> PaymentMethods { get; set; }
        public string PreselectedCoin { get; set; }
        public bool ShowFirst { get; set; }
    }
}
