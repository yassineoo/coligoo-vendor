"use client";

import React, { useState } from "react";
import { Input } from "@/components/interface/input";
import { Label } from "@/components/interface/label";
import { Button } from "@/components/interface/button";
import usersApi from "@/app/api/users";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await usersApi.changePassword({ oldPassword, newPassword });
      setSuccess("Mot de passe mis à jour");
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      setError(err?.message ?? "Erreur lors du changement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-delivery-bg rounded-lg">
      <h2 className="text-xl font-medium mb-6">Changer le mot de passe</h2>

      <div className="bg-white rounded-xl p-8 space-y-4">
        <div>
          <Label className="text-xs">Mot de passe actuel</Label>
          <Input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="h-12"
          />
        </div>

        <div>
          <Label className="text-xs">Nouveau mot de passe</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="h-12"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setOldPassword("");
              setNewPassword("");
            }}
            className="h-12 px-6"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="h-12 px-6 bg-delivery-orange text-white"
          >
            {submitting ? "Envoi..." : "Valider"}
          </Button>
        </div>

        <div>
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
        </div>
      </div>
    </div>
  );
}
