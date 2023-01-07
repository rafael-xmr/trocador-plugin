using System.Threading.Tasks;
using BTCPayServer.Abstractions.Contracts;
using Microsoft.Extensions.Caching.Memory;

namespace BTCPayServer.Plugins.Trocador
{
    public class TrocadorService
    {
        private readonly ISettingsRepository _settingsRepository;
        private readonly IStoreRepository _storeRepository;
        private readonly IMemoryCache _memoryCache;

        public TrocadorService(ISettingsRepository settingsRepository, IStoreRepository storeRepository, IMemoryCache memoryCache)
        {
            _settingsRepository = settingsRepository;
            _storeRepository = storeRepository;
            _memoryCache = memoryCache;
        }
        public async Task<TrocadorSettings> GetTrocadorForStore(string storeId)
        {
            var k = $"{nameof(TrocadorSettings)}_{storeId}";
            return await _memoryCache.GetOrCreateAsync(k, async _ =>
            {
                var res = await _storeRepository.GetSettingAsync<TrocadorSettings>(storeId,
                    nameof(TrocadorSettings));
                if (res is not null) return res;
                res = await _settingsRepository.GetSettingAsync<TrocadorSettings>(k);

                if (res is not null)
                {
                    await SetTrocadorForStore(storeId, res);
                }

                await _settingsRepository.UpdateSetting<TrocadorSettings>(null, k);
                return res;
            });
        }

        public async Task SetTrocadorForStore(string storeId, TrocadorSettings trocadorSettings)
        {
            var k = $"{nameof(TrocadorSettings)}_{storeId}";
            await _storeRepository.UpdateSetting(storeId, nameof(TrocadorSettings), trocadorSettings);
            _memoryCache.Set(k, trocadorSettings);
        }
    }
}
