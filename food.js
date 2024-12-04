const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const suggestions = document.getElementById("suggestions");
const receipeContainer = document.querySelector(".receipe_container");
const receipeDetailsContent = document.querySelector(".receipe_details_content");
const receipeCloseBtn = document.querySelector(".receipe-close-btn");
const mainSection = document.querySelector("main");

async function fetchReceipes(query) {
    receipeContainer.innerHTML = "<h2>Fetching...</h2>";
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
        receipeContainer.innerHTML = "";

        if (!response.meals) {
            receipeContainer.innerHTML = "<h2>No recipes found.</h2>";
            return;
        }

        response.meals.forEach(meal => {
            const receipeDiv = document.createElement("div");
            receipeDiv.classList.add("receipe");
            receipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> Category</p>`;
            const button = document.createElement("button");
            button.textContent = "View Recipe";
            receipeDiv.appendChild(button);

            button.addEventListener("click", () => {
                openReceipePopup(meal);
            });

            receipeContainer.appendChild(receipeDiv);
        });
    } catch (error) {
        receipeContainer.innerHTML = "<h2>Error fetching recipes...</h2>";
    }
}

function fetchSuggestions(query) {
    suggestions.innerHTML = "";
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(res => res.json())
        .then(data => {
            if (data.meals) {
                data.meals.forEach(meal => {
                    const option = document.createElement("option");
                    option.value = meal.strMeal;
                    suggestions.appendChild(option);
                });
            }
        });
}

function openReceipePopup(meal) {
    receipeDetailsContent.innerHTML = `
        <h2 class="receipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="preparation">
            <h3>Preparation:</h3>
            <p>${meal.strInstructions}</p>
        </div>`;
    receipeDetailsContent.parentElement.style.display = "block";
    mainSection.classList.add("blurred");
}

function fetchIngredients(meal) {
    let ingredientList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientList;
}

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    if (query) fetchSuggestions(query);
});

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) fetchReceipes(query);
});

receipeCloseBtn.addEventListener("click", () => {
    receipeDetailsContent.parentElement.style.display = "none";
    mainSection.classList.remove("blurred");
});
