using System.Threading.Tasks;

namespace calendario
{
    public interface ITypedHubClient
    {
        Task Enviar(object objeto);
    }
}