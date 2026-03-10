import { useState } from "react";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { LinkList, LinkItem, UserAvatar } from "@/components";
import { useTheme, useThemeUpdate } from "@/common/hooks/useTheme";
import {useAuthContext} from "@/common/hooks/useAuthContext";
import {getRoleName} from "@/helpers";

const User = () => {
    const {user} = useAuthContext();
    const theme = useTheme();
    const themeUpdate = useThemeUpdate();
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen((prevState) => !prevState);

    return (
        <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
            <DropdownToggle
                tag="a"
                href="#toggle"
                className="dropdown-toggle"
                onClick={(ev) => {
                    ev.preventDefault();
                }}
            >
                <div className="user-toggle">
                    <UserAvatar icon="user-alt" className="sm" />
                    <div className="user-info d-none d-md-block">
                        <div className="user-status">{getRoleName(user?.role)}</div>
                        <div className="user-name dropdown-indicator">{user?.name}</div>
                    </div>
                </div>
            </DropdownToggle>
            <DropdownMenu end className="dropdown-menu-md dropdown-menu-s1">
                <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
                    <div className="user-card sm">
                        <div className="user-avatar">
                            <span>AB</span>
                        </div>
                        <div className="user-info">
                            <span className="lead-text">{user?.name}</span>
                            <span className="sub-text">{user?.email}</span>
                        </div>
                    </div>
                </div>
                <div className="dropdown-inner">
                    <LinkList>
                        <LinkItem link="/profil" icon="setting-alt" onClick={toggle}>
                            Pengaturan Akun
                        </LinkItem>
                        <LinkItem link="/aktifitas" icon="activity-alt" onClick={toggle}>
                            Aktivitas
                        </LinkItem>
                        <li>
                            <a className={`dark-switch ${theme.skin === 'dark' ? 'active' : ''}`} href="#"
                               onClick={(ev) => {
                                   ev.preventDefault();
                                   themeUpdate.skin(theme.skin === 'dark' ? 'light' : 'dark');
                               }}>
                                {theme.skin === 'dark' ?
                                    <><em className="icon ni ni-sun"></em><span>Mode Terang</span></>
                                    :
                                    <><em className="icon ni ni-moon"></em><span>Mode Gelap</span></>
                                }
                            </a>
                        </li>
                    </LinkList>
                </div>
                <div className="dropdown-inner">
                    <LinkList>
                        <LinkItem icon="signout" link={`/auth/keluar`}>
                            Keluar
                        </LinkItem>
                    </LinkList>
                </div>
            </DropdownMenu>
        </Dropdown>
    );
};

export default User;
