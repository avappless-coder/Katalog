const works = [
  { id: 'w1', title: 'Ведьмак', type: 'Книга', updated: 'Сегодня' },
  { id: 'w2', title: 'Solo Leveling', type: 'Манхва', updated: 'Вчера' },
  { id: 'w3', title: '1984', type: 'Книга', updated: '2 дня назад' }
];

export default function AdminWorksPage() {
  return (
    <div className="admin-page">
      <section className="admin-hero">
        <div>
          <div className="panel__title">Админ · Каталог</div>
          <div className="panel__subtitle">Редактирование карточек произведений</div>
        </div>
        <button className="primary-btn">Добавить произведение</button>
      </section>

      <section className="panel">
        <div className="panel__header">
          <div>
            <div className="panel__title">Каталог</div>
            <div className="panel__subtitle">Последние обновления</div>
          </div>
          <input className="search" placeholder="Поиск по названию" />
        </div>
        <div className="panel__body admin-table">
          {works.map((work) => (
            <div key={work.id} className="admin-table__row">
              <div>
                <div className="admin-row__title">{work.title}</div>
                <div className="admin-row__meta">{work.type}</div>
              </div>
              <div className="admin-tag">{work.updated}</div>
              <div className="admin-actions">
                <button className="ghost-btn">Редактировать</button>
                <button className="ghost-btn">Удалить</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}