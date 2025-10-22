"use client";

import React, { useState } from "react";
import PersonalInformation from "@/components/users/PersonalInformation";
import ChangePassword from "@/components/users/ChangePassword";
import Account from "@/components/users/Account";

const tabs = [
  { id: "me", label: "Mes informations" },
  { id: "password", label: "Changer le mot de passe" },
  { id: "account", label: "Compte" },
];

export default function UsersPage() {
  const [active, setActive] = useState<string>("me");

  return (
    <div className="min-h-screen bg-delivery-bg p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Gestion des utilisateurs
          </h1>
          <div className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`px-4 py-2 rounded-md font-medium ${
                  active === t.id
                    ? "bg-delivery-orange text-white"
                    : "bg-white border border-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          {active === "me" && <PersonalInformation />}
          {active === "password" && <ChangePassword />}
          {active === "account" && <Account />}
        </div>
      </div>
    </div>
  );
}
