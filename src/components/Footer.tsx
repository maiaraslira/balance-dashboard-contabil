import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="mt-auto py-8 border-t bg-gradient-to-r from-background via-dark-surface/50 to-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <Card className="p-8 bg-gradient-card border border-executive-gray/20 shadow-card-executive hover:shadow-executive transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            {/* Equipe */}
            <div className="space-y-3">
              <h3 className="font-semibold text-golden-accent text-lg border-b border-golden-accent/30 pb-2 mb-3">
                Equipe
              </h3>
              <div className="text-sm text-muted-foreground leading-relaxed">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <span className="hover:text-foreground transition-colors duration-200">Adna Farias</span>
                  <span className="hover:text-foreground transition-colors duration-200">Maiara Lira</span>
                  <span className="hover:text-foreground transition-colors duration-200">Beatriz Freire</span>
                  <span className="hover:text-foreground transition-colors duration-200">Mario da Mota</span>
                  <span className="hover:text-foreground transition-colors duration-200">José Leandro</span>
                  <span className="hover:text-foreground transition-colors duration-200">Sara Simone</span>
                  <span className="hover:text-foreground transition-colors duration-200">Lucas Américo</span>
                  <span className="hover:text-foreground transition-colors duration-200">Vinicius Nobre</span>
                </div>
              </div>
            </div>

            {/* Separator */}
            <Separator orientation="vertical" className="hidden md:block h-auto bg-executive-gray/30" />

            {/* Disciplina e Professor */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-burnt-orange text-lg border-b border-burnt-orange/30 pb-2 mb-3">
                  Disciplina
                </h3>
                <p className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Contabilidade de Custos e Gerencial
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-accent-warm text-lg border-b border-accent-warm/30 pb-2 mb-3">
                  Professor
                </h3>
                <p className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Marcelo Jota Gomes
                </p>
              </div>
            </div>
          </div>
          
          {/* Bottom border with gradient */}
          <div className="mt-6 pt-4 border-t border-executive-gray/20">
            <div className="text-center">
              <div className="w-16 h-0.5 bg-gradient-to-r from-golden-accent via-burnt-orange to-accent-warm mx-auto animate-pulse"></div>
            </div>
          </div>
        </Card>
      </div>
    </footer>
  );
};