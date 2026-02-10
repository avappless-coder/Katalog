'use client';

import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      return;
    }

    api(`/auth/verify-email?token=${encodeURIComponent(token)}`, { method: 'POST' })
      .then(() => setStatus('ok'))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="auth">
      <section className="auth-card">
        <div className="auth-header">
          <div className="panel__title">Подтверждение email</div>
        </div>
        {status === 'idle' && <div>Проверяем...</div>}
        {status === 'ok' && (
          <div className="auth-success">
            Email подтвержден. Теперь можно войти в аккаунт.
            <div className="auth-footer">
              <a href="/login">Перейти к входу</a>
            </div>
          </div>
        )}
        {status === 'error' && (
          <div className="auth-error">Ссылка недействительна или устарела.</div>
        )}
      </section>
    </div>
  );
}