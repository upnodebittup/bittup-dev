'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChevronDown, ShoppingCart } from 'lucide-react'
import { useCart } from '@/core/context/CartContext'
import { isPublicLinkEnabled } from '@/core/lib/modules'

type Categoria = {
  id: string
  name: string
  slug: string
}

export default function CategoriasMenu() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [open, setOpen] = useState(false)
  const { totalItems } = useCart()
  const cartLink = isPublicLinkEnabled('/loja/carrinho') && (
    <Link
      href="/loja/carrinho"
      aria-label={`Carrinho, ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
      className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
    >
      <ShoppingCart className="h-5 w-5" aria-hidden="true" />
      <span>Carrinho</span>
      <span aria-hidden="true" className="min-w-5 rounded-full bg-[var(--color-bg-secondary)] px-1.5 text-center text-xs leading-5 text-white">
        {totalItems}
      </span>
    </Link>
  )

  useEffect(() => {
    fetch('/api/categorias')
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error('Erro ao carregar categorias:', err))
  }, [])

  return (
    <nav className="w-full bg-[var(--color-bg-primary)] relative z-[999]">
      
      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between gap-2 px-4 py-2">
        <Link href="/loja" className="text-sm font-semibold text-white">
          Início
        </Link>

        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          aria-expanded={open}
          aria-controls="categorias-mobile"
          className="flex items-center gap-1 text-sm font-semibold text-[var(--color-text-primary)]"
        >
          Categorias
          <ChevronDown className={`w-4 h-4 transition ${open ? 'rotate-180' : ''}`} />
        </button>
        {cartLink}
      </div>

      {/* Dropdown */}
      {open && (
        <div id="categorias-mobile" className="md:hidden px-4 pb-3 flex flex-col gap-2 bg-[var(--color-bg-primary)]">
          {categorias.map((cat) => (
            <Link
              key={cat.id}
              href={`/loja/categoria/${cat.slug}`}
              className="text-sm text-[var(--color-text-secondary)]"
              onClick={() => setOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Desktop */}
      <div className="hidden md:flex max-w-7xl mx-auto items-center gap-4 px-4 py-2">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-4 overflow-x-auto font-bold">
          <Link href="/loja" className="text-sm font-semibold text-white hover:underline">
            Início
          </Link>

          {categorias.map((cat) => (
            <Link
              key={cat.id}
              href={`/loja/categoria/${cat.slug}`}
              className="text-sm text-[var(--color-text-secondary)] hover:underline whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </div>
        {cartLink}
      </div>
    </nav>
  )
}
