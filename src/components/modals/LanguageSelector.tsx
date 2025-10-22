"use client";

import { useState } from "react";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function LanguageSelector({
  isOpen,
  onToggle,
  onClose,
}: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const languages = [
    { code: "fr", name: "Français" },
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
  ];

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    onClose();
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center justify-center w-9 h-9 bg-orange-200 rounded-full hover:bg-orange-300 transition-colors"
      >
        <Globe className="w-5 h-5 text-gray-700" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />

          <div className="absolute top-12 right-0 z-50 w-36 sm:w-36 bg-white rounded-lg shadow-lg border border-gray-100">
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.name)}
                  className={`w-full px-4 py-3 text-sm font-roboto text-gray-800 hover:bg-gray-50 transition-colors text-center ${
                    selectedLanguage === language.name
                      ? "bg-orange-50 text-delivery-orange"
                      : ""
                  }`}
                >
                  {language.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
