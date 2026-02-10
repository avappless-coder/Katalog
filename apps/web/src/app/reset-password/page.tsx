'use client';

import { useState } from 'react';
import { api } from '../lib/api';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api('/auth/reset-password', { method: 'POST', body: { token, newPassword: password } });
      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Ошибка сброса');
    }
  };

  return (
    <div className="auth">
      <section className="auth-card">
        <div className="auth-header">
          <div className="panel__title">Сброс пароля</div>
          <div className="panel__subtitle">Введите токен и новый пароль</div>
        </div>
        {done ? (
          <div className="auth-success">
            Пароль обновлен. Теперь можно войти.
            <div className="auth-footer">
              <a href="/login">Войти</a>
            </div>
          </div>
        ) : (
          <form className="auth-form" onSubmit={submit}>
            <label className="field">
              <span>Токен</span>
              <input
                className="input"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>Новый пароль</span>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error ? <div className="auth-error">{error}</div> : null}
            <button className="primary-btn">Сбросить пароль</button>
          </form>
        )}
      </section>
    </div>
  );
}