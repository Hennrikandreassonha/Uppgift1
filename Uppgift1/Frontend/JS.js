let form = document.getElementById("todoform");
let loginForm = document.getElementById("authform");

let toggleAllBtn = document.querySelector("#toggle-all");

let activeToggle = false;
let completedToggle = false;

let allNotes = document.querySelector("#all");
let activeNotes = document.querySelector("#active");
let completedNotes = document.querySelector("#complete");
let noteList = document.querySelector("ul");


const noteUrl = 'https://localhost:7275/ToDoNote';
const authUrl = 'https://localhost:7275/Auth';

removeBorder();
showFooterAndToggleBtn();
updateFrontend();

//Initiates frontend, checking if user is logged in or not.
function updateFrontend() {

    let key = getCookie("api_key");
    let userId = getCookie("user_id");

    let authMessage = document.getElementById("authmesssage");
    let loginLogoutBtn = document.getElementById("loginBtn");
    let userNameInput = document.getElementById("username");
    let passwordInput = document.getElementById("password");


    if (key == "") {
        authMessage.textContent = "Login or register to save your notes for another time!";
        loginLogoutBtn.textContent = "Login";
        userNameInput.required = true;
        passwordInput.required = true;
        noteList.innerHTML = "";
    }
    else {
        authMessage.textContent = "You are logged in";
        loginLogoutBtn.textContent = "Logout";
        userNameInput.required = false;
        passwordInput.required = false;

        getAllNotes(key, userId);
    }
    userNameInput.value = "";
    passwordInput.value = "";
}

form.onsubmit = async (event) => {
    event.preventDefault();

    //Adding a new note.
    let header = form.notetext.value;
    let text = form.text.value;
    let deadline = "";
    if (form.deadline.value != "")
        deadline = `Deadline: ${form.deadline.value}`;

    if (header != "" && text != "") {
        let newNote = createElementForNotelist(header, text, deadline);

        //This isnt really safe i think but its ok for now.
        const apiKey = getCookie("api_key");
        const userId = getCookie("user_id");

        if (apiKey != "") {
            const noteToDb = new NoteToDb(header, text, form.deadline.value, userId);
            newNote.id = await postToDB(noteToDb, apiKey, userId);
        }
        noteList.append(newNote);

        form.reset();
        updateAmountItemsLeft();
        showFooterAndToggleBtn();
    }
};

function createElementForNotelist(header, text, deadline, isDone) {
    const apiKey = getCookie("api_key");
    const userId = getCookie("user_id");
    let newNote = document.createElement("li");

    let noteHeading = document.createElement("h3");
    noteHeading.textContent = header;
    let noteText = document.createElement("p");
    noteText.textContent = text;

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkboxElement");
    if (isDone)
        checkbox.checked = true;

    var deleteBtn = document.createElement("button");
    deleteBtn.id = "remove-btn";
    deleteBtn.textContent = "❌";
    deleteBtn.className = "visibility-hidden";

    let br = document.createElement("br");
    let noteDiv = document.createElement("div");
    noteDiv.append(noteHeading, br, deadline.split('T')[0], br, noteText);

    newNote.append(checkbox, noteDiv, deleteBtn);

    checkbox.addEventListener("click", () => completeNote(newNote, newNote.id, apiKey));
    deleteBtn.addEventListener("click", () => removeItem(newNote.id, apiKey));

    newNote.addEventListener("mouseover", showDeleteBtn);
    newNote.addEventListener("mouseleave", hideDeleteBtn);

    return newNote;
}

class NoteToDb {
    constructor(header, text, deadline, userId) {
        this.heading = header;
        this.text = text;
        this.deadline = deadline
        this.userId = userId;
    }
}

let returnMsg = document.getElementById("return-msg");

async function postToDB(newNote, token) {
    try {
        const response = await fetch(noteUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newNote)
        });

        const data = await response.json();
        const id = data.id;
        returnMsg.textContent = data.message;

        return id;
    } catch (error) {
        returnMsg.textContent = error.message;
    }
}

async function getAllNotes(token, userId) {
    try {
        const response = await fetch(`${noteUrl}/${userId}`, {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        addNotesToList(data.notes);

    } catch (error) {
        returnMsg.textContent = error.message;
    }
}

function addNotesToList(notes) {

    let noteList = document.querySelector("ul");

    notes.forEach(element => {

        if (element.deadLine == undefined)
            element.deadLine = "";

        const liElement = createElementForNotelist(element.heading, element.text, element.deadLine, element.isDone)

        liElement.id = element.id;

        noteList.append(liElement);
    });
}

//Handeling auth
class UserDto {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const userName = loginForm.username.value;
    const password = loginForm.password.value;

    const user = new UserDto(userName, password);

    var loginBtn = document.getElementById('loginBtn');
    var registerBtn = document.getElementById('registerBtn');

    if (event.submitter === loginBtn) {
        if (loginBtn.textContent == "Login") {
            handleLogin(user).then(() => {
                updateFrontend();
            });
        }
        else {
            handleLogout().then(() => {
                updateFrontend();
            });
        }
    } else if (event.submitter === registerBtn) {
        handleRegister(user);
    }
});

let authreturnmsg = document.getElementById("authreturnmsg");

async function handleLogin(userDto) {
    try {
        const response = await fetch(`${authUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userDto)
        });

        const data = await response.json();
        authreturnmsg.textContent = data.message;
        setCookie("api_key", data.token, 1);
        setCookie("user_id", data.id, 1);
        getAllNotes(data.token, data.id);

    } catch (error) {
        authreturnmsg.textContent = error.message;
    }
}
async function handleLogout() {
    document.cookie = "api_key= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "user_id= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"

}

//This cookie should be httponly cookie but it works for this.
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()}`;
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
async function test(token) {
    try {
        const response = await fetch(`https://localhost:7275/WeatherForecast`, {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        authreturnmsg.textContent = data.message;

    } catch (error) {
        authreturnmsg.textContent = error.message;
    }
}
async function handleRegister(userDto) {
    try {
        const response = await fetch(`${authUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userDto)
        });
        const data = await response.json();
        authreturnmsg.textContent = data.message;

    } catch (error) {
        authreturnmsg.textContent = error.message;
    }
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

function removeItem(id, apiKey) {
    if (id == null || id == "undefined") return;

    let noteLiToDelete = document.getElementById(id);

    noteLiToDelete.remove();

    if (apiKey != "") {
        deleteNoteById(id, apiKey);
    }
    updateAmountItemsLeft();
    showClearCompletedBtn();
    showFooterAndToggleBtn();
}

async function deleteNoteById(id, token) {
    try {
        const response = await fetch(`${noteUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        returnMsg.textContent = data.message;

    } catch (error) {
        console.error('Error deleting:', error.message);
        throw new Error(error.message);
    }
}

function completeNote(liElement, id, apiKey) {
    let selectedCheckbox = liElement.querySelector(".checkboxElement");

    let noteHeading = liElement.querySelector("h3");
    let noteText = liElement.querySelector("p");


    if (selectedCheckbox.checked) {
        noteText.className = "text-decoration-line";
        noteHeading.className = "text-decoration-line";

    } else {
        noteText.className = "text-decoration-none";
        noteHeading.className = "text-decoration-none";

    }

    if (apiKey != "") {
        updateNoteStatus(id, apiKey);
    }

    updateAmountItemsLeft();
    showClearCompletedBtn();
    filterNotes();
}

async function updateNoteStatus(id, token) {
    try {
        const response = await fetch(`${noteUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        returnMsg.textContent = data.message;

    } catch (error) {
        console.error('Error deleting:', error.message);
        throw new Error(error.message);
    }
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