import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, Target, AlertTriangle } from 'lucide-react';

interface FinancialData {
  ano: number;
  ativoCirculante: number;
  passivoCirculante: number;
  passivoNaoCirculante: number;
  patrimonioLiquido: number;
  ativoTotal: number;
  receitaLiquida: number;
  lucroLiquido: number;
}

interface AdvancedIndicatorsProps {
  data: FinancialData[];
  selectedYear: number;
}

interface Indicator {
  name: string;
  value: number;
  description: string;
}

export const AdvancedIndicators: React.FC<AdvancedIndicatorsProps> = ({ data, selectedYear }) => {
  // Função para calcular os indicadores a partir dos dados financeiros
  function calcularIndicadores(dados: FinancialData): Indicator[] {
    const dividaTotal = dados.passivoCirculante + dados.passivoNaoCirculante;

    const liquidezCorrente = dados.ativoCirculante / dados.passivoCirculante;
    const endividamentoGeral = dividaTotal / dados.ativoTotal;
    const participacaoCapitaisTerceiros = dividaTotal / dados.patrimonioLiquido;
    const margemLiquida = dados.lucroLiquido / dados.receitaLiquida;
    const roe = dados.lucroLiquido / dados.patrimonioLiquido;
    const roa = dados.lucroLiquido / dados.ativoTotal;
    const giroDoAtivo = dados.receitaLiquida / dados.ativoTotal;

    return [
      {
        name: 'Liquidez Corrente',
        value: liquidezCorrente,
        description: 'Capacidade de pagar obrigações de curto prazo',
      },
      {
        name: 'Endividamento Geral',
        value: endividamentoGeral,
        description: 'Proporção do ativo financiada por capitais de terceiros',
      },
      {
        name: 'Participação Capitais Terceiros',
        value: participacaoCapitaisTerceiros,
        description: 'Relação entre capital de terceiros e patrimônio líquido',
      },
      {
        name: 'Margem Líquida',
        value: margemLiquida,
        description: 'Percentual do lucro líquido sobre a receita líquida',
      },
      {
        name: 'ROE',
        value: roe,
        description: 'Rentabilidade do patrimônio líquido',
      },
      {
        name: 'ROA',
        value: roa,
        description: 'Rentabilidade do ativo',
      },
      {
        name: 'Giro do Ativo',
        value: giroDoAtivo,
        description: 'Eficiência do uso dos ativos para gerar receita',
      },
    ];
  }

  // Encontra os dados do ano selecionado
  const dadosAnoSelecionado = useMemo(() => {
    return data.find(d => d.ano === selectedYear);
  }, [data, selectedYear]);

  if (!dadosAnoSelecionado) {
    return <div>Nenhum dado disponível para o ano {selectedYear}</div>;
  }

  // Calcula os indicadores para o ano selecionado
  const indicadores = useMemo(() => calcularIndicadores(dadosAnoSelecionado), [dadosAnoSelecionado]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {indicadores.map(({ name, value, description }) => {
        // Formatação de valor: percentual ou número normal
        const isPercent = name !== 'Liquidez Corrente' && name !== 'Giro do Ativo';
        const displayValue = isPercent ? (value * 100).toFixed(2) + '%' : value.toFixed(2);

        // Definir badge baseado em valor (exemplo simples)
        let badgeVariant: 'default' | 'secondary' | 'destructive' = 'default';
        if (value >= 0.7) badgeVariant = 'secondary';
        else if (value < 0.3) badgeVariant = 'destructive';

        return (
          <Card key={name} className="p-4">
            <CardHeader>
              <CardTitle>{name}</CardTitle>
              <Badge variant={badgeVariant}>{displayValue}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{description}</p>
              <Progress value={Math.min(value * 100, 100)} className="mt-2" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
