using System.Reflection.Metadata.Ecma335;
using Uppgift1.Data;
using Uppgift1.Models;
using Uppgift1.Repository;

namespace Upggift1.Repository
{
    public class NoteRepository : INoteRepository
    {
        private readonly NoteDbContext _context;
        public NoteRepository(NoteDbContext context)
        {
            _context = context;
        }

        //Using repository pattern making it easier to test the code and it removes logic from controller.
        public ToDoNote? AddNote(ToDoNoteInputModel note)
        {
            //Inputmodel is used as a Dto, Data transfer object. It will be converted to a ToDoNote before its put in database.
            if (note == null) return null;

            DateTime? deadlineToDb = null;
            bool dateParse = DateTime.TryParse(note.Deadline, out DateTime deadline);

            if (dateParse) deadlineToDb = deadline;

            ToDoNote newNote = new ToDoNote(note.Heading, note.Text, DateTime.Now, note.UserId, deadlineToDb);

            if (newNote == null) return null;

            _context.Note.Add(newNote);
            _context.SaveChanges();
            return newNote;
        }

        public int? RemoveNote(int? id)
        {
            if (id == null) return null;

            ToDoNote noteToRemove = _context.Note.Find(id);

            if (noteToRemove == null) return null;

            _context.Note.Remove(noteToRemove);
            _context.SaveChanges();

            return noteToRemove.Id;
        }
        public bool? UpdateStatus(int? id)
        {
            if (id == null) return null;

            ToDoNote noteToUpdate = _context.Note.Find(id);

            if (noteToUpdate == null) return null;

            noteToUpdate.IsDone = !noteToUpdate.IsDone;
            _context.SaveChanges();

            return noteToUpdate.IsDone;
        }
        public ToDoNote? GetNote(int? id)
        {
            if (id == null) return null;

            return _context.Note.Find(id);
        }
        public ToDoNote[] GetAllNotes(int id)
        {
            return _context.Note.Where(x => x.UserId == id).ToArray();
        }
    }
}
