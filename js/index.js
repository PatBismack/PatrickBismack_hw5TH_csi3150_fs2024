// Import JS object Literal
import { usedCars } from "./usedCars.js";
// get form element from html
const form = document.getElementById("search-form");
// Test
const filters = document.getElementById("filter-year");
// get user search input
const query = document.getElementById("search-input");
// grab the html container where results will be published
const result = document.getElementById("result");

let isSearching = false;

// function to clear results
function clearResults() {
  result.innerHTML = "";
}
// function to fetch and show results
async function fetchAndShowResult(usedCars) {
  const data = await fetchData(usedCars);
  if (data && data.results) {
    showResults(data.results);
  }
}
// function to fetch data from the usedCars.js
async function fetchData(usedCars) {
  try {
    let response = await fetch(usedCars);
    if (!response.ok) {
      throw new Error("Something went wrong, please try again later");
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}
// function to display results on the page
function showResults(item) {
  const newContent = item.map(createCarCard).join("");
  result.innerHTML += newContent || "<p> No Results Found. Search again. </p>";
}

// create dynamic car details cards
function createCarCard(car) {
  // destructure car object from usedCars.js
  const { year, make, model, mileage, price, color, gasMileage, image, alt } =
    car;
  // Path for Car Image
  const imagePath = "./assets/image/" + image;

  const cardTemplate = `
      <div class="card">
        <img src="${imagePath}" alt="${alt}">
        <div class="title">
            <p class="year">${year}</p>
            <h1 class="make">${make}</h1>
            <h2 class="model">${model}</h2>
            <p class="color">${color}</p>
        </div>
        <div class="details">
            <p class="price">$${price}</p>
            <p class="mileage">Mileage: ${mileage}</p>
            <p class="mpg">${gasMileage}</p>
        </div>
        <button class="info-btn">More Information</button>
    </div>
  `;
  return cardTemplate;
}

// function to search usedCars based on user input
function searchCars(
  query,
  minYear,
  maxYear,
  minPrice,
  maxPrice,
  minMileage,
  maxMileage,
  selectedColors,
  selectedMake
) {
  const searchTerms = query.toLowerCase().split(" ");
  return usedCars.filter((car) => {
    const matchesSearchTerms = searchTerms.every((term) => {
      return (
        car.make.toLowerCase().includes(term) ||
        car.model.toLowerCase().includes(term) ||
        car.color.toLowerCase().includes(term) ||
        car.year.toString().includes(term)
      );
    });

    const matchesYearRange =
      (!minYear || car.year >= minYear) && (!maxYear || car.year <= maxYear);

    const matchesPriceRange =
      (!minPrice || car.price >= minPrice) &&
      (!maxPrice || car.price <= maxPrice);

    const matchesMileageRange =
      (!minMileage || car.mileage >= minMileage) &&
      (!maxMileage || car.mileage <= maxMileage);

    const matchesColorSelection =
      selectedColors.length === 0 || selectedColors.includes(car.color);
    const matchesMakeSelection =
      selectedMake.length === 0 || selectedMake.includes(car.make);
    return (
      matchesSearchTerms &&
      matchesYearRange &&
      matchesPriceRange &&
      matchesMileageRange &&
      matchesColorSelection &&
      matchesMakeSelection
    );
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearResults();
  isSearching = true;

  // Get values from the year filter
  const minYear = document.getElementById("min-year").value;
  const maxYear = document.getElementById("max-year").value;
  console.log(`Min Year: ${minYear}, Max Year: ${maxYear}`);

  // Get values from the price filter
  const minPrice = document.getElementById("min-price").value;
  const maxPrice = document.getElementById("max-price").value;
  console.log(`Min Price: ${minPrice}, Max Price: ${maxPrice}`);

  // Get values from the mileage filter
  const minMileage = document.getElementById("min-mileage").value;
  const maxMileage = document.getElementById("max-mileage").value;
  console.log(`Min Mileage: ${minMileage}, Max Mileage: ${maxMileage}`);

  // Get Values from the color input
  const selectedColors = Array.from(
    document.querySelectorAll('.filter-color input[type="checkbox"]:checked')
  ).map((checkbox) => checkbox.value);
  console.log(selectedColors);
  // Get values from the make input
  const selectedMake = Array.from(
    document.querySelectorAll('.filter-make input[type="checkbox"]:checked')
  ).map((checkbox) => checkbox.value);
  console.log(selectedMake);

  const queryValue = query.value;
  let filteredCars = searchCars(
    queryValue,
    minYear,
    maxYear,
    minPrice,
    maxPrice,
    minMileage,
    maxMileage,
    selectedColors,
    selectedMake
  );
  showResults(filteredCars);
  console.log(filteredCars);
  isSearching = false;
});
filters.addEventListener("change", async (event) => {
  form.dispatchEvent(new Event("submit"));
});
// initialize the page
async function init() {
  clearResults();
  isSearching = false;
  await showResults(usedCars);
}

init();
