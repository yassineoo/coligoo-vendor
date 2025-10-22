"use client";

import React, { useState } from "react";
import { Button } from "@/components/interface/button";
import usersApi from "@/app/api/users";
import { useRouter } from "next/navigation";

export default function Account() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Supprimer définitivement votre compte ?")) return;
    setDeleting(true);
    setError(null);
    try {
      await usersApi.deleteAccount();
      router.push("/signin");
    } catch (err: any) {
      setError(err?.message ?? "Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-delivery-bg rounded-lg">
      <h2 className="text-xl font-medium mb-6">Supprimer le compte</h2>

      <div className="bg-white rounded-xl p-8">
        <p className="mb-4 text-sm text-gray-700">
          La suppression de votre compte supprimera toutes vos données. Cette
          action est irréversible.
        </p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-12"
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className="h-12 bg-red-600 text-white"
          >
            {deleting ? "Suppression..." : "Supprimer mon compte"}
          </Button>
        </div>

        <div className="mt-4">
          {error && <div className="text-red-600">{error}</div>}
        </div>
      </div>
    </div>
  );
}
