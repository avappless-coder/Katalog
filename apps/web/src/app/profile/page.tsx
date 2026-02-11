import { apiSafe } from '../../lib/api';
import { ActivityHeatmap } from '../../components/ActivityHeatmap';

type Me = {
  id: string;
  username?: string | null;
  email: string;
  profile?: { displayName?: string | null; avatarUrl?: string | null; bio?: string | null } | null;
};

async function getMe() {
  return apiSafe<Me>('/users/me', { id: 'guest', username: 'guest', email: 'guest@local', profile: null });
}

const demo = [
  0, 1, 2, 0, 3, 1, 0,
  1, 2, 4, 1, 0, 2, 3,
  0, 1, 1, 3, 2, 0, 0,
  2, 3, 1, 0, 2, 1, 4,
  0, 1, 2, 0, 3, 1, 0,
  1, 2, 4, 1, 0, 2, 3,
  0, 1, 1, 3, 2, 0, 0,
  2, 3, 1, 0, 2, 1, 4
];

export default async function ProfilePage() {
  const me = await getMe();

  return (
    <div className="profile">
      <section className="profile-card">
        <div className="profile-card__avatar" />
        <div className="profile-card__info">
          <div className="profile-card__name">{me.profile?.displayName || me.username || me.email}</div>
          <div className="profile-card__meta">Читает и коллекционирует манхву</div>
          <p className="profile-card__bio">
            {me.profile?.bio || 'Добавьте описание профиля в настройках.'}
          </p>
          <div className="profile-card__actions">
            <button className="primary-btn">Добавить в друзья</button>
            <button className="ghost-btn">Настройки приватности</button>
          </div>
        </div>
        <div className="profile-card__stats">
          <div className="stat-pill">
            <div className="stat-pill__value">128</div>
            <div className="stat-pill__label">книг прочитано</div>
          </div>
          <div className="stat-pill">
            <div className="stat-pill__value">36</div>
            <div className="stat-pill__label">в процессе</div>
          </div>
          <div className="stat-pill">
            <div className="stat-pill__value">8</div>
            <div className="stat-pill__label">достижений</div>
          </div>
        </div>
      </section>

      <section className="profile-grid">
        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Активность чтения</div>
              <div className="panel__subtitle">Последние 8 недель</div>
            </div>
            <button className="ghost-btn">Экспорт</button>
          </div>
          <div className="panel__body">
            <ActivityHeatmap data={demo} />
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Достижения</div>
              <div className="panel__subtitle">Последние полученные</div>
            </div>
            <button className="ghost-btn">Все достижения</button>
          </div>
          <div className="panel__body achievements">
            {['Первая книга', 'Книжный марафон', 'Романтик'].map((a) => (
              <div key={a} className="achievement-card">
                <div className="achievement-card__icon">★</div>
                <div>
                  <div className="achievement-card__title">{a}</div>
                  <div className="achievement-card__subtitle">Недавно получено</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Друзья</div>
              <div className="panel__subtitle">Открытые профили</div>
            </div>
            <button className="ghost-btn">Все друзья</button>
          </div>
          <div className="panel__body friends-list">
            {['Ирина', 'Михаил', 'Диана', 'Кай'].map((name) => (
              <div key={name} className="friend-row">
                <div className="friend-row__avatar" />
                <div>
                  <div className="friend-row__name">{name}</div>
                  <div className="friend-row__meta">Общих книг: 12</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}