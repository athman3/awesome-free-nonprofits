import { useState, useMemo } from 'react'
import { Github, Mail, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ServiceCard } from '@/components/ServiceCard'
import { CategoryFilter } from '@/components/CategoryFilter'
import { SearchBar } from '@/components/SearchBar'
import servicesData from '@/data/services.json'
import awesomeLogo from '@/assets/awesome-logo-svg-vector.svg'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Handle search query change - reset category to 'all' when searching
  const handleSearchChange = (value) => {
    setSearchQuery(value)
    // Reset to 'all' when user starts searching
    if (value.trim() && selectedCategory !== 'all') {
      setSelectedCategory('all')
    }
  }

  // Identify the top 3 services from the full list (before filtering)
  const featuredServiceNames = useMemo(() => {
    const allServices = [...servicesData.services]
    // Sort by score (descending) then by name (ascending)
    allServices.sort((a, b) => {
      const scoreDiff = (b.score || 0) - (a.score || 0)
      if (scoreDiff !== 0) return scoreDiff
      return a.name.localeCompare(b.name)
    })
    // Return the names of the top 3
    return allServices.slice(0, 3).map(s => s.name)
  }, [])

  // Filter services based on search and category
  const filteredServices = useMemo(() => {
    let filtered = [...servicesData.services]

    // If search is active, search across all services regardless of category
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.categories.some(cat => cat.toLowerCase().includes(query))
      )
    } else {
      // Only filter by category when no search is active
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(service =>
          service.categories.includes(selectedCategory)
        )
      }
    }

    // Sort results by score (descending) then by name (ascending)
    filtered.sort((a, b) => {
      // Sort by score descending
      const scoreDiff = (b.score || 0) - (a.score || 0)
      if (scoreDiff !== 0) return scoreDiff
      
      // If scores are equal, sort by name ascending
      return a.name.localeCompare(b.name)
    })

    return filtered
  }, [searchQuery, selectedCategory])

  return (
    <ThemeProvider defaultTheme="system">
      <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        {/* Header */}
        <header className="border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 rounded-xl">
                  <img 
                    src={awesomeLogo} 
                    alt="Awesome Logo" 
                    className="h-6 w-auto flex-shrink-0"
                  />
                </div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight truncate min-w-0 flex-1 text-zinc-900 dark:text-zinc-100">
                  Awesome Free Nonprofits
                </h1>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="ghost" size="icon" className="hover:bg-transparent" asChild>
                  <a
                    href="https://github.com/athman3/awesome-free-nonprofits"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-16">
          {/* Hero Section */}
          <section className="text-center mb-20 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-zinc-900 dark:text-zinc-50">
              Discover Amazing <br className="hidden sm:block" />
              <span className="text-emerald-600 dark:text-emerald-500 relative whitespace-nowrap">
                <span className="relative z-10">Resources</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-emerald-200/50 dark:bg-emerald-800/50 -rotate-1 -z-10 rounded-full"></span>
              </span>
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              A curated collection of free and discounted services to help your nonprofit
              organization thrive.
            </p>
          </section>

          {/* Search and Filters */}
          <div className="space-y-8 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <div className="flex justify-center max-w-2xl mx-auto">
              <SearchBar value={searchQuery} onChange={handleSearchChange} />
            </div>
            <div className="flex justify-center">
              <CategoryFilter
                categories={servicesData.categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-12 text-center animate-in fade-in duration-700 delay-200">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 inline-block px-6 py-2 rounded-full">
              Showing {filteredServices.length} of {servicesData.services.length} services
              {!searchQuery.trim() && selectedCategory !== 'all' && ` in ${selectedCategory}`}
              {searchQuery.trim() && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Services Grid */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.name}
                  service={service}
                  isFeatured={featuredServiceNames.includes(service.name)}
                  onCategoryClick={setSelectedCategory}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchX className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">No services found</h3>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
                We couldn't find what you were looking for. Try adjusting your search or filters.
              </p>
              <Button 
                variant="outline" 
                className="rounded-full px-8 border-2"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-12 mt-auto border-t border-zinc-200/50 dark:border-zinc-800/50">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 text-sm text-zinc-500 dark:text-zinc-400">
            <a 
              href="https://creativecommons.org/publicdomain/zero/1.0/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              CC0 1.0 License
            </a>
            
            <span className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
            
            <span className="flex items-center gap-2">
              <span className="text-base">🇩🇿</span>
              Built by
              <a
                href="https://github.com/ATHman3"
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                ATHman3
              </a>
            </span>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App
