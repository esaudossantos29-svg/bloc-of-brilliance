import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-[10px] md:h-[20px] w-[20px] md:w-[40px] shrink-0 cursor-pointer items-center rounded-lg px-[2px] md:px-[3px] transition-colors data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-[7px] md:h-[14px] w-[7px] md:w-[14px] rounded-md bg-zinc-600 shadow-lg ring-0 transition-all data-[state=checked]:translate-x-[10px] md:data-[state=checked]:translate-x-[20px] data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
