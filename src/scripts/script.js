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

// Highlight which pet is currelty selected
function showSelectedPet(button) {
    let buttons = document.querySelectorAll('.petNameList');
    for (let b of buttons) {
        b.style['border-color'] = '#000000'
        b.style['border-width'] = '1px';
    }
    button.style['border-color'] = '#702963';
    button.style['border-width'] = '2px';
}


// Create button for pet
function createPetButton(name) {
    let petlist = document.getElementById("petList");
    let newpet = document.createElement("button");
    newpet.textContent = name;
    newpet.classList.add("petNameList");
    newpet.addEventListener('click', () => {
        setUpDifferentPet(newpet.textContent);
        showSelectedPet(newpet);
});
    petlist.appendChild(newpet);
}

// Add pet to local storage array
function addPetToLocalStorage(name, breed) {
    let cur = JSON.parse(localStorage.getItem('pets'));
    cur.push({
        'name': name,
        'breed': breed,
        'description': 'No information given for pet yet'});
    localStorage.setItem('pets', JSON.stringify(cur));
}

// Find and return pet if it exists
function petExists(name) {
    for (let pet of JSON.parse(localStorage.getItem('pets'))) {
        if (pet.name == name)
            return pet;
    }
    return null;
}

// Create new pet and add it to local storage, still needs to add a bunch of info though
function setUpPetAndLocalStorage() {
    const petName = document.getElementById('petName').value.trim().toLowerCase();
    const petBreed = document.getElementById('petBreed').value.trim().toLowerCase();
    
    if (petExists(petName)) {
        alert("Pet with that name already exists, please choose another name or consider making this one more unique :)");
    } else {

        addPetToLocalStorage(petName, petBreed);
        closeModal("add-pet-modal");
        createPetButton(petName);
    }
}

// Change all of the things to do with the new selected pet
function setUpDifferentPet(pet_name) {
    changeBreedImage(pet_name);
    changeBreedInfo(pet_name);
    changePetDescription(pet_name);
}

// Get breed image from API and set the image to it
function changeBreedImage(petname) {
    let pet = petExists(petname);
    let image = document.getElementById("actualpicture");
    fetch ("https://dog.ceo/api/breed/" + pet.breed + "/images/random")
        .then(data => data.json())
        .then(da => {
            if (da.status != 'error') {
                image.src = da.message;
                image.alt = 'image of ' + pet.breed;
            } else {
                image.src = null;
                image.alt = da.message;
            }
        });
}

// Get breed info from API and display the text in #actualinfo
function changeBreedInfo(petname) {
    let pet = petExists(petname);
    let info = document.getElementById("actualinfo");

    fetch("https://api.thedogapi.com/v1/breeds/search?q=" + pet.breed)
        .then(data => data.json())
        .then(da => {
            if (da.length > 0) {
                let breed = da[0];
                info.innerHTML = 
                    "Breed: " + breed.name + "<br>" +
                    "Temperament: " + breed.temperament + "<br>" +
                    "Life Span: " + breed.life_span + "<br>" +
                    "Average Weight: " + breed.weight.metric + " kg";
            } else {
                info.textContent = "Breed information not found.";
            }
    });
}

function changePetDescription(pet_name) {
    let text = document.getElementById('general-input');
    let pet = petExists(pet_name);
    text.textContent = pet.description;
}

// Save the pets description in local storage
function updateDescription(e) {
    e.preventDefault();
    let curpet = null;
    let buttons = document.querySelectorAll('.petNameList');
    for (let b of buttons) {
        if (b.style['border-width'] == '2px') {
            curpet = b;
        }
    }

    let pets = JSON.parse(localStorage.getItem('pets'));
    let input = document.getElementById('general-information');
    let newdesc = input.value.trim();
    input.value = '';

    let theindex = -1;
    for (let i in pets) {
        if (pets[i].name == curpet.textContent) {
            theindex = i;
        }
    }
    pets[theindex].description = newdesc;
    localStorage.setItem('pets', JSON.stringify(pets));
    changePetDescription(pets[theindex].name);
}

// Initialization Function
(function () {
    if (localStorage.getItem('pets')) {
        let pets = JSON.parse(localStorage.getItem('pets'));
        for (let pet of pets) {
            createPetButton(pet.name);
        }
        if (pets.length > 0) {
            setUpDifferentPet(pets[0].name)
            let button = document.querySelector('.petNameList');
            showSelectedPet(button);
        }
    } else {
        localStorage.setItem('pets', JSON.stringify([]));
    }
})();