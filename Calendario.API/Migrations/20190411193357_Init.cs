using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Calendario.API.Migrations
{
    public partial class Init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tarefas",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(nullable: true),
                    dataPrevistaInicio = table.Column<DateTime>(nullable: true),
                    dataPrevistaTermino = table.Column<DateTime>(nullable: true),
                    DataRealInicio = table.Column<DateTime>(nullable: true),
                    DataRealTermino = table.Column<DateTime>(nullable: true),
                    TempoEsforcoPrevisto = table.Column<double>(nullable: false),
                    TempoEsforcoReal = table.Column<double>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    Prioridade = table.Column<int>(nullable: false),
                    usuarioId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tarefas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tarefas");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
