import { apiSafe } from '../../lib/api';

type LibraryItem = {
  workId: string;
  status: string;
  progressPages: number;
  progressChapters: number;
  work: {
    id: string;
    title: string;
    type: string;
    coverUrl?: string | null;
    totalPages?: number | null;
    totalChapters?: number | null;
  };
};

const filters = ['Все', 'Читаю', 'Прочитано', 'В планах', 'Бросил', 'Отложено'];

async function getLibrary(status?: string) {
  return apiSafe<LibraryItem[]>(`/library${status ? `?status=${status}` : ''}`, []);
}

export default async function LibraryPage() {
  const items = await getLibrary();

  return (
    <div className="library">
      <section className="library-header">
        <div>
          <div className="panel__title">Моя библиотека</div>
          <div className="panel__subtitle">Управляйте статусами и прогрессом чтения</div>
        </div>
        <div className="library-actions">
          <input className="search" placeholder="Поиск по названию" />
          <button className="primary-btn">Добавить</button>
        </div>
      </section>

      <section className="library-filters">
        {filters.map((filter) => (
          <button key={filter} className="chip">
            {filter}
          </button>
        ))}
      </section>

      <section className="library-grid">
        {items.map((item) => (
          <article key={item.workId} className="work-card">
            <div className="work-card__cover" />
            <div className="work-card__body">
              <div className="work-card__type">{item.work.type}</div>
              <div className="work-card__title">{item.work.title}</div>
              <div className="work-card__status">{item.status}</div>
              <div className="progress-bar">
                <span style={{ width: `${item.progressPages ? Math.min(100, item.progressPages) : 0}%` }} />
              </div>
              <div className="progress-meta">
                {item.progressPages} / {item.work.totalPages ?? '—'} стр.
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}