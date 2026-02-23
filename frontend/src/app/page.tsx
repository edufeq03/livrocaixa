import React from 'react';
import MeiCalculator from '@/components/MeiCalculator';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Laptop, Layout, Users, FileText } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <FileText className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight">LivroCaixa</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#calculator" className="hover:text-primary transition-colors">Calculadora</Link>
            <Link href="#features" className="hover:text-primary transition-colors">Funcionalidades</Link>
            <Link href="/login" className="bg-secondary text-secondary-foreground px-5 py-2 rounded-xl hover:bg-secondary/80 transition-all">Entrar</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3 h-3" />
              SaaS White-Label para Contadores
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
              A gestão financeira que o seu <span className="text-primary italic">cliente</span> merece.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Simplifique o livro caixa dos seus clientes MEI e facilite a migração para o Simples Nacional com total controle contábil.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/login" className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                Começar agora <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#calculator" className="bg-secondary text-secondary-foreground px-8 py-4 rounded-2xl font-bold hover:bg-secondary/80 transition-all">
                Ver calculadora
              </Link>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-accent/10 rounded-[3rem] blur-3xl group-hover:opacity-75 transition-opacity" />
            <div className="relative glass border border-white/20 rounded-[2.5rem] shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
              <div className="text-center p-12 space-y-4">
                <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Laptop className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Dashboard Multi-Tenant</h3>
                <p className="text-muted-foreground">Interface premium para escritórios de contabilidade e empresas clientes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-24 bg-secondary/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Você está pagando impostos a mais?</h2>
            <p className="text-lg text-muted-foreground">
              Microempreendedores que faturam acima de R$ 60k/ano podem economizar muito migrando para o Simples Nacional. Calcule agora.
            </p>
          </div>
          <MeiCalculator />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-secondary/50 border border-border hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layout className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">White-Label Completo</h3>
              <p className="text-muted-foreground leading-relaxed">Customize logos, cores e domínios para cada um dos seus escritórios parceiros.</p>
            </div>
            <div className="p-8 rounded-3xl bg-secondary/50 border border-border hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Gestão Centralizada</h3>
              <p className="text-muted-foreground leading-relaxed">O contador visualiza todas as transações de todos os clientes em um único painel.</p>
            </div>
            <div className="p-8 rounded-3xl bg-secondary/50 border border-border hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Segurança Total</h3>
              <p className="text-muted-foreground leading-relaxed">Isolamento rigoroso de dados entre tenants e backups automáticos garantidos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">MEI vs Simples Nacional: O que muda?</h2>
          <div className="overflow-hidden rounded-3xl border border-border shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="p-6 font-bold border-b">Recurso</th>
                  <th className="p-6 font-bold border-b">MEI</th>
                  <th className="p-6 font-bold border-b text-primary">Simples Nacional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-6 font-medium">Teto de Faturamento</td>
                  <td className="p-6 text-muted-foreground">R$ 81.000 / ano</td>
                  <td className="p-6 font-semibold">Até R$ 4,8 Milhões / ano</td>
                </tr>
                <tr>
                  <td className="p-6 font-medium">Funcionários</td>
                  <td className="p-6 text-muted-foreground">Máximo 1</td>
                  <td className="p-6 font-semibold">Sem restrições</td>
                </tr>
                <tr>
                  <td className="p-6 font-medium">Atividades Permitidas</td>
                  <td className="p-6 text-muted-foreground">Limitadas</td>
                  <td className="p-6 font-semibold">Quase todas as atividades</td>
                </tr>
                <tr>
                  <td className="p-6 font-medium">Crescimento</td>
                  <td className="p-6 text-muted-foreground text-sm italic">Limitado pelo teto</td>
                  <td className="p-6 font-semibold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Escalabilidade livre</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border text-center text-muted-foreground text-sm">
        <p>&copy; 2026 LivroCaixa SaaS. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
