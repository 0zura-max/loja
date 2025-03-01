using Microsoft.AspNetCore.Mvc;
using Teste.Services;
using Teste.Models;
using System.Threading.Tasks;

namespace Teste.Controllers
{
    [ApiController]
    [Route("api/usuarios")]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;
        private readonly JwtService _jwtService; 

        public UsuarioController(UsuarioService usuarioService, JwtService jwtService)
        {
            _usuarioService = usuarioService;
            _jwtService = jwtService;
        }

        [HttpPost("criar")]
        public async Task<IActionResult> CriarUsuario([FromBody] UsuarioRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Nome) || string.IsNullOrWhiteSpace(request.Senha))
            {
                return BadRequest("Os campos nome e senha são obrigatórios.");
            }

            try
            {
                await _usuarioService.CriarUsuario(request.Nome, request.Senha);
                return Ok("Usuário criado com sucesso!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        public class UsuarioRequest
        {
            public string Nome { get; set; }
            public string Senha { get; set; }
        }

        public class LoginRequest
        {
            public string Nome { get; set; }
            public string Senha { get; set; }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _usuarioService.Login(request.Nome, request.Senha);
            if (token == null)
            {
                return Unauthorized("Credenciais inválidas.");
            }

            return Ok(new { Token = token }); 
        }
    }
}
