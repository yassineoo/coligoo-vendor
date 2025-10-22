"use client";

import PersonalInformation from "./users/PersonalInformation";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-delivery-bg flex">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <PersonalInformation />
        </main>
      </div>
    </div>
  );
}
