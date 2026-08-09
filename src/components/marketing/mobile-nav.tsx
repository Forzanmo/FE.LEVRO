'use client'

import * as React from 'react'
import Link from 'next/link'
import { MenuIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { ROUTES } from '@/lib/constants/routes'

export interface MarketingNavLink {
  label: string
  href: string
}

/**
 * The marketing header's small-screen navigation.
 *
 * The header keeps ONE primary action visible at every width ("Get started")
 * and moves everything else in here, because at 320px a logo plus two text
 * links plus a button plus a theme toggle does not fit and degrades into a row
 * of cramped 30px targets. A real sheet is cheaper than that compromise: Radix
 * gives it a focus trap, escape-to-close, scroll lock and the right ARIA for
 * free, so the mobile menu is more accessible than the desktop row it replaces,
 * not less.
 *
 * Every row is a 48px tap target — above the 44px floor, and sized for thumbs
 * rather than for how much text is in the label.
 *
 * It is a leaf, so the marketing page itself stays a server component and this
 * menu's interactive JS is scoped to the menu.
 *
 * It is NOT the page's only client component, which this comment used to claim:
 * `components/shared/reveal.tsx` is also `'use client'` and pulls `motion/react`
 * onto the landing page for six scroll-triggered translates. That is worth
 * revisiting — the page removed a 31KB font for eight glyphs — but a CSS-only
 * scroll reveal needs `animation-timeline`, which is not yet safe to rely on.
 */
export function MobileNav({ links }: { links: readonly MarketingNavLink[] }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/*
       * `SheetTrigger asChild` around a plain button, not the shared `Button`
       * component: the trigger lives on the committed navy header, where the
       * button's own hover and focus colours are wrong.
       *
       * It has to go through SheetTrigger rather than a bare `onClick`, though.
       * Radix returns focus to the element that opened the dialog when it
       * closes, and it can only do that for a trigger it knows about — with a
       * hand-rolled onClick, pressing Escape dropped focus onto <body> and a
       * keyboard user was returned to the top of the document instead of to the
       * menu button they had just been on.
       */}
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="focus-visible:ring-brand-surface-accent inline-flex size-11 items-center justify-center rounded-lg text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 md:hidden"
        >
          <MenuIcon className="size-5" aria-hidden="true" />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[19rem] gap-0 sm:max-w-[19rem]">
        <SheetHeader className="p-5 pb-3">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Jump to a section, or sign in.</SheetDescription>
        </SheetHeader>

        <nav className="px-3">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <SheetClose asChild>
                  <Link
                    href={link.href}
                    className="text-foreground hover:bg-muted focus-visible:ring-ring flex min-h-12 items-center justify-between rounded-lg px-3 text-base font-medium outline-none transition-colors focus-visible:ring-2 active:bg-muted"
                  >
                    {link.label}
                    <Icon name="arrow-right" size="sm" className="text-muted-foreground" />
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>

        {/*
         * ONE button, not two.
         *
         * This was a filled "Create your account" directly above an outlined
         * "Sign in" — two visually distinct actions with the identical `href`,
         * presenting new-versus-returning (the only distinction a first-time
         * visitor cares about at that moment) as a choice that does not exist.
         * Worse, "Create your account" does not create an account: `/sign-up`
         * has no page yet, so the next screen is titled Sign in and has to walk
         * back the promise this one made.
         *
         * Until there is a real registration route, the honest shape is a single
         * primary action and a quieter line naming the other case, both pointing
         * at the combined screen that actually handles both.
         */}
        <div className="border-border mt-auto flex flex-col gap-3 border-t p-5">
          <SheetClose asChild>
            <Button asChild size="xl" fullWidth>
              <Link href={ROUTES.createAccount}>Create free account</Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href={ROUTES.signIn}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex min-h-11 items-center justify-center rounded-lg text-sm outline-none transition-colors focus-visible:ring-2"
            >
              Already have an account? Sign in
            </Link>
          </SheetClose>
          <div className="border-border flex items-center justify-between border-t pt-4">
            <span className="text-muted-foreground text-sm">Appearance</span>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
