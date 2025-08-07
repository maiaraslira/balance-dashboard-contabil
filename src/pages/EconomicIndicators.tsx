import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { EconomicIndicators } from '@/components/EconomicIndicators';
import { CSVUploader } from '@/components/CSVUploader';
import { Footer } from '@/components/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';

interface FinancialData {
  Indicador: string;
  [year: string]: string | number;
}

const EconomicIndicatorsPage = () => {
  const [data, setData] = useState<FinancialData[]>([]);

  const years = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'Indicador' && !isNaN(Number(key))).sort()
    : [];

  const handleDataLoad = (newData: FinancialData[]) => {
    setData(newData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-dark-surface to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="border-border hover:bg-muted">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            </Link>
            
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/2240fbf5-992f-488c-97a6-5ee6a5fb65d1.png" 
                alt="Natura" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-primary-blue">
                  Indicadores Econômicos e Financeiros
                </h1>
                <p className="text-muted-foreground">
                  Natura S/A - Análise Detalhada
                </p>
              </div>
            </div>
          </div>
          
          <ThemeToggle />
        </div>

        {/* Content */}
        {data.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="bg-gradient-card border border-corporate-gray-light rounded-lg p-8 shadow-card-executive">
              <h2 className="text-xl font-semibold text-primary-blue mb-4">
                Carregue os Dados Financeiros
              </h2>
              <p className="text-muted-foreground mb-6">
                Para visualizar os indicadores econômicos e financeiros, faça o upload do arquivo CSV com os dados da empresa.
              </p>
              <CSVUploader onDataLoad={handleDataLoad} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {[
                {
                  title: "Endividamento Geral (EG)",
                  description: "Mede o grau de endividamento da empresa em relação ao ativo total"
                },
                {
                  title: "Liquidez Geral (LG)",
                  description: "Capacidade de pagamento de todas as obrigações da empresa"
                },
                {
                  title: "Liquidez Corrente (LC)",
                  description: "Capacidade de pagamento das obrigações de curto prazo"
                },
                {
                  title: "Liquidez Seca (LS)",
                  description: "Liquidez corrente excluindo os estoques"
                },
                {
                  title: "Giro do Ativo (GA)",
                  description: "Eficiência na utilização dos ativos para gerar receitas"
                },
                {
                  title: "ROA/ROI",
                  description: "Rentabilidade sobre o ativo total investido"
                }
              ].map((indicator, index) => (
                <div key={index} className="bg-dark-surface-elevated border border-corporate-gray-light rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-primary-blue mb-2">
                    {indicator.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {indicator.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EconomicIndicators data={data} years={years} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EconomicIndicatorsPage;