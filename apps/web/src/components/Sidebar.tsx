import Link from 'next/link';
import { navItems } from '../lib/nav';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="brand-mark">K</div>
        <div className="brand-text">
          <div className="brand-title">Katalog</div>
          <div className="brand-subtitle">Книги, манга, манхва</div>
        </div>
      </div>
      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="nav-item">
            <span>{item.label}</span>
            {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
          </Link>
        ))}
      </nav>
      <div className="sidebar__footer">
        <div className="sidebar__hint">Дополнительные разделы появятся автоматически.</div>
      </div>
    </aside>
  );
}