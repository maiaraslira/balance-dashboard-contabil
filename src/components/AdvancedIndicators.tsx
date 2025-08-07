import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, Target, AlertTriangle } from 'lucide-react';

interface FinancialData {
  Indicador: string;
  [year: string]: string | number;
}

interface AdvancedIndicatorsProps {
  data: FinancialData[];
  selectedYear: string;
}

export const AdvancedIndicators = ({ data, selectedYear }: AdvancedIndicatorsProps) => {
  const indicators = useMemo(() => {
    const findValue = (keywords: string[]) => {
      const item = data.find(d => 
        keywords.some(keyword => 
          d.Indicador.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      return item ? Number(item[selectedYear]) || 0 : 0;
    };

    // Dados básicos necessários para cálculos
    const receitaLiquida = findValue(['receita líquida', 'receita liquida']);
    const lucroLiquido = findValue(['lucro líquido', 'lucro liquido']);
    const ativoTotal = findValue(['ativo total', 'ativo']);
    const patrimonioLiquido = findValue(['patrimônio líquido', 'patrimonio liquido']);
    const passivo = findValue(['passivo total', 'passivo']);
    const ativoCirculante = findValue(['ativo circulante']);
    const passivoCirculante = findValue(['passivo circulante']);
    const cmv = Math.abs(findValue(['cmv', 'custo mercadoria vendida', 'custo dos produtos vendidos']));
    const estoques = findValue(['estoques', 'estoque']);
    const contasReceber = findValue(['contas a receber', 'duplicatas a receber']);
    const fornecedores = findValue(['fornecedores', 'contas a pagar']);

    // Cálculo dos indicadores avançados
    const endividamentoGeral = ativoTotal ? (passivo / ativoTotal) * 100 : 0;
    const liquidezCorrente = passivoCirculante ? ativoCirculante / passivoCirculante : 0;
    const liquidezGeral = (passivo + passivoCirculante) ? (ativoTotal) / (passivo + passivoCirculante) : 0;
    const giroAtivo = ativoTotal ? receitaLiquida / ativoTotal : 0;
    const margemLiquida = receitaLiquida ? (lucroLiquido / receitaLiquida) * 100 : 0;
    const roa = ativoTotal ? (lucroLiquido / ativoTotal) * 100 : 0;
    const roe = patrimonioLiquido ? (lucroLiquido / patrimonioLiquido) * 100 : 0;
    const multiplicadorAlavancagem = patrimonioLiquido ? ativoTotal / patrimonioLiquido : 0;
    
    // Indicadores de atividade
    const pmre = (estoques && cmv) ? (estoques * 365) / cmv : 0; // Prazo Médio Renovação Estoques
    const pmrv = (contasReceber && receitaLiquida) ? (contasReceber * 365) / receitaLiquida : 0; // Prazo Médio Recebimento Vendas
    const pmpc = (fornecedores && cmv) ? (fornecedores * 365) / cmv : 0; // Prazo Médio Pagamento Compras
    
    const cicloOperacional = pmre + pmrv;
    const cicloFinanceiro = cicloOperacional - pmpc;

    return [
      {
        category: 'Endividamento',
        indicators: [
          {
            name: 'Endividamento Geral',
            value: endividamentoGeral,
            format: 'percentage',
            status: endividamentoGeral < 50 ? 'good' : endividamentoGeral < 70 ? 'warning' : 'bad',
            description: 'Percentual de recursos de terceiros em relação ao ativo total'
          },
          {
            name: 'Multiplicador de Alavancagem',
            value: multiplicadorAlavancagem,
            format: 'decimal',
            status: multiplicadorAlavancagem < 2 ? 'good' : multiplicadorAlavancagem < 3 ? 'warning' : 'bad',
            description: 'Relação entre ativo total e patrimônio líquido'
          }
        ]
      },
      {
        category: 'Liquidez',
        indicators: [
          {
            name: 'Liquidez Corrente',
            value: liquidezCorrente,
            format: 'decimal',
            status: liquidezCorrente > 1.2 ? 'good' : liquidezCorrente > 1 ? 'warning' : 'bad',
            description: 'Capacidade de pagamento das obrigações de curto prazo'
          },
          {
            name: 'Liquidez Geral',
            value: liquidezGeral,
            format: 'decimal',
            status: liquidezGeral > 1 ? 'good' : liquidezGeral > 0.8 ? 'warning' : 'bad',
            description: 'Capacidade de pagamento das obrigações totais'
          }
        ]
      },
      {
        category: 'Rentabilidade',
        indicators: [
          {
            name: 'Margem Líquida',
            value: margemLiquida,
            format: 'percentage',
            status: margemLiquida > 10 ? 'good' : margemLiquida > 5 ? 'warning' : 'bad',
            description: 'Percentual de lucro sobre as vendas'
          },
          {
            name: 'ROA - Retorno sobre Ativos',
            value: roa,
            format: 'percentage',
            status: roa > 8 ? 'good' : roa > 4 ? 'warning' : 'bad',
            description: 'Retorno gerado pelos ativos da empresa'
          },
          {
            name: 'ROE - Retorno sobre Patrimônio',
            value: roe,
            format: 'percentage',
            status: roe > 15 ? 'good' : roe > 10 ? 'warning' : 'bad',
            description: 'Retorno sobre o investimento dos acionistas'
          },
          {
            name: 'Giro do Ativo',
            value: giroAtivo,
            format: 'decimal',
            status: giroAtivo > 1 ? 'good' : giroAtivo > 0.5 ? 'warning' : 'bad',
            description: 'Eficiência na utilização dos ativos'
          }
        ]
      },
      {
        category: 'Atividade',
        indicators: [
          {
            name: 'PMRE - Prazo Médio Renovação Estoques',
            value: pmre,
            format: 'days',
            status: pmre < 60 ? 'good' : pmre < 90 ? 'warning' : 'bad',
            description: 'Tempo médio para renovar os estoques'
          },
          {
            name: 'PMRV - Prazo Médio Recebimento',
            value: pmrv,
            format: 'days',
            status: pmrv < 30 ? 'good' : pmrv < 60 ? 'warning' : 'bad',
            description: 'Tempo médio para receber vendas'
          },
          {
            name: 'Ciclo Operacional',
            value: cicloOperacional,
            format: 'days',
            status: cicloOperacional < 90 ? 'good' : cicloOperacional < 120 ? 'warning' : 'bad',
            description: 'Tempo entre compra e recebimento'
          },
          {
            name: 'Ciclo Financeiro',
            value: cicloFinanceiro,
            format: 'days',
            status: cicloFinanceiro < 30 ? 'good' : cicloFinanceiro < 60 ? 'warning' : 'bad',
            description: 'Necessidade de capital de giro'
          }
        ]
      }
    ];
  }, [data, selectedYear]);

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'days':
        return `${value.toFixed(0)} dias`;
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

  const getProgressValue = (value: number, format: string, status: string) => {
    switch (format) {
      case 'percentage':
        return Math.min(value, 100);
      case 'decimal':
        return Math.min(value * 25, 100); // Escala para visualização
      case 'days':
        return Math.min(100 - (value / 120) * 100, 100); // Menos dias = melhor
      default:
        return 50;
    }
  };

  return (
    <div className="space-y-6">
      {indicators.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-natura-dark-green">
              <Calculator className="h-5 w-5" />
              Indicadores de {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.indicators.map((indicator, index) => (
                <div key={index} className="space-y-3 p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{indicator.name}</h4>
                    <Badge variant="outline" className={`text-${getStatusColor(indicator.status)} border-${getStatusColor(indicator.status)}`}>
                      {getStatusIcon(indicator.status)}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-natura-dark-green">
                    {formatValue(indicator.value, indicator.format)}
                  </div>
                  <Progress 
                    value={getProgressValue(indicator.value, indicator.format, indicator.status)}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {indicator.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};