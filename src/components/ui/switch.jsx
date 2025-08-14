"use client";

import * as React from "react";

const Switch = React.forwardRef(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <div
        className={`inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${
          className || ""
        }`}
        onClick={() => {
          if (!disabled && onCheckedChange) {
            console.log(
              "Switch clicked, toggling from",
              checked,
              "to",
              !checked
            );
            onCheckedChange(!checked);
          }
        }}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        ref={ref}
        {...props}
      >
        <div
          className={`block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
