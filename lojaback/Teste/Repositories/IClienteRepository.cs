using Teste.Models;

namespace Teste.Repositories
{
    public interface IClienteRepository
    {
        Task<IEnumerable<Cliente>> GetAll(string usuarioNome);
        Task<Cliente?> GetById(int id, string usuarioNome);
        Task Add(Cliente cliente, string usuarioNome);
        Task Update(Cliente cliente, string usuarioNome);
        Task Delete(int id, string usuarioNome);
    }
}
