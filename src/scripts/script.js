const modal = new bootstrap.Modal('#add-pet-modal', { keyboard: false });

function launchModal() {
    modal.show();
}

let addpetbutton = document.getElementById("addpet");
addpetbutton.addEventListener("click", launchModal);