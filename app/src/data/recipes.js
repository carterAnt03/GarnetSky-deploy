import spaghettiImg from "../assets/spaghetti.jpg";
import carbonaraImg from "../assets/carbonara.jpg";
import curryImg from "../assets/curry.jpg";
import cookieImg from "../assets/cookie.jpg";

// Simple in-memory data set for the demo recipe app.
// In a full application these would come from a backend API or database.
export const RECIPES = [
  {
    id: "spaghetti",
    title: "Spaghetti",
    time: "30 Minutes",
    tags: ["Vegan", "4 ingredients", "Easy"],
    desc: "A simple, comforting pasta with tomato sauce.",
    thumb: spaghettiImg,
    ingredients: [
      "8 oz spaghetti",
      "2 cups tomato sauce",
      "2 cloves garlic, minced",
      "2 tbsp olive oil",
    ],
    instructions: [
      "Cook spaghetti according to package directions; drain.",
      "Sauté garlic in olive oil, then add tomato sauce and simmer for 5–10 minutes.",
      "Toss pasta with sauce and serve.",
    ],
  },
  {
    id: "carbonara",
    title: "Spaghetti Carbonara",
    time: "25 Minutes",
    tags: ["Pork", "Creamy", "Italian"],
    desc: "Classic carbonara with eggs, Parmesan, and crispy pancetta.",
    thumb: carbonaraImg,
    ingredients: [
      "8 oz spaghetti",
      "2 eggs",
      "1/2 cup grated Parmesan",
      "4 oz pancetta or bacon",
      "Salt & pepper",
    ],
    instructions: [
      "Cook pasta until al dente, reserving 1/2 cup of the pasta water.",
      "Crisp pancetta in a pan and set aside.",
      "Whisk eggs and Parmesan together in a bowl.",
      "Toss hot pasta with pancetta, then quickly stir in egg mixture, using pasta water as needed to create a silky sauce.",
    ],
  },
  {
    id: "curry",
    title: "Weeknight Chickpea Curry",
    time: "35 Minutes",
    tags: ["Vegetarian", "Gluten-free", "Spicy"],
    desc: "A cozy coconut chickpea curry for busy nights.",
    thumb: curryImg,
    ingredients: [
      "1 tbsp oil",
      "1 onion, diced",
      "2 tbsp curry paste",
      "1 can chickpeas, drained",
      "1 can coconut milk",
      "Salt to taste",
    ],
    instructions: [
      "Sauté onion in oil until soft.",
      "Stir in curry paste and cook for 1 minute.",
      "Add chickpeas and coconut milk, then simmer for 15 minutes.",
      "Serve over rice with your favorite toppings.",
    ],
  },
  {
    id: "caesar",
    title: "Simple Caesar Salad",
    time: "15 Minutes",
    tags: ["Salad", "Quick"],
    desc: "Crisp romaine with creamy Caesar dressing.",
    thumb:
      "https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=800&auto=format&fit=crop",
    ingredients: [
      "Romaine lettuce",
      "Croutons",
      "Parmesan cheese",
      "Caesar dressing",
    ],
    instructions: [
      "Wash and chop romaine.",
      "Toss with Caesar dressing until lightly coated.",
      "Top with croutons and shaved Parmesan, then serve immediately.",
    ],
  },
  {
    id: "choc-chip",
    title: "Chocolate Chip Cookies",
    time: "30 Minutes",
    tags: ["Dessert"],
    desc: "Soft and chewy cookies loaded with warm chocolate chips.",
    thumb: cookieImg,
    ingredients: [
      "2 1/4 cups flour",
      "1 cup butter, softened",
      "3/4 cup sugar",
      "3/4 cup brown sugar",
      "1 egg + 1 egg yolk",
      "1 1/2 cups chocolate chips",
    ],
    instructions: [
      "Cream butter and sugars together until light and fluffy.",
      "Beat in egg and egg yolk, then mix in dry ingredients until just combined.",
      "Fold in chocolate chips.",
      "Scoop onto baking sheet and bake at 350°F for 10–12 minutes.",
    ],
  },
];

