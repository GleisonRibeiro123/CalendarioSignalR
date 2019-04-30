using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Calendario.API.Models
{
    public class Tarefa
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime? dataPrevistaInicio { get; set; }
        public DateTime? dataPrevistaTermino { get; set; }
        public DateTime? DataRealInicio { get; set; }
        public DateTime? DataRealTermino { get; set; }
        public double TempoEsforcoPrevisto { get; set; }
        public double TempoEsforcoReal { get;set; }
        public int Status { get; set; }
        public int Prioridade { get; set; }
    
        public virtual Usuario Responsavel { get; }
        public int? usuarioId { get;set; }

    }
}