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
    <div className="flex flex-wrap gap-3 justify-center">
      <Badge
        variant={selectedCategory === "all" ? "default" : "outline"}
        className="cursor-pointer transition-all text-sm px-4 py-2 hover:scale-[1.02]"
        onClick={() => onCategorySelect("all")}
      >
        All Services
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className="cursor-pointer transition-all text-sm px-4 py-2 hover:scale-[1.02]"
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  )
}

