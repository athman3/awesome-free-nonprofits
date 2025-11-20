import { ExternalLink } from "lucide-react"
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
 * @param {string[]} props.service.categories - Service categories
 * @param {Function} props.onCategoryClick - Callback when category badge is clicked
 */
export function ServiceCard({ service, onCategoryClick }) {
  return (
    <Card className="h-full min-h-[450px] flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl mb-2">
          <span className="truncate">{service.name}</span>
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-3">
          {service.categories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => onCategoryClick(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {service.about && (
          <div className="mb-1">
            <h4 className="font-semibold text-base tracking-wide text-foreground mb-2">
              About 
            </h4>
            <CardDescription className="text-base leading-relaxed mb-4">
              {service.about}
            </CardDescription>
          </div>
        )}
        {service.offer && (
          <div className="mb-6">
            <h4 className="font-semibold text-base tracking-wide text-foreground mb-2">
              Offer
            </h4>
            <CardDescription className="text-base leading-relaxed">
              {service.offer}
            </CardDescription>
          </div>
        )}
        {!service.about && !service.offer && service.description && (
          <CardDescription className="flex-1 text-lg leading-relaxed mb-6">
            {service.description}
          </CardDescription>
        )}
        <Button
          variant="outline"
          className="mt-auto w-full py-3"
          asChild
        >
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Learn More
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}

