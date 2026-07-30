'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/icon'
import { ROUTES } from '@/lib/constants/routes'
import { useSession } from '@/providers/session-provider'

import { Logo } from './logo'

function UserMenu() {
  const { user, signOut } = useSession()
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
    router.push(ROUTES.signIn)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu">
          <Avatar className="size-8">
            <AvatarFallback className="bg-brand-muted text-brand text-xs font-semibold">
              {user?.initials ?? 'LV'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-medium">{user?.name ?? 'Your account'}</span>
          {user?.email ? (
            <span className="text-muted-foreground text-xs font-normal">{user.email}</span>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="gap-2">
          <Link href={ROUTES.settings}>
            <Icon name="settings" size="sm" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive gap-2">
          <Icon name="logout" size="sm" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NotificationsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Icon name="bell" size="sm" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col items-center gap-1 px-3 py-6 text-center">
          <Icon name="bell" size="md" className="text-muted-foreground" />
          <span className="text-sm font-medium">You&rsquo;re all caught up</span>
          <span className="text-muted-foreground text-xs">New activity will show up here.</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Sticky top chrome. No global search by product design (spec §4). */
export function AppHeader() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/88 sticky top-0 z-[var(--z-sticky)] flex h-16 items-center gap-2 border-b px-4 backdrop-blur sm:px-6">
      <div className="md:hidden">
        <Logo />
      </div>
      <div className="ml-auto flex items-center gap-0.5">
        <NotificationsMenu />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
