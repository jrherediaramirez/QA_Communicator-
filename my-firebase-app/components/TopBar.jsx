// my-firebase-app/components/TopBar.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import {
  Cog8ToothIcon,
  MagnifyingGlassIcon,
  BellIcon,
} from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

/* ──────────────  Styled components  ────────────── */

const NavContainer = styled.nav`
  background-color: #153450;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-family: sans-serif;
  color: white;
  position: relative;
  border-radius: 15px;

  @media (min-width: 640px) {
    padding: 0 24px;
  }
`;

const LogoImage = styled.img`
  height: 70px;
  width: auto;
`;

const DesktopNav = styled.div`
  display: none;
  flex-grow: 1;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const LinksPill = styled.div`
  background-color: white;
  border-radius: 9999px;
  padding: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StyledNavLink = styled.a`
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  color: #153450;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  white-space: nowrap;

  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }

  &.active {
    background-color: #153450;
    color: white;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
      0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }
`;

const IconsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BaseIconButton = styled.button`
  padding: 6px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease-in-out;
  border: none;
  cursor: pointer;

  svg {
    height: 20px;
    width: 20px;
  }
`;

const SettingsButton = styled(BaseIconButton)`
  color: white;
  background-color: transparent;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  &.active {
    background-color: white;
    color: #153450;
  }
`;

const SearchButton = styled(BaseIconButton)`
  background-color: white;
  color: #153450;

  &:hover {
    background-color: #153450;
    color: white;
  }
`;

const NotificationButton = styled(BaseIconButton)`
  color: white;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const MobileMenuToggle = styled.button`
  background-color: transparent;
  color: white;
  padding: 8px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    height: 24px;
    width: 24px;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  background-color: #153450;
  padding: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 4px;

  a {
    display: block;
    padding: 10px 12px;
    border-radius: 4px;
    font-size: 16px;
    text-decoration: none;
    color: #cbd5e1;
    font-weight: 500;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    &.active {
      background-color: #2ecc71;
      color: white;
    }
  }
`;

/* ──────────────  Component  ────────────── */

const TopBar = () => {
  const router = useRouter();

  const navLinks = [
    { name: 'Home', path: '/dashboard' },
    { name: 'Batches Entry', path: '/batches/entry' },
    { name: 'Search Batches', path: '/batches/search' },
  ];

  const settingsPath = '/settings';
  const [activePath, setActivePath] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setActivePath(router.pathname);
  }, [router.pathname]);

  const handleLinkClick = (path) => {
    setActivePath(path);
    router.push(path);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  return (
    <NavContainer>
      <LogoImage src="/warehouse-logo.png" alt="Logo" />

      {/* Desktop navigation */}
      <DesktopNav>
        <LinksPill>
          {navLinks.map((link) => (
            <StyledNavLink
              key={link.name}
              href={link.path}
              className={activePath === link.path ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.path);
              }}
            >
              {link.name}
            </StyledNavLink>
          ))}
        </LinksPill>
      </DesktopNav>

      {/* Icons */}
      <IconsGroup>
        <SettingsButton
          className={activePath === settingsPath ? 'active' : ''}
          onClick={() => handleLinkClick(settingsPath)}
          aria-label="Settings"
        >
          <Cog8ToothIcon />
        </SettingsButton>

        <SearchButton aria-label="Search">
          <MagnifyingGlassIcon />
        </SearchButton>

        <NotificationButton aria-label="Notifications">
          <BellIcon />
        </NotificationButton>

        <MobileMenuToggle
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <XMarkIcon /> : <Bars3Icon />}
        </MobileMenuToggle>
      </IconsGroup>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <MobileMenu>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className={activePath === link.path ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.path);
              }}
            >
              {link.name}
            </a>
          ))}

          <a
            href={settingsPath}
            className={activePath === settingsPath ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick(settingsPath);
            }}
          >
            Settings
          </a>
        </MobileMenu>
      )}
    </NavContainer>
  );
};

export default TopBar;
