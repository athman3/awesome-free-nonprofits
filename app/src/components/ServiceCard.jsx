import { ExternalLink, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

/**
 * Service Card Component
 * Displays a nonprofit service with its details and categories
 * 
 * @param {Object} props - Component props
 * @param {Object} props.service - Service data
 * @param {string} props.service.name - Service name
 * @param {string} props.service.url - Service URL
 * @param {string} props.service.description - Service description
 * @param {string} props.service.logo - Logo path (optional)
 * @param {string[]} props.service.categories - Service categories
 * @param {boolean} [props.isFeatured] - Whether the service is featured
 * @param {Function} props.onCategoryClick - Callback when category badge is clicked
 */
export function ServiceCard({ service, isFeatured, onCategoryClick }) {
  return (
    <Card className={`h-full flex flex-col border shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm group ${
      isFeatured 
        ? 'border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-emerald-100 dark:shadow-emerald-900/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30' 
        : 'bg-white/60 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-900 hover:border-primary/20'
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            {service.name}
          </CardTitle>
          {service.logo && (
            <div className="p-2 rounded-2xl bg-white shadow-sm dark:bg-zinc-800">
              <img
                src={service.logo}
                alt={`${service.name} logo`}
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
        
        <div className="h-1" />
        
        <div className="flex flex-wrap gap-2">
          {service.categories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="cursor-pointer rounded-full px-3 py-1 border border-zinc-300 dark:border-zinc-600 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground hover:border-primary dark:hover:border-primary transition-colors font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
              onClick={(e) => {
                e.preventDefault();
                onCategoryClick(category);
              }}
            >
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-0">
        <div className="flex-1 space-y-4 mb-6">
          {service.about && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                About
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {service.about}
              </p>
            </div>
          )}
          
          {service.offer && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                Offer
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {service.offer}
              </p>
            </div>
          )}

          {!service.about && !service.offer && service.description && (
            <p className="text-base leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          )}
        </div>

        <Button
          variant="default"
          className="w-full mt-auto group/btn rounded-full shadow-none hover:shadow-lg transition-all duration-300"
          size="lg"
          asChild
        >
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Visit Website
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}

