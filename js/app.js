const select = document.getElementById('breeds');
const card = document.querySelector('.card'); 
const form = document.querySelector('form');

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

// Creating a function that allow the developer to better utilize the fetch function
// It will check to see if the status of the api is giving the 'OK' status
// Then it will convert the response to be in JSON format
// and will handle any error that occur
function fetchData(url) {
    return fetch(url)
                .then(checkStatus)
                .then(res => res.json())
                .catch(error => console.log('Looks like there was a problem with fetching the data', error))
}
// Promise.all allows for multiple promises
Promise.all([
    fetchData('https://dog.ceo/api/breeds/list'),
    fetchData('https://dog.ceo/api/breeds/image/random')

])
.then(data => {
    const breedList = data[0].message;
    const randomImage = data[1].message;

    generateOptions(breedList);
    generateImage(randomImage);
})

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
// Here we check the status of the api
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
// Appending the data to our dog breed list
function generateOptions(data) {
    const options = data.map(item => `
        <option value='${item}'>${item}</option>
    `).join('');
    select.innerHTML = options;
}

// Creating a img tag with the correct image of the dog
function generateImage(data) {
    const html = `
    <img src='${data}' alt>
    <p> Click to view images of ${select.value}s</p>
    `;
    card.innerHTML = html;
}

// Here we are fetching image for the specific dog's breed
// and then we assign the corresponding data to the img and p element
function fetchBreedImage() {
    const breed = select.value;
    const img = card.querySelector('img');
    const p = card.querySelector('p');

    fetchData(`https://dog.ceo/api/breed/${breed}/images/random`)
        .then(data => {
            img.src = data.message;
            img.alt = breed;
            p.textContent = `Click to view more ${breed}s`;
        })
}

// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------
// Adding event listeners to necessary elements
select.addEventListener('change', fetchBreedImage);
card.addEventListener('click', fetchBreedImage);
form.addEventListener('submit', postData);


// ------------------------------------------
//  POST DATA
// ------------------------------------------

// Posting the data back to the API
// Name and Comment will be posted
function postData(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;

    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, comment})
    }

    fetch('http://jsonplaceholder.typicode.com/comments', config)
        .then(checkStatus)
        .then(response => response.json())
        .then(data => console.log(data))
}