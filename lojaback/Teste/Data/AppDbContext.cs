using Microsoft.EntityFrameworkCore;
using Teste.Models;

namespace Teste.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Produto> Produtos { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=LAPTOP-1KB7IMR7\\SQLExpress;Database=loja;Integrated Security=True;TrustServerCertificate=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>()
        .HasKey(c => new { c.Codigo, c.UsuarioNome });
            modelBuilder.Entity<Produto>()
       .HasKey(p => new { p.Codigo, p.UsuarioNome });

            modelBuilder.Entity<Produto>()
                .Property(p => p.ValorVenda)
                .HasColumnType("decimal(10,2)");

            modelBuilder.Entity<Produto>()
                .Property(p => p.PesoBruto)
                .HasColumnType("decimal(10,2)");

            modelBuilder.Entity<Produto>()
                .Property(p => p.PesoLiquido)
                .HasColumnType("decimal(10,2)");

            base.OnModelCreating(modelBuilder);
        }
    }
}
