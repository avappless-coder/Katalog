export default function Home() {
  return (
    <div className="dashboard">
      <section className="hero">
        <div className="hero__content">
          <div className="hero__tag">Трекер чтения</div>
          <h1>Видите путь, а не только цель.</h1>
          <p>
            Katalog собирает вашу библиотеку, прогресс и цитаты в одном месте — с гибкой
            приватностью и статистикой без искусственных прогнозов.
          </p>
          <div className="hero__actions">
            <button className="primary-btn">Начать трекинг</button>
            <button className="ghost-btn">Импортировать библиотеку</button>
          </div>
        </div>
        <div className="hero__stats">
          <div className="stat-card">
            <div className="stat-label">Сегодня</div>
            <div className="stat-value">42 стр.</div>
            <div className="stat-sub">2 главы</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">В процессе</div>
            <div className="stat-value">6</div>
            <div className="stat-sub">серий</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Достижения</div>
            <div className="stat-value">8</div>
            <div className="stat-sub">открыто</div>
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Список чтения</div>
              <div className="panel__subtitle">Продолжите с того же места</div>
            </div>
            <button className="ghost-btn">Открыть</button>
          </div>
          <div className="panel__body">
            <div className="list-row">
              <div className="list-row__title">Ведьмак: Кровь эльфов</div>
              <div className="list-row__progress">
                <div className="progress-bar">
                  <span style={{ width: '62%' }} />
                </div>
                <div className="progress-meta">310 / 500 стр.</div>
              </div>
            </div>
            <div className="list-row">
              <div className="list-row__title">Solo Leveling</div>
              <div className="list-row__progress">
                <div className="progress-bar">
                  <span style={{ width: '28%' }} />
                </div>
                <div className="progress-meta">46 / 160 гл.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Активность</div>
              <div className="panel__subtitle">7 дней</div>
            </div>
            <button className="ghost-btn">Подробнее</button>
          </div>
          <div className="panel__body heatmap">
            {Array.from({ length: 28 }).map((_, i) => (
              <span key={i} className={`heat ${i % 5}`} />
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Цитаты дня</div>
              <div className="panel__subtitle">Топ сообщества</div>
            </div>
            <button className="ghost-btn">Все цитаты</button>
          </div>
          <div className="panel__body">
            <blockquote className="quote">
              “Все, что когда-либо было написано, предназначалось для того, чтобы быть
              прочитанным заново.”
            </blockquote>
            <div className="quote__meta">Хорхе Луис Борхес</div>
          </div>
        </div>
      </section>
    </div>
  );
}