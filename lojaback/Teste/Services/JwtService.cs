using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Teste.Data;
using Teste.Models;

namespace Teste.Services
{
    public class JwtService
    {
        private readonly string _secretKey;
        private readonly AppDbContext _context;

        public JwtService(IConfiguration configuration, AppDbContext context)
        {
            _secretKey = configuration["Jwt:Key"] ?? throw new Exception("Chave JWT não configurada.");
            _context = context;
        }

        public string GerarToken(string nomeUsuario)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, nomeUsuario)
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public ClaimsPrincipal? ValidarToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_secretKey);

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
                return principal;
            }
            catch
            {
                return null;
            }
        }

        public string? ObterNomeUsuario(string token)
        {
            var principal = ValidarToken(token);
            if (principal == null)
                return null;

            var nomeUsuario = principal.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(nomeUsuario))
                return null;

            var usuarioExiste = _context.Usuarios.Any(u => u.Nome == nomeUsuario);
            return usuarioExiste ? nomeUsuario : null;
        }
    }
}
