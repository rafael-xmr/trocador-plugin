dotnet publish -c Altcoins-Release -o bin/publish/BTCPayServer.Plugins.Trocador
dotnet run -p ../../BTCPayServer.PluginPacker bin/publish/BTCPayServer.Plugins.Trocador BTCPayServer.Plugins.Trocador ../packed
