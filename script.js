// It creates a favorites meal array if it doesn't exist in local storage
if (localStorage.getItem("favouritesList") == null) {
  localStorage.setItem("favouritesList", JSON.stringify([]));
}

// It fetches meals from the API and returns them
async function fetchMealsFromApi(url, value) {
  // Check if meals are already cached
  const cachedMeals = localStorage.getItem(value);
  if (cachedMeals) {
    return JSON.parse(cachedMeals);
  }

  // If not cached, fetch meals from API
  const response = await fetch(`${url}${value}`);
  const meals = await response.json();

  // Cache the fetched meals
  localStorage.setItem(value, JSON.stringify(meals));

  return meals;
}

// Function to toggle night mode
function toggleNightMode() {
  document.body.classList.toggle("night-mode");
}

// It shows all meals card in the main section according to the search input value
function showMealList() {
  let inputValue = document.getElementById("my-search").value;
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  let html = "";
  let meals = fetchMealsFromApi(url, inputValue);
  meals.then((data) => {
    if (data.meals) {
      data.meals.forEach((element) => {
        let isFav = false;
        for (let index = 0; index < arr.length; index++) {
          if (arr[index] == element.idMeal) {
            isFav = true;
          }
        }
        if (isFav) {
          html += `
            <div id="card" class="card mb-3" style="width: 20rem;">
              <img src="${element.strMealThumb}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">${element.strMeal}</h5>
                <div class="d-flex justify-content-between mt-5">
                  <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                  <button id="main${element.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                </div>
              </div>
            </div>
          `;
        } else {
          html += `
            <div id="card" class="card mb-3" style="width: 20rem;">
              <img src="${element.strMealThumb}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">${element.strMeal}</h5>
                <div class="d-flex justify-content-between mt-5">
                  <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                  <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                </div>
              </div>
            </div>
          `;
        }
      });
    } else {
      html += `
        <div class="page-wrap d-flex flex-row align-items-center">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-md-12 text-center">
                <span class="display-1 d-block">404</span>
                <div class="mb-4 lead">
                  The meal you are looking for was not found.
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    document.getElementById("main").innerHTML = html;
  });
}

// It shows the full meal details in the main section
async function showMealDetails(id) {
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";
  await fetchMealsFromApi(url, id).then((data) => {
    html += `
      <div id="meal-details" class="mb-5">
        <div id="meal-header" class="d-flex justify-content-around flex-wrap">
          <div id="meal-thumbail">
            <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
          </div>
          <div id="details">
            <h3>${data.meals[0].strMeal}</h3>
            <h6>Category: ${data.meals[0].strCategory}</h6>
            <h6>Area: ${data.meals[0].strArea}</h6>
          </div>
        </div>
        <div id="meal-instruction" class="mt-3">
          <h5 class="text-center">Instruction:</h5>
          <p>${data.meals[0].strInstructions}</p>
        </div>
        <div class="text-center">
          <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
        </div>
      </div>
    `;
  });
  document.getElementById("main").innerHTML = html;
}

// It shows all favorite meals in the favorites body section
async function showFavMealList() {
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";
  if (arr.length == 0) {
    html += `
      <div class="page-wrap d-flex flex-row align-items-center">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-12 text-center">
              <span class="display-1 d-block">404</span>
              <div class="mb-4 lead">
                No meal added to your favorites list.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    for (let index = 0; index < arr.length; index++) {
      await fetchMealsFromApi(url, arr[index]).then((data) => {
        html += `
          <div id="card" class="card mb-3" style="width: 20rem;">
            <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${data.meals[0].strMeal}</h5>
              <div class="d-flex justify-content-between mt-5">
                <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                <button id="main${data.meals[0].idMeal}"
                class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius: 50%"><i class="fa-solid fa-heart"></i></button>
                </div>
                </div>
                </div>
                `;
                });
                }
                }
                document.getElementById("favourites-body").innerHTML = html;
                }
                
                // Function to add or remove meals from the favorites list
                function addRemoveToFavList(id) {
                let arr = JSON.parse(localStorage.getItem("favouritesList"));
                let contain = false;
                for (let index = 0; index < arr.length; index++) {
                if (id == arr[index]) {
                contain = true;
                }
                }
                if (contain) {
                let number = arr.indexOf(id);
                arr.splice(number, 1);
                alert("Your meal has been removed from your favorites list");
                } else {
                arr.push(id);
                alert("Your meal has been added to your favorites list");
                }
                localStorage.setItem("favouritesList", JSON.stringify(arr));
                showMealList();
                showFavMealList();
                }
                
                // Function to remove loader after the page is loaded
                function loader() {
                document.querySelector('.loader-container').classList.add('fade-out');
                }
                
                function fadeOut() {
                setInterval(loader, 1500);
                }
                
                window.onload = fadeOut;
                
                // Event Listeners
                document.getElementById("my-search").addEventListener("keyup", showMealList);
                
                // Initial Function Calls
                showMealList();
                showFavMealList();