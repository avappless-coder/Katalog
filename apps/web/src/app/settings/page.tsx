export default function SettingsPage() {
  return (
    <div className="settings">
      <section className="settings-hero">
        <div>
          <div className="panel__title">Настройки аккаунта</div>
          <div className="panel__subtitle">Приватность, безопасность и уведомления</div>
        </div>
        <button className="primary-btn">Сохранить изменения</button>
      </section>

      <section className="settings-grid">
        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Профиль</div>
              <div className="panel__subtitle">Отображение имени и описания</div>
            </div>
          </div>
          <div className="panel__body form-grid">
            <label className="field">
              <span>Отображаемое имя</span>
              <input className="input" placeholder="Ваше имя" />
            </label>
            <label className="field">
              <span>Описание</span>
              <textarea className="input" rows={4} placeholder="Пару слов о себе" />
            </label>
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Приватность</div>
              <div className="panel__subtitle">Кто видит ваш профиль и библиотеку</div>
            </div>
          </div>
          <div className="panel__body form-grid">
            {['Профиль', 'Библиотека', 'Цитаты', 'Активность'].map((label) => (
              <label key={label} className="field">
                <span>{label}</span>
                <select className="input">
                  <option>Публично</option>
                  <option>Только друзья</option>
                  <option>Приватно</option>
                </select>
              </label>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Безопасность</div>
              <div className="panel__subtitle">Email и пароль</div>
            </div>
          </div>
          <div className="panel__body form-grid">
            <label className="field">
              <span>Email</span>
              <input className="input" placeholder="you@example.com" />
            </label>
            <label className="field">
              <span>Новый пароль</span>
              <input className="input" type="password" placeholder="••••••••" />
            </label>
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Уведомления</div>
              <div className="panel__subtitle">Контроль активности</div>
            </div>
          </div>
          <div className="panel__body toggles">
            {['Новые заявки в друзья', 'Ответы на цитаты', 'Еженедельный отчет'].map((label) => (
              <label key={label} className="toggle">
                <input type="checkbox" />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}