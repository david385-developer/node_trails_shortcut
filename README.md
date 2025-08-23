# 🍳 Recipe API

This project provides a RESTful API built with **Express.js** and
**SQLite** for managing and searching recipes. It reads recipe data from
a JSON file, stores it in a SQLite database, and exposes endpoints to
query recipes with filtering and pagination.

------------------------------------------------------------------------

## 🚀 Features

-   Load recipe data from `US_recipes.json` into SQLite.
-   Store structured recipe information: cuisine, title, rating, prep
    time, cook time, total time, description, nutrients, and servings.
-   Pagination and sorting by rating.
-   Search recipes by **title**, with optional filters for **calories**
    and **rating**.

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **Node.js** with **Express.js** for the server.
-   **SQLite** as the database engine.
-   **sqlite3** & **sqlite** npm packages for database handling.
-   **fs** for file handling.

------------------------------------------------------------------------

## 📂 Project Setup

### 1. Clone the repository

``` bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Prepare database

-   Make sure you have a file named `US_recipes.json` in the project
    root.
-   The server will parse it and populate `sample.db`.

### 4. Start the server

``` bash
node index.js
```

Server runs at:\
👉 <http://localhost:3000>

------------------------------------------------------------------------

## 📡 API Endpoints

### 1. Get paginated recipes

    GET /api/recipes/?pages=<offset>&limit=<count>

#### Example

``` http
GET /api/recipes/?pages=0&limit=5
```

#### Response

``` json
{
  "pages": 1,
  "limit": 10,
  "total": 50,
  "data": [
    {
      "id": 1,
      "title": "Spaghetti Carbonara",
      "cuisine": "Italian",
      "rating": 4.5,
      "prep_time": 15,
      "description": "Classic pasta with eggs and pancetta",
      "nutrients": { "calories": 320, "protein": "12g" },
      "serves": 2
    }
  ]
}
```

------------------------------------------------------------------------

### 2. Search recipes

    GET /api/recipes/search/?title=<string>&calories<=<max>&rating>=<min>

#### Parameters

-   **title** (string, optional) -- search by recipe title.\
-   **calories\<=** (number, optional) -- filter by maximum calories.\
-   **rating\>=** (number, optional) -- filter by minimum rating.

#### Example

``` http
GET /api/recipes/search/?title=pasta&calories<=500&rating>=4
```

#### Response

``` json
[
  {
    "id": 12,
    "title": "Pasta Primavera",
    "cuisine": "Italian",
    "rating": 4.3,
    "prep_time": 20,
    "description": "Vegetable pasta with light sauce",
    "nutrients": { "calories": 420, "protein": "10g" },
    "serves": 3
  }
]
```
