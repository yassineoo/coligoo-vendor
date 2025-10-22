import { X } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure you want to delete this?",
  description = "This action cannot be undone",
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[rgba(45,60,82,0.34)] backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-[430px] bg-white rounded-xl border border-black border-opacity-10 shadow-[20px_20px_20px_0_rgba(0,0,0,0.08)] p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <X className="w-4 h-4 text-black" />
        </button>

        <div className="flex flex-col items-center gap-10">
          <div className="w-[115px] h-[112px] rounded-[66px] bg-delivery-orange bg-opacity-40 flex items-center justify-center">
            <img
              src="/images/trash.png"
              alt="Delete icon"
              className="w-16 h-20"
            />
          </div>

          <div className="flex flex-col items-center gap-5 text-center">
            <h2 className="text-xl font-semibold text-black font-inter leading-normal">
              {title}
            </h2>
            <p className="text-base text-black font-inter leading-normal">
              {description}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="w-[118px] h-12 rounded-[13px] bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <span className="text-black font-medium text-[17px] font-roboto leading-[21px] tracking-[0.43px]">
                Cancel
              </span>
            </button>

            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="w-[116px] h-12 rounded-[15px] bg-delivery-orange border-2 border-delivery-orange flex items-center justify-center hover:bg-orange-600 transition-colors"
            >
              <span className="text-white font-medium text-base font-roboto leading-6 tracking-[0.5px]">
                Delete
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
