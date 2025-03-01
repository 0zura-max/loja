using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Teste.Models
{
    public class Produto
    {
        [Required]
        public int Codigo { get; set; }

        [Required]
        [StringLength(255)]
        [Column("descricao")]
        public string Descricao { get; set; }

        [Required]
        [StringLength(100)]
        [Column("codigo_barras")]
        public string CodigoBarras { get; set; }

        [Required]
        [Column("valor_venda", TypeName = "decimal(10,2)")]
        public decimal? ValorVenda { get; set; }

        [Required]
        [Column("peso_bruto", TypeName = "decimal(10,2)")]
        public decimal? PesoBruto { get; set; }

        [Required]
        [Column("peso_liquido", TypeName = "decimal(10,2)")]
        public decimal? PesoLiquido { get; set; }

        [Required]
        [StringLength(100)]
        [Column("usuario_nome")]
        public string UsuarioNome { get; set; }
    }
}
