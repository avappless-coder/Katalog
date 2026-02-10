const requests = [
  { id: 'g1', name: 'романтика', user: 'Ирина', status: 'PENDING' },
  { id: 'g2', name: 'слоуберн', user: 'Алекс', status: 'PENDING' }
];

export default function AdminGenresPage() {
  return (
    <div className="admin-page">
      <section className="admin-hero">
        <div>
          <div className="panel__title">Админ · Жанры</div>
          <div className="panel__subtitle">Заявки на добавление жанров</div>
        </div>
        <button className="primary-btn">Добавить жанр</button>
      </section>

      <section className="panel">
        <div className="panel__header">
          <div>
            <div className="panel__title">Заявки</div>
            <div className="panel__subtitle">Ожидают рассмотрения</div>
          </div>
        </div>
        <div className="panel__body admin-table">
          {requests.map((req) => (
            <div key={req.id} className="admin-table__row">
              <div>
                <div className="admin-row__title">{req.name}</div>
                <div className="admin-row__meta">От: {req.user}</div>
              </div>
              <div className="admin-tag">{req.status}</div>
              <div className="admin-actions">
                <button className="ghost-btn">Отклонить</button>
                <button className="primary-btn">Одобрить</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}