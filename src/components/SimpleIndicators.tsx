import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, AlertTriangle, Target } from 'lucide-react';

interface FinancialData {
  Indicador: string;
  [year: string]: string | number;
}

interface SimpleIndicatorsProps {
  data: FinancialData[];
  selectedYear: string;
  previousYear: string;
}

export const SimpleIndicators = ({ data, selectedYear, previousYear }: SimpleIndicatorsProps) => {
  const indicators = useMemo(() => {
    const findValue = (keywords: string[], year: string) => {
      const item = data.find(d => 
        keywords.some(keyword => 
          d.Indicador.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      return item ? Number(item[year]) || 0 : 0;
    };

    // Dados básicos disponíveis
    const receitaLiquida = findValue(['receita líquida'], selectedYear);
    const receitaLiquidaAnterior = findValue(['receita líquida'], previousYear);
    
    const receitaBruta = findValue(['receita bruta'], selectedYear);
    const receitaBrutaAnterior = findValue(['receita bruta'], previousYear);
    
    const lucrobruto = findValue(['lucro bruto'], selectedYear);
    const lucroBrutoAnterior = findValue(['lucro bruto'], previousYear);
    
    const ebitda = findValue(['ebitda'], selectedYear);
    const ebitdaAnterior = findValue(['ebitda'], previousYear);
    
    const ebitdaRecorrente = findValue(['ebitda recorrente'], selectedYear);
    const ebitdaRecorrenteAnterior = findValue(['ebitda recorrente'], previousYear);
    
    const cmv = Math.abs(findValue(['cmv'], selectedYear));
    const cmvAnterior = Math.abs(findValue(['cmv'], previousYear));
    
    const depreciacao = findValue(['depreciação'], selectedYear);
    const depreciacaoAnterior = findValue(['depreciação'], previousYear);
    
    const despesasVendas = Math.abs(findValue(['despesas com vendas'], selectedYear));
    const despesasVendasAnterior = Math.abs(findValue(['despesas com vendas'], previousYear));
    
    const despesasAdmin = Math.abs(findValue(['despesas adm'], selectedYear));
    const despesasAdminAnterior = Math.abs(findValue(['despesas adm'], previousYear));

    // Cálculo dos indicadores
    const margemBruta = receitaLiquida ? (lucrobruto / receitaLiquida) * 100 : 0;
    const margemBrutaAnterior = receitaLiquidaAnterior ? (lucroBrutoAnterior / receitaLiquidaAnterior) * 100 : 0;
    
    const margemEbitda = receitaLiquida ? (ebitda / receitaLiquida) * 100 : 0;
    const margemEbitdaAnterior = receitaLiquidaAnterior ? (ebitdaAnterior / receitaLiquidaAnterior) * 100 : 0;
    
    const margemEbitdaRecorrente = receitaLiquida ? (ebitdaRecorrente / receitaLiquida) * 100 : 0;
    const margemEbitdaRecorrenteAnterior = receitaLiquidaAnterior ? (ebitdaRecorrenteAnterior / receitaLiquidaAnterior) * 100 : 0;
    
    const cmvSobreReceita = receitaLiquida ? (cmv / receitaLiquida) * 100 : 0;
    const cmvSobreReceitaAnterior = receitaLiquidaAnterior ? (cmvAnterior / receitaLiquidaAnterior) * 100 : 0;
    
    const despesasVendasSobreReceita = receitaLiquida ? (despesasVendas / receitaLiquida) * 100 : 0;
    const despesasVendasSobreReceitaAnterior = receitaLiquidaAnterior ? (despesasVendasAnterior / receitaLiquidaAnterior) * 100 : 0;
    
    const despesasAdminSobreReceita = receitaLiquida ? (despesasAdmin / receitaLiquida) * 100 : 0;
    const despesasAdminSobreReceitaAnterior = receitaLiquidaAnterior ? (despesasAdminAnterior / receitaLiquidaAnterior) * 100 : 0;

    const crescimentoReceita = receitaLiquidaAnterior ? ((receitaLiquida - receitaLiquidaAnterior) / Math.abs(receitaLiquidaAnterior)) * 100 : 0;
    const crescimentoLucro = lucroBrutoAnterior ? ((lucrobruto - lucroBrutoAnterior) / Math.abs(lucroBrutoAnterior)) * 100 : 0;
    const crescimentoEbitda = ebitdaAnterior ? ((ebitda - ebitdaAnterior) / Math.abs(ebitdaAnterior)) * 100 : 0;

    return [
      {
        category: 'Rentabilidade',
        indicators: [
          {
            name: 'Margem Bruta',
            value: margemBruta,
            previousValue: margemBrutaAnterior,
            format: 'percentage',
            status: margemBruta > 50 ? 'good' : margemBruta > 40 ? 'warning' : 'bad',
            description: 'Percentual do lucro bruto sobre a receita líquida'
          },
          {
            name: 'Margem EBITDA',
            value: margemEbitda,
            previousValue: margemEbitdaAnterior,
            format: 'percentage',
            status: margemEbitda > 15 ? 'good' : margemEbitda > 10 ? 'warning' : 'bad',
            description: 'Percentual do EBITDA sobre a receita líquida'
          },
          {
            name: 'Margem EBITDA Recorrente',
            value: margemEbitdaRecorrente,
            previousValue: margemEbitdaRecorrenteAnterior,
            format: 'percentage',
            status: margemEbitdaRecorrente > 15 ? 'good' : margemEbitdaRecorrente > 10 ? 'warning' : 'bad',
            description: 'EBITDA ajustado excluindo itens não recorrentes'
          }
        ]
      },
      {
        category: 'Estrutura de Custos',
        indicators: [
          {
            name: 'CMV sobre Receita',
            value: cmvSobreReceita,
            previousValue: cmvSobreReceitaAnterior,
            format: 'percentage',
            status: cmvSobreReceita < 40 ? 'good' : cmvSobreReceita < 50 ? 'warning' : 'bad',
            description: 'Custo dos produtos vendidos como % da receita'
          },
          {
            name: 'Despesas de Vendas/Marketing',
            value: despesasVendasSobreReceita,
            previousValue: despesasVendasSobreReceitaAnterior,
            format: 'percentage',
            status: despesasVendasSobreReceita < 40 ? 'good' : despesasVendasSobreReceita < 50 ? 'warning' : 'bad',
            description: 'Despesas comerciais como % da receita'
          },
          {
            name: 'Despesas Administrativas',
            value: despesasAdminSobreReceita,
            previousValue: despesasAdminSobreReceitaAnterior,
            format: 'percentage',
            status: despesasAdminSobreReceita < 15 ? 'good' : despesasAdminSobreReceita < 20 ? 'warning' : 'bad',
            description: 'Despesas administrativas como % da receita'
          }
        ]
      },
      {
        category: 'Crescimento',
        indicators: [
          {
            name: 'Crescimento da Receita',
            value: crescimentoReceita,
            previousValue: 0,
            format: 'percentage',
            status: crescimentoReceita > 10 ? 'good' : crescimentoReceita > 0 ? 'warning' : 'bad',
            description: `Crescimento da receita vs ${previousYear}`
          },
          {
            name: 'Crescimento do Lucro Bruto',
            value: crescimentoLucro,
            previousValue: 0,
            format: 'percentage',
            status: crescimentoLucro > 10 ? 'good' : crescimentoLucro > 0 ? 'warning' : 'bad',
            description: `Crescimento do lucro bruto vs ${previousYear}`
          },
          {
            name: 'Crescimento do EBITDA',
            value: crescimentoEbitda,
            previousValue: 0,
            format: 'percentage',
            status: crescimentoEbitda > 10 ? 'good' : crescimentoEbitda > 0 ? 'warning' : 'bad',
            description: `Crescimento do EBITDA vs ${previousYear}`
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