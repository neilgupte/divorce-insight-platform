
import React, { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, icon, iconPosition = "left", ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          className={cn(
            iconPosition === "left" ? "pl-9" : "pr-9",
            className
          )}
          ref={ref}
          {...props}
        />
        {icon && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground",
              iconPosition === "left" ? "left-3" : "right-3"
            )}
          >
            {icon}
          </div>
        )}
      </div>
    );
  }
);

InputWithIcon.displayName = "InputWithIcon";
