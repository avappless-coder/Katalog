'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api('/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <section className="auth-card">
        <div className="auth-header">
          <div className="panel__title">Вход</div>
          <div className="panel__subtitle">Используйте email для авторизации</div>
        </div>
        <form className="auth-form" onSubmit={submit}>
          <label className="field">
            <span>Email</span>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Пароль</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error ? <div className="auth-error">{error}</div> : null}
          <button className="primary-btn" disabled={loading}>
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>
        <div className="auth-footer">
          <a href="/forgot-password">Забыли пароль?</a>
          <a href="/register">Создать аккаунт</a>
        </div>
      </section>
    </div>
  );
}