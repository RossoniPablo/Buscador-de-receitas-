/*
1 - Pegar a informação do input, quando botão for clicado [Linhas: 13-16 ]
2 - Ir até a AudioParam, trazer as receitas [Linhas: 22-27]
3 - Mostrar as receitas na tela  [Linhas:31-41]
4 - Saber quando o usuário clicou na tela 
5 - Buscar informações individual da receita na API 
6 - Mostrar a receita individual na tela
*/

const form = document.querySelector('.search-form')
const recipeList = document.querySelector('.recipe-list')
const recipeDetails = document.querySelector('.recipe-details')

// 1 - Pegar a informação do input, quando botão for clicado
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const inputValue = event.target[0].value;
  searchRecipes(inputValue)
})

// 2 - Ir até a AudioParam, trazer as receitas
async function searchRecipes(ingredient) {
  recipeList.innerHTML = `<p>Carregando receitas</p>`
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await response.json();

    showRecipes(data.meals)
  }
  catch (error) {
    recipeList.innerHTML = `<p>Nenhuma receita encontrada</p>`
  }
}
// 3 - Mostrar as receitas na tela 
function showRecipes(recipes) {
  recipeList.innerHTML = recipes.map(
    (recipe) =>
      `
      <div class="recipe-card" onClick="getRecipesDetails(${recipe.idMeal})">
        <img src="${recipe.strMealThumb}" alt="Foto da receita"> 
        <h3>${recipe.strMeal}</h3>
      </div>
    `
  ).join('')
}

async function getRecipesDetails(id) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await response.json();
  const recipe = data.meals[0];
  const ingredients = []; // Usar um array para armazenar os ingredientes

  // 5 - Buscar informações individual da receita na API 
  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) { // Corrigido para strIngredient
      ingredients.push(`<li>${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}</li>`);
    } else {
      break;
    }
  }
  // 6 - Mostrar a receita individual na tela
  recipeDetails.innerHTML = `
    <h2>${recipe.strMeal}</h2>
     <img src="${recipe.strMealThumb}" alt=${recipe.strMeal} class="recipe-img">
     <h3>Categoria: ${recipe.strCategory}</h3>   
     <h3>Origem: ${recipe.strArea}</h3>
     <h3>Ingredientes: ${recipe.strArea}</h3>
    <ul>${ingredients.join('')}</ul>
     <h3>Instruções:</h3>
     <p>${recipe.strInstructions}</p>
     <p>Tags: ${recipe.strTags}</p>
     <p>Vídeo da receita completa: <a href="${recipe.strYoutube}" target=_blank" >Assista no Youtube</a>   </p>
  `;
}

