import { cn } from '@/lib/utils'

interface FilterTabsProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  counts?: Record<string, number>
  className?: string
}

/* Tabs editoriales subrayados: el filtro contemporáneo (adiós pills 2018).
   En mobile scrollea horizontal; el conteo va en superíndice ámbar. */
export function FilterTabs({ options, value, onChange, counts, className }: FilterTabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex gap-6 sm:gap-9 overflow-x-auto border-b border-[#6B4423]/15 px-1 sm:justify-center',
        '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
    >
      {options.map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt)}
            className={cn(
              'relative pb-3 text-sm whitespace-nowrap transition-colors button-text tracking-wide',
              active
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {opt}
            {counts && counts[opt] != null && (
              <span
                className={cn(
                  'ml-1 text-[0.62rem] align-super font-semibold',
                  active ? 'text-[var(--brand-accent)]' : 'text-muted-foreground/50'
                )}
              >
                {counts[opt]}
              </span>
            )}
            <span
              className={cn(
                'absolute left-0 right-0 -bottom-px h-[2.5px] rounded-full transition-all duration-300',
                active ? 'bg-[var(--brand-accent)]' : 'bg-transparent'
              )}
              aria-hidden="true"
            />
          </button>
        )
      })}
    </div>
  )
}
