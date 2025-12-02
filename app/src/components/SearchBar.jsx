import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

/**
 * Search Bar Component
 * Provides a search input for filtering services
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Current search value
 * @param {Function} props.onChange - Callback when search value changes
 */
export function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Cloud, Design..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 h-14 text-lg rounded-full border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow focus-visible:ring-emerald-500/30"
      />
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
    </div>
  )
}
