import { Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface YearSelectorProps {
  years: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
}

export const YearSelector = ({ years, selectedYear, onYearChange }: YearSelectorProps) => {
  const getPreviousYear = () => {
    const currentIndex = years.indexOf(selectedYear);
    return currentIndex > 0 ? years[currentIndex - 1] : selectedYear;
  };

  return (
    <Card className="bg-gradient-card border border-executive-gray/30 shadow-card-executive">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-burnt-orange">
          <Calendar className="h-5 w-5" />
          Filtros de Análise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Ano de Análise</label>
          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-3 bg-gradient-primary rounded-lg shadow-card-executive border border-burnt-orange/20">
            <div className="text-sm text-primary-foreground/70">Ano Atual</div>
            <div className="font-bold text-golden-accent">{selectedYear}</div>
          </div>
          <div className="text-center p-3 bg-dark-surface-elevated rounded-lg border border-executive-gray/30">
            <div className="text-sm text-muted-foreground">Comparação</div>
            <div className="font-bold text-burnt-orange-light">{getPreviousYear()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};