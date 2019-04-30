using Calendario.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Calendario.API.Data
{
    public class TarefaContext : DbContext
    {
        public TarefaContext (DbContextOptions<TarefaContext> options) : base (options) {}

        public DbSet<Tarefa> Tarefas { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
    }
}