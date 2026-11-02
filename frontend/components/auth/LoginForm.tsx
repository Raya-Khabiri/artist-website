"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import PasswordInput from "@/components/auth/PasswordInput";

type LoginFormProps = {
  redirectTo?: string;
};
export default function LoginForm({ redirectTo = "/" }: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const signedInUser = await login({
        email: email.trim(),
        password,
      });

      const destination = signedInUser.is_staff ? "/studio" : redirectTo;

      router.replace(destination);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-black/15 pt-8">
      <div>
        <label
          htmlFor="email"
          className="text-xs uppercase tracking-[0.25em] text-black/50"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-3 w-full border-b border-black/20 bg-transparent py-3 text-lg outline-none transition focus:border-[#9b1c1c]"
        />
      </div>

      <div className="mt-8">
        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
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
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      <p className="mt-7 text-sm text-black/55">
        New to EAMORA?{" "}
        <Link
          href="/register"
          className="text-[#171717] underline underline-offset-4 transition hover:text-[#9b1c1c]"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
