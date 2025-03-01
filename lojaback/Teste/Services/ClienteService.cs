using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Teste.Models;
using Teste.Repositories;

namespace Teste.Services
{
    public class ClienteService
    {
        private readonly IClienteRepository _clienteRepository;
        private readonly JwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ClienteService(
            IClienteRepository clienteRepository,
            JwtService jwtService,
            IHttpContextAccessor httpContextAccessor)
        {
            _clienteRepository = clienteRepository;
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

        private bool ValidarCpf(string cpf)
        {
            return !string.IsNullOrWhiteSpace(cpf) && cpf.Length == 11 && cpf.All(char.IsDigit);
        }

 
        public async Task<IEnumerable<Cliente>> ListarClientes()
        {
            var usuarioNome = ObterUsuarioNome();
            return await _clienteRepository.GetAll(usuarioNome);
        }

        public async Task<Cliente?> BuscarCliente(int id)
        {
            var usuarioNome = ObterUsuarioNome();
            return await _clienteRepository.GetById(id, usuarioNome);
        }

        public async Task AdicionarCliente(Cliente cliente)
        {
            var usuarioNome = ObterUsuarioNome();

            if (!ValidarCpf(cliente.Documento))
            {
                throw new System.Exception("CPF inválido. Deve conter exatamente 11 dígitos numéricos.");
            }

            try
            {
                await _clienteRepository.Add(cliente, usuarioNome);
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException?.Message.Contains("UNIQUE") == true ||
                    ex.InnerException?.Message.Contains("duplicate") == true)
                {
                    throw new System.Exception("Já existe um cliente com esse documento.");
                }
                throw new System.Exception("Erro ao salvar no banco de dados.");
            }
        }

        public async Task AtualizarCliente(Cliente cliente)
        {
            var usuarioNome = ObterUsuarioNome();

            if (!ValidarCpf(cliente.Documento))
            {
                throw new System.Exception("CPF inválido. Deve conter exatamente 11 dígitos numéricos.");
            }

            try
            {
                await _clienteRepository.Update(cliente, usuarioNome);
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException?.Message.Contains("PRIMARY") == true)
                {
                    throw new System.Exception("O código do cliente não pode ser alterado.");
                }
                if (ex.InnerException?.Message.Contains("UNIQUE") == true ||
                    ex.InnerException?.Message.Contains("duplicate") == true)
                {
                    throw new System.Exception("Já existe um cliente com esse documento.");
                }
                throw new System.Exception("Erro ao atualizar o cliente no banco de dados.");
            }
        }

        public async Task RemoverCliente(int id)
        {
            var usuarioNome = ObterUsuarioNome();
            await _clienteRepository.Delete(id, usuarioNome);
        }
    }
}