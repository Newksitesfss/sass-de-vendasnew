"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SalesPageProps {
  sellerId: string
}

interface Sale {
  id: string
  productId: string
  productName: string
  buyerName: string
  buyerPhone: string
  amount: number
  status: "pending" | "confirmed"
  proofUrl?: string
  createdAt: string
}

export default function SalesPage({ sellerId }: SalesPageProps) {
  const [sales, setSales] = useState<Sale[]>([])

  useEffect(() => {
    const storedSales = localStorage.getItem(`sales_${sellerId}`)
    if (storedSales) {
      setSales(JSON.parse(storedSales))
    }
  }, [sellerId])

  const handleConfirmSale = (saleId: string) => {
    const updatedSales = sales.map((sale) => (sale.id === saleId ? { ...sale, status: "confirmed" } : sale))
    setSales(updatedSales)
    localStorage.setItem(`sales_${sellerId}`, JSON.stringify(updatedSales))
  }

  const handleDeleteSale = (saleId: string) => {
    const updatedSales = sales.filter((sale) => sale.id !== saleId)
    setSales(updatedSales)
    localStorage.setItem(`sales_${sellerId}`, JSON.stringify(updatedSales))
  }

  const pendingSales = sales.filter((s) => s.status === "pending")
  const confirmedSales = sales.filter((s) => s.status === "confirmed")

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingSales.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{confirmedSales.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Sales */}
      <div>
        <h2 className="text-xl font-bold mb-4">Vendas Pendentes ({pendingSales.length})</h2>
        {pendingSales.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Nenhuma venda pendente</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingSales.map((sale) => (
              <Card key={sale.id}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold">{sale.productName}</h3>
                        <p className="text-sm text-muted-foreground">Cliente: {sale.buyerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">R$ {sale.amount.toFixed(2)}</p>
                        <p className="text-xs text-yellow-600 font-medium">Aguardando comprovante</p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p>
                        <span className="font-medium">Telefone:</span> {sale.buyerPhone}
                      </p>
                    </div>
                    {sale.proofUrl && (
                      <div>
                        <p className="text-sm font-medium mb-2">Comprovante:</p>
                        <img
                          src={sale.proofUrl || "/placeholder.svg"}
                          alt="Comprovante"
                          className="max-w-xs rounded border"
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleConfirmSale(sale.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Confirmar Venda
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteSale(sale.id)}>
                        Deletar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Confirmed Sales */}
      <div>
        <h2 className="text-xl font-bold mb-4">Vendas Confirmadas ({confirmedSales.length})</h2>
        {confirmedSales.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Nenhuma venda confirmada</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {confirmedSales.map((sale) => (
              <Card key={sale.id} className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold">{sale.productName}</h3>
                      <p className="text-sm text-muted-foreground">Cliente: {sale.buyerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">R$ {sale.amount.toFixed(2)}</p>
                      <p className="text-xs text-green-600 font-medium">✓ Confirmada</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
