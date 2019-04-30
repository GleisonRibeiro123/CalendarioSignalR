using System.Reflection.Metadata.Ecma335;
using System.Linq;
using System.Threading.Tasks;
using Calendario.API.Data;
using Calendario.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Calendario.API.Repository
{
    public class TarefaRepository : ITarefaRepository
    {
        private readonly TarefaContext _context;

        public TarefaRepository(TarefaContext context)
        {
            _context = context;
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }
        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }
        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0 ; 
        }


        //Todos os métodos GET
        public async Task<Tarefa[]> GetAllTarefasAsync()
        {
            IQueryable<Tarefa> query = _context.Tarefas;

            return await query.ToArrayAsync();
        }

        public async Task<Tarefa> GetAllTarefasAsyncById(int Id)
        {
            IQueryable<Tarefa> query = _context.Tarefas;


            query = query.AsNoTracking().Where(c => c.Id == Id).OrderBy(c => c.Id == Id);

            return await query.FirstOrDefaultAsync();

        }
        //Usuario
        public async Task<Usuario[]> GetAllUsuariosAsync()
        {
            IQueryable<Usuario> query = _context.Usuarios;
            return await query.ToArrayAsync();
        }
        public async Task<Usuario> GetUsuarioAsyncById(int Id)
        {
            IQueryable<Usuario> query = _context.Usuarios;

            query = query.Where(c => c.Id == Id);

            return await query.FirstOrDefaultAsync();

        }
        public async Task<Tarefa[]> GetTarefasAsyncByUsuario(int id)
        {
            IQueryable<Tarefa> query = _context.Tarefas;
            query = query.Where(c => c.usuarioId == id);

            return await query.ToArrayAsync();
        }
    
    }
}