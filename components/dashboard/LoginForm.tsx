"use client";

import { startTransition, useActionState, useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { login } from "@/app/dashboard/actions";
import { cn } from "@/lib/utils";
import type { FormState } from "@/lib/dashboard/types";
import { inputClass } from "./FormFields";
import { buttonVariants } from "./ui";

const initialState: FormState = { status: "idle" };

export function LoginForm({ next, notice }: { next: string; notice?: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const errors = state.status === "error" ? state.errors : {};

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(() => formAction(new FormData(event.currentTarget)));
      }}
      className="space-y-5"
      noValidate
    >
      <input type="hidden" name="next" value={next} />

      {state.status === "error" ? (
        <div role="alert" className="flex gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 translate-y-0.5" />
          {state.message}
        </div>
      ) : (
        notice && (
          <div role="status" className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-800 dark:text-amber-300">
            {notice}
          </div>
        )
      )}

      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-dash-text">
          Login
        </label>
        <input id="username" name="username" autoComplete="username" autoFocus required aria-invalid={errors.username ? true : undefined} className={cn(inputClass, "h-10")} />
        {errors.username && <p className="mt-1.5 text-sm text-red-600">{errors.username.join(" ")}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-dash-text">
          Parol
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-invalid={errors.password ? true : undefined}
            className={cn(inputClass, "h-10 pr-10")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-2 text-dash-muted hover:text-dash-text"
            aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password.join(" ")}</p>}
      </div>

      <button type="submit" disabled={pending} className={cn(buttonVariants.primary, "h-10 w-full")}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "Kirilmoqda..." : "Kirish"}
      </button>
    </form>
  );
}
