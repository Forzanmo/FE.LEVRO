'use client'

import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon, type IconName } from '@/components/ui/icon'

const OPTIONS: { value: string; label: string; icon: IconName }[] = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'system' },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change theme">
          {/* Swapped via the `.dark` class (set pre-paint by next-themes), so the
              trigger is hydration-safe without reading theme state in JS. */}
          <Icon name="sun" size="sm" className="dark:hidden" />
          <Icon name="moon" size="sm" className="hidden dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            data-active={theme === option.value}
            className="gap-2 data-[active=true]:font-medium"
          >
            <Icon name={option.icon} size="sm" />
            {option.label}
            {theme === option.value ? (
              <Icon name="check" size="xs" className="text-brand ml-auto" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
