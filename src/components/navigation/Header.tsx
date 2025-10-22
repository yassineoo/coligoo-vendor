"use client";

import { useState } from "react";
import NotificationPanel from "../modals/NotificationPanel";
import LanguageSelector from "../modals/LanguageSelector";

export default function Header() {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full h-[72px] bg-white shadow-sm flex items-center px-4 z-50">
      {" "}
      <div className="absolute left-[22px] top-[18px]">
        <img
          src="/logo-long.svg"
          alt="ColiGoo Logo"
          className="w-[152px] h-9"
        />
      </div>
      <div className="absolute left-[234px] top-4 w-[388px] h-[38px]">
        <div className="relative w-full h-full">
          <div className="w-full h-full rounded-[19px] border-[0.6px] border-[#D5D5D5] bg-[#F5F6FA]"></div>
          <div className="absolute left-[17px] top-[11px]">
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-50"
            >
              <g opacity="0.5">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.38238 12.8699C12.1122 11.7098 13.3847 8.55632 12.2245 5.82648C11.0644 3.09664 7.91093 1.82416 5.18109 2.98432C2.45125 4.14447 1.17877 7.29793 2.33892 10.0278C3.49908 12.7576 6.65254 14.0301 9.38238 12.8699Z"
                  stroke="black"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.0791 11.7246L15.2444 15.8905"
                  stroke="black"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search"
            className="absolute left-[45px] top-[10px] w-[43px] h-4 bg-transparent text-sm text-[#202224] opacity-50 placeholder:text-[#202224] placeholder:opacity-50 border-none outline-none font-roboto"
          />
        </div>
      </div>
      <div className="absolute right-[35px] top-4 flex items-center gap-6">
        <div className="flex items-center gap-6">
          <LanguageSelector
            isOpen={showLanguageSelector}
            onToggle={() => {
              setShowLanguageSelector(!showLanguageSelector);
              setShowNotificationPanel(false);
            }}
            onClose={() => setShowLanguageSelector(false)}
          />

          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationPanel(!showNotificationPanel);
                setShowLanguageSelector(false);
              }}
              className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0166 2.00098C6.94992 2.00098 4.46658 4.48431 4.46658 7.55098V9.30098C4.46658 9.86764 4.23325 10.7176 3.94158 11.201L2.88325 12.9676C2.23325 14.0593 2.68325 15.276 3.88325 15.676C7.86658 17.001 12.1749 17.001 16.1582 15.676C17.2832 15.301 17.7666 13.9843 17.1582 12.9676L16.0999 11.201C15.8082 10.7176 15.5749 9.85931 15.5749 9.30098V7.55098C15.5666 4.50098 13.0666 2.00098 10.0166 2.00098Z"
                  stroke="#444750"
                  strokeWidth="1.25"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                />
                <path
                  d="M12.7751 16.0176C12.7751 17.5426 11.5251 18.7926 10.0001 18.7926C9.24176 18.7926 8.54176 18.4759 8.04176 17.9759C7.54176 17.4759 7.2251 16.7759 7.2251 16.0176"
                  stroke="#444750"
                  strokeWidth="1.25"
                  strokeMiterlimit="10"
                />
              </svg>
            </button>
            <div className="absolute top-0 right-0 w-[7.5px] h-[7.5px] bg-[#F57600] rounded-full border-[1.67px] border-white"></div>

            <NotificationPanel
              isOpen={showNotificationPanel}
              onClose={() => setShowNotificationPanel(false)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src="/images/avatar.png"
                alt="User Avatar"
                className="object-cover relative"
              />
            </div>
          </div>
          <button className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity">
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.5999 7.79199L11.1666 13.2253C10.5249 13.867 9.4749 13.867 8.83324 13.2253L3.3999 7.79199"
                stroke="#444750"
                strokeWidth="1.25"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
