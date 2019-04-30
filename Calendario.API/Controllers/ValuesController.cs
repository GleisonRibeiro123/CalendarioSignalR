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
    public class ValuesController : ControllerBase
    {
        private readonly ITarefaRepository _repo;

        public ValuesController(ITarefaRepository repo)
        {
            _repo = repo;
        }
        // GET api/values
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
               var resultado = await _repo.GetAllTarefasAsync();
               return Ok(resultado); 
            }
            catch (System.Exception)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var resultado = await _repo.GetAllTarefasAsyncById(id);
                return Ok(resultado);
            }
            catch (System.Exception)
            {
                
                throw;
            }
        }

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post(Tarefa model)
        {
            try
            {
                _repo.Add(model);
                if(await _repo.SaveChangesAsync())
                {
                    return Created($"/api/value/{model.Id}", model);
                }
            }
            catch (System.Exception)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
            return BadRequest();
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id,Tarefa model)
        {  
             

            try
            {

                var mudanca = await _repo.GetAllTarefasAsyncById(id);
                if(mudanca == null) return NotFound();
 
                _repo.Update(model);

                if(await _repo.SaveChangesAsync())
                {

                    return Created($"/api/values/{model.Id}", model);
                }
            }
            catch (Exception)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
            return BadRequest();
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deletado = await _repo.GetAllTarefasAsyncById(id);
                if(deletado == null) return NotFound();

                _repo.Delete(deletado);
                if(await _repo.SaveChangesAsync())
                {
                    return Ok();
                }
            }
            catch (System.Exception)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou");
            }
            return BadRequest();
        }

        
        }
     
    }



