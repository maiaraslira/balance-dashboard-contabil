import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, AlertTriangle, Target } from 'lucide-react';

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

interface SimpleIndicatorsProps {
  data: FinancialData[];
  selectedYear: string;
  previousYear: string;
}

export const SimpleIndicators = ({ data, selectedYear, previousYear }: SimpleIndicatorsProps) => {
  const indicators = useMemo(() => {
    const findData = (year: string) => {
      return data.find(d => d.Ano.toString() === year);
    };

    const currentData = findData(selectedYear);
    const previousData = findData(previousYear);

    if (!currentData) return [];

    const crescimentoReceita = previousData ? ((currentData.Receita_Liquida - previousData.Receita_Liquida) / Math.abs(previousData.Receita_Liquida)) * 100 : 0;
    const crescimentoLucro = previousData ? ((currentData.Lucro_Liquido - previousData.Lucro_Liquido) / Math.abs(previousData.Lucro_Liquido)) * 100 : 0;

    return [
      {
        category: 'Rentabilidade',
        indicators: [
          {
            name: 'Margem Líquida',
            value: currentData.Margem_Liquida,
            previousValue: previousData?.Margem_Liquida || 0,
            format: 'percentage',
            status: currentData.Margem_Liquida > 10 ? 'good' : currentData.Margem_Liquida > 5 ? 'warning' : 'bad',
            description: 'Percentual do lucro líquido sobre a receita líquida'
          },
          {
            name: 'ROE',
            value: currentData.ROE,
            previousValue: previousData?.ROE || 0,
            format: 'percentage',
            status: currentData.ROE > 15 ? 'good' : currentData.ROE > 10 ? 'warning' : 'bad',
            description: 'Rentabilidade do patrimônio líquido'
          },
          {
            name: 'ROA',
            value: currentData.ROA,
            previousValue: previousData?.ROA || 0,
            format: 'percentage',
            status: currentData.ROA > 5 ? 'good' : currentData.ROA > 2 ? 'warning' : 'bad',
            description: 'Rentabilidade do ativo'
          }
        ]
      },
      {
        category: 'Liquidez e Endividamento',
        indicators: [
          {
            name: 'Liquidez Corrente',
            value: currentData.Liquidez_Corrente,
            previousValue: previousData?.Liquidez_Corrente || 0,
            format: 'decimal',
            status: currentData.Liquidez_Corrente > 1.5 ? 'good' : currentData.Liquidez_Corrente > 1.0 ? 'warning' : 'bad',
            description: 'Capacidade de pagar obrigações de curto prazo'
          },
          {
            name: 'Endividamento Geral',
            value: currentData.Endividamento_Geral,
            previousValue: previousData?.Endividamento_Geral || 0,
            format: 'percentage',
            status: currentData.Endividamento_Geral < 40 ? 'good' : currentData.Endividamento_Geral < 60 ? 'warning' : 'bad',
            description: 'Proporção do ativo financiada por capitais de terceiros'
          },
          {
            name: 'Participação Capitais Terceiros',
            value: currentData.Participacao_Capitais_Terceiros,
            previousValue: previousData?.Participacao_Capitais_Terceiros || 0,
            format: 'percentage',
            status: currentData.Participacao_Capitais_Terceiros < 50 ? 'good' : currentData.Participacao_Capitais_Terceiros < 100 ? 'warning' : 'bad',
            description: 'Relação entre capital de terceiros e patrimônio líquido'
          }
        ]
      },
      {
        category: 'Eficiência e Crescimento',
        indicators: [
          {
            name: 'Giro do Ativo',
            value: currentData.Giro_Ativo,
            previousValue: previousData?.Giro_Ativo || 0,
            format: 'decimal',
            status: currentData.Giro_Ativo > 1.0 ? 'good' : currentData.Giro_Ativo > 0.5 ? 'warning' : 'bad',
            description: 'Eficiência do uso dos ativos para gerar receita'
          },
          {
            name: 'Crescimento da Receita',
            value: crescimentoReceita,
            previousValue: 0,
            format: 'percentage',
            status: crescimentoReceita > 10 ? 'good' : crescimentoReceita > 0 ? 'warning' : 'bad',
            description: `Crescimento da receita vs ${previousYear}`
          },
          {
            name: 'Crescimento do Lucro',
            value: crescimentoLucro,
            previousValue: 0,
            format: 'percentage',
            status: crescimentoLucro > 10 ? 'good' : crescimentoLucro > 0 ? 'warning' : 'bad',
            description: `Crescimento do lucro líquido vs ${previousYear}`
          }
        ]
      }
    ];
  }, [data, selectedYear, previousYear]);

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'decimal':
        return value.toFixed(2);
      default:
        return value.toString();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'positive';
      case 'warning':
        return 'warning';
      case 'bad':
        return 'negative';
      default:
        return 'neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <TrendingUp className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'bad':
        return <Target className="h-4 w-4" />;
      default:
        return <Calculator className="h-4 w-4" />;
    }
  };

  const getProgressValue = (value: number, format: string) => {
    if (format === 'percentage') {
      return Math.min(Math.max(value, 0), 100);
    }
    return Math.min(value * 2, 100); // Escala para visualização
  };

  const getTrend = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  return (
    <div className="space-y-6">
      {indicators.map((category, categoryIndex) => (
        <Card key={categoryIndex} className="bg-gradient-card border border-executive-gray/30 shadow-card-executive hover:shadow-executive transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-burnt-orange">
              <Calculator className="h-5 w-5" />
              {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.indicators.map((indicator, index) => {
                const trend = getTrend(indicator.value, indicator.previousValue);
                const statusColor = getStatusColor(indicator.status);
                
                return (
                  <div key={index} className="space-y-3 p-4 rounded-lg border border-executive-gray/30 bg-dark-surface-elevated shadow-card-executive hover:shadow-executive transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-burnt-orange-light group-hover:text-golden-accent transition-colors duration-300">{indicator.name}</h4>
                      <Badge variant="outline" className={`text-${statusColor} border-${statusColor} group-hover:shadow-sm transition-all duration-300`}>
                        {getStatusIcon(indicator.status)}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-golden-accent group-hover:text-golden-light transition-colors duration-300">
                      {formatValue(indicator.value, indicator.format)}
                    </div>
                    {indicator.previousValue !== 0 && (
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${trend > 0 ? 'text-positive border-positive' : trend < 0 ? 'text-negative border-negative' : 'text-neutral border-neutral'}`}
                        >
                          {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend).toFixed(1)}%
                        </Badge>
                        <span className="text-xs text-muted-foreground">vs {previousYear}</span>
                      </div>
                    )}
                    <Progress 
                      value={getProgressValue(indicator.value, indicator.format)}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {indicator.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};