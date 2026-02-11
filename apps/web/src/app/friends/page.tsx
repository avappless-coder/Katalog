import { apiSafe } from '../../lib/api';

type Friend = {
  id: string;
  user: { id: string; displayName?: string | null; avatarUrl?: string | null };
};

type FriendRequest = {
  id: string;
  from: { id: string; displayName?: string | null; avatarUrl?: string | null };
  createdAt: string;
};

async function getFriends() {
  return apiSafe<Friend[]>('/friends', []);
}

async function getRequests() {
  return apiSafe<FriendRequest[]>('/friends/requests', []);
}

export default async function FriendsPage() {
  const [friends, requests] = await Promise.all([getFriends(), getRequests()]);

  return (
    <div className="friends">
      <section className="friends-header">
        <div>
          <div className="panel__title">Друзья</div>
          <div className="panel__subtitle">Управляйте заявками и наблюдайте активность</div>
        </div>
        <div className="friends-actions">
          <input className="search" placeholder="Поиск по пользователям" />
          <button className="primary-btn">Найти</button>
        </div>
      </section>

      <section className="friends-grid">
        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Заявки</div>
              <div className="panel__subtitle">Входящие</div>
            </div>
          </div>
          <div className="panel__body request-list">
            {requests.map((req) => (
              <div key={req.id} className="request-row">
                <div className="friend-row__avatar" />
                <div className="request-row__info">
                  <div className="friend-row__name">{req.from.displayName || 'Без имени'}</div>
                  <div className="friend-row__meta">Запрос дружбы</div>
                </div>
                <div className="request-row__actions">
                  <button className="primary-btn">Принять</button>
                  <button className="ghost-btn">Отклонить</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Мои друзья</div>
              <div className="panel__subtitle">Активные</div>
            </div>
            <button className="ghost-btn">Все</button>
          </div>
          <div className="panel__body friends-list">
            {friends.map((friend) => (
              <div key={friend.id} className="friend-row">
                <div className="friend-row__avatar" />
                <div>
                  <div className="friend-row__name">{friend.user.displayName || 'Без имени'}</div>
                  <div className="friend-row__meta">Профиль</div>
                </div>
                <button className="ghost-btn friend-row__cta">Профиль</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}