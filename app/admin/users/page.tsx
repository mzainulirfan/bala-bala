import { requireRole } from "@/actions/auth";
import { listProfilesAction } from "@/actions/staff";
import { PageShell, StaffNav } from "@/components/ui/chrome";

export default async function UsersPage() {
  await requireRole(["admin"]);
  const profiles = await listProfilesAction();

  return (
    <PageShell title="Kelola User" subtitle="Daftar profil staff. Pembuatan akun Supabase dilakukan dari dashboard Supabase untuk MVP ini." nav={<StaffNav active="admin" />}>
      <section className="surface overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-orange-50">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-100">
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td className="px-4 py-3 font-semibold">{profile.name}</td>
                <td className="px-4 py-3">{profile.email}</td>
                <td className="px-4 py-3">{profile.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </PageShell>
  );
}
