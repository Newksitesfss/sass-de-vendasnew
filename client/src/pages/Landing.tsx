import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useLocation } from "wouter";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";

interface Plan {
  id: number;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
}

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const plans: Plan[] = [
    {
      id: 1,
      name: "Starter",
      description: "Para começar",
      priceMonthly: 4500, // R$ 45,00
      priceAnnual: 32000, // R$ 320,00
      features: [
        "Até 100 vendas/mês",
        "Dashboard básico",
        "Relatórios simples",
        "Suporte por email",
        "5 dias grátis",
      ],
    },
    {
      id: 2,
      name: "Professional",
      description: "Para crescer",
      priceMonthly: 9900, // R$ 99,00
      priceAnnual: 71280, // R$ 712,80
      features: [
        "Até 1.000 vendas/mês",
        "Dashboard avançado",
        "Relatórios detalhados",
        "Suporte prioritário",
        "Integrações",
        "5 dias grátis",
      ],
    },
    {
      id: 3,
      name: "Enterprise",
      description: "Para escalar",
      priceMonthly: 29900, // R$ 299,00
      priceAnnual: 215280, // R$ 2.152,80
      features: [
        "Vendas ilimitadas",
        "Dashboard customizável",
        "Relatórios em tempo real",
        "Suporte 24/7",
        "Integrações avançadas",
        "API completa",
        "5 dias grátis",
      ],
    },
  ];

  const handleStartTrial = (planId: number) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
    } else {
      setLocation(`/checkout/${planId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
            <span className="text-xl font-bold text-slate-900">{APP_TITLE}</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button onClick={() => setLocation("/dashboard")}>Dashboard</Button>
            ) : (
              <Button onClick={() => (window.location.href = getLoginUrl())}>
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          Gerencie suas vendas com facilidade
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Plataforma completa para acompanhar, analisar e crescer suas vendas.
          Comece com 5 dias grátis, sem cartão de crédito.
        </p>
        <Button
          size="lg"
          onClick={() => handleStartTrial(1)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Começar Teste Grátis
        </Button>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Planos e Preços
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.id === 2
                  ? "border-blue-600 border-2 shadow-lg scale-105"
                  : "border-slate-200"
              }`}
            >
              {plan.id === 2 && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-4xl font-bold text-slate-900">
                    R$ {(plan.priceMonthly / 100).toFixed(2)}
                  </div>
                  <p className="text-sm text-slate-600">por mês</p>
                  <p className="text-sm text-slate-500 mt-2">
                    ou R$ {(plan.priceAnnual / 100).toFixed(2)}/ano
                  </p>
                </div>

                <Button
                  onClick={() => handleStartTrial(plan.id)}
                  className={`w-full ${
                    plan.id === 2
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-slate-200 text-slate-900 hover:bg-slate-300"
                  }`}
                >
                  Começar Teste Grátis
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600">
          <p className="mb-4">
            © 2024 {APP_TITLE}. Todos os direitos reservados.
          </p>
          <p className="text-sm">
            Desenvolvido por{" "}
            <span className="font-semibold text-slate-900">Cria Tech</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
