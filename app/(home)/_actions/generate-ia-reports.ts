"use server";
import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isMatch } from "date-fns";
import OpenAI from "openai";

const DUMMY_REPORT =
  "### Relatório Financeiro Pessoal\n\n**Período de Análise:** Novembro de 2024  \n**Total de Transações:** 15\n\n#### Resumo das Transações\n- **Receitas (DEPOSITS):**\n  - Educação: R$ 4856,56\n  - Educação: R$ 3,23\n- **Investimentos:**\n  - Salário: R$ 3232,00\n- **Despesas (EXPENSES):**\n  - Alimentação: R$ 10.563,00\n  - Habitação: R$ 32,33\n\n#### Totais\n- **Total de Receitas:** R$ 8.091,79\n- **Total de Despesas:** R$ 10.595,33\n- **Saldo: R$ -2.503,54**\n\n### Análise de Desempenho Financeiro\n\n1. **Despesas Elevadas em Alimentação:** \n   - Você gastou um total significativo em alimentos, que representa a maior parte de suas despesas. Considere revisar seus hábitos alimentares e o lugar onde compra suas refeições. Comprar em mercados, cozinhar em casa e fazer listas de compras podem ajudar a reduzir esses gastos.\n\n2. **Educação como Fonte de Receita:** \n   - Seus depósitos relacionados à educação mostram que você tem uma fonte de renda neste setor. Avalie se é possível aumentar essa renda, seja por meio de mais horas de trabalho, aulas ou consultorias.\n\n3. **Investimentos da Renda:**\n   - É positivo que você esteja fazendo investimentos com parte do seu salário. No entanto, a relação entre investimentos e despesas pode estar desbalanceada, uma vez que suas despesas atuais superam suas receitas.\n\n4. **Saldo Negativo:**\n   - O saldo negativo indica que você está gastando mais do que recebe. É essencial ajustar suas despesas para não comprometer sua saúde financeira a longo prazo.\n\n### Dicas para Melhorar Sua Vida Financeira\n\n1. **Criação de um Orçamento Mensal:**\n   - Estabeleça um orçamento com limites claros para cada categoria de despesas, especialmente para alimentação. Use ferramentas de planilhas, aplicativos ou mesmo cadernos para monitorar seus gastos diários.\n\n2. **Planejamento de Refeições:**\n   - Planeje suas refeições da semana e faça uma lista de compras para evitar compras por impulso. Cozinhar em casa geralmente é mais econômico do que comer fora.\n\n3. **Controle de Despesas:**\n   - Anote todas as suas despesas, mesmo as pequenas. Isso ajuda a identificar onde está gastando mais e onde pode cortar.\n\n4. **Aumente sua Renda:**\n   - Considere oportunidades de aumentar sua receita, como trabalhos extras, vendas de produtos que não usa mais, freelance ou empreendedorismo.\n\n5. **Fundo de Emergência:**\n   - Destine uma pequena porcentagem do que recebe para um fundo de emergência. Isso é importante para lidar com imprevistos sem comprometer suas finanças.\n\n6. **Reavaliação de Assinaturas e Serviços:**\n   - Verifique se possui assinaturas ou serviços que não usa mais. Cancelar esses pode aliviar suas despesas mensais.\n\n7. **Educação Financeira:**\n   - Investir em sua educação financeira pode trazer retornos significativos. Considere ler livros, acompanhar podcasts ou fazer cursos sobre finanças pessoais.\n\n8. **Considere Consultar um Especialista:**\n   - Um consultor financeiro pode ajudar a criar um plano mais específico baseado em sua situação atual.\n\n### Conclusão\n\nSua situação financeira apresenta oportunidades de melhoria. Ao seguir algumas das dicas acima, você poderá criar uma estrutura financeira mais saudável, onde suas receitas superem suas despesas, aumentando seu bem-estar e segurança financeira a longo prazo.";

export const generateAiReport = async (month: string) => {
  if (!isMatch(month, "MM")) {
    throw new Error("Invalid month");
  }
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const user = await clerkClient().users.getUser(userId);
  const userHasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";
  if (!userHasPremiumPlan) {
    throw new Error("User has no premium plan");
  }

  if (!process.env.OPENAI_API_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return DUMMY_REPORT;
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const transactions = await db.transaction.findMany({
    where: {
      date: {
        gte: new Date(`2024-${month}-01`),
        lt: new Date(`2024-${month}-31`),
      },
    },
  });
  const content = `Gere um relatório com insights sobre as minhas finanças, com dicas e orientações de como melhorar minha vida financeira. As transações estão divididas por ponto e vírgula. A estrutura de cada uma é {DATA}-{TIPO}-{VALOR}-{CATEGORIA}. São elas:
        ${transactions
          .map(
            (transaction) =>
              `${transaction.date.toLocaleDateString("pt-BR")}-R$${transaction.amount}-${transaction.type}-${transaction.category}`,
          )
          .join(";")}`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em gestão e organização de finanças pessoais. Você ajuda as pessoas a organizarem melhor as suas finanças.",
      },
      {
        role: "user",
        content,
      },
    ],
  });
  return completion.choices[0].message.content;
};
