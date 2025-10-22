"use client";

import { useState } from "react";
import { Button } from "@/components/interface/button";
import { Input } from "@/components/interface/input";
import { Label } from "@/components/interface/label";

export default function DevelopmentSettings() {
  const [formData, setFormData] = useState({
    secretLiveKey: "LIVE-667-777-7788",
    secretTestKey: "LIVE-667-777-7788",
    publishableLiveKey: "LIVE-667-777-7788",
    publishableTestKey: "LIVE-667-777-7788",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    console.log("Settings saved", formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-delivery-bg rounded-lg">
      <h1 className="text-xl font-medium text-[#292D32] mb-8 font-roboto">
        Development
      </h1>

      <div className="bg-[#F1F1F1] rounded-xl p-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-medium text-[#292D32] font-roboto">
              Secret API Keys
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <div className="space-y-2">
                <Label className="text-delivery-gray text-xs font-medium font-plus-jakarta-sans">
                  Live environment
                </Label>
                <Input
                  value={formData.secretLiveKey}
                  onChange={(e) =>
                    handleInputChange("secretLiveKey", e.target.value)
                  }
                  className="bg-white border-delivery-stroke rounded-lg h-12 px-4 text-sm font-inter text-[#292D32] shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-delivery-gray text-xs font-medium font-plus-jakarta-sans">
                  Test environment
                </Label>
                <Input
                  value={formData.secretTestKey}
                  onChange={(e) =>
                    handleInputChange("secretTestKey", e.target.value)
                  }
                  className="bg-white border-delivery-stroke rounded-lg h-12 px-4 text-sm font-inter text-[#292D32] shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-medium text-[#292D32] font-roboto">
              Publishable API Keys
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <div className="space-y-2">
                <Label className="text-delivery-gray text-xs font-medium font-plus-jakarta-sans">
                  Live environment
                </Label>
                <Input
                  value={formData.publishableLiveKey}
                  onChange={(e) =>
                    handleInputChange("publishableLiveKey", e.target.value)
                  }
                  className="bg-white border-delivery-stroke rounded-lg h-12 px-4 text-sm font-inter text-[#292D32] shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-delivery-gray text-xs font-medium font-plus-jakarta-sans">
                  Test environment
                </Label>
                <Input
                  value={formData.publishableTestKey}
                  onChange={(e) =>
                    handleInputChange("publishableTestKey", e.target.value)
                  }
                  className="bg-white border-delivery-stroke rounded-lg h-12 px-4 text-sm font-inter text-[#292D32] shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <Button
            onClick={handleSaveChanges}
            className="bg-delivery-orange text-white border-delivery-orange rounded-lg px-8 py-3 h-12 font-roboto text-base font-medium hover:bg-delivery-orange/90"
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
