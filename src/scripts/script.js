let currentpet = null;

// Opens the addPet modal
function launchModal() {
    const modal = new bootstrap.Modal('#add-pet-modal', { keyboard: false });
    modal.show();
}

// Saw we were reusing code, so this will close a modal with the name passed to it
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

// Create new pet and add it to local storage, still needs to add a bunch of info though
function setUpPetAndLocalStorage() {
    const petName = document.getElementById('petName').value.trim().toLowerCase();
    const petBreed = document.getElementById('petBreed').value.trim().toLowerCase();
    
    if (localStorage.getItem(petName)) {
        alert("Pet with that name already exists, please choose another name or consider making this one more unique :)");
    } else {
        localStorage.setItem(petName, JSON.stringify({'breed': petBreed}));
        closeModal("add-pet-modal");
        let petlist = document.getElementById("petList");
        let newpet = document.createElement("button");
        newpet.textContent = petName;
        newpet.classList.add("petNameList");
        newpet.addEventListener('click', () => setUpDifferentPet(newpet));
        petlist.appendChild(newpet);
    }
}

// Change all of the things to do with the new selected pet
function setUpDifferentPet(pet) {
    let localpet = JSON.parse(localStorage.getItem(pet.textContent));
    currentpet = localpet;
    changeBreedImage();
}

// Get breed image from API and set the image to it
function changeBreedImage() {
    let image = document.getElementById("actualpicture");
    fetch ("https://dog.ceo/api/breed/" + currentpet.breed + "/images/random")
        .then(data => data.json())
        .then(da => {
            image.src = da.message;
        });
}