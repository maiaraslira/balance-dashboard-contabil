import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

interface IndicatorChartsProps {
  data: FinancialData[];
  years: string[];
}

export const IndicatorCharts = ({ data, years }: IndicatorChartsProps) => {
  const chartData = useMemo(() => {
    // Preparar dados para gráficos baseados nos 10 indicadores principais
    const revenueData = years.map(year => {
      const yearData = data.find(d => d.Ano.toString() === year);
      return {
        year,
        value: yearData?.Receita_Liquida || 0
      };
    });

    const profitData = years.map(year => {
      const yearData = data.find(d => d.Ano.toString() === year);
      return {
        year,
        value: yearData?.Lucro_Liquido || 0
      };
    });

    // Indicadores de rentabilidade
    const profitabilityData = years.map(year => {
      const yearData = data.find(d => d.Ano.toString() === year);
      return {
        year,
        margemLiquida: yearData?.Margem_Liquida || 0,
        roe: yearData?.ROE || 0,
        roa: yearData?.ROA || 0
      };
    });

    // Indicadores de liquidez e endividamento
    const liquidityData = years.map(year => {
      const yearData = data.find(d => d.Ano.toString() === year);
      return {
        year,
        liquidezCorrente: yearData?.Liquidez_Corrente || 0,
        endividamento: yearData?.Endividamento_Geral || 0,
        participacaoTerceiros: yearData?.Participacao_Capitais_Terceiros || 0
      };
    });

    // Dados para análise de crescimento
    const growthData = years.slice(1).map((year, index) => {
      const currentData = data.find(d => d.Ano.toString() === year);
      const previousData = data.find(d => d.Ano.toString() === years[index]);
      
      const crescimentoReceita = previousData && currentData ? 
        ((currentData.Receita_Liquida - previousData.Receita_Liquida) / Math.abs(previousData.Receita_Liquida)) * 100 : 0;
      const crescimentoLucro = previousData && currentData ? 
        ((currentData.Lucro_Liquido - previousData.Lucro_Liquido) / Math.abs(previousData.Lucro_Liquido)) * 100 : 0;
      
      return {
        year,
        crescimentoReceita,
        crescimentoLucro
      };
    });

    // Dados de eficiência
    const efficiencyData = years.map(year => {
      const yearData = data.find(d => d.Ano.toString() === year);
      return {
        year,
        giroAtivo: yearData?.Giro_Ativo || 0
      };
    });

    return {
      revenueData,
      profitData,
      profitabilityData,
      liquidityData,
      growthData,
      efficiencyData
    };
  }, [data, years]);

  const COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Evolução da Receita */}
      <Card className="bg-gradient-card border border-executive-gray/30 shadow-card-executive hover:shadow-executive transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-primary">Evolução da Receita Líquida</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
               <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Evolução do Lucro Líquido */}
      <Card className="bg-gradient-card border border-executive-gray/30 shadow-card-executive hover:shadow-executive transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-primary">Evolução do Lucro Líquido</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.profitData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
               <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#22c55e" 
                strokeWidth={3}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Indicadores de Rentabilidade */}
      <Card className="bg-gradient-card border border-executive-gray/30 shadow-card-executive hover:shadow-executive transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-primary">Indicadores de Rentabilidade</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
               <Line 
                type="monotone" 
                dataKey="margemLiquida" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Margem Líquida"
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="roe" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="ROE"
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="roa" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="ROA"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Indicadores de Liquidez e Endividamento */}
      <Card className="bg-gradient-card border border-executive-gray/30 shadow-card-executive hover:shadow-executive transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-primary">Liquidez e Endividamento</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.liquidityData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value: number) => value.toFixed(2)} />
               <Bar 
                dataKey="liquidezCorrente" 
                fill="#22c55e"
                name="Liquidez Corrente"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="endividamento" 
                fill="#ef4444"
                name="Endividamento Geral (%)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Taxa de Crescimento */}
      <Card className="bg-gradient-card border border-executive-gray/30 shadow-card-executive hover:shadow-executive transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-primary">Taxa de Crescimento Anual</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.growthData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${value.toFixed(0)}%`} />
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
               <Bar 
                dataKey="crescimentoReceita" 
                fill="hsl(var(--primary))"
                name="Crescimento Receita"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="crescimentoLucro" 
                fill="#22c55e"
                name="Crescimento Lucro Líquido"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Eficiência do Ativo */}
      <Card className="bg-gradient-card border border-executive-gray/30 shadow-card-executive hover:shadow-executive transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-primary">Giro do Ativo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => value.toFixed(2)} />
              <Tooltip formatter={(value: number) => value.toFixed(2)} />
               <Bar 
                dataKey="giroAtivo" 
                fill="#8b5cf6"
                name="Giro do Ativo"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};