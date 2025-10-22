export default function SpeedBadge() {
  return (
    <div className="absolute left-8 bottom-8 lg:bottom-16 z-10 hidden lg:block">
      <div className="w-[79px] h-[79px] bg-white rounded-full flex items-center justify-center shadow-lg">
        <img
          src="/auth/speed.png"
          alt="Delivery Speed"
          className="w-[79px] h-[79px]"
        />
      </div>
    </div>
  );
}
