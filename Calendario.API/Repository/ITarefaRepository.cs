using System.Threading.Tasks;
using Calendario.API.Models;

namespace Calendario.API.Repository
{
    public interface ITarefaRepository
    {
        void Add<T>(T entity) where T : class;
         void Update<T>(T entity) where T : class;
         void Delete<T>(T entity) where T : class;

         Task<bool> SaveChangesAsync();

         Task<Tarefa[]> GetAllTarefasAsync();
         Task<Tarefa> GetAllTarefasAsyncById(int Id);
        Task<Tarefa[]> GetTarefasAsyncByUsuario(int id);

         Task<Usuario[]> GetAllUsuariosAsync();
         Task<Usuario> GetUsuarioAsyncById(int Id);
   

        
    }
}