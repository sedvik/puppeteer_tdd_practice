const filterBar = document.querySelector('.filter');
const noteList = document.querySelector('.note-list');
const newNoteTextarea = document.querySelector('.new-note-input');
const submitNoteButton = document.querySelector('.submit-note');

// Helper functions
function createNoteLi() {
    const li = document.createElement('li');
    li.className = 'note';
    return li;
}

function addTextNode(parentElem, text) {
    const textNode = document.createTextNode(text);
    parentElem.appendChild(textNode);
    return parentElem
}

function addDeleteButton(parentElem) {
    const deleteButton = document.createElement('input');
    deleteButton.type = 'button';
    deleteButton.value = 'X';

    // Add click eventHandler for note deletion
    deleteButton.addEventListener('click', handleDelete);

    parentElem.appendChild(deleteButton);
    return parentElem;
}

// Event Handlers
function handleDelete(e) {
    e.target.parentElement.remove();
}

// Event listeners
submitNoteButton.addEventListener('click', () => {
    // Pull noteText from new note textarea
    const noteText = newNoteTextarea.value;

    // Do not create new li if noteText is blank
    if (!noteText) {
        return;
    }

    // Create new li, and append text node and delete button
    let newLi = createNoteLi();
    newLi = addTextNode(newLi, noteText);
    newLi = addDeleteButton(newLi);

    // Append new li to noteList
    noteList.appendChild(newLi);

    // Clear text from textarea
    newNoteTextarea.value = '';
});

filterBar.addEventListener('keyup', (e) => {
    const filterBarText = e.target.value;
    const notes = document.getElementsByClassName('note');
    let note;
    // Loop through notes to see which notes include the filter bar text. Set display to none for any that don't
    for (let i = 0; i < notes.length; i++) {
        note = notes[i];
        if (!note.innerText.includes(filterBarText)) {
            note.style.display = 'none';
        } else {
            note.style.display = 'list-item';
        }
    }
});

