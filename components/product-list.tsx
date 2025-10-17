"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductListProps {
  products: any[]
  onDeleteProduct: (productId: string) => void
}

export default function ProductList({ products, onDeleteProduct }: ProductListProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meus Produtos</CardTitle>
          <CardDescription>Você ainda não tem produtos cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Adicione seu primeiro produto para começar a vender!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Meus Produtos ({products.length})</h2>
      {products.map((product) => (
        <Card key={product.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  {product.category && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                      {product.category}
                    </span>
                  )}
                </div>
                {product.description && <p className="text-sm text-muted-foreground mt-1">{product.description}</p>}
                <div className="mt-3 space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Preço:</span> R$ {product.price.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">PIX:</span> {product.pixKey}
                  </p>
                  <p>
                    <span className="font-medium">Telefone:</span> {product.phone}
                  </p>
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={() => onDeleteProduct(product.id)}>
                Deletar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
