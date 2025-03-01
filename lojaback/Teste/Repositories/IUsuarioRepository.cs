using System.Threading.Tasks;
using Teste.Models;

namespace Teste.Repositories
{
    public interface IUsuarioRepository
    {
        Task AddAsync(Usuario usuario);
        Task<Usuario> GetByNomeAsync(string nome);
    }
}