'use client';

import { useState } from 'react';
import { api } from '../lib/api';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
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
        body: { email, password, displayName: displayName || undefined }
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
          <div className="panel__subtitle">Подтвердите email, чтобы активировать аккаунт</div>
        </div>
        {success ? (
          <div className="auth-success">
            Мы отправили письмо для подтверждения email. Проверьте почту.
          </div>
        ) : (
          <form className="auth-form" onSubmit={submit}>
            <label className="field">
              <span>Имя (необязательно)</span>
              <input
                className="input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </label>
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