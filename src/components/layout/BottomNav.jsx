import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Plus, MoreHorizontal, Package, MapPin, Settings, X } from 'lucide-react';
import './BottomNav.css';

export function BottomNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Secondary items for the More Sheet
  const secondaryItems = [
    { path: '/inventory', icon: Package, label: t('nav.inventory') },
    { path: '/locations', icon: MapPin, label: t('nav.locations') },
    { path: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  const handleLinkClick = () => {
    setIsMoreOpen(false);
  };

  // Determine if any secondary route is active to highlight the "More" tab
  const isSecondaryActive = secondaryItems.some(item => location.pathname === item.path);

  return (
    <>
      <nav className="bottom-nav" aria-label="Mobile Navigation">
        {/* Dashboard */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`
          }
          onClick={() => setIsMoreOpen(false)}
        >
          <LayoutDashboard size={20} />
          <span>{t('nav.dashboard')}</span>
        </NavLink>

        {/* Center Floating Action Button (FAB) */}
        <NavLink
          to="/add"
          className={({ isActive }) =>
            `bottom-nav-item bottom-nav-item-add ${isActive ? 'bottom-nav-item-add-active' : ''}`
          }
          onClick={() => setIsMoreOpen(false)}
          aria-label={t('nav.addItem')}
        >
          <div className="bottom-nav-fab-circle">
            <Plus size={26} />
          </div>
        </NavLink>

        {/* More Options Tab */}
        <button
          type="button"
          className={`bottom-nav-item bottom-nav-btn-more ${isMoreOpen || isSecondaryActive ? 'bottom-nav-item-active' : ''}`}
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          aria-expanded={isMoreOpen}
          aria-label="Toggle secondary menu"
        >
          <MoreHorizontal size={20} />
          <span>{t('common.close') ? 'More' : 'More'}</span>
        </button>
      </nav>

      {/* Slide-up Glassmorphic More Sheet Overlay */}
      {isMoreOpen && (
        <div className="bottom-nav-overlay-backdrop animate-fade-in" onClick={() => setIsMoreOpen(false)}>
          <div className="bottom-nav-more-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header">
              <span className="sheet-title">{t('app.name')}</span>
              <button 
                type="button" 
                className="sheet-close-btn"
                onClick={() => setIsMoreOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="sheet-divider" />

            <div className="sheet-links-grid">
              {secondaryItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`sheet-nav-link ${isActive ? 'sheet-nav-link-active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <div className="sheet-link-icon-bg">
                      <item.icon size={20} />
                    </div>
                    <span className="sheet-link-label">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
