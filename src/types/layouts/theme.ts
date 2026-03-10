import React from "react";

export interface Theme {
    main: 'default' | 'bordered';
    sidebar: 'white' | 'light' | 'dark' | 'theme';
    sidebarCompact: boolean;
    sidebarVisibility: boolean;
    sidebarMobile: boolean;
    header: 'white' | 'light' | 'dark' | 'theme';
    skin: 'light' | 'dark';
}

export interface ThemeUpdateContextType {
    uistyle: (value: 'default' | 'bordered') => void;
    sidebar: (value: 'white' | 'light' | 'dark' | 'theme') => void;
    sidebarCompact: () => void;
    sidebarVisibility: () => void;
    sidebarHide: () => void;
    header: (value: 'white' | 'light' | 'dark' | 'theme') => void;
    skin: (value: 'light' | 'dark') => void;
    reset: () => void;
}

export interface ThemeContextType {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}