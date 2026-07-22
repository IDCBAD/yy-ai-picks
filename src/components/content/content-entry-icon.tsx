import Image from "next/image";

export interface ContentEntryIconProps {
  iconKey: string;
  kind: "category" | "scenario";
}

export function ContentEntryIcon({ iconKey, kind }: ContentEntryIconProps) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className="contentEntryIcon"
      data-entry-icon={kind}
      height={512}
      src={`/assets/icons/${kind}-${iconKey}.png`}
      width={512}
    />
  );
}
