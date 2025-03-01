using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Teste.Models;
using Teste.Services;

namespace Teste.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProdutosController : ControllerBase
    {
        private readonly ProdutoService _produtoService;

        public ProdutosController(ProdutoService produtoService)
        {
            _produtoService = produtoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Produto>>> GetAll()
        {
            try
            {
                var produtos = await _produtoService.GetAllAsync();
                return Ok(produtos);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpGet("{codigo}")]
        [AllowAnonymous]
        public async Task<ActionResult<Produto>> GetById(int codigo)
        {
            try
            {
                var produto = await _produtoService.GetByIdAsync(codigo);
                if (produto == null) return NotFound("Produto não encontrado");
                return Ok(produto);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<Produto>> Create(Produto produto)
        {
            try
            {
                var produtoCriado = await _produtoService.AddAsync(produto);
                return CreatedAtAction(nameof(GetById), new { codigo = produtoCriado.Codigo }, produtoCriado);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{codigo}")]
        public async Task<IActionResult> Update(int codigo, [FromBody] Produto produto)
        {
            if (codigo != produto.Codigo) return BadRequest("Código do produto inválido.");

            try
            {
                await _produtoService.UpdateAsync(produto);
                return NoContent();
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{codigo}")]
        public async Task<IActionResult> Delete(int codigo)
        {
            try
            {
                await _produtoService.DeleteAsync(codigo);
                return NoContent();
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}