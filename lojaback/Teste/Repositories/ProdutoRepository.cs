using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Teste.Data;
using Teste.Models;

namespace Teste.Repositories
{
    public class ProdutoRepository : IProdutoRepository
    {
        private readonly AppDbContext _context;

        public ProdutoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Produto>> GetAllAsync(string usuarioNome)
        {
            return await _context.Produtos.Where(p =>p.UsuarioNome == usuarioNome)
                .ToListAsync();
        }

        public async Task<Produto> GetByIdAsync(int codigo, string usuarioNome)
        {
            return await _context.Produtos.FirstOrDefaultAsync(p => p.Codigo == codigo && p.UsuarioNome == usuarioNome);
        }

        public async Task AddAsync(Produto produto, string usuarioNome)
        {
            produto.UsuarioNome = usuarioNome;
            produto.Codigo = await ObterProximoCodigo(usuarioNome); 

            await _context.Produtos.AddAsync(produto);
            await _context.SaveChangesAsync();
        }

        public async Task<int> ObterProximoCodigo(string usuarioNome)
        {
            var ultimoCodigo = await _context.Produtos
                .Where(p => p.UsuarioNome == usuarioNome)
                .OrderByDescending(p => p.Codigo)
                .Select(p => p.Codigo)
                .FirstOrDefaultAsync();

            return ultimoCodigo + 1; 
        }

        public async Task UpdateAsync(Produto produto, string usuarioNome)
        {
            var produtoExistente = await _context.Produtos
                .FirstOrDefaultAsync(p => p.Codigo == produto.Codigo && p.UsuarioNome == usuarioNome);

            if (produtoExistente == null)
            {
                throw new InvalidOperationException("Produto não encontrado");
            }

            _context.Entry(produtoExistente).CurrentValues.SetValues(new
            {
                produto.Descricao,
                produto.CodigoBarras,
                produto.ValorVenda,
                produto.PesoBruto,
                produto.PesoLiquido
            });

            await _context.SaveChangesAsync();
        }


        public async Task DeleteAsync(int codigo, string usuarioNome)
        {
            var produto = await _context.Produtos.FirstOrDefaultAsync(p => p.Codigo == codigo && p.UsuarioNome == usuarioNome);
            if (produto != null)
            {
                _context.Produtos.Remove(produto);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new InvalidOperationException("Produto não encontrado.");
            }
        }
    }
}