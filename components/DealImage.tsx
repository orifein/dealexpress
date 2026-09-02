import Image from "next/image";

type DealImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function DealImage({ src, alt, className, priority }: DealImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes="(min-width: 1024px) 42vw, (min-width: 640px) 50vw, 100vw"
      priority={priority}
    />
  );
}
