const users = [
  { id: 'u1', name: 'Анна Т.', email: 'anna@katalog.io', role: 'SUPER_ADMIN', status: 'ACTIVE' },
  { id: 'u2', name: 'Ирина К.', email: 'irina@katalog.io', role: 'ADMIN', status: 'ACTIVE' },
  { id: 'u3', name: 'Михаил С.', email: 'mike@katalog.io', role: 'USER', status: 'BLOCKED' }
];

export default function AdminUsersPage() {
  return (
    <div className="admin-page">
      <section className="admin-hero">
        <div>
          <div className="panel__title">Админ · Пользователи</div>
          <div className="panel__subtitle">Роли, блокировки и доступы</div>
        </div>
        <button className="primary-btn">Экспорт</button>
      </section>

      <section className="panel">
        <div className="panel__header">
          <div>
            <div className="panel__title">Список пользователей</div>
            <div className="panel__subtitle">Всего: 1 284</div>
          </div>
          <input className="search" placeholder="Поиск по email" />
        </div>
        <div className="panel__body admin-table">
          {users.map((user) => (
            <div key={user.id} className="admin-table__row">
              <div>
                <div className="admin-row__title">{user.name}</div>
                <div className="admin-row__meta">{user.email}</div>
              </div>
              <div className="admin-tag">{user.role}</div>
              <div className={`admin-status ${user.status === 'ACTIVE' ? 'active' : 'blocked'}`}>
                {user.status}
              </div>
              <div className="admin-actions">
                <button className="ghost-btn">Роль</button>
                <button className="ghost-btn">Блок</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}