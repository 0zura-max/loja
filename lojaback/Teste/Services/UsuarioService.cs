using System.Threading.Tasks;
using Teste.Models;
using Teste.Repositories;
using BCrypt.Net;

namespace Teste.Services
{
    public class UsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly JwtService _jwtService;

        public UsuarioService(IUsuarioRepository usuarioRepository, JwtService jwtService)
        {
            _usuarioRepository = usuarioRepository;
            _jwtService = jwtService;
        }

        public async Task<Usuario> CriarUsuario(string nome, string senha)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(nome) || nome.Length < 3)
                {
                    throw new Exception("O nome do usuário deve ter pelo menos 3 caracteres.");
                }

                string senhaCriptografada = BCrypt.Net.BCrypt.HashPassword(senha);

                var usuario = new Usuario
                {
                    Nome = nome,
                    Senha = senhaCriptografada 
                };

                await _usuarioRepository.AddAsync(usuario);
                return usuario;
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao criar usuário: {ex.Message}");
            }
        }


        public async Task<string?> Login(string nome, string senha)
        {
            var usuario = await _usuarioRepository.GetByNomeAsync(nome);
            if (usuario == null)
            {
                return null; 
            }

            bool senhaValida = BCrypt.Net.BCrypt.Verify(senha, usuario.Senha);
            if (!senhaValida)
            {
                return null; 
            }

            string token = _jwtService.GerarToken(usuario.Nome);
            return token;
        }
    }
}
