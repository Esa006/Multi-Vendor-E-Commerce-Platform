import { NavLink } from 'react-router-dom';
import './Sidebar.css';

/**
 * Sidebar — reusable admin/vendor sidebar nav.
 * Pass `links` array and optional `collapsed` prop.
 */
export default function Sidebar({
  links = [],
  collapsed = false,
  header = null,
  footer = null,
}) {
  return (
    <aside
      className={`sv-sidebar-c${collapsed ? ' sv-sidebar-c--collapsed' : ''}`}
      aria-label="Sidebar navigation"
    >
      {header && <div className="sv-sidebar-c__header">{header}</div>}

      <nav className="sv-sidebar-c__nav">
        <ul className="list-unstyled mb-0">
          {links.map(({ icon, label, to, badge }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `sv-sidebar-c__link${isActive ? ' sv-sidebar-c__link--active' : ''}`
                }
                title={collapsed ? label : undefined}
              >
                {icon && (
                  <span className="material-symbols-outlined sv-sidebar-c__icon" aria-hidden="true">
                    {icon}
                  </span>
                )}
                {!collapsed && (
                  <>
                    <span className="sv-sidebar-c__label">{label}</span>
                    {badge != null && (
                      <span className="sv-sidebar-c__badge" aria-label={`${badge} items`}>
                        {badge > 99 ? '99+' : badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {footer && <div className="sv-sidebar-c__footer">{footer}</div>}
    </aside>
  );
}
