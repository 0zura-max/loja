using System.Collections.Generic;
using System.Threading.Tasks;
using Teste.Models;

namespace Teste.Repositories
{
    public interface IProdutoRepository
    {
        Task<IEnumerable<Produto>> GetAllAsync(string usuarioNome);
        Task<Produto> GetByIdAsync(int codigo, string usuarioNome);
        Task AddAsync(Produto produto, string usuarioNome);
        Task UpdateAsync(Produto produto, string usuarioNome);
        Task DeleteAsync(int codigo, string usuarioNome);
    }
}