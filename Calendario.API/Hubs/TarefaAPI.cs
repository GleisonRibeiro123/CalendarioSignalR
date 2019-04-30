using calendario;
using Calendario.API;

using Microsoft.AspNetCore.SignalR;

namespace Calendario
{
    public class TarefaAPI
    {
        private IHubContext<TarefaHub, ITypedHubClient> _hubContext;

        public TarefaAPI(IHubContext<TarefaHub, ITypedHubClient> hubContext)
        {
            _hubContext = hubContext;
        }
    }
}