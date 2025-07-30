import LanguageSwitcher from "./language-switcher";
import Notifications from "./notifications";

export default function TopBar() {
  return (
    <div className="flex items-center  justify-between py-4 px-8">
      <div className="flex-1 max-w-md"></div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <Notifications />
      </div>
    </div>
  );
}
