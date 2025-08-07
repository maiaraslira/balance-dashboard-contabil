import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface FinancialData {
  Indicador: string;
  [year: string]: string | number;
}

interface FinancialMetricsProps {
  data: FinancialData[];
  selectedYear: string;
  previousYear: string;
}

export const FinancialMetrics = ({ data, selectedYear, previousYear }: FinancialMetricsProps) => {
  const calculateIndicators = useMemo(() => {
    const findValue = (indicator: string, year: string) => {
      const item = data.find(d => d.Indicador.toLowerCase().includes(indicator.toLowerCase()));
      return item ? Number(item[year]) || 0 : 0;
    };

    // Dados básicos disponíveis
    const receitaLiquida = findValue('receita líquida', selectedYear);
    const receitaLiquidaAnterior = findValue('receita líquida', previousYear);
    
    const receitaBruta = findValue('receita bruta', selectedYear);
    const receitaBrutaAnterior = findValue('receita bruta', previousYear);
    
    const lucrobruto = findValue('lucro bruto', selectedYear);
    const lucroBrutoAnterior = findValue('lucro bruto', previousYear);
    
    const ebitda = findValue('ebitda', selectedYear);
    const ebitdaAnterior = findValue('ebitda', previousYear);
    
    const ebitdaRecorrente = findValue('ebitda recorrente', selectedYear);
    const ebitdaRecorrenteAnterior = findValue('ebitda recorrente', previousYear);
    
    const cmv = Math.abs(findValue('cmv', selectedYear));
    const cmvAnterior = Math.abs(findValue('cmv', previousYear));

    // Cálculo dos indicadores disponíveis
    const margemBruta = receitaLiquida ? (lucrobruto / receitaLiquida) * 100 : 0;
    const margemBrutaAnterior = receitaLiquidaAnterior ? (lucroBrutoAnterior / receitaLiquidaAnterior) * 100 : 0;
    
    const margemEbitda = receitaLiquida ? (ebitda / receitaLiquida) * 100 : 0;
    const margemEbitdaAnterior = receitaLiquidaAnterior ? (ebitdaAnterior / receitaLiquidaAnterior) * 100 : 0;
    
    const margemEbitdaRecorrente = receitaLiquida ? (ebitdaRecorrente / receitaLiquida) * 100 : 0;
    const margemEbitdaRecorrenteAnterior = receitaLiquidaAnterior ? (ebitdaRecorrenteAnterior / receitaLiquidaAnterior) * 100 : 0;
    
    const cmvPercentual = receitaLiquida ? (cmv / receitaLiquida) * 100 : 0;
    const cmvPercentualAnterior = receitaLiquidaAnterior ? (cmvAnterior / receitaLiquidaAnterior) * 100 : 0;

    return [
      {
        title: 'Receita Líquida',
        value: receitaLiquida,
        previousValue: receitaLiquidaAnterior,
        format: 'currency',
        description: 'Receita total líquida de impostos'
      },
      {
        title: 'Lucro Bruto',
        value: lucrobruto,
        previousValue: lucroBrutoAnterior,
        format: 'currency',
        description: 'Receita líquida menos custo dos produtos vendidos'
      },
      {
        title: 'EBITDA',
        value: ebitda,
        previousValue: ebitdaAnterior,
        format: 'currency',
        description: 'Lucro antes de juros, impostos, depreciação e amortização'
      },
      {
        title: 'EBITDA Recorrente',
        value: ebitdaRecorrente,
        previousValue: ebitdaRecorrenteAnterior,
        format: 'currency',
        description: 'EBITDA ajustado excluindo itens não recorrentes'
      },
      {
        title: 'Margem Bruta',
        value: margemBruta,
        previousValue: margemBrutaAnterior,
        format: 'percentage',
        description: 'Percentual do lucro bruto sobre a receita líquida'
      },
      {
        title: 'Margem EBITDA',
        value: margemEbitda,
        previousValue: margemEbitdaAnterior,
        format: 'percentage',
        description: 'Percentual do EBITDA sobre a receita líquida'
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