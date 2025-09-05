import { Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import Global from "assets/icons/global.svg";
import { useLanguage } from "./use-language";
import clsx from "clsx";

type Language = {
  label: string;
  value: string;
};

export default function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguage();

  const languages: Language[] = [
    { label: "English", value: "en" },
    { label: "Français", value: "fr" },
    { label: "العربية", value: "ar" },
  ];

  const handleLanguageChange = (language: Language) => {
    changeLanguage(language.value);
  };

  const languageMenuItems = languages.map((lang) => ({
    key: lang.value,
    label: (
      <div
        className={clsx("text-center py-1", {
          "font-bold": currentLanguage === lang.value,
        })}
        onClick={() => handleLanguageChange(lang)}
      >
        {lang.label}
      </div>
    ),
  }));
  return (
    <Dropdown
      menu={{ items: languageMenuItems }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <div className="flex items-center cursor-pointer">
        <img src={Global} alt="Language Switcher" className="w-6 h-6" />
      </div>
    </Dropdown>
  );
}
