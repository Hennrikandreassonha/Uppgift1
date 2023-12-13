let form = document.querySelector("form");


let toggleAllBtn = document.querySelector("#toggle-all");

let activeToggle = false;
let completedToggle = false;

let allNotes = document.querySelector("#all");
let activeNotes = document.querySelector("#active");
let completedNotes = document.querySelector("#complete");

const apiUrl = 'https://localhost:7275/ToDoNote';

removeBorder();
showFooterAndToggleBtn();

form.onsubmit = (event) => {
    event.preventDefault();

    //Adding a new note.
    let header = form.notetext.value;
    let text = form.text.value;
    let deadline = "";
    if(form.deadline.value != "")
        deadline = `Deadline: ${form.deadline.value}`;

    if (header != "" && text != "") {
        let noteList = document.querySelector("ul");

        let newNote = document.createElement("li");
        newNote.addEventListener("mouseover", showDeleteBtn);
        newNote.addEventListener("mouseleave", hideDeleteBtn);

        let noteHeading = document.createElement("h3");
        noteHeading.textContent = header;
        let noteText = document.createElement("p");
        noteText.textContent = text;

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("click", completeNote);

        var deleteBtn = document.createElement("button");
        deleteBtn.id = "remove-btn";
        deleteBtn.textContent = "❌";
        deleteBtn.className = "visibility-hidden";

        let br = document.createElement("br");

        let noteDiv = document.createElement("div");
        noteDiv.append(noteHeading, br, deadline, br, noteText);

        newNote.append(checkbox, noteDiv, deleteBtn);

        noteList.append(newNote);

        deleteBtn.addEventListener("click", removeItem);

        const noteToDb = new NoteToDb(header, text, form.deadline.value);
        postDoDB(noteToDb);

        form.reset();
        updateAmountItemsLeft();
        showFooterAndToggleBtn();
    }
};

class NoteToDb {
    constructor(header, text, deadline) {
        this.heading = header;
        this.text = text;
        this.deadline = deadline
    }
}

let returnMsg = document.getElementById("return-msg");

function postDoDB(newNote) {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNote)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            returnMsg.textContent = data.message;
        })
        .catch(error => {
            returnMsg.textContent = error.message;
        });
}

//Options for filtering the notes.
allNotes.addEventListener("click", function () {
    completedToggle = false;
    activeToggle = false;

    removeBorder();
    filterNotes();
});
activeNotes.addEventListener("click", function () {
    activeToggle = true;
    completedToggle = false;
    removeBorder();
    filterNotes();
});
completedNotes.addEventListener("click", function () {
    completedToggle = true;
    activeToggle = false;

    removeBorder();
    filterNotes();
});

//Instead of using the focus property we use an outline to show foucs.
function removeBorder() {
    if (completedToggle) {
        allNotes.classList.remove("filterBtn-show-outline");
        activeNotes.classList.remove("filterBtn-show-outline");
        completedNotes.classList.add("filterBtn-show-outline");
    } else if (activeToggle) {
        allNotes.classList.remove("filterBtn-show-outline");
        activeNotes.classList.add("filterBtn-show-outline");
        completedNotes.classList.remove("filterBtn-show-outline");
    } else {
        allNotes.classList.add("filterBtn-show-outline");
        activeNotes.classList.remove("filterBtn-show-outline");
        completedNotes.classList.remove("filterBtn-show-outline");
    }
}

function filterNotes() {
    let noteList = document.querySelectorAll("#to-do-list li");

    if (activeToggle) {
        noteList.forEach((element) => {
            let checkBox = element.querySelector('input[type="checkbox"]');

            if (checkBox.checked) {

                checkBox.parentNode.className = "display-none"
            }
            else {
                checkBox.parentNode.className = "display-flex"
            }
        });
    } else if (completedToggle) {
        noteList.forEach((element) => {
            let checkBox = element.querySelector('input[type="checkbox"]');

            if (checkBox.checked) {
                checkBox.parentNode.className = "display-flex"
            }
            else {
                checkBox.parentNode.className = "display-none"
            }
        });
    } else {
        noteList.forEach((element) => {

            let checkBox = element.querySelector('input[type="checkbox"]');

            checkBox.parentNode.className = "display-flex"

        });
    }
}

function removeListItems() {
    let noteList = document.querySelector("#to-do-list");

    while (noteList.firstElementChild) {
        noteList.firstElementChild.remove();
    }
}

function removeItem() {
    this.parentNode.remove();

    updateAmountItemsLeft();
    showClearCompletedBtn();
    showFooterAndToggleBtn();
}

function completeNote(event) {
    let selectedCheckbox = event.target;
    let noteLiElement = selectedCheckbox.parentNode;

    let noteText = noteLiElement.querySelector("label");

    if (selectedCheckbox.checked) {
        noteText.className = "text-decoration-line";
    } else {
        noteText.className = "text-decoration-none";
    }

    updateAmountItemsLeft();
    showClearCompletedBtn();
    filterNotes();
}

