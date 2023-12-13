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

        public ToDoNote? AddNote(ToDoNoteInputModel note)
        {
            if (note == null) return null;

            DateTime? deadlineToDb = null;
            bool dateParse = DateTime.TryParse(note.Deadline, out DateTime deadline);

            if (dateParse) deadlineToDb = deadline;

            ToDoNote newNote = new ToDoNote(note.Heading, note.Text, DateTime.Now, deadlineToDb);

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
    }
}
