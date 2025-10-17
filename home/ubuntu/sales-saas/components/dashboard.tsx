"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProductForm from "./product-form"
import ProductList from "./product-list"
import SalesPage from "./sales-page"

interface DashboardProps {
  seller: any
  onLogout: () => void
}

export default function Dashboard({ seller, onLogout }: DashboardProps) {
  const [tab, setTab] = useState<"products" | "sales" | "link">("products")
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    const storedProducts = localStorage.getItem(`products_${seller.id}`)
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    }
  }, [seller.id])

  const handleAddProduct = (product: any) => {
    const newProducts = [...products, { ...product, id: Date.now().toString() }]
    setProducts(newProducts)
    localStorage.setItem(`products_${seller.id}`, JSON.stringify(newProducts))
  }

  const handleDeleteProduct = (productId: string) => {
    const newProducts = products.filter((p) => p.id !== productId)
    setProducts(newProducts)
    localStorage.setItem(`products_${seller.id}`, JSON.stringify(newProducts))
  }

  const handleLogout = () => {
    localStorage.removeItem("seller")
    onLogout()
  }

  const salesLink = `${typeof window !== "undefined" ? window.location.origin : ""}/vendedor/${seller.id}`

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Minha Loja</h1>
            <p className="text-sm text-muted-foreground">Bem-vindo, {seller.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 flex gap-4">
          <button
            onClick={() => setTab("products")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              tab === "products"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Meus Produtos
          </button>
          <button
            onClick={() => setTab("sales")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              tab === "sales"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Vendas
          </button>
          <button
            onClick={() => setTab("link")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              tab === "link"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Link da Loja
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {tab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ProductForm onAddProduct={handleAddProduct} />
            </div>
            <div className="lg:col-span-2">
              <ProductList products={products} onDeleteProduct={handleDeleteProduct} />
            </div>
          </div>
        )}

        {tab === "sales" && <SalesPage sellerId={seller.id} />}

        {tab === "link" && (
          <Card>
            <CardHeader>
              <CardTitle>Link da Sua Loja</CardTitle>
              <CardDescription>Compartilhe este link com seus clientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg break-all font-mono text-sm">{salesLink}</div>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(salesLink)
                  alert("Link copiado!")
                }}
              >
                Copiar Link
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