function showDeleteBtn(event) {
    let liElement = event.target;
    let deleteBtn = liElement.querySelector("button");

    if (deleteBtn != null) {
        deleteBtn.className = "visibility-visible";
    }
}

function hideDeleteBtn(event) {
    let liElement = event.target;
    let deleteBtn = liElement.querySelector("button");

    deleteBtn.className = "visibility-hidden";
}

//Updates the counter with the amount of notes left.
function updateAmountItemsLeft() {
    let counter = getAmountNotesLeft();

    let pluralSingular = counter != 1 ? "s" : "";

    let itemLeftlabel = document.querySelector("#itemLeft");

    itemLeftlabel.textContent = `${counter} item${pluralSingular} left`;
}

let clearCompletedBtn = document.querySelector("#clear-completed");

clearCompletedBtn.addEventListener("click", clearCompleted);

function clearCompleted() {
    let noteList = document.querySelectorAll("#to-do-list li");

    noteList.forEach(task => {
        let checkForCompleted = task.querySelector('input[type="checkbox"]');

        if (checkForCompleted.checked) {
            task.remove();
        }

    });
    updateAmountItemsLeft();
    showClearCompletedBtn();
    showFooterAndToggleBtn();
}
//Keep track on how many items is left.
function getAmountNotesLeft() {
    let noteList = document.querySelectorAll("#to-do-list li");
    let counter = 0;

    noteList.forEach((element) => {
        let checkBox = element.querySelector('input[type="checkbox"]');

        if (!checkBox.checked) {
            counter++;
        }
    });



    return counter;
}
function toggleBtnStyle(amountLeft) {

    if (amountLeft == 0) {
        toggleAllBtn.classList.add("zeroOpacity");
        toggleAllBtn.classList.remove("toggle-btn-opacity");

    }
    else {
        toggleAllBtn.classList.add("toggle-btn-opacity");
        toggleAllBtn.classList.remove("zeroOpacity");

    }
}

//Returns the amount of notes which are not completed.
function getAmountNotesDone() {
    let noteList = document.querySelectorAll("#to-do-list li");
    let counter = 0;

    noteList.forEach((element) => {
        let checkBox = element.querySelector('input[type="checkbox"]');

        if (checkBox.checked) {
            counter++;
        }
    });
    toggleBtnStyle(counter);
    return counter;
}

//Displays the clear completed button depending on if any notes are completed
function showClearCompletedBtn() {
    let clearCompletedBtn = document.querySelector("#clear-completed");
    let counter = getAmountNotesDone();
    const width = window.innerWidth;

    //Om skärmen är liten och det finns klara notes
    if (width < 430 && counter > 0) {
        clearCompletedBtn.className = "display-inline-block";
    }
    //Om skärmen är liten och det inte finns några klara
    else if (width < 430) {
        clearCompletedBtn.className = "display-none";
    }
    //Om skärmen är stor och det finns klara notes
    else if (counter > 0) {
        clearCompletedBtn.className = "visibility-visible";
    }
    //Skärmen är stor och det finns inga klara notes.
    else {
        clearCompletedBtn.className = "visibility-hidden";
    }
}

toggleAllBtn.addEventListener("mousedown", function (event) {
    event.preventDefault();
    toggleAllNotes();
});

function toggleAllNotes() {

    let noteList = document.querySelectorAll("#to-do-list li");
    //If all notes is done we unmark all of them.
    if (getAmountNotesDone() == noteList.length) {
        allNotesActive();
    } else {
        completeAllNotes();
    }
    updateAmountItemsLeft();
    showClearCompletedBtn();
    filterNotes();
}

function completeAllNotes() {
    let noteList = document.querySelectorAll("#to-do-list li");

    noteList.forEach((element) => {
        let checkBox = element.querySelector('input[type="checkbox"]');
        checkBox.checked = true;

        let noteText = element.querySelector("h3");
        noteText.className = "text-decoration-line";
    });
}
function allNotesActive() {
    let noteList = document.querySelectorAll("#to-do-list li");
    //If no note is selected or if more than 1 is selected we select all notes.
    noteList.forEach((element) => {
        let checkBox = element.querySelector('input[type="checkbox"]');
        checkBox.checked = false;

        let noteText = element.querySelector("h3");

        noteText.className = "text-decoration-none";
    });
}

function showFooterAndToggleBtn() {
    let noteList = document.querySelectorAll("#to-do-list li");
    let toDoInfo = document.querySelector("#to-do-info");

    if (noteList.length > 0) {
        toggleAllBtn.classList.add("visibility-visible");
        toggleAllBtn.classList.remove("visibility-hidden");

        toDoInfo.className = "display-grid";
    } else {
        toggleAllBtn.classList.remove("visibility-visible");
        toggleAllBtn.classList.add("visibility-hidden");

        toDoInfo.className = "display-none";
    }
}