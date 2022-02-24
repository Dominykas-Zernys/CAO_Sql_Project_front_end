// cars display script

const cardContainer = document.getElementById('card-container');

async function getCars() {
  cardContainer.innerHTML = '';
  const resCars = await fetch('http://localhost:5000/cars/');
  const cars = await resCars.json();
  if (!cars.success) {
    cardContainer.innerHTML = '<div>something went wrong</div>';
    return;
  }
  cars.data.forEach((car) => {
    const createCardWrapper = document.createElement('div');
    createCardWrapper.classList.add('card-wrapper');
    createCardWrapper.innerHTML = `<div class="card-title-wrapper card-section">
  <h3 class="licence-plate">${licencePlateFormat(car.number_plates)}</h3>
  <h4 class="car-brand">${car.title}</h4>
  </div>
  <div class="image-wrapper card-section">
  <img src="${car.image}" class="image" alt="">
  </div>
  <div class="delete-wrapper card-section">
  <button class="delete-button" data-id="${car.id}">DELETE</button>
  </div>`;
    cardContainer.prepend(createCardWrapper);
  });
}

getCars();

function licencePlateFormat(plateNumber) {
  const newPlateNumber =
    plateNumber.substring(0, 3) + ' ' + plateNumber.substring(3);
  return newPlateNumber;
}

cardContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-button')) {
    const idToDelete = event.target.dataset.id;
    if (!confirm('Do you really want to delete this car?')) {
      return;
    }
    fetch('http://localhost:5000/cars/' + idToDelete, {
      method: 'DELETE',
    });
    location.reload();
  }
});

// Add car script

const carBrandInput = document.getElementById('car-brand-input');
const licenceNumberInput = document.getElementById('licence-number-input');
const imageInput = document.getElementById('image-input');
const priceInput = document.getElementById('price-input');
const carForm = document.getElementById('add-car-form');
const newCarText = document.querySelector('.new-car-text');

carForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (
    !carBrandInput.value ||
    !licenceNumberInput.value ||
    !imageInput.value ||
    !priceInput.value
  ) {
    addSubmitText('red-text', 'All fields must be filled in!');
    return;
  }
  postCar(
    carBrandInput.value,
    licenceNumberInput.value,
    imageInput.value,
    priceInput.value
  );
  carBrandInput.value = '';
  licenceNumberInput.value = '';
  imageInput.value = '';
  priceInput.value = '';
  addSubmitText('green-text', 'The car has been submitted successfully!');
  getCars();
});

async function postCar(brand, licenceNumber, image, price) {
  await fetch('http://localhost:5000/cars/', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({
      title: brand,
      image: image,
      price: price,
      numberPlates: licenceNumber,
    }),
  });
}

function addSubmitText(textColor, textContent) {
  newCarText.classList.add(textColor);
  newCarText.textContent = textContent;
  setTimeout(() => {
    newCarText.textContent = '';
    newCarText.classList.remove(textColor);
  }, 5000);
}

// navigating between pages script

const navButtonCars = document.getElementById('cars-display-button');
const navButtonAddCar = document.getElementById('cars-add-button');
const mainWrapper = document.querySelector('.car-display-wrapper');
const formWrapper = document.querySelector('.add-car-wrapper');

navButtonCars.addEventListener('click', () => {
  if (formWrapper.classList.contains('hidden')) {
    return;
  }
  mainWrapper.classList.remove('hidden');
  formWrapper.classList.add('hidden');
});

navButtonAddCar.addEventListener('click', () => {
  if (mainWrapper.classList.contains('hidden')) {
    return;
  }
  formWrapper.classList.remove('hidden');
  mainWrapper.classList.add('hidden');
});
