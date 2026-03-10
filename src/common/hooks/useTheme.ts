import {createContext, useContext} from "react";
import type {Theme, ThemeContextType, ThemeUpdateContextType} from "../../types";

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const ThemeUpdateContext = createContext<ThemeUpdateContextType | undefined>(undefined);

export function useTheme(): Theme {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context.theme;
}

export function useThemeUpdate(): ThemeUpdateContextType {
    const context = useContext(ThemeUpdateContext);
    if (!context) {
        throw new Error('useThemeUpdate must be used within a ThemeProvider');
    }
    return context;
}