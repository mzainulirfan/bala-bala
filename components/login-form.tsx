"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "@/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="btn-primary w-full">
      {pending ? "Masuk..." : "Masuk"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, undefined);

  return (
    <main className="app-shell grid min-h-screen place-items-center px-4">
      <section className="surface-strong w-full max-w-sm p-6">
        <p className="section-title">Staff Gorengan</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Login dashboard</h1>
        <p className="mt-2 text-sm text-stone-600">Masuk sebagai kasir, dapur, atau admin untuk mengelola antrean.</p>
        <form action={formAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">Email</span>
            <input
              name="email"
              type="email"
              className="field"
              placeholder="cashier@gorengan.test"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Password</span>
            <input
              name="password"
              type="password"
              className="field"
              placeholder="password"
            />
          </label>
          {state?.error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{state.error}</p> : null}
          <SubmitButton />
        </form>
        <div className="mt-5 rounded-md border border-orange-200 bg-orange-50 p-3 text-sm text-stone-700">
          Demo lokal: admin@gorengan.test, cashier@gorengan.test, kitchen@gorengan.test. Password: password.
        </div>
      </section>
    </main>
  );
}
