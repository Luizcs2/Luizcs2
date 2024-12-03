function scrollToResults() {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.scrollIntoView({ behavior: "smooth" });
}

// Display the results
function displayResults(searchResults) {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = "";

  // Process the data and generate the HTML content for each result
  let html = "";
  searchResults.forEach((day) => {
    html += `<div class="recipe">
      <h2>${day.dayOfWeek}</h2>
      <ul>
        ${day.recipes.map((recipe) => `
          <li>
            <h3>${recipe.recipeName}</h3>
            <img src="${recipe.imageUrl}" alt="${recipe.recipeName}">
            <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
            <p><strong>Ready in Minutes:</strong> ${recipe.readyInMinutes}</p>
            <p><strong>Servings:</strong> ${recipe.servings}</p>
            <p><strong>Source URL:</strong> <a href="${recipe.sourceUrl}" target="_blank">${recipe.sourceUrl}</a></p>
          </li>
        `).join("")}
      </ul>
    </div>`;
  });

  // Update the results container with the generated HTML content
  resultsContainer.innerHTML = html;

  // Scroll to the results
  scrollToResults();
}

// Event listeners for the buttons
document.getElementById("getMealPlan").addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:8080/get-meal-plan");
    const data = await response.json();
    displayResults(data);
  } catch (error) {
    console.error("An error occurred:", error);
  }
});
