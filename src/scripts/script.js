const modal = new bootstrap.Modal('#add-pet-modal', { keyboard: false });

function launchModal() {
    modal.show();
}

let addpetbutton = document.getElementById("addpet");
addpetbutton.addEventListener("click", launchModal);

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

    const modalElement = document.getElementById('editModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
}
