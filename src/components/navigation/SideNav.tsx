"use client";

import { useState, useEffect, useRef } from "react";
import LogoutModal from "../modals/LogoutModal";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

type SidebarItem = {
  iconName: string;
  label: string;
  path: string;
};

export default function SideNav() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    top: number;
    height: number;
    opacity: number;
  }>({
    top: 0,
    height: 0,
    opacity: 0,
  });

  const sidebarItems: SidebarItem[] = [
    { iconName: "home", label: "Home", path: "/dashboard" },
    {
      iconName: "box",
      label: "Order Lists",
      path: "/dashboard/order-lists",
    },
    { iconName: "bag", label: "Product", path: "/dashboard/products" },
    { iconName: "box-remove", label: "Returned", path: "/dashboard/returned" },  
    { iconName: "wallet", label: "Payment", path: "/dashboard/payment" },
    { iconName: "lockers", label: "Lockers", path: "/dashboard/lockers" },
    {
      iconName: "tag",
      label: "Price applied",
      path: "/dashboard/price-applied",
    },
    {
      iconName: "simcard",
      label: "Development",
      path: "/dashboard/development",
    },
    { iconName: "setting", label: "Settings", path: "/dashboard/settings" },
  ];

  useEffect(() => {
    if (activeLinkRef.current) {
      setIndicatorStyle({
        top: activeLinkRef.current.offsetTop,
        height: activeLinkRef.current.offsetHeight,
        opacity: 1,
      });
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [pathname]);

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.push("/signin");
  };

  function iconSrc(name: string, active: boolean) {
    const suffix = active ? "-white" : "";
    return `/icons/${name}${suffix}.svg`;
  }

  return (
    <>
      <aside className="fixed top-[72px] left-0 w-54 h-[calc(100vh-72px)] bg-white border-r border-gray-100 z-50">
        <div className="flex flex-col h-full">
          <div className="flex-1 py-8">
            <nav className="relative px-4 space-y-1">
              <span
                className="absolute left-0 w-1 bg-delivery-orange rounded-r-lg transition-all duration-300 ease-in-out"
                style={{
                  top: indicatorStyle.top,
                  height: indicatorStyle.height,
                  opacity: indicatorStyle.opacity,
                }}
              />

              {sidebarItems.map((item) => {
                const isActive =
                  item.path === "/dashboard"
                    ? pathname === item.path
                    : pathname?.startsWith(item.path);

                return (
                  <Link
                    key={item.label}
                    href={item.path}
                    ref={isActive ? activeLinkRef : null}
                    aria-current={isActive ? "page" : undefined}
                    className={`w-full flex items-center px-4 py-3 text-[14px] font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-delivery-orange text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <img
                      src={iconSrc(item.iconName, Boolean(isActive))}
                      alt={`${item.label} icon`}
                      className="w-[24px] h-[24px] mr-3 flex-shrink-0"
                      draggable={false}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center px-4 py-3 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <img
                src="/icons/logout.svg"
                alt="Logout icon"
                className="w-[22px] h-[22px] mr-3 flex-shrink-0"
                draggable={false}
              />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
