"use client"

import type React from "react"
import { supabase } from "@/lib/supabaseClient"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LoginFormProps {
  onLoginSuccess: (seller: any) => void
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Preencha todos os campos")
      return
    }

    if (!isLogin && !name) {
      setError("Nome é obrigatório")
      return
    }

    if (isLogin) {
      const { data, error } = await supabase.from("sellers").select("*").eq("email", email).eq("password", password).single()
      if (error || !data) {
        setError("Email ou senha incorretos")
        return
      }
      onLoginSuccess(data)

    } else {
      const { data: existingSeller, error: existingSellerError } = await supabase.from("sellers").select("*").eq("email", email).single()
      if (existingSeller) {
        setError("Email já cadastrado")
        return
      }

      const { data: newSeller, error } = await supabase.from("sellers").insert([{ name, email, password }]).select().single()
      if (error || !newSeller) {
        console.error("Error creating seller:", error)
        setError("Erro ao cadastrar. Tente novamente.")
        return
      }
      onLoginSuccess(newSeller)

    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-center">{isLogin ? "Bem-vindo" : "Criar Conta"}</CardTitle>
          <CardDescription className="text-center">
            {isLogin ? "Faça login para acessar sua loja" : "Crie sua conta de vendedor"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Nome</label>
                <Input type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button type="submit" className="w-full">
              {isLogin ? "Entrar" : "Cadastrar"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
              }}
              className="w-full text-sm text-primary hover:underline"
            >
              {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça login"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

