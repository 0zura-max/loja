using Microsoft.EntityFrameworkCore;
using Teste.Data;
using Teste.Models;

namespace Teste.Repositories
{
    public class ClienteRepository : IClienteRepository
    {
        private readonly AppDbContext _context;

        public ClienteRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cliente>> GetAll(string usuarioNome)
        {
            return await _context.Clientes
                .Where(c => c.UsuarioNome == usuarioNome)
                .ToListAsync();
        }


        public async Task<Cliente?> GetById(int id, string usuarioNome)
        {
            return await _context.Clientes
                .FirstOrDefaultAsync(c => c.Codigo == id && c.UsuarioNome == usuarioNome);
        }
        public async Task Add(Cliente cliente, string usuarioNome)
        {
            cliente.UsuarioNome = usuarioNome;
            cliente.Codigo = await ObterProximoCodigo(usuarioNome); 

            await _context.Clientes.AddAsync(cliente);
            await _context.SaveChangesAsync();
        }

        public async Task<int> ObterProximoCodigo(string usuarioNome)
        {
            var ultimoCodigo = await _context.Clientes
                .Where(c => c.UsuarioNome == usuarioNome)
                .OrderByDescending(c => c.Codigo)
                .Select(c => c.Codigo)
                .FirstOrDefaultAsync();

            return ultimoCodigo + 1; 
        }



        public async Task Update(Cliente cliente, string usuarioNome)
        {
            var clienteExistente = await _context.Clientes
                .FirstOrDefaultAsync(c => c.Codigo == cliente.Codigo && c.UsuarioNome == usuarioNome);

            if (clienteExistente != null)
            {
                _context.Entry(clienteExistente).CurrentValues.SetValues(new
                {
                    cliente.Nome,
                    cliente.Fantasia,
                    cliente.Documento,
                    cliente.Endereco
                });

                await _context.SaveChangesAsync();
                
            }
            else
            {
                throw new InvalidOperationException("Cliente não encontrado");
            }

            
        }




        public async Task Delete(int id,string usuarioNome)
        {
            var cliente = await _context.Clientes
                                        .FirstOrDefaultAsync(c => c.Codigo == id && c.UsuarioNome==usuarioNome);

            if (cliente != null)
            {
                _context.Clientes.Remove(cliente);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new InvalidOperationException("Cliente não encontrado.");
            }
        }

    }
}
