const express = require('express')
const app = express()
const cors = require('cors');
app.use(cors());
app.use(express.json())
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const dbPath = path.join(__dirname, 'sample.db')

const fs = require('fs');
const { title } = require('process')
let rawData = fs.readFileSync('US_recipes.json', 'utf-8');

rawData = rawData.replace(/NaN/g, 'null');

const data = JSON.parse(rawData);


let db = null;


const initializeDbAndServer = async () => {
  try {
    db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  })
  const insertQuery = `

      INSERT INTO recipes 

      (cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves) 

      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)

    `

    const insertStmt = await db.prepare(insertQuery)

  Object.values(data).forEach( async (recipe) => {
  recipe.rating = isNaN(recipe.rating) ? null : recipe.rating;
  recipe.prep_time = isNaN(recipe.prep_time) ? null : recipe.prep_time;
  recipe.cook_time = isNaN(recipe.cook_time) ? null : recipe.cook_time;
  recipe.total_time = isNaN(recipe.total_time) ? null : recipe.total_time;


      await insertStmt.run([
        recipe.cuisine,

        recipe.title,

        recipe.rating,

        recipe.prep_time,

        recipe.cook_time,

        recipe.total_time,

        recipe.description,

        JSON.stringify(recipe.nutrients), // since JSON

        recipe.serves,

      ])

    })
  app.listen(3000, () => {
    console.log("The Server has started running at http://localhost:3000")
  })
  }
  catch (e) {
    console.log(`DB Error ${e.message}`)
    process.exit(1)
  }
}

app.get('/api/recipes/', async (request, response) => {
  const {pages, limit} = request.query
  const getRecipesQuery = `
  SELECT
    *
  FROM
    recipes
  ORDER BY
    rating DESC
  LIMIT ${limit}
  OFFSET ${pages};
  `;
  const recipesResponse = await db.all(getRecipesQuery)
  response.send({
    pages: 1,
    limit: 10,
    total: 50,
    data: recipesResponse.map((eachItem) => {
    return {
      id: eachItem.id,
      title: eachItem.title,
      cuisine: eachItem.cuisine,
      rating: eachItem.rating,
      prep_time: eachItem.prep_time,
      description: eachItem.description,
      nutrients: JSON.parse(eachItem.nutrients),
      serves: eachItem.serves
    }
  })
  })
})

app.get('/api/recipes/search/', async (request, response) => {
  let { calories, title = "", rating } = request.query;

  // Handle calories safely
  if (calories && calories.includes("<=")) {
    calories = calories.split("<=")[1];
  }

  // Handle rating safely
  if (rating && rating.includes(">=")) {
    rating = rating.split(">=")[1];
  }

  const recipeSearchQuery = `
    SELECT *
    FROM recipes
    WHERE title LIKE '%${title}%'
    LIMIT 10
  `;

  const recipeSearchResults = await db.all(recipeSearchQuery);

  const result = recipeSearchResults
    .map((eachItem) => {
      return {
        id: eachItem.id,
        title: eachItem.title,
        cuisine: eachItem.cuisine,
        rating: eachItem.rating,
        prep_time: eachItem.prep_time,
        description: eachItem.description,
        nutrients: JSON.parse(eachItem.nutrients),
        serves: eachItem.serves,
      };
    })
    .filter((eachItem) => {
      let valid = true;

      if (calories && parseInt(eachItem.nutrients.calories) > parseInt(calories)) {
        valid = false;
      }

      if (rating && parseFloat(eachItem.rating) < parseFloat(rating)) {
        valid = false;
      }

      return valid;
    });

  response.send(result);
});


initializeDbAndServer()