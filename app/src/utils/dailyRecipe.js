// Returns a recipe that rotates daily based on the current date
// The same recipe shows all day and changes at midnight
export function getDailyRecipe(recipes) {
    if(!recipes || recipes.length == 0) return null;

    const today = new Date();

    //Build a number from todays date (03-02-2026 => 20260302)
    // Using this instead of Date.now() so it stays the same all day
    const dateKey = 
        today.getFullYear() * 10000 +
        (today.getMonth() + 1) * 100 +
        today.getDate();
    //Pick a recipe by cycling through the list based on the date
    const index = dateKey % recipes.length;

    return recipes[index];
}
