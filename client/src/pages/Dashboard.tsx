import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, LogOut, Zap } from "lucide-react";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const subscriptionQuery = trpc.subscription.getCurrent.useQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  const subscription = subscriptionQuery.data;
  const isTrialActive =
    subscription && subscription.status === "trial"
      ? new Date(subscription.trialEndDate) > new Date()
      : false;

  const daysRemaining = subscription
    ? Math.ceil(
        (new Date(subscription.trialEndDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <Button
            variant="outline"
            onClick={logout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Bem-vindo, {user?.name || "Usuário"}!</CardTitle>
            <CardDescription>Email: {user?.email}</CardDescription>
          </CardHeader>
        </Card>

        {/* Subscription Status */}
        {subscriptionQuery.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : subscription ? (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Plano Atual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Plano</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {subscription.plan.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        subscription.status === "trial"
                          ? "bg-yellow-500"
                          : subscription.status === "active"
                            ? "bg-green-500"
                            : "bg-red-500"
                      }`}
                    />
                    <p className="font-semibold text-slate-900 capitalize">
                      {subscription.status === "trial"
                        ? "Teste Grátis"
                        : subscription.status === "active"
                          ? "Ativo"
                          : "Cancelado"}
                    </p>
                  </div>
                </div>
                {isTrialActive && (
                  <div>
                    <p className="text-sm text-slate-600">Dias Restantes</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {daysRemaining} dias
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Plan Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Plano</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Preço Mensal</p>
                  <p className="text-2xl font-bold text-slate-900">
                    R$ {(subscription.plan.priceMonthly / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Preço Anual</p>
                  <p className="text-2xl font-bold text-slate-900">
                    R$ {(subscription.plan.priceAnnual / 100).toFixed(2)}
                  </p>
                </div>
                {subscription.status === "trial" && (
                  <Button
                    onClick={() => setLocation("/upgrade")}
                    className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                  >
                    Fazer Upgrade
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Nenhuma Assinatura Ativa</CardTitle>
              <CardDescription>
                Comece com 5 dias grátis para testar todos os recursos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setLocation("/")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Ver Planos
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        {subscription && (
          <Card>
            <CardHeader>
              <CardTitle>Recursos do Plano</CardTitle>
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
        )}
      </main>
    </div>
  );
}
