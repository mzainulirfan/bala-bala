"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "@/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="w-full rounded-md bg-brand px-4 py-3 font-bold text-white disabled:bg-stone-300">
      {pending ? "Masuk..." : "Masuk"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, undefined);

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-4">
      <section className="w-full max-w-sm rounded-lg border border-orange-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Staff Gorengan</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">Login dashboard</h1>
        <form action={formAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">Email</span>
            <input
              name="email"
              type="email"
              className="mt-1 w-full rounded-md border border-orange-200 px-3 py-3 outline-none focus:border-brand"
              placeholder="cashier@gorengan.test"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Password</span>
            <input
              name="password"
              type="password"
              className="mt-1 w-full rounded-md border border-orange-200 px-3 py-3 outline-none focus:border-brand"
              placeholder="password"
            />
          </label>
          {state?.error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{state.error}</p> : null}
          <SubmitButton />
        </form>
        <div className="mt-5 rounded-md bg-orange-50 p-3 text-sm text-stone-700">
          Demo lokal: admin@gorengan.test, cashier@gorengan.test, kitchen@gorengan.test. Password: password.
        </div>
      </section>
    </main>
  );
}
