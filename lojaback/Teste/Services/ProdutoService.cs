using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Teste.Models;
using Teste.Repositories;

namespace Teste.Services
{
    public class ProdutoService
    {
        private readonly IProdutoRepository _produtoRepository;
        private readonly JwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ProdutoService(
            IProdutoRepository produtoRepository,
            JwtService jwtService,
            IHttpContextAccessor httpContextAccessor)
        {
            _produtoRepository = produtoRepository;
            _jwtService = jwtService;
            _httpContextAccessor = httpContextAccessor;
        }

        private string ObterUsuarioNome()
        {
            var authorizationHeader = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
            {
                throw new UnauthorizedAccessException("Token não fornecido.");
            }
            var token = authorizationHeader.Substring("Bearer ".Length).Trim();
            return _jwtService.ObterNomeUsuario(token);
        }

        private bool CodigoBarrasValido(string? codigoBarras)
        {
            return string.IsNullOrEmpty(codigoBarras) || Regex.IsMatch(codigoBarras, "^[0-9]{13}$");
        }

        public async Task<IEnumerable<Produto>> GetAllAsync()
        {
            var usuarioNome = ObterUsuarioNome();
            return await _produtoRepository.GetAllAsync(usuarioNome);
        }

        public async Task<Produto> GetByIdAsync(int codigo)
        {
            var usuarioNome = ObterUsuarioNome();
            return await _produtoRepository.GetByIdAsync(codigo, usuarioNome);
        }

        public async Task<Produto> AddAsync(Produto produto)
        {
            var usuarioNome = ObterUsuarioNome();

            if (!CodigoBarrasValido(produto.CodigoBarras))
            {
                throw new System.Exception("O código de barras deve conter exatamente 13 números.");
            }

            if (produto.ValorVenda <= 0)
            {
                throw new System.Exception("O valor de venda não pode ser 0.");
            }

            if (produto.PesoBruto <= 0)
            {
                throw new System.Exception("O peso bruto não pode ser 0.");
            }

            if (produto.PesoLiquido <= 0)
            {
                throw new System.Exception("O peso líquido não pode ser 0.");
            }

            try
            {
                await _produtoRepository.AddAsync(produto, usuarioNome);
                return produto;
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException?.Message.Contains("PRIMARY") == true)
                {
                    throw new System.Exception("Já existe um produto com esse código.");
                }
                if (ex.InnerException?.Message.Contains("UNIQUE") == true ||
                    ex.InnerException?.Message.Contains("duplicate") == true)
                {
                    throw new System.Exception("Já existe um produto com esse código de barras.");
                }
                throw new System.Exception("Erro ao salvar no banco de dados.");
            }
        }

        public async Task UpdateAsync(Produto produto)
        {
            var usuarioNome = ObterUsuarioNome();

            if (!CodigoBarrasValido(produto.CodigoBarras))
            {
                throw new System.Exception("O código de barras deve conter exatamente 13 números.");
            }

            if (produto.ValorVenda <= 0)
            {
                throw new System.Exception("O valor de venda não pode ser 0.");
}

            else if (produto.PesoBruto <= 0)
            {
                throw new System.Exception("O peso bruto não pode ser 0.");
            }

            else if (produto.PesoLiquido <= 0)
            {
                throw new System.Exception("O peso líquido não pode ser 0.");
            }

            try
            {
                await _produtoRepository.UpdateAsync(produto, usuarioNome);
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException?.Message.Contains("PRIMARY") == true)
                {
                    throw new System.Exception("O código do produto não pode ser alterado.");
                }
                if (ex.InnerException?.Message.Contains("UNIQUE") == true ||
                    ex.InnerException?.Message.Contains("duplicate") == true)
                {
                    throw new System.Exception("Já existe um produto com esse código de barras.");
                }
                throw new System.Exception("Erro ao atualizar o produto no banco de dados.");
            }
        }

        public async Task DeleteAsync(int codigo)
        {
            var usuarioNome = ObterUsuarioNome();
            await _produtoRepository.DeleteAsync(codigo, usuarioNome);
        }
    }
}