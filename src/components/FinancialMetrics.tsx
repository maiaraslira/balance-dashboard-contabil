import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface FinancialData {
  Ano: number;
  Ativo_Circulante: number;
  Passivo_Circulante: number;
  Patrimonio_Liquido: number;
  Ativo_Total: number;
  Passivo_Nao_Circulante: number;
  Receita_Liquida: number;
  Lucro_Liquido: number;
  Endividamento_Geral: number;
  Participacao_Capitais_Terceiros: number;
  Composicao_Endividamento: number;
  Grau_Imobilizacao_PL: number;
  Grau_Imobilizacao_RNC: number;
  Liquidez_Geral: number;
  Liquidez_Corrente: number;
  Liquidez_Seca: number;
  Giro_Ativo: number;
  Margem_Liquida: number;
  ROA: number;
  ROE: number;
  MAF: number;
  ROI_DuPont: number;
}

interface FinancialMetricsProps {
  data: FinancialData[];
  selectedYear: string;
  previousYear: string;
}

export const FinancialMetrics = ({ data, selectedYear, previousYear }: FinancialMetricsProps) => {
  const calculateIndicators = useMemo(() => {
    const findData = (year: string) => {
      return data.find(d => d.Ano.toString() === year);
    };

    const currentData = findData(selectedYear);
    const previousData = findData(previousYear);

    if (!currentData) return [];

    return [
      {
        title: 'Receita Líquida',
        value: currentData.Receita_Liquida,
        previousValue: previousData?.Receita_Liquida || 0,
        format: 'currency',
        description: 'Valor total de vendas líquidas no período'
      },
      {
        title: 'Lucro Líquido',
        value: currentData.Lucro_Liquido,
        previousValue: previousData?.Lucro_Liquido || 0,
        format: 'currency',
        description: 'Lucro final após todas as despesas e impostos'
      },
      {
        title: 'Liquidez Corrente',
        value: currentData.Liquidez_Corrente,
        previousValue: previousData?.Liquidez_Corrente || 0,
        format: 'decimal',
        description: 'Capacidade de pagar obrigações de curto prazo'
      },
      {
        title: 'Endividamento Geral',
        value: currentData.Endividamento_Geral,
        previousValue: previousData?.Endividamento_Geral || 0,
        format: 'percentage',
        description: 'Proporção do ativo financiada por capitais de terceiros'
      },
      {
        title: 'Participação Capitais Terceiros',
        value: currentData.Participacao_Capitais_Terceiros,
        previousValue: previousData?.Participacao_Capitais_Terceiros || 0,
        format: 'percentage',
        description: 'Relação entre capital de terceiros e patrimônio líquido'
      },
      {
        title: 'Margem Líquida',
        value: currentData.Margem_Liquida,
        previousValue: previousData?.Margem_Liquida || 0,
        format: 'percentage',
        description: 'Percentual do lucro líquido sobre a receita líquida'
      },
      {
        title: 'ROE',
        value: currentData.ROE,
        previousValue: previousData?.ROE || 0,
        format: 'percentage',
        description: 'Rentabilidade do patrimônio líquido'
      },
      {
        title: 'ROA',
        value: currentData.ROA,
        previousValue: previousData?.ROA || 0,
        format: 'percentage',
        description: 'Rentabilidade do ativo'
      },
      {
        title: 'Giro do Ativo',
        value: currentData.Giro_Ativo,
        previousValue: previousData?.Giro_Ativo || 0,
        format: 'decimal',
        description: 'Eficiência do uso dos ativos para gerar receita'
      }
    ];
  }, [data, selectedYear, previousYear]);

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value); // Valores já em milhões
      case 'decimal':
        return value.toFixed(2);
      default:
        return value.toString();
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-positive" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-negative" />;
    return <Minus className="h-4 w-4 text-neutral" />;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'positive';
    if (current < previous) return 'negative';
    return 'neutral';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {calculateIndicators.map((metric, index) => {
        const trend = ((metric.value - metric.previousValue) / Math.abs(metric.previousValue || 1)) * 100;
        const trendColor = getTrendColor(metric.value, metric.previousValue);
        
        return (
          <Card key={index} className="relative overflow-hidden bg-gradient-card border border-executive-gray/30 shadow-card-executive hover:shadow-executive transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-executive" />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                {metric.title}
                {getTrendIcon(metric.value, metric.previousValue)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-golden-accent">
                  {formatValue(metric.value, metric.format)}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-${trendColor} border-${trendColor}`}>
                    {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    vs {previousYear}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};