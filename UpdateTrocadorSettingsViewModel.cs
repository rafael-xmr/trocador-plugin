namespace BTCPayServer.Plugins.Trocador
{
    public class UpdateTrocadorSettingsViewModel
    {
        public bool Enabled { get; set; }
        public string StoreName { get; set; }
        public bool FiatDenominated { get; set; }
        public string ReferralCode { get; set; }
    }
}
