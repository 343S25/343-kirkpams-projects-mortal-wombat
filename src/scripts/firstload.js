function addFirstPet() {
    event.preventDefault();
    const petName = document.getElementById('pet-name').value.trim().toLowerCase();
    const petBreed = document.getElementById('pet-breed').value.trim().toLowerCase();
    const petDescription = document.getElementById('pet-description').value.trim();
    
    if (localStorage.getItem('pets') && localStorage.getItem('pets').length > 0) {
        alert("It seems you are a returning user, please move on to the main page using the under 'Returning User?'");
    } else {
        localStorage.setItem('pets', JSON.stringify([]));
        addPetToLocalStorage(petName, petBreed, petDescription);
        window.location.replace('main.html');
    }
}

function addPetToLocalStorage(name, breed, description) {
    let cur = JSON.parse(localStorage.getItem('pets'));
    cur.push({
        'name': name,
        'breed': breed,
        'description': description});
    localStorage.setItem('pets', JSON.stringify(cur));
}