export default function ErrorComp({ error }: { error?: string }) {
  return <div className="p-4 text-center text-red-600">{error}</div>;
}
