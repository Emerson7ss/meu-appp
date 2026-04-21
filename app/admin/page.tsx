import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "./admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    redirect("/")
  }

  // Get all users
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  // Get all materials count per user
  const { data: materiaisCount } = await supabase
    .from("materiais")
    .select("user_id")

  const userMaterialCounts: Record<string, number> = {}
  materiaisCount?.forEach((m) => {
    userMaterialCounts[m.user_id] = (userMaterialCounts[m.user_id] || 0) + 1
  })

  return (
    <AdminDashboard
      profile={profile}
      users={users || []}
      materialCounts={userMaterialCounts}
    />
  )
}
