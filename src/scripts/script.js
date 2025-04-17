function launchModal() {
    const modal = new bootstrap.Modal('#add-pet-modal', { keyboard: false });
    modal.show();
}

function closeModal(elementName) {
    const modalElement = document.getElementById(elementName);
    const modal = bootstrap.Modal.getInstance(modalElement);
    let inputs = modalElement.querySelectorAll("input");
    for (let i of inputs) {
        i.value = "";
    }
    modal.hide();
}

let currentAppointmentElement = null;

// used when specific input is clicked and opens modal
function openModal(el) {
    currentAppointmentElement = el;
    document.getElementById('appointmentInput').value = el.innerText;
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

// edits the input field when the modals save button is clicked
function edit() {
    const newValue = document.getElementById('appointmentInput').value.trim();
    
    if (currentAppointmentElement && newValue) {
        currentAppointmentElement.innerText = newValue;
    }

    closeModal("editModal");
}

function setUpPetLocalStorage() {
    const petName = document.getElementById('petName').value.trim().toLowerCase();
    const petBreed = document.getElementById('petBreed').value.trim().toLowerCase();

    if (localStorage.getItem(petName)) {
        alert("Pet with that name already exists, please choose another name or consider making this one more unique :)");
    } else {
        localStorage.setItem(petName, {'breed': petBreed});
        closeModal("add-pet-modal");
    }
}