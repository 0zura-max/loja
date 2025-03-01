using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Teste.Data;
using Teste.Models;
using Microsoft.Data.SqlClient;

namespace Teste.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly AppDbContext _context;

        public UsuarioRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Usuario usuario)
        {
            try
            {
                await _context.Usuarios.AddAsync(usuario);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException is SqlException sqlEx && sqlEx.Number == 2627) 
                {
                    throw new Exception("Usuário já existe. Escolha outro nome.");
                }

                throw; // Re-lança a exceção original se for outro erro
            }
        }

        public async Task<Usuario> GetByNomeAsync(string nome)
        {
            return await _context.Usuarios.FirstOrDefaultAsync(u => u.Nome == nome);
        }
    }
}
