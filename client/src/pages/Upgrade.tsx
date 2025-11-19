import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Upgrade() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [isLoading, setIsLoading] = useState(false);

  const subscriptionQuery = trpc.subscription.getCurrent.useQuery();
  const upgradeMutation = trpc.subscription.upgradeToPaid.useMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  const subscription = subscriptionQuery.data;

  if (!subscription || subscription.status !== "trial") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma assinatura de teste encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/dashboard")} variant="outline">
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const monthlyPrice = (subscription.plan.priceMonthly / 100).toFixed(2);
  const annualPrice = (subscription.plan.priceAnnual / 100).toFixed(2);
  const monthlySavings = (
    ((subscription.plan.priceMonthly * 12 - subscription.plan.priceAnnual) /
      (subscription.plan.priceMonthly * 12)) *
    100
  ).toFixed(0);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      await upgradeMutation.mutateAsync({ billingCycle });
      toast.success("Assinatura ativada com sucesso!");
      setLocation("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao fazer upgrade"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Plan Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{subscription.plan.name}</CardTitle>
              <CardDescription>
                Faça upgrade para começar a usar todos os recursos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {subscription.plan.features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-700">
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Billing Cycle Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Selecione o Ciclo de Faturamento</CardTitle>
              <CardDescription>
                Escolha entre pagamento mensal ou anual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Monthly */}
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    billingCycle === "monthly"
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-lg font-bold text-slate-900">
                    R$ {monthlyPrice}
                  </div>
                  <div className="text-sm text-slate-600">por mês</div>
                </button>

                {/* Annual */}
                <button
                  onClick={() => setBillingCycle("annual")}
                  className={`p-4 border-2 rounded-lg transition-all relative ${
                    billingCycle === "annual"
                      ? "border-green-600 bg-green-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Economize {monthlySavings}%
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    R$ {annualPrice}
                  </div>
                  <div className="text-sm text-slate-600">por ano</div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Assinatura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Plano</span>
                <span className="font-semibold text-slate-900">
                  {subscription.plan.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Ciclo de Faturamento</span>
                <span className="font-semibold text-slate-900 capitalize">
                  {billingCycle === "monthly" ? "Mensal" : "Anual"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <span className="text-slate-600">Preço</span>
                <span className="font-semibold text-slate-900 text-lg">
                  R${" "}
                  {billingCycle === "monthly" ? monthlyPrice : annualPrice}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processando...
              </>
            ) : (
              `Fazer Upgrade - R$ ${
                billingCycle === "monthly" ? monthlyPrice : annualPrice
              }`
            )}
          </Button>

          <p className="text-center text-sm text-slate-600">
            Ao prosseguir, você concorda com nossos termos de serviço.
          </p>
        </div>
      </main>
    </div>
  );
}
