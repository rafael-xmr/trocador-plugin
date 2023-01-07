namespace BTCPayServer.Plugins.Trocador
{
    public class TrocadorSettings
    {
        public bool Enabled { get; set; }
        public decimal AmountMarkupPercentage { get; set; } = 0;
    }
}
