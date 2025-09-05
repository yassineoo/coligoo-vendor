import Empty from "assets/emtpy.png";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <img src={Empty} alt="No Data" className="w-32 mb-4" />
    </div>
  );
}
