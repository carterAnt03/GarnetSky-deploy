//Maps Cuisine keywords (matched against recipe tags) to CSS class names.
// THe order matters - the first match wins if a recipe has multiple cuisine tags.
export const CUISINE_THEMES = [
    { keywords: ["italian"],     className: "theme-italian" },                                                                                     
    { keywords: ["mexican"],     className: "theme-mexican" },                                                                                     
    { keywords: ["japanese", "sushi", "ramen"], className: "theme-japanese" },
    { keywords: ["indian"],      className: "theme-indian" },
    { keywords: ["french"],      className: "theme-french" },
    { keywords: ["mediterranean"], className: "theme-mediterranean" },
    { keywords: ["american", "bbq", "southern"], className: "theme-american" },
    { keywords: ["chinese"],     className: "theme-chinese" },
    { keywords: ["thai"],        className: "theme-thai" },
];

//Looks through a recipe's tags and returns the matching cuisine CSS class
// Returns an empty string if no cuisine is detected (uses the default theme)
export function getCuisineClass(tags = []) {
    const normalizedTags = tags.map((t) => t.toLowerCase());

    for (const cuisine of CUISINE_THEMES) {
      const match = cuisine.keywords.some((keyword) =>
        normalizedTags.some((tag) => tag.includes(keyword))
      );
      if (match) return cuisine.className;
    }

    // No cuisine match found — fall back to default app styles
    return "";
  }