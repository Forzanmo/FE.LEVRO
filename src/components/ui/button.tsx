import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Solid brand fill with a crafted top highlight (inset-ring, so it never
        // fights the focus ring), a soft depth shadow, and a brightness-lift on
        // hover + press — depth, not a flat opacity fade.
        default:
          "bg-primary text-primary-foreground shadow-sm inset-ring-1 inset-ring-white/15 hover:brightness-110 active:brightness-95",
        gradient:
          "bg-gradient-brand-deep text-white shadow-sm inset-ring-1 inset-ring-white/20 hover:shadow-brand-glow active:brightness-95 focus-visible:ring-brand/50",
        outline:
          "border-border bg-background shadow-xs hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_6%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive shadow-xs hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-2 px-3.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-md px-2.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-md px-3 text-sm in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-10 gap-2 px-4.5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xl: "h-12 gap-2.5 rounded-xl px-6 text-base has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-9",
        "icon-xs":
          "size-7 rounded-md in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 rounded-md in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-10",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Shows a spinner, disables interaction and sets aria-busy. */
  isLoading?: boolean
  /** Icon rendered before the label. Ignored when asChild is set. */
  leftIcon?: React.ReactNode
  /** Icon rendered after the label. Ignored when asChild is set. */
  rightIcon?: React.ReactNode
}

function Button({
  className,
  variant = "default",
  size = "default",
  fullWidth,
  asChild = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  // Slot requires a single child, so decoration only applies to real buttons.
  const content = asChild ? (
    children
  ) : (
    <>
      {isLoading ? (
        <Loader2Icon className="size-4 animate-spin" data-icon="inline-start" aria-hidden />
      ) : leftIcon ? (
        <span data-icon="inline-start" className="inline-flex">
          {leftIcon}
        </span>
      ) : null}
      {children != null ? <span className="contents">{children}</span> : null}
      {!isLoading && rightIcon ? (
        <span data-icon="inline-end" className="inline-flex">
          {rightIcon}
        </span>
      ) : null}
    </>
  )

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {content}
    </Comp>
  )
}

export { Button, buttonVariants }
