import { createContext, useContext, useEffect, useState } from "react"

const ThemeProviderContext = createContext({
  theme: "system",
  setTheme: () => null,
})

/**
 * Theme Provider Component
 * Manages dark/light/system theme state and persists to localStorage
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.defaultTheme - Default theme ('light', 'dark', or 'system')
 * @param {string} props.storageKey - localStorage key for theme persistence
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "awesome-nonprofits-theme",
  ...props
}) {
  const [theme, setTheme] = useState(
    () => typeof localStorage === 'undefined'
      ? defaultTheme
      : localStorage.getItem(storageKey) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    // Determine the actual theme to apply
    let themeToApply = theme
    if (theme === "system") {
      themeToApply = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
    }

    // Only update if the class needs to change to prevent flash
    const currentTheme = root.classList.contains("dark") ? "dark" : "light"
    if (currentTheme !== themeToApply) {
      root.classList.remove("light", "dark")
      root.classList.add(themeToApply)
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

/**
 * Hook to access theme context
 * @returns {Object} Theme context with theme and setTheme
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

