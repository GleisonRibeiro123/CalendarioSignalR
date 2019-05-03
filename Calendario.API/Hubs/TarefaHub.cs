using System;
using calendario;
using Calendario.API.Models;
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
        public async void Atualizar(int id,DateTime newStart, DateTime newEnd) {
            var tarefa = await _repository.GetAllTarefasAsyncById(id);
            tarefa.dataPrevistaInicio = newStart;
            tarefa.dataPrevistaTermino = newEnd;
            await Clients.All.EnviarMudanca(tarefa);
        }
        public async void Update(int id, DateTime newStart, DateTime newEnd){
            var mudanca = await _repository.GetAllTarefasAsyncById(id);
            mudanca.DataRealInicio = newStart;
            mudanca.DataRealTermino = newEnd;
            _repository.Update(mudanca);
            await _repository.SaveChangesAsync();
        }
        public async void UpdateKanban(int id,int status){
            var mudanca = await _repository.GetAllTarefasAsyncById(id);
            mudanca.Status = status;            
            _repository.Update(mudanca);
            await _repository.SaveChangesAsync();
            var novidade = await _repository.GetAllTarefasAsync();
            await Clients.All.Enviar(novidade);
        }



    }
}
