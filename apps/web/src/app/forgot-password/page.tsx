'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api('/auth/request-password-reset', { method: 'POST', body: { username } });
      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Ошибка запроса');
    }
  };

  return (
    <div className="auth">
      <section className="auth-card">
        <div className="auth-header">
          <div className="panel__title">Восстановление пароля</div>
          <div className="panel__subtitle">Введите ник, чтобы создать токен сброса</div>
        </div>
        {done ? (
          <div className="auth-success">Если пользователь существует, токен создан.</div>
        ) : (
          <form className="auth-form" onSubmit={submit}>
            <label className="field">
              <span>Ник</span>
              <input
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            {error ? <div className="auth-error">{error}</div> : null}
            <button className="primary-btn">Создать токен</button>
          </form>
        )}
      </section>
    </div>
  );
}