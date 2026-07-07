"use client";
import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
function InputOTP({
  className,
  containerClassName,
  ...props
}) {
  return <OTPInput
    data-slot="input-otp"
    containerClassName={cn(
      "flex items-center gap-2 has-disabled:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />;
}
function InputOTPGroup({ className, ...props }) {
  return <div
    data-slot="input-otp-group"
    className={cn("flex items-center gap-2 sm:gap-3", className)}
    {...props}
  />;
}
function InputOTPSlot({
  index,
  className,
  ...props
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};
  return <div
    data-slot="input-otp-slot"
    data-active={isActive}
    className={cn(
      "relative flex h-14 w-12 sm:h-16 sm:w-14 items-center justify-center rounded-[14px] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-2xl font-bold text-slate-900 dark:text-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 outline-none data-[active=true]:z-10 data-[active=true]:border-slate-900 dark:data-[active=true]:border-white data-[active=true]:ring-4 data-[active=true]:ring-slate-900/10 dark:data-[active=true]:ring-white/10",
      className
    )}
    {...props}
  >
      {char}
      {hasFakeCaret && <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-slate-900 dark:bg-white h-6 w-[2px] duration-1000" />
        </div>}
    </div>;
}
function InputOTPSeparator({ ...props }) {
  return <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>;
}
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
