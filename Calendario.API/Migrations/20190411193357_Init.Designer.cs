﻿// <auto-generated />
using System;
using Calendario.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Calendario.API.Migrations
{
    [DbContext(typeof(TarefaContext))]
    [Migration("20190411193357_Init")]
    partial class Init
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.3-servicing-35854");

            modelBuilder.Entity("Calendario.API.Models.Tarefa", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("DataRealInicio");

                    b.Property<DateTime?>("DataRealTermino");

                    b.Property<int>("Prioridade");

                    b.Property<int>("Status");

                    b.Property<double>("TempoEsforcoPrevisto");

                    b.Property<double>("TempoEsforcoReal");

                    b.Property<string>("Title");

                    b.Property<DateTime?>("dataPrevistaInicio");

                    b.Property<DateTime?>("dataPrevistaTermino");

                    b.Property<int?>("usuarioId");

                    b.HasKey("Id");

                    b.ToTable("Tarefas");
                });

            modelBuilder.Entity("Calendario.API.Models.Usuario", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Nome");

                    b.HasKey("Id");

                    b.ToTable("Usuarios");
                });
#pragma warning restore 612, 618
        }
    }
}
