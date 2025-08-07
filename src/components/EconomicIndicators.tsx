import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, PieChart } from 'lucide-react';

interface FinancialData {
  Indicador: string;
  [year: string]: string | number;
}

interface EconomicIndicatorsProps {
  data: FinancialData[];
  years: string[];
}

export const EconomicIndicators = ({ data, years }: EconomicIndicatorsProps) => {
  const [selectedYear, setSelectedYear] = useState<string>(years[years.length - 1] || '');

  // Indicadores econômicos e financeiros específicos
  const economicIndicators = [
    'Endividamento Geral (EG)',
    'Liquidez Geral (LG)', 
    'Liquidez Corrente (LC)',
    'Liquidez Seca (LS)',
    'Giro do Ativo (GA)',
    'Rentabilidade do Ativo (ROA ou ROI)'
  ];

  // Filtrar dados para indicadores econômicos
  const economicData = data.filter(item => 
    economicIndicators.some(indicator => 
      item.Indicador.includes(indicator) || 
      indicator.includes(item.Indicador)
    )
  );

  // Preparar dados para gráficos
  const chartData = years.map(year => {
    const yearData: any = { year };
    economicData.forEach(item => {
      const key = item.Indicador.replace(/[()]/g, '').replace(/\s+/g, '_');
      yearData[key] = parseFloat(String(item[year])) || 0;
    });
    return yearData;
  });

  // Configuração de cores para os gráficos
  const chartConfig = {
    Endividamento_Geral_EG: {
      label: "Endividamento Geral",
      color: "hsl(var(--warning-orange))"
    },
    Liquidez_Geral_LG: {
      label: "Liquidez Geral",
      color: "hsl(var(--primary-blue))"
    },
    Liquidez_Corrente_LC: {
      label: "Liquidez Corrente", 
      color: "hsl(var(--success-green))"
    },
    Liquidez_Seca_LS: {
      label: "Liquidez Seca",
      color: "hsl(var(--primary-blue-light))"
    },
    Giro_do_Ativo_GA: {
      label: "Giro do Ativo",
      color: "hsl(var(--accent-green))"
    },
    Rentabilidade_do_Ativo_ROA_ou_ROI: {
      label: "ROA/ROI",
      color: "hsl(var(--success-green-dark))"
    }
  };

  // Função para calcular variação
  const calculateVariation = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Função para determinar status do indicador
  const getIndicatorStatus = (value: number, indicator: string) => {
    if (indicator.includes('Liquidez')) {
      return value >= 1 ? 'positive' : value >= 0.5 ? 'warning' : 'negative';
    }
    if (indicator.includes('Endividamento')) {
      return value <= 0.3 ? 'positive' : value <= 0.6 ? 'warning' : 'negative';
    }
    if (indicator.includes('ROA') || indicator.includes('Giro')) {
      return value >= 0.1 ? 'positive' : value >= 0.05 ? 'warning' : 'negative';
    }
    return 'neutral';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'text-success-green';
      case 'negative': return 'text-destructive-red';
      case 'warning': return 'text-warning-orange';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (value: number, previousValue: number) => {
    const variation = calculateVariation(value, previousValue);
    if (variation > 0) return <TrendingUp className="h-4 w-4 text-success-green" />;
    if (variation < 0) return <TrendingDown className="h-4 w-4 text-destructive-red" />;
    return <Activity className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary-blue mb-2">
            Indicadores Econômicos e Financeiros
          </h2>
          <p className="text-muted-foreground">
            Análise detalhada de liquidez, endividamento e rentabilidade
          </p>
        </div>
        
        <div className="w-full lg:w-48">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="bg-dark-surface-elevated border-corporate-gray-light">
              <SelectValue placeholder="Selecionar Ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards de Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {economicData.map((item, index) => {
          const currentValue = parseFloat(String(item[selectedYear])) || 0;
          const previousYear = years[years.indexOf(selectedYear) - 1];
          const previousValue = previousYear ? parseFloat(String(item[previousYear])) || 0 : 0;
          const variation = calculateVariation(currentValue, previousValue);
          const status = getIndicatorStatus(currentValue, item.Indicador);

          return (
            <Card key={index} className="bg-gradient-card border-corporate-gray-light shadow-card-executive hover:shadow-executive transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {index % 3 === 0 && <DollarSign className="h-5 w-5 text-primary-blue" />}
                    {index % 3 === 1 && <BarChart3 className="h-5 w-5 text-success-green" />}
                    {index % 3 === 2 && <PieChart className="h-5 w-5 text-warning-orange" />}
                  </div>
                  {getStatusIcon(currentValue, previousValue)}
                </div>
                <CardTitle className="text-sm font-medium text-foreground leading-tight">
                  {item.Indicador}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <span className={`text-2xl font-bold ${getStatusColor(status)}`}>
                      {currentValue.toFixed(4)}
                    </span>
                    <Badge 
                      variant={status === 'positive' ? 'default' : status === 'negative' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {status === 'positive' ? 'Bom' : status === 'negative' ? 'Ruim' : 'Médio'}
                    </Badge>
                  </div>
                  
                  {previousYear && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">vs {previousYear}</span>
                      <span className={variation >= 0 ? 'text-success-green' : 'text-destructive-red'}>
                        {variation > 0 ? '+' : ''}{variation.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full lg:w-auto lg:inline-grid grid-cols-3 bg-dark-surface-elevated border border-corporate-gray-light shadow-card-executive">
          <TabsTrigger 
            value="trends" 
            className="data-[state=active]:bg-primary-blue data-[state=active]:text-white data-[state=active]:shadow-executive"
          >
            Tendências
          </TabsTrigger>
          <TabsTrigger 
            value="liquidity"
            className="data-[state=active]:bg-success-green data-[state=active]:text-white data-[state=active]:shadow-success"
          >
            Liquidez
          </TabsTrigger>
          <TabsTrigger 
            value="performance"
            className="data-[state=active]:bg-warning-orange data-[state=active]:text-white data-[state=active]:shadow-executive"
          >
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-gradient-card border-corporate-gray-light shadow-card-executive">
            <CardHeader>
              <CardTitle className="text-primary-blue">Evolução dos Indicadores</CardTitle>
              <CardDescription>Tendência temporal de todos os indicadores econômicos</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--corporate-gray-light))" />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  {Object.entries(chartConfig).map(([key, config]) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={config.color}
                      strokeWidth={2}
                      dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                      name={config.label}
                    />
                  ))}
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="liquidity" className="space-y-6">
          <Card className="bg-gradient-card border-corporate-gray-light shadow-card-executive">
            <CardHeader>
              <CardTitle className="text-success-green">Indicadores de Liquidez</CardTitle>
              <CardDescription>Análise da capacidade de pagamento de curto prazo</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--corporate-gray-light))" />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="Liquidez_Geral_LG"
                    stackId="1"
                    stroke="hsl(var(--primary-blue))"
                    fill="hsl(var(--primary-blue))"
                    fillOpacity={0.3}
                    name="Liquidez Geral"
                  />
                  <Area
                    type="monotone"
                    dataKey="Liquidez_Corrente_LC"
                    stackId="2"
                    stroke="hsl(var(--success-green))"
                    fill="hsl(var(--success-green))"
                    fillOpacity={0.3}
                    name="Liquidez Corrente"
                  />
                  <Area
                    type="monotone"
                    dataKey="Liquidez_Seca_LS"
                    stackId="3"
                    stroke="hsl(var(--primary-blue-light))"
                    fill="hsl(var(--primary-blue-light))"
                    fillOpacity={0.3}
                    name="Liquidez Seca"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-gradient-card border-corporate-gray-light shadow-card-executive">
            <CardHeader>
              <CardTitle className="text-warning-orange">Performance e Eficiência</CardTitle>
              <CardDescription>Endividamento, giro do ativo e rentabilidade</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--corporate-gray-light))" />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    dataKey="Endividamento_Geral_EG"
                    fill="hsl(var(--warning-orange))"
                    name="Endividamento Geral"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="Giro_do_Ativo_GA"
                    fill="hsl(var(--accent-green))"
                    name="Giro do Ativo"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="Rentabilidade_do_Ativo_ROA_ou_ROI"
                    fill="hsl(var(--success-green-dark))"
                    name="ROA/ROI"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};