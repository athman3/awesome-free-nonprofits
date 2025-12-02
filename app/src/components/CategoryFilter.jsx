import { Badge } from "@/components/ui/badge"

/**
 * Category Filter Component
 * Displays all available categories and allows filtering
 * 
 * @param {Object} props - Component props
 * @param {string[]} props.categories - All available categories
 * @param {string} props.selectedCategory - Currently selected category
 * @param {Function} props.onCategorySelect - Callback when a category is selected
 */
export function CategoryFilter({ categories, selectedCategory, onCategorySelect }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Badge
        variant={selectedCategory === "all" ? "default" : "outline"}
        className={`cursor-pointer transition-all text-sm px-5 py-2.5 rounded-full hover:scale-[1.02] ${
          selectedCategory === "all" 
            ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 border-transparent" 
            : "bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-900"
        }`}
        onClick={() => onCategorySelect("all")}
      >
        All Services
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className={`cursor-pointer transition-all text-sm px-5 py-2.5 rounded-full hover:scale-[1.02] ${
            selectedCategory === category
              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 border-transparent"
              : "bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-900"
          }`}
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  )
}
