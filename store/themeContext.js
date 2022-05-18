import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ThemeContext = createContext(null)
export { ThemeContext }

export function useThemeContext() {
    const context = useContext(ThemeContext)
    if (context === null) {
        throw new Error('useThemeContext is null')
    }
    if (context === undefined) {
        throw new Error('useThemeContext was used outside of its Provider')
    }
    return context
}

export default function ThemeContextProvider(props) {

    const [theme, setTheme] = useState('light')

    const toggleTheme = useCallback((value) => {
        const mode = value ? value : theme === 'light' ? 'dark' : 'light'
        localStorage.setItem('theme', mode)
        setTheme(mode)
    }, [theme, setTheme])

    const contextValues = useMemo(() => ({
        theme,
        toggleTheme
    }), [
        theme,
        toggleTheme
    ])

    return(
        <ThemeContext.Provider value={contextValues}>
            {props.children}
        </ThemeContext.Provider>
    )

};