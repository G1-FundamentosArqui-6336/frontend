import type { FormEvent } from 'react';
import { useState } from 'react';

type Props = { onSubmit: (email: string, password: string) => void };

export default function LoginForm({ onSubmit }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(email, password);
  }

  return (
    <form onSubmit={handleSubmit} aria-label="login-form" className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Iniciar sesión</h2>
      <label className="block mb-3">
        <span className="text-sm font-medium">Email</span>
        <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" required />
      </label>
      <label className="block mb-4">
        <span className="text-sm font-medium">Contraseña</span>
        <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2" value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" required />
      </label>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Entrar</button>
    </form>
  );
}
