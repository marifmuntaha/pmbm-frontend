import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Outlet } from 'react-router-dom';
import type {Theme, ThemeUpdateContextType} from "@/types";
import { ThemeContext, ThemeUpdateContext } from "@/common/hooks/useTheme";

const ThemeProvider: React.FC = () => {
    const defaultTheme: Theme = {
        main: 'default',
        sidebar: 'white',
        sidebarCompact: false,
        sidebarVisibility: false,
        sidebarMobile: false,
        header: 'white',
        skin: 'light',
    };

    const [theme, setTheme] = useState<Theme>(defaultTheme);

    const themeUpdate: ThemeUpdateContextType = {
        uistyle: (value) => setTheme((prevTheme) => ({ ...prevTheme, main: value })),
        sidebar: (value) => setTheme((prevTheme) => ({ ...prevTheme, sidebar: value })),
        sidebarCompact: () => setTheme((prevTheme) => ({ ...prevTheme, sidebarCompact: !prevTheme.sidebarCompact })),
        sidebarVisibility: () => setTheme((prevTheme) => ({ ...prevTheme, sidebarVisibility: !prevTheme.sidebarVisibility })),
        sidebarHide: () => setTheme((prevTheme) => ({ ...prevTheme, sidebarVisibility: false })),
        header: (value) => setTheme((prevTheme) => ({ ...prevTheme, header: value })),
        skin: (value) => setTheme((prevTheme) => ({ ...prevTheme, skin: value })),
        reset: () => setTheme(defaultTheme),
    };

    const bodyClass = classNames({
        'nk-body bg-lighter npc-default has-sidebar no-touch nk-nio-theme': true,
    });

    useEffect(() => {
        const body = document.querySelector('body');
        if (body) {
            body.className = bodyClass;
        }
    }, [bodyClass]);

    useEffect(() => {
        const body = document.querySelector('body');
        if (body) {
            if (theme.main === 'default') {
                body.classList.add('ui-default');
                body.classList.remove('ui-bordered');
            } else {
                body.classList.add('ui-bordered');
                body.classList.remove('ui-default');
            }

            if (theme.skin === 'dark') {
                body.classList.add('dark-mode');
            } else {
                body.classList.remove('dark-mode');
            }

            if (theme.sidebarVisibility) {
                body.classList.add('nav-shown');
            } else {
                body.classList.remove('nav-shown');
            }
        }
    }, [theme]);

    useEffect(() => {
        const handleMobileSidebar = () => {
            if (window.innerWidth < 1200) {
                setTheme((prevTheme) => ({ ...prevTheme, sidebarMobile: true }));
            } else {
                setTheme((prevTheme) => ({ ...prevTheme, sidebarMobile: false, sidebarVisibility: false }));
            }
        };

        handleMobileSidebar();
        window.addEventListener('resize', handleMobileSidebar);
        return () => {
            window.removeEventListener('resize', handleMobileSidebar);
        };
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <ThemeUpdateContext.Provider value={themeUpdate}>
                <Outlet />
            </ThemeUpdateContext.Provider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
