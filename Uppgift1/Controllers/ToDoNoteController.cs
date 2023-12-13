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
            if (newNote == null) return BadRequest("Note is empty");

            var result = _repo.AddNote(newNote);

            if (result != null) return Ok("Note added");

            return BadRequest("Something went wrong");
        }

        [HttpDelete]
        public IActionResult Id([FromBody] int? id)
        {
            if (id == null) return BadRequest("Input wass empty");

            var result = _repo.RemoveNote(id);

            if (id == result) return Ok("Note removed");

            return BadRequest("Something went wrong");
        }
    }
}