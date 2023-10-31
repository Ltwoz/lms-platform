import { LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";

interface InfoCardProps {
  label: string;
  icon: LucideIcon;
  variant?: "default" | "success";
  numberOfItems: number;
}

const InfoCard = ({
  label,
  icon: Icon,
  variant,
  numberOfItems,
}: InfoCardProps) => {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
      <IconBadge variant={variant} icon={Icon} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-gray-500 text-sm">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
