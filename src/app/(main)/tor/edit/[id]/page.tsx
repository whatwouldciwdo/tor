import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTorPage({ params }: PageProps) {
  const { id } = await params;
  
  // Redirect to create page with id parameter for editing
  redirect(`/tor/create?id=${id}`);
}
