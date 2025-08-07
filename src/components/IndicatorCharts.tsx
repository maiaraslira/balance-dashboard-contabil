import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface FinancialData {
  Indicador: string;
  [year: string]: string | number;
}

interface IndicatorChartsProps {
  data: FinancialData[];
  years: string[];
}

export const IndicatorCharts = ({ data, years }: IndicatorChartsProps) => {
  const chartData = useMemo(() => {
    // Função para encontrar valores dos indicadores
    const findIndicatorValues = (keywords: string[]) => {
      const indicator = data.find(item => 
        keywords.some(keyword => 
          item.Indicador.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      return indicator || null;
    };

    // Preparar dados para gráficos baseados nos dados reais disponíveis
    const revenueData = years.map(year => {
      const receita = findIndicatorValues(['receita líquida']);
      return {
        year,
        value: receita ? Number(receita[year]) || 0 : 0
      };
    });

    const grossProfitData = years.map(year => {
      const lucro = findIndicatorValues(['lucro bruto']);
      return {
        year,
        value: lucro ? Number(lucro[year]) || 0 : 0
      };
    });

    const ebitdaData = years.map(year => {
      const ebitda = findIndicatorValues(['ebitda']);
      return {
        year,
        value: ebitda ? Number(ebitda[year]) || 0 : 0
      };
    });

    const ebitdaRecurrentData = years.map(year => {
      const ebitdaRec = findIndicatorValues(['ebitda recorrente']);
      return {
        year,
        value: ebitdaRec ? Number(ebitdaRec[year]) || 0 : 0
      };
    });

    // Dados para análise de margem
    const marginData = years.map(year => {
      const receita = findIndicatorValues(['receita líquida']);
      const lucrobruto = findIndicatorValues(['lucro bruto']);
      const ebitda = findIndicatorValues(['ebitda']);
      
      const receitaValue = receita ? Number(receita[year]) || 0 : 0;
      const lucroBrutoValue = lucrobruto ? Number(lucrobruto[year]) || 0 : 0;
      const ebitdaValue = ebitda ? Number(ebitda[year]) || 0 : 0;
      
      return {
        year,
        margemBruta: receitaValue ? (lucroBrutoValue / receitaValue) * 100 : 0,
        margemEbitda: receitaValue ? (ebitdaValue / receitaValue) * 100 : 0
      };
    });

    // Dados para análise de crescimento
    const growthData = years.slice(1).map((year, index) => {
      const currentReceita = revenueData.find(d => d.year === year)?.value || 0;
      const previousReceita = revenueData.find(d => d.year === years[index])?.value || 0;
      const currentLucro = grossProfitData.find(d => d.year === year)?.value || 0;
      const previousLucro = grossProfitData.find(d => d.year === years[index])?.value || 0;
      const currentEbitda = ebitdaData.find(d => d.year === year)?.value || 0;
      const previousEbitda = ebitdaData.find(d => d.year === years[index])?.value || 0;
      
      return {
        year,
        crescimentoReceita: previousReceita ? ((currentReceita - previousReceita) / Math.abs(previousReceita)) * 100 : 0,
        crescimentoLucro: previousLucro ? ((currentLucro - previousLucro) / Math.abs(previousLucro)) * 100 : 0,
        crescimentoEbitda: previousEbitda ? ((currentEbitda - previousEbitda) / Math.abs(previousEbitda)) * 100 : 0
      };
    });

    // Análise de despesas
    const expenseData = years.map(year => {
      const receita = findIndicatorValues(['receita líquida']);
      const cmv = findIndicatorValues(['cmv']);
      const vendas = findIndicatorValues(['despesas com vendas']);
      const admin = findIndicatorValues(['despesas adm']);
      
      const receitaValue = receita ? Number(receita[year]) || 0 : 0;
      const cmvValue = Math.abs(cmv ? Number(cmv[year]) || 0 : 0);
      const vendasValue = Math.abs(vendas ? Number(vendas[year]) || 0 : 0);
      const adminValue = Math.abs(admin ? Number(admin[year]) || 0 : 0);
      
      return {
        year,
        cmvPercent: receitaValue ? (cmvValue / receitaValue) * 100 : 0,
        vendasPercent: receitaValue ? (vendasValue / receitaValue) * 100 : 0,
        adminPercent: receitaValue ? (adminValue / receitaValue) * 100 : 0
      };
    });

    return {
      revenueData,
      grossProfitData,
      ebitdaData,
      ebitdaRecurrentData,
      marginData,
      growthData,
      expenseData
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
              <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}B`} />
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

      {/* Evolução do Lucro Bruto */}
      <Card className="bg-gradient-card border border-executive-gray/30 shadow-card-executive hover:shadow-executive transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-primary">Evolução do Lucro Bruto</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.grossProfitData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}B`} />
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

      {/* EBITDA */}
      <Card className="bg-gradient-card border border-executive-gray/30 shadow-card-executive hover:shadow-executive transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-primary">Evolução do EBITDA</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.ebitdaData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `R$ ${value.toFixed(0)}M`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
               <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Margens */}
      <Card className="bg-gradient-card border border-executive-gray/30 shadow-card-executive hover:shadow-executive transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-primary">Análise de Margens</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.marginData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
               <Bar 
                dataKey="margemBruta" 
                fill="#22c55e"
                name="Margem Bruta"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="margemEbitda" 
                fill="#f59e0b"
                name="Margem EBITDA"
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
                name="Crescimento Lucro Bruto"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="crescimentoEbitda" 
                fill="#f59e0b"
                name="Crescimento EBITDA"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Análise de Despesas */}
      <Card className="bg-gradient-card border border-executive-gray/30 shadow-card-executive hover:shadow-executive transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-primary">Análise de Despesas (% Receita Líquida)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.expenseData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${value.toFixed(0)}%`} />
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
               <Bar 
                dataKey="cmvPercent" 
                fill="#ef4444"
                name="CMV"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="vendasPercent" 
                fill="#f59e0b"
                name="Vendas e Marketing"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="adminPercent" 
                fill="#6b7280"
                name="Administrativas"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};