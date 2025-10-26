import spaghettiImg from "../assets/spaghetti.jpg";
import carbonaraImg from "../assets/carbonara.jpg";
import curryImg from "../assets/curry.jpg";
import cookieImg from "../assets/cookie.jpg";


export const RECIPES = [
  {
    id: "spaghetti",
    title: "Spaghetti",
    time: "30 Minutes",
    tags: ["Vegan", "4 ingredients", "Easy"],
    desc: "A simple, comforting pasta with tomato sauce.",
    thumb: spaghettiImg,
    ingredients: [
      "8 oz spaghetti", "2 cups tomato sauce", "2 cloves garlic, minced", "2 tbsp olive oil"
    ],
    instructions: [
      "Cook pasta per package; drain.",
      "Sauté garlic in olive oil, add sauce; simmer 5 min.",
      "Toss pasta with sauce and serve."
    ],
  },
  {
    id: "carbonara",
    title: "Spaghetti Carbonara",
    time: "25 Minutes",
    tags: ["2 servings", "Easy"],
    desc: "A Classic Italian dish witha creamy egg sauce, pancetta, and parmesan.",
    thumb: carbonaraImg,
    ingredients: [
      "6 oz spaghetti", "2 oz pancetta, diced", "2 large eggs", "1/2 cup grated Parmesan", "2 cloves garlic, minced"
    ],
    instructions: [
      "Cook spaghetti; save 1/4 cup pasta water.",
      "Crisp pancetta; add garlic 30s.",
      "Off heat, toss pasta with eggs+cheese; thin with pasta water."
    ],
  },
  {
    id: "chicken-curry",
    title: "Chicken Curry",
    time: "35 Minutes",
    tags: ["Easy"],
    desc: "A flavorful curry dish made with tender chicken, spices, and a rich curry sauce.",
    thumb: curryImg,
    ingredients: [
      "1 lb chicken", "1 onion", "2 tbsp curry powder", "1 cup coconut milk"
    ],
    instructions: [
      "Sauté onion; add curry powder.",
      "Add chicken; brown.",
      "Pour coconut milk; simmer 15 min."
    ],
  },
  {
    id: "caesar-salad",
    title: "Caesar Salad",
    time: "10 Minutes",
    tags: ["Quick"],
    desc: "A fresh salad with crisp romaine lettuce, croutons, parmesan, and Caesar dressing.",
    thumb: "https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Romaine", "Croutons", "Parmesan", "Caesar dressing"],
    instructions: ["Toss all together and serve."]
  },
  {
    id: "choc-chip",
    title: "Chocolate Chip",
    time: "30 Minutes",
    tags: ["Dessert"],
    desc: "Soft and chewy cookies loaded with warm chocolate chips.",
    thumb: cookieImg,
    ingredients: ["Flour", "Butter", "Sugar", "Egg", "Chocolate chips"],
    instructions: ["Mix, scoop, and bake at 350°F for 10–12 min."]
  }
];
