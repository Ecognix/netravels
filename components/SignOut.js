"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function SignOut() {
  const [error, setError] = useState("");
  const router = useRouter();
  async function signOut() {
    const supabase = createClient();
    if (!supabase) { setError("Sign-out is not configured."); return; }
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) { setError(signOutError.message); return; }
    router.push("/"); router.refresh();
  }
  return <div><button className="text-button" onClick={signOut}>Sign out <i className="ar"/></button>{error && <p role="alert" className="form-message error">{error}</p>}</div>;
}
