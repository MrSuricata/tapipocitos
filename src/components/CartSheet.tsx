import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash, WhatsappLogo, ArrowRight, ShoppingBag, ImageSquare } from '@phosphor-icons/react'
import { useCart, buildWhatsappQuoteLink } from '@/lib/cart'

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Navigate to the contact form with the quote pre-filled. */
  onRequestForm: () => void
}

export function CartSheet({ open, onOpenChange, onRequestForm }: CartSheetProps) {
  const { items, remove, clear, count } = useCart()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-primary">
            <ShoppingBag size={20} weight="duotone" />
            Mi presupuesto
            {count > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({count} {count === 1 ? 'producto' : 'productos'})
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="text-left">
            Agregá los productos que te interesan y pedí tu presupuesto sin cargo.
          </SheetDescription>
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full min-h-[240px] flex flex-col items-center justify-center text-center gap-3">
              <ShoppingBag size={56} weight="thin" className="text-muted-foreground/40" />
              <p className="text-muted-foreground">Tu presupuesto está vacío.</p>
              <p className="text-sm text-muted-foreground/80 max-w-[220px]">
                Explorá los productos y tocá “Agregar al presupuesto”.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 bg-secondary/40 rounded-xl p-2.5"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageSquare size={22} weight="thin" className="text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                      {item.category && (
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      )}
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                      aria-label={`Quitar ${item.name}`}
                    >
                      <Trash size={16} />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="border-t px-6 py-4 space-y-2">
            <a
              href={buildWhatsappQuoteLink(items)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-white font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
              style={{ backgroundColor: '#25D366' }}
            >
              <WhatsappLogo size={22} weight="fill" />
              Pedir presupuesto por WhatsApp
            </a>
            <Button variant="outline" className="w-full rounded-full group" onClick={onRequestForm}>
              Pedir por formulario
              <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
            <button
              onClick={clear}
              className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors pt-1"
            >
              Vaciar presupuesto
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
