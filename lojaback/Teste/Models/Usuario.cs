using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Teste.Models
{
    public class Usuario
    {
        [Key]
        [Required]
        public string Nome { get; set; } 

        [Required]
        public string Senha { get; set; }

        public ICollection<Produto> Produtos { get; set; }
        public ICollection<Cliente> Clientes { get; set; }
    }
}
