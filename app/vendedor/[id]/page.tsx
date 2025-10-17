"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  pixKey: string
  phone: string
}

interface SelectedProduct {
  product: Product
  buyerName: string
  buyerPhone: string
  proofFile?: File
}

export default function SellerStorePage({ params }: { params: { id: string } }) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    try {
      const storedProducts = localStorage.getItem(`products_${params.id}`)
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts))
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }, [params.id, mounted])

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Carregando loja...</p>
        </div>
      </div>
    )
  }

  const categories = ["all", ...new Set(products.map((p) => p.category))]
  const filteredProducts = categoryFilter === "all" ? products : products.filter((p) => p.category === categoryFilter)

  const handleBuyProduct = (product: Product) => {
    setSelectedProduct({
      product,
      buyerName: "",
      buyerPhone: "",
    })
  }

  const handleSubmitPurchase = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct || !selectedProduct.buyerName || !selectedProduct.buyerPhone) {
      alert("Preencha todos os campos")
      return
    }

    const sale = {
      id: Date.now().toString(),
      productId: selectedProduct.product.id,
      productName: selectedProduct.product.name,
      buyerName: selectedProduct.buyerName,
      buyerPhone: selectedProduct.buyerPhone,
      amount: selectedProduct.product.price,
      status: "pending",
      proofUrl: selectedProduct.proofFile ? URL.createObjectURL(selectedProduct.proofFile) : undefined,
      createdAt: new Date().toISOString(),
    }

    const existingSales = JSON.parse(localStorage.getItem(`sales_${params.id}`) || "[]")
    existingSales.push(sale)
    localStorage.setItem(`sales_${params.id}`, JSON.stringify(existingSales))

    alert("Compra registrada! Aguarde a confirmação do vendedor.")
    setSelectedProduct(null)
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Loja Vazia</CardTitle>
              <CardDescription>Esta loja ainda não tem produtos disponíveis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Volte mais tarde para ver os produtos disponíveis.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Loja Online</h1>
          <p className="text-muted-foreground">Escolha um produto e faça sua compra</p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                categoryFilter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat === "all" ? "Todos" : cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    {product.category && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {product.description && <p className="text-sm text-muted-foreground mb-4">{product.description}</p>}
                <div className="mt-auto space-y-3">
                  <div className="text-2xl font-bold text-primary">R$ {product.price.toFixed(2)}</div>
                  <Button onClick={() => handleBuyProduct(product)} className="w-full">
                    Comprar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Purchase Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Comprar: {selectedProduct.product.name}</CardTitle>
                <CardDescription>Preencha os dados para completar a compra</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPurchase} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Valor: R$ {selectedProduct.product.price.toFixed(2)}
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Seu Nome *</label>
                    <Input
                      placeholder="João Silva"
                      value={selectedProduct.buyerName}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          buyerName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Seu Telefone *</label>
                    <Input
                      placeholder="(11) 99999-9999"
                      value={selectedProduct.buyerPhone}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          buyerPhone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Chave PIX para Pagamento</label>
                    <div className="bg-muted p-3 rounded text-sm break-all font-mono">
                      {selectedProduct.product.pixKey}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Contato do Vendedor</label>
                    <div className="bg-muted p-3 rounded text-sm">{selectedProduct.product.phone}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Enviar Comprovante (Opcional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          proofFile: e.target.files?.[0],
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setSelectedProduct(null)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1">
                      Confirmar Compra
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
