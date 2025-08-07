import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface CSVUploaderProps {
  onDataLoad: (data: any[]) => void;
}

export const CSVUploader = ({ onDataLoad }: CSVUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: any = {};
      headers.forEach((header, index) => {
        const value = values[index];
        obj[header] = isNaN(Number(value)) ? value : Number(value);
      });
      return obj;
    });
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, envie apenas arquivos CSV.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const text = await file.text();
      const data = parseCSV(text);
      onDataLoad(data);
      setUploadedFile(file.name);
      toast({
        title: "Arquivo carregado com sucesso!",
        description: `${data.length} indicadores financeiros foram importados.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao processar arquivo",
        description: "Verifique se o arquivo CSV está no formato correto.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [onDataLoad, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Card className="w-full bg-gradient-card border border-executive-gray/30 shadow-card-executive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-burnt-orange" />
          Upload dos Dados Financeiros
        </CardTitle>
        <CardDescription>
          Envie o arquivo CSV com os indicadores financeiros da Natura S/A
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            isDragOver
              ? 'border-burnt-orange bg-burnt-orange/10 shadow-executive'
              : uploadedFile
              ? 'border-positive bg-positive/10 shadow-card-executive'
              : 'border-executive-gray/50 hover:border-burnt-orange/70 hover:bg-burnt-orange/5'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          {uploadedFile ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="h-12 w-12 text-positive" />
              <div>
                <p className="font-medium text-positive">Arquivo carregado</p>
                <p className="text-sm text-muted-foreground">{uploadedFile}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => document.getElementById('csv-input')?.click()}
              >
                Carregar outro arquivo
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Upload className={`h-12 w-12 ${isDragOver ? 'text-burnt-orange' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-lg font-medium">
                  {isLoading ? 'Processando arquivo...' : 'Arraste o arquivo CSV aqui'}
                </p>
                <p className="text-sm text-muted-foreground">
                  ou clique para selecionar um arquivo
                </p>
              </div>
              <Button
                variant="executive"
                onClick={() => document.getElementById('csv-input')?.click()}
                disabled={isLoading}
              >
                Selecionar arquivo
              </Button>
            </div>
          )}
        </div>
        <input
          id="csv-input"
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};