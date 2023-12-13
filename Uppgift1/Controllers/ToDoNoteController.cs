using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Uppgift1.Data;
using Uppgift1.Models;
using Uppgift1.Repository;

namespace Uppgift1.Controllers
{
    [Route("[controller]")]
    public class ToDoNoteController : Controller
    {
        private INoteRepository _repo;
        public ToDoNoteController(INoteRepository repo)
        {
            _repo = repo;
        }

        [HttpPost]
        public IActionResult Add([FromBody] ToDoNoteInputModel newNote)
        {
            if (newNote == null) return BadRequest(new { message = "Note is empty" });

            var result = _repo.AddNote(newNote);

            if (result != null) return Ok(new { message = "Note added", id = result.Id });

            return BadRequest(new { message = "Something went wrong" });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id == null) return BadRequest(new { message = "Input was empty" });

            var result = _repo.RemoveNote(id);

            if (id == result) return Ok(new { message = "Note removed"});

            return BadRequest(new { message = "Something went wrong" });
        }
        [HttpPut("{id}")]
        public IActionResult Update(int? id)
        {
            if (id == null) return BadRequest(new { message = "Input was empty" });

            _repo.UpdateStatus(id);

            return Ok(new { message = "Note updated" });
        }
    }
}