import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect to TOR page which now serves as the main dashboard
  redirect("/tor");
}
