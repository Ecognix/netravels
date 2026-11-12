"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function AuthForm({ next = "/account", callbackError = false, initialMode = "signin" }) {
  const [mode, setMode] = useState(initialMode);
  const [message, setMessage] = useState(callbackError ? "We couldn’t verify that link. Please try signing in again." : "");
  const [error, setError] = useState(callbackError);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const safeNext = next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : "/account";
  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const supabase = createClient();
    if (!supabase) { setError(true); setMessage("Sign-in is not configured yet. Please contact the team."); return; }
    setBusy(true); setMessage(""); setError(false);
    try {
      if (mode === "signup") {
        const { data, error: resultError } = await supabase.auth.signUp({ email: form.get("email"), password: form.get("password"), options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}` } });
        if (resultError) throw resultError;
        if (!data.session) { setMessage("Check your email for a confirmation link. After confirming, you can sign in."); return; }
      } else {
        const { error: resultError } = await supabase.auth.signInWithPassword({ email: form.get("email"), password: form.get("password") });
        if (resultError) throw resultError;
      }
      router.push(safeNext); router.refresh();
    } catch (resultError) {
      setError(true); setMessage(resultError.message || "Authentication failed. Please try again.");
    } finally { setBusy(false); }
  }
  return <div className="auth-card"><div className="auth-switch"><button type="button" className={mode === "signin" ? "active" : ""} onClick={()=>{setMode("signin");setMessage("");}}>Sign in</button><button type="button" className={mode === "signup" ? "active" : ""} onClick={()=>{setMode("signup");setMessage("");}}>Create account</button></div><h2>{mode === "signin" ? "Welcome back." : "Let’s get started."}</h2><p className="muted-text">{mode === "signin" ? "Sign in to request a journey or see your enquiries." : "Create an account to request a journey and follow your enquiries."}</p><form onSubmit={submit} className="form-grid"><label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com"/></label><label>Password<input name="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} required minLength={6} placeholder="At least 6 characters"/></label><button disabled={busy} className="button button-dark wide-button" type="submit">{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"} <span><i className="ar"/></span></button></form>{message && <p role={error ? "alert" : "status"} className={`form-message${error ? " error" : ""}`}>{message}</p>}<div className="auth-or">OR</div><button type="button" className="google-button" disabled><b>G</b> Continue with Google <span>Coming soon</span></button><p className="small-note">Google sign-in is a preview and isn’t enabled yet. Email and password require a configured Supabase project.</p></div>;
}
