import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import './Sidebar.css';

export function Sidebar({ collapsed, onToggleCollapse }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Primary navigation (Dashboard only)
  const primaryItem = { path: '/', icon: LayoutDashboard, label: t('nav.dashboard') };

  // Secondary/Management navigation (lower emphasis)
  const secondaryItems = [
    { path: '/inventory', icon: Package, label: t('nav.inventory') },
    { path: '/locations', icon: MapPin, label: t('nav.locations') },
    { path: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo" onClick={() => navigate('/')}>
          <span className="sidebar-logo-icon">📦</span>
          {!collapsed && <span className="sidebar-logo-text">{t('app.name')}</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={onToggleCollapse}
          aria-label={collapsed ? t('nav.expand') : t('nav.collapse')}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {/* Dashboard (Primary) */}
        <NavLink
          to={primaryItem.path}
          end
          className={({ isActive }) =>
            `sidebar-link sidebar-link-primary ${isActive ? 'sidebar-link-active' : ''}`
          }
          title={collapsed ? primaryItem.label : undefined}
        >
          <primaryItem.icon className="sidebar-link-icon" size={22} />
          {!collapsed && <span className="sidebar-link-text">{primaryItem.label}</span>}
        </NavLink>

        {/* Prominent Primary Add Action Button at Top */}
        <button
          className="sidebar-add-primary-btn"
          onClick={() => navigate('/add')}
          title={t('nav.addItem')}
        >
          <Plus size={20} />
          {!collapsed && <span>{t('nav.addItem')}</span>}
        </button>
      </nav>

      {/* Secondary Management Links at Bottom */}
      <div className="sidebar-secondary-footer">
        {!collapsed && <div className="secondary-divider-label">{t('inventory.sortBy')}</div>}
        <div className="secondary-divider" />
        <nav className="sidebar-nav-secondary">
          {secondaryItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link sidebar-link-secondary ${isActive ? 'sidebar-link-secondary-active' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="sidebar-link-icon-secondary" size={16} />
              {!collapsed && <span className="sidebar-link-text-secondary">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
