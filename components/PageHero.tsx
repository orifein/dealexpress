export function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 space-y-2">
      <h1 className="text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
        {title}
      </h1>
      {subtitle ? <p className="max-w-2xl text-lg text-muted">{subtitle}</p> : null}
    </div>
  );
}
