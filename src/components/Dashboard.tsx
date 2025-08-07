import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CSVUploader } from './CSVUploader';
import { YearSelector } from './YearSelector';
import { FinancialMetrics } from './FinancialMetrics';
import { IndicatorCharts } from './IndicatorCharts';
import { SimpleIndicators } from './SimpleIndicators';
import { BarChart3, Calculator, TrendingUp, FileText, ExternalLink } from 'lucide-react';
import { Footer } from './Footer';
import { ThemeToggle } from './ThemeToggle';

interface FinancialData {
  Indicador: string;
  [year: string]: string | number;
}

export const Dashboard = () => {
  const [data, setData] = useState<FinancialData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');

  const years = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'Indicador' && !isNaN(Number(key))).sort()
    : [];

  const handleDataLoad = (newData: FinancialData[]) => {
    setData(newData);
    const availableYears = Object.keys(newData[0] || {})
      .filter(key => key !== 'Indicador' && !isNaN(Number(key)))
      .sort();
    setSelectedYear(availableYears[availableYears.length - 1] || '');
  };

  const getPreviousYear = () => {
    const currentIndex = years.indexOf(selectedYear);
    return currentIndex > 0 ? years[currentIndex - 1] : selectedYear;
  };

  if (data.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-dark-surface to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 relative">
              <div className="absolute top-0 right-4">
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-center mb-6">
                 <img 
                  src="/src/assets/balance-logo.png" 
                  alt="Balancê" 
                  className="h-20 w-auto"
                />
              </div>
               <h1 className="text-4xl font-bold text-primary-blue mb-4 font-sans">
                Balancê
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
                Análise Estratégica - Natura S/A
              </p>
            </div>

            {/* Upload Card */}
            <div className="max-w-2xl mx-auto">
              <CSVUploader onDataLoad={handleDataLoad} />
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                {
                  icon: <BarChart3 className="h-8 w-8 text-primary-blue" />,
                  title: "Métricas Principais",
                  description: "ROE, ROA, Margem Líquida e mais"
                },
                {
                  icon: <TrendingUp className="h-8 w-8 text-success-green" />,
                  title: "Evolução Temporal",
                  description: "Gráficos interativos de tendências"
                },
                {
                  icon: <Calculator className="h-8 w-8 text-warning-orange" />,
                  title: "Indicadores Avançados",
                  description: "Análise DuPont e indicadores de atividade"
                },
                {
                  icon: <FileText className="h-8 w-8 text-primary-blue-light" />,
                  title: "Relatório Completo",
                  description: "Mais de 20 indicadores calculados"
                }
              ].map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-lg bg-gradient-card border border-corporate-gray-light shadow-card-executive hover:shadow-executive transition-all duration-300 group">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-primary-blue mb-2 font-sans">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-dark-surface to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
             <img 
              src="/src/assets/balance-logo.png" 
              alt="Balancê" 
              className="h-14 w-auto"
            />
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-primary-blue font-sans">
                  Balancê
                </h1>
                <p className="text-muted-foreground font-sans">
                  Análise Estratégica - Natura S/A
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/indicadores-economicos">
                  <Button variant="outline" size="sm" className="border-border hover:bg-muted">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Indicadores Econômicos
                  </Button>
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-80">
            <YearSelector 
              years={years}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto lg:inline-grid grid-cols-2 lg:grid-cols-4 bg-dark-surface-elevated border border-corporate-gray-light shadow-card-executive">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white data-[state=active]:shadow-executive transition-all duration-300 font-medium"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="charts" 
              className="data-[state=active]:bg-success-green data-[state=active]:text-white data-[state=active]:shadow-success transition-all duration-300 font-medium"
            >
              Gráficos
            </TabsTrigger>
            <TabsTrigger 
              value="indicators" 
              className="data-[state=active]:bg-warning-orange data-[state=active]:text-white data-[state=active]:shadow-executive transition-all duration-300 font-medium"
            >
              Indicadores
            </TabsTrigger>
            <TabsTrigger 
              value="upload" 
              className="data-[state=active]:bg-primary-blue-dark data-[state=active]:text-white data-[state=active]:shadow-executive transition-all duration-300 font-medium"
            >
              Dados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <FinancialMetrics 
              data={data}
              selectedYear={selectedYear}
              previousYear={getPreviousYear()}
            />
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <IndicatorCharts 
              data={data}
              years={years}
            />
          </TabsContent>

          <TabsContent value="indicators" className="space-y-6">
            <SimpleIndicators 
              data={data}
              selectedYear={selectedYear}
              previousYear={getPreviousYear()}
            />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <CSVUploader onDataLoad={handleDataLoad} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};