"use client";

import { useState } from "react";

type PasswordInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  minLength?: number;
};

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  autoComplete,
  minLength,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs uppercase tracking-[0.25em] text-black/50"
      >
        {label}
      </label>

      <div className="relative mt-3">
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="
            w-full
            border-b
            border-black/20
            bg-transparent
            py-3
            pr-12
            text-lg
            outline-none
            transition

            focus:border-[#9b1c1c]
          "
        />

        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          className="
            absolute
            inset-y-0
            right-0
            flex
            w-10
            items-center
            justify-center
            text-black/40
            transition-colors

            hover:text-[#9b1c1c]
            focus-visible:outline
            focus-visible:outline-1
            focus-visible:outline-offset-2
            focus-visible:outline-[#9b1c1c]
          "
        >
          {isVisible ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
            >
              <path
                d="M3 3l18 18M10.6 10.7a2 2 0 002.7 2.7M9.9 4.2A10.8 10.8 0 0112 4c5.5 0 9 6 9 6a16.5 16.5 0 01-2.1 2.8M6.2 6.2C4.2 7.6 3 10 3 10s3.5 6 9 6a9.8 9.8 0 004-.8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
            >
              <path
                d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="12"
                cy="12"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
