export function EmptyDeals({ message }: { message: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-line bg-card px-6 py-12 text-center text-muted">
      {message}
    </p>
  );
}
