'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api('/auth/request-password-reset', { method: 'POST', body: { email } });
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
          <div className="panel__subtitle">Мы отправим ссылку на email</div>
        </div>
        {done ? (
          <div className="auth-success">Проверьте почту, если email зарегистрирован.</div>
        ) : (
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
            {error ? <div className="auth-error">{error}</div> : null}
            <button className="primary-btn">Отправить ссылку</button>
          </form>
        )}
      </section>
    </div>
  );
}