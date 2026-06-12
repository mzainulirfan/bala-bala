import { requireRole } from "@/actions/auth";
import { listMenusAction } from "@/actions/staff";
import { AdminMenu } from "@/components/admin-menu";
import { PageShell, StaffNav } from "@/components/ui/chrome";

export default async function AdminMenuPage() {
  await requireRole(["admin"]);
  const menus = await listMenusAction();

  return (
    <PageShell title="Kelola Menu" subtitle="Tambah, edit, nonaktifkan, atau tandai menu habis." nav={<StaffNav active="admin" />}>
      <AdminMenu initialMenus={menus} />
    </PageShell>
  );
}
