using Microsoft.EntityFrameworkCore;
using Upggift1.Repository;
using Uppgift1;
using Uppgift1.Data;
using Uppgift1.Models;

namespace ToDoTests
{
    public class ToDoAppTests
    {
        private readonly NoteRepository _repo;
        public ToDoAppTests()
        {
            var optionsBuilder = new DbContextOptionsBuilder<NoteDbContext>().UseInMemoryDatabase("InMemory");
            NoteDbContext context = new NoteDbContext(optionsBuilder.Options);
            _repo = new NoteRepository(context);
        }

        [Fact]
        public void Add_Note_Should_Return_ToDoNote_With_Details()
        {
            var noteRequest = new ToDoNoteInputModel("TestHeader", "TestNote", "2023-01-01");

            var result = _repo.AddNote(noteRequest);

            Assert.NotNull(result);
            Assert.Equal(noteRequest.Heading, result.Heading);
            Assert.Equal(noteRequest.Text, result.Text);
        }
        [Fact]
        public void Add_Note_Should_Return_Null()
        {
            ToDoNoteInputModel? noteRequest = null;

            var result = _repo.AddNote(noteRequest);

            Assert.Null(result);
        }
        [Fact]
        public void Remove_Note_Should_Return_RemovedNote_With_Details()
        {
            var noteRequest = new ToDoNoteInputModel("TestHeader", "TestNote", "2023-01-01");
            var result = _repo.AddNote(noteRequest);

            var removed = _repo.RemoveNote(result.Id);

            Assert.NotNull(removed);
            Assert.Equal(noteRequest.Heading, result.Heading);
            Assert.Equal(noteRequest.Text, result.Text);
        }
        [Fact]
        public void Remove_Note_Should_Return_Null()
        {
            var removed = _repo.RemoveNote(null);

            Assert.Null(removed);
        }
        [Fact]
        public void Update_Note_Should_Return_Different_IsDone_Value()
        {
            var noteRequest = new ToDoNoteInputModel("TestHeader", "TestNote", "2023-01-01");
            var addedNote = _repo.AddNote(noteRequest);
            var currentStatus = addedNote.IsDone;

            var removed = _repo.UpdateStatus(addedNote.Id);

            Assert.NotNull(removed);
            Assert.NotEqual(currentStatus, removed.Value);
        }
        [Fact]
        public void Update_Note_Should_Return_Null()
        {
            var removed = _repo.UpdateStatus(null);

            Assert.Null(removed);
        }
    }
}