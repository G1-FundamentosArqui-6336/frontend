import { useState } from "react";
import type { FormEvent } from "react";
import { signUpRequestSchema } from "@/core/dtos/auth.dto";
import type { SignUpRequest } from "@/core/dtos/auth.dto";
import { z } from "zod";

const ROLE_OPTIONS = ["ROLE_MANAGER", "ROLE_DRIVER", "ROLE_CLIENT"] as const;

type Props = {
  onSubmit: (data: SignUpRequest) => void;
};

type ValidationErrors = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export default function RegisterForm({ onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function validateField(field: keyof ValidationErrors, value: string) {
    const formData = {
      email,
      password,
      firstName,
      lastName,
      phone,
      roles,
      [field]: value,
    };

    try {
      signUpRequestSchema.parse(formData);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldError = err.issues.find((e) => e.path[0] === field);
        if (fieldError) {
          setErrors((prev) => ({ ...prev, [field]: fieldError.message }));
        } else {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
      }
    }
  }

  function handleBlur(field: keyof ValidationErrors) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = {
      email,
      password,
      firstName,
      lastName,
      phone,
    }[field];
    if (typeof value === "string") {
      validateField(field, value);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      phone: true,
    });

    // Validate all fields
    try {
      const validatedData = signUpRequestSchema.parse({
        email,
        password,
        firstName,
        lastName,
        phone,
        roles,
      });

      setErrors({});
      onSubmit(validatedData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: ValidationErrors = {};
        err.issues.forEach((error) => {
          const field = error.path[0] as keyof ValidationErrors;
          if (!newErrors[field]) {
            newErrors[field] = error.message;
          }
        });
        setErrors(newErrors);
      }
    }
  }

  function toggleRole(role: string) {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

  function getInputClassName(field: keyof ValidationErrors) {
    const baseClass =
      "mt-1 block w-full rounded-lg bg-white/5 backdrop-blur-sm border p-2.5 transition-all duration-200 text-white placeholder:text-white/40";
    const hasError = touched[field] && errors[field];
    const isValid = touched[field] && !errors[field];

    if (hasError) {
      return `${baseClass} border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/30`;
    }
    if (isValid) {
      return `${baseClass} border-green-400/50 focus:border-green-400 focus:ring-2 focus:ring-green-400/30`;
    }
    return `${baseClass} border-white/20 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="register-form"
      className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">
        Crear cuenta
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {/* Email */}
        <label className="block">
          <span className="text-sm font-medium text-white">Email *</span>
          <input
            className={getInputClassName("email")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched.email) validateField("email", e.target.value);
            }}
            onBlur={() => handleBlur("email")}
            type="email"
            name="email"
            aria-required="true"
            aria-invalid={touched.email && !!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          <div className="min-h-[20px] mt-1">
            {touched.email && errors.email && (
              <p id="email-error" className="text-sm text-red-600" role="alert">
                {errors.email}
              </p>
            )}
          </div>
        </label>

        {/* Password */}
        <label className="block">
          <span className="text-sm font-medium text-white">Contraseña *</span>
          <div className="relative">
            <input
              className={getInputClassName("password")}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (touched.password) validateField("password", e.target.value);
              }}
              onBlur={() => handleBlur("password")}
              type={showPassword ? "text" : "password"}
              name="password"
              aria-required="true"
              aria-invalid={touched.password && !!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 rounded p-1"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clipRule="evenodd"
                  />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="min-h-[20px] mt-1">
            {touched.password && errors.password && (
              <p
                id="password-error"
                className="text-sm text-red-600"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>
        </label>

        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-white">Nombre *</span>
            <input
              className={getInputClassName("firstName")}
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (touched.firstName)
                  validateField("firstName", e.target.value);
              }}
              onBlur={() => handleBlur("firstName")}
              type="text"
              name="firstName"
              aria-required="true"
              aria-invalid={touched.firstName && !!errors.firstName}
              aria-describedby={
                errors.firstName ? "firstName-error" : undefined
              }
            />
            <div className="min-h-[20px] mt-1">
              {touched.firstName && errors.firstName && (
                <p
                  id="firstName-error"
                  className="text-sm text-red-600"
                  role="alert"
                >
                  {errors.firstName}
                </p>
              )}
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-white">Apellido *</span>
            <input
              className={getInputClassName("lastName")}
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (touched.lastName) validateField("lastName", e.target.value);
              }}
              onBlur={() => handleBlur("lastName")}
              type="text"
              name="lastName"
              aria-required="true"
              aria-invalid={touched.lastName && !!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />
            <div className="min-h-[20px] mt-1">
              {touched.lastName && errors.lastName && (
                <p
                  id="lastName-error"
                  className="text-sm text-red-600"
                  role="alert"
                >
                  {errors.lastName}
                </p>
              )}
            </div>
          </label>
        </div>

        {/* Phone */}
        <label className="block">
          <span className="text-sm font-medium text-white">Teléfono *</span>
          <input
            className={getInputClassName("phone")}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (touched.phone) validateField("phone", e.target.value);
            }}
            onBlur={() => handleBlur("phone")}
            type="tel"
            name="phone"
            aria-required="true"
            aria-invalid={touched.phone && !!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          <div className="min-h-[20px] mt-1">
            {touched.phone && errors.phone && (
              <p id="phone-error" className="text-sm text-red-600" role="alert">
                {errors.phone}
              </p>
            )}
          </div>
        </label>

        {/* Roles */}
        <fieldset className="border-t border-white/20 pt-4">
          <legend className="text-sm font-medium mb-3 text-white">
            Roles (opcional)
          </legend>
          <div className="flex flex-col gap-2">
            {ROLE_OPTIONS.map((r) => (
              <label
                key={r}
                className="inline-flex items-center gap-2 cursor-pointer text-white"
              >
                <input
                  className="rounded focus:ring-2 focus:ring-brand-500 cursor-pointer accent-brand-500"
                  type="checkbox"
                  checked={roles.includes(r)}
                  onChange={() => toggleRole(r)}
                  aria-label={`Seleccionar rol ${r}`}
                />
                <span className="text-sm">{r}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="w-full bg-brand-500 text-white py-2.5 rounded-lg hover:bg-brand-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-transparent font-medium"
          aria-label="Registrar nueva cuenta"
        >
          Registrar
        </button>
      </div>
    </form>
  );
}
