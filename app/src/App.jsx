import { useState, useMemo } from 'react'
import { Github, Mail } from 'lucide-react'
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
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <img 
                  src={awesomeLogo} 
                  alt="Awesome Logo" 
                  className="h-5 sm:h-6 flex-shrink-0"
                  style={{ width: 'auto' }}
                />
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight truncate min-w-0 flex-1">
                  Awesome Free Nonprofits
                </h1>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href="https://github.com/athman3/awesome-free-nonprofits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Discover Amazing Resources
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A curated collection of free and discounted services to help your nonprofit
              organization thrive. From cloud infrastructure to design tools, find everything
              you need in one place.
            </p>
          </section>

          {/* Search and Filters */}
          <div className="space-y-6 mb-8">
            <div className="flex justify-center">
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
          <div className="mb-6 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredServices.length} of {servicesData.services.length} services
              {!searchQuery.trim() && selectedCategory !== 'all' && ` in ${selectedCategory}`}
              {searchQuery.trim() && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Services Grid */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.name}
                  service={service}
                  onCategoryClick={setSelectedCategory}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No services found. Try adjusting your filters or search query.
              </p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t bg-muted/30 mt-auto">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col items-center text-center space-y-8">
              {/* CTA Section */}
              <div className="space-y-4 max-w-xl mx-auto">
                <h3 className="text-2xl font-semibold tracking-tight">Grow the collection</h3>
                <p className="text-muted-foreground">
                  Help other nonprofits by adding free resources you use and love. 
                  Your contributions make this list better for everyone.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  <Button variant="default" asChild>
                    <a
                      href="https://github.com/athman3/awesome-free-nonprofits"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      <Github className="h-4 w-4" />
                      Contribute on GitHub
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a
                      href="mailto:contact@athman3.com?subject=Request%20Addition%20or%20Report%20Error"
                      className="gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      contact@athman3.com
                    </a>
                  </Button>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full max-w-4xl text-base text-muted-foreground">
                <div>
                  🇩🇿 Built by{' '}
                  <a
                    href="https://github.com/ATHman3"
                    className="font-medium text-green-600 hover:text-green-500 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ATHman3
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App
