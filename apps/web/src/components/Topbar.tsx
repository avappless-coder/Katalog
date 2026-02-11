'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar__title">
        <div className="topbar__kicker">Мой каталог</div>
        <div className="topbar__headline">Контроль чтения и прогресса</div>
      </div>
      <div className="topbar__actions">
        <ThemeToggle />
        <Link className="ghost-btn" href="/login">Вход</Link>
        <Link className="ghost-btn" href="/register">Регистрация</Link>
        <button className="primary-btn">Добавить произведение</button>
      </div>
    </header>
  );
}