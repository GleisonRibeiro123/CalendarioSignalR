using calendario;
using Calendario.API.Repository;
using Microsoft.AspNetCore.SignalR;

namespace Calendario.API
{
    public class TarefaHub : Hub<ITypedHubClient>
    {
        private readonly ITarefaRepository _repository;

        public TarefaHub(ITarefaRepository repository)
        {
            _repository = repository;
        }
        public async void SendToAll()
        {
            var tarefa = await _repository.GetAllTarefasAsync();
            await Clients.All.Enviar(tarefa);
        }
    }
}
