import { FollowFacebook } from "@/components/FollowFacebook";
import { FollowTelegram } from "@/components/FollowTelegram";

export function FollowSocials({ variant = "bar" }: { variant?: "bar" | "button" }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <FollowFacebook variant={variant} />
      <FollowTelegram variant={variant} />
    </div>
  );
}
