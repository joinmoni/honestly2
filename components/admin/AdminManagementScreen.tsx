"use client";

import { useState } from "react";
import { AdminCategoriesSection } from "@/components/admin/AdminCategoriesSection";
import { AdminClaimsSection } from "@/components/admin/AdminClaimsSection";
import { AdminCreateCategoryModal } from "@/components/admin/AdminCreateCategoryModal";
import { AdminDirectorySection } from "@/components/admin/AdminDirectorySection";
import { AdminManagementHeader } from "@/components/admin/AdminManagementHeader";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import type { AdminDashboardData } from "@/lib/types/admin-dashboard";

type AdminManagementScreenProps = {
  data: AdminDashboardData;
};

export function AdminManagementScreen({ data }: AdminManagementScreenProps) {
  const [categoryGroups, setCategoryGroups] = useState(data.categories);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-[#F9F8F6] text-stone-900">
        <AdminTopNav brandLabel={data.brandLabel} navLinks={data.navLinks} />

        <main className="mx-auto max-w-6xl p-8 md:p-12">
          <AdminManagementHeader title={data.title} statusLabel={data.statusLabel} statusState={data.statusState} onCreateCategory={() => setCreateCategoryOpen(true)} />

          <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
            <AdminClaimsSection claims={data.claims} />
            <AdminCategoriesSection groups={categoryGroups} />
            <AdminDirectorySection rows={data.directory} />
          </div>
        </main>
      </div>

      <AdminCreateCategoryModal
        open={createCategoryOpen}
        onClose={() => setCreateCategoryOpen(false)}
        onCreateCategory={(payload) => {
          setCategoryGroups((current) => [
            ...current,
            {
              id: `cat-local-${current.length + 1}`,
              name: payload.name,
              subcategories: payload.subcategories
            }
          ]);
        }}
      />
    </>
  );
}
