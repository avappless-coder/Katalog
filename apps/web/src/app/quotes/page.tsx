import { api } from '../../lib/api';

type Quote = {
  id: string;
  text: string;
  author?: string | null;
  likesCount: number;
  createdAt: string;
};

type UserQuote = {
  id: string;
  text: string;
  author?: string | null;
};

async function getTopQuotes() {
  return api<Quote[]>('/quotes/global?sort=top');
}

async function getMyQuotes() {
  return api<UserQuote[]>('/quotes/me');
}

export default async function QuotesPage() {
  const [topQuotes, myQuotes] = await Promise.all([getTopQuotes(), getMyQuotes()]);

  return (
    <div className="quotes">
      <section className="quotes-hero">
        <div>
          <div className="panel__title">Цитаты</div>
          <div className="panel__subtitle">Личные коллекции и топ сообщества</div>
        </div>
        <div className="quotes-actions">
          <button className="ghost-btn">Импортировать</button>
          <button className="primary-btn">Добавить цитату</button>
        </div>
      </section>

      <section className="quotes-grid">
        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Топ цитат</div>
              <div className="panel__subtitle">Сортировка по популярности</div>
            </div>
            <button className="ghost-btn">По новизне</button>
          </div>
          <div className="panel__body quotes-list">
            {topQuotes.map((quote) => (
              <article key={quote.id} className="quote-card">
                <p className="quote-card__text">“{quote.text}”</p>
                <div className="quote-card__meta">
                  <span>{quote.author || '—'}</span>
                  <button className="like-btn">♥ {quote.likesCount}</button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <div>
              <div className="panel__title">Моя коллекция</div>
              <div className="panel__subtitle">Личные заметки</div>
            </div>
            <button className="ghost-btn">Все</button>
          </div>
          <div className="panel__body quotes-list">
            {myQuotes.map((quote) => (
              <article key={quote.id} className="quote-card">
                <p className="quote-card__text">“{quote.text}”</p>
                <div className="quote-card__meta">
                  <span>{quote.author || '—'}</span>
                  <div className="quote-card__actions">
                    <button className="ghost-btn">Редактировать</button>
                    <button className="ghost-btn">Удалить</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}