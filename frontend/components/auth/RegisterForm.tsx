"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { registerUser } from "@/lib/auth-api";

export default function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      await registerUser({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: normalizedEmail,
        password,
        password_confirm: passwordConfirm,
      });

      await login({
        email: normalizedEmail,
        password,
      });

      router.push("/contact");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create your account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "mt-3 w-full border-b border-black/20 bg-transparent py-3 text-lg outline-none transition focus:border-[#9b1c1c]";

  const labelClassName = "text-xs uppercase tracking-[0.25em] text-black/50";

  return (
    <form onSubmit={handleSubmit} className="border-t border-black/15 pt-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="first-name" className={labelClassName}>
            First name
          </label>

          <input
            id="first-name"
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="last-name" className={labelClassName}>
            Last name
          </label>

          <input
            id="last-name"
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="mt-8">
        <label htmlFor="register-email" className={labelClassName}>
          Email
        </label>

        <input
          id="register-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClassName}
        />
      </div>

      <div className="mt-8">
        <label htmlFor="register-password" className={labelClassName}>
          Password
        </label>

        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClassName}
        />
      </div>

      <div className="mt-8">
        <label htmlFor="password-confirm" className={labelClassName}>
          Confirm password
        </label>

        <input
          id="password-confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          className={inputClassName}
        />
      </div>

      {error && (
        <p role="alert" className="mt-6 text-sm leading-6 text-[#9b1c1c]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-10 w-full border border-[#171717] px-6 py-4 text-xs uppercase tracking-[0.3em] transition hover:bg-[#171717] hover:text-[#f4f1eb] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>

      <p className="mt-7 text-sm text-black/55">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#171717] underline underline-offset-4 transition hover:text-[#9b1c1c]"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
