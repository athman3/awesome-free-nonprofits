import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"
import { useRef } from "react"

/**
 * Theme Toggle Component
 * Provides a button to toggle between light and dark themes
 * Features View Transitions API with circular reveal effect
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const buttonRef = useRef(null)

  /**
   * Toggles the theme with a circular reveal View Transition animation
   * Circle always expands from button center to reveal the new theme
   */
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light"
    
    // If View Transitions API is not supported, just change theme
    if (!document.startViewTransition) {
      setTheme(newTheme)
      return
    }

    // Get button center coordinates
    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    // Calculate the maximum radius needed to cover the entire screen
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    // Start the View Transition
    const transition = document.startViewTransition(() => {
      setTheme(newTheme)
    })

    try {
      await transition.ready

      // Always animate the NEW view expanding from center
      // This creates a consistent circular reveal effect in both directions
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ],
        },
        {
          duration: 500,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    } catch {
      // Transition was skipped or failed
    }
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md p-2"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 opacity-100 transition-all duration-300 ease-out dark:-rotate-90 dark:scale-0 dark:opacity-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 opacity-0 transition-all duration-300 ease-out dark:rotate-0 dark:scale-100 dark:opacity-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

