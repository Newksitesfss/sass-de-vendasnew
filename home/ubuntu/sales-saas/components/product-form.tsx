"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductFormProps {
  onAddProduct: (product: any) => void
}

const CATEGORIES = ["Eletrônicos", "Roupas", "Alimentos", "Livros", "Beleza", "Esportes", "Casa", "Outros"]

export default function ProductForm({ onAddProduct }: ProductFormProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [pixKey, setPixKey] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !price || !category || !pixKey || !phone) {
      setError("Preencha todos os campos obrigatórios")
      return
    }

    if (isNaN(Number.parseFloat(price))) {
      setError("Preço deve ser um número válido")
      return
    }

    onAddProduct({
      name,
      price: Number.parseFloat(price),
      description,
      category,
      pixKey,
      phone,
      createdAt: new Date().toISOString(),
    })

    setName("")
    setPrice("")
    setDescription("")
    setCategory("")
    setPixKey("")
    setPhone("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Produto</CardTitle>
        <CardDescription>Adicione um novo produto à sua loja</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nome do Produto *</label>
            <Input placeholder="Ex: Camiseta Azul" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Categoria *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione uma categoria</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Preço (R$) *</label>
            <Input
              type="number"
              placeholder="0.00"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descrição</label>
            <textarea
              placeholder="Descreva seu produto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Chave PIX *</label>
            <Input
              placeholder="CPF, Email, Telefone ou Chave Aleatória"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Telefone para Contato *</label>
            <Input placeholder="(11) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button type="submit" className="w-full">
            Adicionar Produto
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
