import React, { useEffect, useLayoutEffect, type MouseEvent, type JSX } from "react";
import { Icon } from "../../components";
import classNames from "classnames";
import { NavLink, useLocation } from "react-router";
import { slideUp, slideDown, getParents } from "../../helpers";
import { useThemeUpdate } from '../../common/hooks/useTheme';

export interface MenuItem {
    heading?: string;
    link?: string;
    text?: string;
    icon?: string;
    badge?: string;
    newTab?: boolean;
    subMenu?: MenuItem[];
}

interface MenuProps {
    data: MenuItem[];
}

const Menu: React.FC<MenuProps> = ({ data }) => {
    const themeUpdate = useThemeUpdate();
    const location = useLocation();

    const currentLink = (selector: string): void => {
        const elm = document.querySelectorAll(selector);

        elm.forEach((item) => {
            const activeRouterLink = item.classList.contains('active');

            if (activeRouterLink) {
                const parents = getParents(item, '.nk-menu', 'nk-menu-item');
                parents.forEach((parentElement: Element) => {
                    parentElement.classList.add('active', 'current-page');
                    const subItem = parentElement.querySelector('.nk-menu-wrap');
                    if (subItem !== null && subItem instanceof HTMLElement) {
                        subItem.style.display = "block";
                    }
                });
            } else {
                const parent = item.parentElement;
                if (parent) {
                    parent.classList.remove('active', 'current-page');
                }
            }
        });
    };

    const dropdownToggle = (elm: HTMLElement): void => {
        const parent = elm.parentElement;
        const nextelm = elm.nextElementSibling;

        if (!parent || !nextelm || !(nextelm instanceof HTMLElement)) return;

        const speed = nextelm.children.length > 5 ? 400 + nextelm.children.length * 10 : 400;

        if (!parent.classList.contains('active')) {
            parent.classList.add('active');
            slideDown(nextelm, speed);
        } else {
            parent.classList.remove('active');
            slideUp(nextelm, speed);
        }
    };

    const closeSiblings = (elm: HTMLElement): void => {
        const parent = elm.parentElement;
        if (!parent || !parent.parentElement) return;

        const siblings = parent.parentElement.children;

        Array.from(siblings).forEach((item) => {
            if (item !== parent) {
                item.classList.remove('active');
                if (item.classList.contains('has-sub')) {
                    const subitems = item.querySelectorAll('.nk-menu-wrap');
                    subitems.forEach((child) => {
                        if (child.parentElement) {
                            child.parentElement.classList.remove('active');
                        }
                        slideUp(child as HTMLElement, 400);
                    });
                }
            }
        });
    };

    const menuToggle = (e: MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        const item = e.currentTarget.closest('.nk-menu-toggle') as HTMLElement | null;

        if (item) {
            dropdownToggle(item);
            closeSiblings(item);
        }
    };

    const routeChange = (): void => {
        const selector = document.querySelectorAll(".nk-menu-link");

        selector.forEach((item) => {
            if (item.classList.contains('active')) {
                closeSiblings(item as HTMLElement);
                item.parentElement?.classList.add("active");
            } else {
                item.parentElement?.classList.remove("active");
                currentLink('.nk-menu-link');
            }
        });
    };

    useLayoutEffect(() => {
        routeChange();
        themeUpdate.sidebarHide();
    }, [location.pathname]);

    useEffect(() => {
        currentLink('.nk-menu-link');
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const renderMenuItem = (item: MenuItem, index: number, level: number = 0): JSX.Element => {
        if (item.heading) {
            return (
                <li key={`${level}-${index}`} className="nk-menu-heading">
                    <h6 className="overline-title text-blue-alt">{item.heading}</h6>
                </li>
            );
        }

        const hasSubMenu = item.subMenu && item.subMenu.length > 0;

        return (
            <li
                key={`${level}-${index}`}
                className={classNames({
                    'nk-menu-item': true,
                    'has-sub': hasSubMenu,
                })}
            >
                {!hasSubMenu ? (
                    <NavLink
                        to={item.link || '#'}
                        className="nk-menu-link"
                        target={item.newTab ? '_blank' : undefined}
                    >
                        {item.icon && (
                            <span className="nk-menu-icon">
                                <Icon name={item.icon} />
                            </span>
                        )}
                        <span className="nk-menu-text">{item.text}</span>
                        {item.badge && (
                            <span className="nk-menu-badge">{item.badge}</span>
                        )}
                    </NavLink>
                ) : (
                    <>
                        <a
                            href="#"
                            className="nk-menu-link nk-menu-toggle"
                            onClick={menuToggle}
                        >
                            {item.icon && (
                                <span className="nk-menu-icon">
                                    <Icon name={item.icon} />
                                </span>
                            )}
                            <span className="nk-menu-text">{item.text}</span>
                            {item.badge && (
                                <span className="nk-menu-badge">{item.badge}</span>
                            )}
                        </a>
                        <div className="nk-menu-wrap">
                            <ul className="nk-menu-sub">
                                {item.subMenu?.map((sItem, sIndex) =>
                                    renderMenuItem(sItem, sIndex, level + 1)
                                )}
                            </ul>
                        </div>
                    </>
                )}
            </li>
        );
    };

    const renderMenuItems = (): JSX.Element[] => {
        return data.map((item, index) => {
            if (item.heading) {
                return (
                    <li key={index} className="nk-menu-heading">
                        <h6 className="overline-title text-blue-alt">{item.heading}</h6>
                    </li>
                );
            }

            const hasSubMenu = item.subMenu && item.subMenu.length > 0;

            return (
                <li
                    key={index}
                    className={classNames({
                        'nk-menu-item': true,
                        'has-sub': hasSubMenu,
                    })}
                >
                    {!hasSubMenu ? (
                        <NavLink
                            to={item.link || '#'}
                            className="nk-menu-link"
                            target={item.newTab ? '_blank' : undefined}
                        >
                            {item.icon && (
                                <span className="nk-menu-icon">
                                    <Icon name={item.icon} />
                                </span>
                            )}
                            <span className="nk-menu-text">{item.text}</span>
                            {item.badge && (
                                <span className="nk-menu-badge">{item.badge}</span>
                            )}
                        </NavLink>
                    ) : (
                        <>
                            <a
                                href="#"
                                className="nk-menu-link nk-menu-toggle"
                                onClick={menuToggle}
                            >
                                {item.icon && (
                                    <span className="nk-menu-icon">
                                        <Icon name={item.icon} />
                                    </span>
                                )}
                                <span className="nk-menu-text">{item.text}</span>
                                {item.badge && (
                                    <span className="nk-menu-badge">{item.badge}</span>
                                )}
                            </a>
                            <div className="nk-menu-wrap">
                                <ul className="nk-menu-sub">
                                    {item.subMenu?.map((sItem, sIndex) => {
                                        const hasSubSubMenu = sItem.subMenu && sItem.subMenu.length > 0;

                                        return (
                                            <li
                                                key={sIndex}
                                                className={classNames({
                                                    'nk-menu-item': true,
                                                    'has-sub': hasSubSubMenu,
                                                })}
                                            >
                                                {!hasSubSubMenu ? (
                                                    <NavLink
                                                        to={sItem.link || '#'}
                                                        className="nk-menu-link"
                                                        target={sItem.newTab ? '_blank' : undefined}
                                                    >
                                                        <span className="nk-menu-text">{sItem.text}</span>
                                                        {sItem.badge && (
                                                            <span className="nk-menu-badge">{sItem.badge}</span>
                                                        )}
                                                    </NavLink>
                                                ) : (
                                                    <>
                                                        <a
                                                            href="#"
                                                            className="nk-menu-link nk-menu-toggle"
                                                            onClick={menuToggle}
                                                        >
                                                            <span className="nk-menu-text">{sItem.text}</span>
                                                            {sItem.badge && (
                                                                <span className="nk-menu-badge">{sItem.badge}</span>
                                                            )}
                                                        </a>
                                                        <div className="nk-menu-wrap">
                                                            <ul className="nk-menu-sub">
                                                                {sItem.subMenu?.map((s2Item, s2Index) => {
                                                                    const hasSubSubSubMenu = s2Item.subMenu && s2Item.subMenu.length > 0;

                                                                    return (
                                                                        <li
                                                                            key={s2Index}
                                                                            className={classNames({
                                                                                'nk-menu-item': true,
                                                                                'has-sub': hasSubSubSubMenu,
                                                                            })}
                                                                        >
                                                                            {!hasSubSubSubMenu ? (
                                                                                <NavLink
                                                                                    to={s2Item.link || '#'}
                                                                                    className="nk-menu-link"
                                                                                    target={s2Item.newTab ? '_blank' : undefined}
                                                                                >
                                                                                    <span
                                                                                        className="nk-menu-text">{s2Item.text}</span>
                                                                                    {s2Item.badge && (
                                                                                        <span
                                                                                            className="nk-menu-badge">{s2Item.badge}</span>
                                                                                    )}
                                                                                </NavLink>
                                                                            ) : (
                                                                                <>
                                                                                    <a
                                                                                        href="#"
                                                                                        className="nk-menu-link nk-menu-toggle"
                                                                                        onClick={menuToggle}
                                                                                    >
                                                                                        <span
                                                                                            className="nk-menu-text">{s2Item.text}</span>
                                                                                        {s2Item.badge && (
                                                                                            <span
                                                                                                className="nk-menu-badge">{s2Item.badge}</span>
                                                                                        )}
                                                                                    </a>
                                                                                    <div className="nk-menu-wrap">
                                                                                        <ul className="nk-menu-sub">
                                                                                            {s2Item.subMenu?.map((s3Item, s3Index) => (
                                                                                                <li key={s3Index}
                                                                                                    className="nk-menu-item">
                                                                                                    <NavLink
                                                                                                        to={s3Item.link || '#'}
                                                                                                        className="nk-menu-link"
                                                                                                        target={s3Item.newTab ? '_blank' : undefined}
                                                                                                    >
                                                                                                        <span className="nk-menu-text">
                                                                                                            {s3Item.text}
                                                                                                        </span>
                                                                                                        {s3Item.badge && (
                                                                                                            <span
                                                                                                                className="nk-menu-badge">
                                                                                                                {s3Item.badge}
                                                                                                            </span>
                                                                                                        )}
                                                                                                    </NavLink>
                                                                                                </li>
                                                                                            ))}
                                                                                        </ul>
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        </div>
                                                    </>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </>
                    )}
                </li>
            );
        });
    };

    return <ul className="nk-menu">{renderMenuItems()}</ul>;
};

export default Menu;