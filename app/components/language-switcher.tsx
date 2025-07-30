import { Dropdown } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

type Language = {
  key: string;
  label: string;
  value: string;
};

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const languages: Language[] = [
    { key: "en", label: "English", value: "en" },
    { key: "fr", label: "Français", value: "fr" },
    { key: "ar", label: "العربية", value: "ar" },
  ];

  const handleLanguageChange = (language: Language) => {
    console.log("Language changed to:", language);
    // TODO: Implement language change logic
    i18n.changeLanguage(language.value);
  };
  const languageMenuItems = languages.map((lang) => ({
    key: lang.key,
    label: (
      <div
        className="text-center py-1"
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
        <GlobalOutlined className="text-lg" />
      </div>
    </Dropdown>
  );
}
