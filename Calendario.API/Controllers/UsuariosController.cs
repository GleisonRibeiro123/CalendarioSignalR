using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Calendario.API.Data;
using Calendario.API.Models;
using Calendario.API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Calendario.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly ITarefaRepository _repo;

        public UsuariosController(ITarefaRepository repo)
        {
            _repo = repo;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var resultado = await _repo.GetAllUsuariosAsync();
                return Ok(resultado);
            }
            catch (System.Exception)
            {
                
                 return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
        }
        [HttpGet("getbyuser/{id}")]
        public async Task<IActionResult> GetUsuarios(int id){
            try
            {
                var resultado = await _repo.GetTarefasAsyncByUsuario(id);
                return Ok(resultado);
            }
            catch (System.Exception)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
        }
    }
}