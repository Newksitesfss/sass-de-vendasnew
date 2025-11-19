import { drizzle } from "drizzle-orm/mysql2";
import { plans } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const seedPlans = async () => {
  try {
    console.log("Seeding plans...");

    const defaultPlans = [
      {
        name: "Starter",
        description: "Para começar",
        priceMonthly: 4500, // R$ 45,00
        priceAnnual: 32000, // R$ 320,00
        features: JSON.stringify([
          "Até 100 vendas/mês",
          "Dashboard básico",
          "Relatórios simples",
          "Suporte por email",
          "5 dias grátis",
        ]),
      },
      {
        name: "Professional",
        description: "Para crescer",
        priceMonthly: 9900, // R$ 99,00
        priceAnnual: 71280, // R$ 712,80
        features: JSON.stringify([
          "Até 1.000 vendas/mês",
          "Dashboard avançado",
          "Relatórios detalhados",
          "Suporte prioritário",
          "Integrações",
          "5 dias grátis",
        ]),
      },
      {
        name: "Enterprise",
        description: "Para escalar",
        priceMonthly: 29900, // R$ 299,00
        priceAnnual: 215280, // R$ 2.152,80
        features: JSON.stringify([
          "Vendas ilimitadas",
          "Dashboard customizável",
          "Relatórios em tempo real",
          "Suporte 24/7",
          "Integrações avançadas",
          "API completa",
          "5 dias grátis",
        ]),
      },
    ];

    for (const plan of defaultPlans) {
      await db.insert(plans).values(plan);
      console.log(`✓ Created plan: ${plan.name}`);
    }

    console.log("✓ Plans seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding plans:", error);
    process.exit(1);
  }
};

seedPlans();
