type DealImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function DealImage({ src, alt, className, priority }: DealImageProps) {
  return (
    // Local original SVGs — keep native img to avoid next/image SVG restrictions.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      {...(priority ? { fetchPriority: "high" as const } : {})}
    />
  );
}
