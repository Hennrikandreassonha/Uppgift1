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
        private readonly NoteDbContext _dbContext;
        public ToDoAppTests()
        {
            var optionsBuilder = new DbContextOptionsBuilder<NoteDbContext>().UseInMemoryDatabase("InMemory");
            _dbContext = new NoteDbContext(optionsBuilder.Options);
            _repo = new NoteRepository(_dbContext);
        }

        [Fact]
        public void Add_Note_Should_Return_ToDoNote_With_Details()
        {
            //Arrange
            var userForTest = new User("123", "123");
            _dbContext.User.Add(userForTest);
           
            var noteRequest = new ToDoNoteInputModel("TestHeader", "TestNote", 1, "2023-01-01");
            
            //Act
            var result = _repo.AddNote(noteRequest);

            //Assert
            Assert.NotNull(result);
            Assert.Equal(noteRequest.Heading, result.Heading);
            Assert.Equal(noteRequest.Text, result.Text);
            Assert.Equal(DateTime.Parse(noteRequest.Deadline), result.DeadLine);
        }
        [Fact]
        public void Add_Note_Should_Return_Null()
        {
            //Arrange
            ToDoNoteInputModel? noteRequest = null;

            //Act
            var result = _repo.AddNote(noteRequest);

            //Assert
            Assert.Null(result);
        }
        [Fact]
        public void Remove_Note_Should_Return_RemovedNote_With_Details()
        {
            //Arrange
            var userForTest = new User("123", "123");
            _dbContext.User.Add(userForTest);

            var noteRequest = new ToDoNoteInputModel("TestHeader", "TestNote", 1, "2023-01-01");

            //Act
            var result = _repo.AddNote(noteRequest);

            var removed = _repo.RemoveNote(result.Id);

            //Assert
            Assert.NotNull(removed);
            Assert.Equal(noteRequest.Heading, result.Heading);
            Assert.Equal(noteRequest.Text, result.Text);
        }
        [Fact]
        public void Remove_Note_Should_Return_Null()
        {
            //Arrange and Act
            var removed = _repo.RemoveNote(null);

            //Assert
            Assert.Null(removed);
        }
        [Fact]
        public void Update_Note_Should_Return_Different_IsDone_Value()
        {
            //Arrange
            var userForTest = new User("123", "123");
            _dbContext.User.Add(userForTest);

            var noteRequest = new ToDoNoteInputModel("TestHeader", "TestNote", 1, "2023-01-01");

            //Act
            var addedNote = _repo.AddNote(noteRequest);
            var currentStatus = addedNote.IsDone;

            var removed = _repo.UpdateStatus(addedNote.Id);

            //Assert
            Assert.NotNull(removed);
            Assert.NotEqual(currentStatus, removed.Value);
        }
        [Fact]
        public void Update_Note_Should_Return_Null()
        {
            //Arrange and act
            var removed = _repo.UpdateStatus(null);

            //Assert
            Assert.Null(removed);
        }
        [Fact]
        public void Get_All_User_Notes_Should_Return_Correct_Amount()
        {
            //Arrange
            var userForTest = new User("123", "123");
            _dbContext.User.Add(userForTest);

            var newNote1 = new ToDoNoteInputModel("TestHeader", "TestNote", 1, "2023-01-01");
            var newNote2 = new ToDoNoteInputModel("TestHeader", "TestNote", 1, "2023-01-01");

            //Act
            _repo.AddNote(newNote1);
            _repo.AddNote(newNote2);
            _dbContext.SaveChanges();

            var notes = _repo.GetAllNotes(1);

            //Assert
            Assert.NotNull(notes);
            Assert.NotEqual(notes.Length, 1);
        }
        [Fact]
        public void Get_All_User_Notes_Should_Return_No_Notes()
        {
            //Arrange
            var userForTest1 = new User("123", "123");
            var userForTest2 = new User("123", "123");

            //Act
            _dbContext.User.Add(userForTest1);
            _dbContext.User.Add(userForTest2);

            //Wrong ID
            var newNote1 = new ToDoNoteInputModel("TestHeader", "TestNote", 2, "2023-01-01");

            _repo.AddNote(newNote1);
            _dbContext.SaveChanges();

            var notes = _repo.GetAllNotes(1);

            //Assert
            Assert.Null(notes);
        }
    }
}