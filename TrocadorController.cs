using System;
using System.Threading.Tasks;
using BTCPayServer.Abstractions.Constants;
using BTCPayServer.Client;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BTCPayServer.Plugins.Trocador
{
    [Authorize(AuthenticationSchemes = AuthenticationSchemes.Cookie)]
    [Authorize(Policy = Policies.CanModifyStoreSettings, AuthenticationSchemes = AuthenticationSchemes.Cookie)]
    [Route("plugins/{storeId}/Trocador")]
    public class TrocadorController : Controller
    {
        private readonly BTCPayServerClient _btcPayServerClient;
        private readonly TrocadorService _TrocadorService;

        public TrocadorController(BTCPayServerClient btcPayServerClient, TrocadorService TrocadorService)
        {
            _btcPayServerClient = btcPayServerClient;
            _TrocadorService = TrocadorService;
        }

        [HttpGet("")]
        public async Task<IActionResult> UpdateTrocadorSettings(string storeId)
        {
            var store = await _btcPayServerClient.GetStore(storeId);

            UpdateTrocadorSettingsViewModel vm = new UpdateTrocadorSettingsViewModel();
            vm.StoreName = store.Name;
            TrocadorSettings Trocador = null;
            try
            {
                Trocador = await _TrocadorService.GetTrocadorForStore(storeId);
            }
            catch (Exception)
            {
                // ignored
            }

            SetExistingValues(Trocador, vm);
            return View(vm);
        }

        private void SetExistingValues(TrocadorSettings existing, UpdateTrocadorSettingsViewModel vm)
        {
            if (existing == null)
                return;
            vm.Enabled = existing.Enabled;
            vm.FiatDenominated = existing.FiatDenominated;
        }

        [HttpPost("")]
        public async Task<IActionResult> UpdateTrocadorSettings(string storeId, UpdateTrocadorSettingsViewModel vm,
            string command)
        {
            if (vm.Enabled)
            {
                if (!ModelState.IsValid)
                {
                    return View(vm);
                }
            }

            var TrocadorSettings = new TrocadorSettings()
            {
                Enabled = vm.Enabled,
                FiatDenominated = vm.FiatDenominated,
            };

            switch (command)
            {
                case "save":
                    await _TrocadorService.SetTrocadorForStore(storeId, TrocadorSettings);
                    TempData["SuccessMessage"] = "Trocador settings modified";
                    return RedirectToAction(nameof(UpdateTrocadorSettings), new {storeId});

                default:
                    return View(vm);
            }
        }
    }
}
