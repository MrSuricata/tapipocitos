import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

// A "quote cart" (carrito de presupuesto): the customer collects products they
// are interested in, then requests a quote via WhatsApp or the contact form.
// Persisted in localStorage so it survives reloads.

export interface CartItem {
  id: string
  name: string
  image?: string
  category?: string
  price?: string
}

interface CartContextType {
  items: CartItem[]
  count: number
  add: (item: CartItem) => void
  remove: (id: string) => void
  clear: () => void
  has: (id: string) => boolean
  toggle: (item: CartItem) => void
}

const CART_KEY = 'tapipocitos_cart'
const CartContext = createContext<CartContextType | null>(null)

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (x): x is CartItem =>
        x && typeof x.id === 'string' && typeof x.name === 'string'
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [items])

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) setItems(loadCart())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback((item: CartItem) => {
    setItems((prev) => (prev.some((p) => p.id === item.id) ? prev : [...prev, item]))
  }, [])

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const has = useCallback((id: string) => items.some((p) => p.id === id), [items])

  const toggle = useCallback((item: CartItem) => {
    setItems((prev) =>
      prev.some((p) => p.id === item.id)
        ? prev.filter((p) => p.id !== item.id)
        : [...prev, item]
    )
  }, [])

  return (
    <CartContext.Provider
      value={{ items, count: items.length, add, remove, clear, has, toggle }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}

const WHATSAPP_NUMBER = '59899251310'

// Builds a WhatsApp link with the cart contents formatted as a quote request.
export function buildWhatsappQuoteLink(items: CartItem[]): string {
  const lines = [
    '¡Hola TAPIPOCITOS! Quiero pedir un presupuesto por estos productos:',
    '',
    ...items.map((it, i) => `${i + 1}. ${it.name}${it.category ? ` (${it.category})` : ''}`),
    '',
    '¿Me pasan info y precio? ¡Gracias!',
  ]
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
}

// Plain-text summary used to pre-fill the contact form message.
export function buildQuoteMessage(items: CartItem[]): string {
  const lines = [
    'Hola, quiero pedir un presupuesto por estos productos:',
    '',
    ...items.map((it, i) => `${i + 1}. ${it.name}${it.category ? ` (${it.category})` : ''}`),
  ]
  return lines.join('\n')
}

// WhatsApp link to consult about a single product.
export function buildWhatsappConsultLink(item: CartItem): string {
  const text = `¡Hola TAPIPOCITOS! Quiero consultar por: ${item.name}${
    item.category ? ` (${item.category})` : ''
  }. ¿Me pasan info y precio? ¡Gracias!`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}
