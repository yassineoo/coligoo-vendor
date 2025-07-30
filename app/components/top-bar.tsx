import LanguageSwitcher from "./language-switcher";

export default function TopBar() {
  return (
    <div className="flex items-center justify-between py-4 px-8">
      <div className="flex-1 max-w-md"></div>
      <div>
        <LanguageSwitcher />
      </div>
    </div>
  );
}
