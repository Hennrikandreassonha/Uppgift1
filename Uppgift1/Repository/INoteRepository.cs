using Uppgift1.Models;

namespace Uppgift1.Repository
{
    public interface INoteRepository
    {
        ToDoNote? AddNote(ToDoNoteInputModel note);
        int? RemoveNote(int? id);
        bool? UpdateStatus(int? id);
        ToDoNote? GetNote(int? id);
        ToDoNote[] GetAllNotes(int id);
    }
}
