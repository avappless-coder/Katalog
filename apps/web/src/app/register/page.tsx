'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api('/auth/register', {
        method: 'POST',
        body: { username, password }
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <section className="auth-card">
        <div className="auth-header">
          <div className="panel__title">Регистрация</div>
          <div className="panel__subtitle">Создайте аккаунт по нику и паролю</div>
        </div>
        {success ? (
          <div className="auth-success">Аккаунт создан. Можно входить.</div>
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
              {loading ? 'Создаем...' : 'Создать аккаунт'}
            </button>
          </form>
        )}
        <div className="auth-footer">
          <a href="/login">Уже есть аккаунт? Войти</a>
        </div>
      </section>
    </div>
  );
}