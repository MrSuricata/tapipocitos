import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { BackgroundDecor } from '@/components/BackgroundDecor'

interface AdminLoginProps {
  onLogin: (password: string) => void
}

function SofaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 22V18C4 14 6 12 10 12H30C34 12 36 14 36 18V22"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M2 22C2 20 3 19 5 19H35C37 19 38 20 38 22V24C38 25 37 26 36 26H4C3 26 2 25 2 24V22Z"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M8 26V29" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 26V29" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      toast.error('Ingresá la contraseña')
      return
    }
    onLogin(password)
  }

  return (
    <div className="admin-ui min-h-screen relative flex items-center justify-center px-6 bg-[#F5F0EB]">
      <BackgroundDecor />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-3xl shadow-float p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <SofaMark className="w-9 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">TAPIPOCITOS</h1>
            <p className="text-gradient-warm font-semibold text-xs uppercase tracking-[0.25em] mt-1.5">
              Panel Admin
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Ingresá la contraseña para gestionar el sitio
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 h-12 rounded-xl bg-white/70"
                placeholder="Contraseña"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 rounded-full cta-primary text-base"
            >
              Iniciar Sesión
            </Button>
          </form>

          <button
            type="button"
            onClick={() => {
              window.location.href = '/'
            }}
            className="w-full text-center text-xs text-muted-foreground hover:text-accent mt-6 transition-colors"
          >
            ← Volver al sitio
          </button>
        </div>
      </div>
    </div>
  )
}
