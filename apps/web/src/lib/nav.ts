export type NavItem = {
  label: string;
  href: string;
  badge?: string;
};

export const navItems: NavItem[] = [
  { label: 'Главная', href: '/' },
  { label: 'Мой список', href: '/library' },
  { label: 'Профиль', href: '/profile' },
  { label: 'Друзья', href: '/friends' },
  { label: 'Настройки аккаунта', href: '/settings' },
  { label: 'Цитаты', href: '/quotes' },
  { label: 'Админ', href: '/admin', badge: 'NEW' }
];