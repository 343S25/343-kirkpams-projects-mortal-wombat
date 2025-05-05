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
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

// edits the input field when the modals save button is clicked and updates local storage
function edit() {
    const newValue = document.getElementById('appointmentInput').value.trim();

    if (currentAppointmentElement && newValue) {
        const section = currentAppointmentElement.dataset.section;
        const index = parseInt(currentAppointmentElement.dataset.index);

        currentAppointmentElement.innerText = newValue;

        // getting current pet
        const buttons = document.querySelectorAll('.petNameList');
        let selectedPetName = null;
        for (let b of buttons) {
            if (b.style['border-width'] === '2px') {
                selectedPetName = b.textContent;
                break;
            }
        }

        // setting spec-info to local storage
        if (selectedPetName) {
            let pets = JSON.parse(localStorage.getItem('pets'));
            for (let pet of pets) {
                if (pet.name === selectedPetName) {
                    pet[section][index] = newValue;
                    break;
                }
            }
            localStorage.setItem('pets', JSON.stringify(pets));
        }
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
        name: name,
        breed: breed,
        description: 'No information given for pet yet',
        appointments: ["Click to add appointment!", "Click to add appointment!", "Click to add appointment!", "Click to add appointment!", "Click to add appointment!"],
        medical: ["Click to add medical info!", "Click to add medical info!", "Click to add medical info!", "Click to add medical info!", "Click to add medical info!"],
        feeding: ["Click to add feeding info!", "Click to add feeding info!", "Click to add feeding info!", "Click to add feeding info!", "Click to add feeding info!"],
        activities: ["Click to add activity!", "Click to add activity!", "Click to add activity!", "Click to add activity!", "Click to add activity!"]
    });
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
    populateModalButtons(pet_name);
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

// population spec-info modals
function populateModalButtons(petName) {
    const pet = petExists(petName);
    if (!pet) {
        return;
    }

    ["appointments", "medical", "feeding", "activities"].forEach(section => {
        for (let i = 0; i < 5; i++) {
            const selector = `button[data-section="${section}"][data-index="${i}"]`;
            const btn = document.querySelector(selector);
            if (btn) {
                btn.innerText = pet[section][i];
            }
        }
    });
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

function exportClick(ev) {
    // TODO add a feature to create "transportodons" (export the current
    // todo items as a json file) by completing the steps below:

    // TODO 1. get the current state from localStorage
    // I wanted mine to be an object with a single key (items) and then a parsed representation of the value from localStorage
    let state = JSON.parse(localStorage.getItem('items'));
    let obj = {
      'items': state
    };
    // TODO 2. get the stringified version of the state from the previous step
    let stringified = JSON.stringify(obj);
    // TODO 3. encode the state as a URI component
    let encoded = encodeURIComponent(stringified);
    // TODO 4. prepend the encoded string with the data URL dark magic:
    // 'data:application/json;charset=utf-8,'
    // ok, it's not really dark magic, read more here:
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs
    let prepended = 'data:application/json;charset=utf-8,' + encoded;
    // TODO 5. create a link which has as its href the result from the preceding step and its download attribute set to
    // "transportodons.json"
    let link = document.createElement('a');
    link.href = prepended;
    link.download = 'transportodons.json';
    // TODO 6. add the link to the downloads container in the provided html
    document.getElementById('downloads').appendChild(link);
    // TODO 7. write the javascript to click the newly added link
    link.click();
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