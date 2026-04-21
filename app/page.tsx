import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Dashboard } from "@/components/dashboard"

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    // Profile should exist due to trigger, but handle edge case
    redirect("/login")
  }

  // Get user's materials
  const { data: materiais } = await supabase
    .from("materiais")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <Dashboard
      initialProfile={profile}
      initialMateriais={materiais || []}
    />
  )
}
