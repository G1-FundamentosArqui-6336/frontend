import { useState } from 'react';
import type { FormEvent } from 'react';
const ROLE_OPTIONS = ['ROLE_MANAGER', 'ROLE_DRIVER', 'ROLE_CLIENT'] as const;

type Props = { onSubmit: (data: { email: string; password: string; firstName: string; lastName: string; phone: string; roles?: string[] }) => void };

export default function RegisterForm({ onSubmit }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [roles, setRoles] = useState<string[]>([]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ email, password, firstName, lastName, phone, roles });
  }

  function toggleRole(role: string) {
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  }

  return (
    <form onSubmit={handleSubmit} aria-label="register-form" className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Crear cuenta</h2>
      <div className="grid grid-cols-1 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" required />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Contraseña</span>
          <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2" value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" required />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Nombre</span>
            <input className="mt-1 block w-full rounded-md border-gray-300 p-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" name="firstName" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Apellido</span>
            <input className="mt-1 block w-full rounded-md border-gray-300 p-2" value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" name="lastName" />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Teléfono</span>
          <input className="mt-1 block w-full rounded-md border-gray-300 p-2" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" name="phone" />
        </label>

        <fieldset className="border-t pt-3">
          <legend className="text-sm font-medium mb-2">Roles</legend>
          <div className="flex flex-col gap-2">
            {ROLE_OPTIONS.map((r) => (
              <label key={r} className="inline-flex items-center gap-2">
                <input className="rounded" type="checkbox" checked={roles.includes(r)} onChange={() => toggleRole(r)} />
                <span className="text-sm">{r}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">Registrar</button>
      </div>
    </form>
  );
}
