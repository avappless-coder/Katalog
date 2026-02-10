export default function AdminPage() {
  return (
    <div className="admin">
      <section className="admin-hero">
        <div>
          <div className="panel__title">Административная панель</div>
          <div className="panel__subtitle">Управление пользователями, каталогом и жанрами</div>
        </div>
        <button className="primary-btn">Создать отчет</button>
      </section>

      <section className="admin-grid">
        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Пользователи</div>
              <div className="panel__subtitle">Блокировки и роли</div>
            </div>
            <button className="ghost-btn">Открыть</button>
          </div>
          <div className="panel__body admin-list">
            {['Анна Т.', 'Ирина К.', 'Михаил С.'].map((name) => (
              <div key={name} className="admin-row">
                <div>
                  <div className="admin-row__title">{name}</div>
                  <div className="admin-row__meta">Статус: ACTIVE</div>
                </div>
                <button className="ghost-btn">Детали</button>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Каталог</div>
              <div className="panel__subtitle">Книги, манга, манхва</div>
            </div>
            <button className="ghost-btn">Добавить</button>
          </div>
          <div className="panel__body admin-list">
            {['Ведьмак', 'Solo Leveling', '1984'].map((title) => (
              <div key={title} className="admin-row">
                <div>
                  <div className="admin-row__title">{title}</div>
                  <div className="admin-row__meta">Изменено: сегодня</div>
                </div>
                <button className="ghost-btn">Редактировать</button>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Жанры</div>
              <div className="panel__subtitle">Заявки на добавление</div>
            </div>
            <button className="ghost-btn">Посмотреть</button>
          </div>
          <div className="panel__body admin-list">
            {['романтика', 'слоуберн', 'историческая манхва'].map((genre) => (
              <div key={genre} className="admin-row">
                <div>
                  <div className="admin-row__title">{genre}</div>
                  <div className="admin-row__meta">Статус: PENDING</div>
                </div>
                <button className="primary-btn">Одобрить</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}