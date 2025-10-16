'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { sendToGoogleSheets } from '@/lib/sheets-client';
import { Professor, FeedbackFormData, RATING_DESCRIPTIONS } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingScale } from '@/components/RatingScale';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Tipagem da linha que vem do Supabase (colunas originais)
type RawProfessor = {
  REGIONAL: string;
  Cadastro: string;
  Nome: string;
  Admissão: string | null;
  CPF: string;
  Cargo: string;
  Local: string;
  ESCOLA: string;
  Horas_Mes: string | number | null;
  Horas_Semana: string | number | null;
};

// Utilitário para usar no ILIKE com segurança
const escapeILike = (s: string) =>
  s.replace(/[%_]/g, (m) => `\\${m}`).replace(/\s+/g, ' ').trim();

export default function FormPage() {
  // 🔻 REMOVIDO: controle de usuário/autenticação
  // const [user, setUser] = useState<any>(null);
  // const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  // Unidades vindas do banco
  const [unidades, setUnidades] = useState<string[]>([]);
  const [loadingUnidades, setLoadingUnidades] = useState(true);

  // Seleção e lista de professores
  const [selectedUnidade, setSelectedUnidade] = useState('');
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loadingProfessores, setLoadingProfessores] = useState(false);

  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [formData, setFormData] = useState<Partial<FeedbackFormData>>({
    planejamento: undefined,
    didatica: undefined,
    comunicacao: undefined,
    postura: undefined,
    consideracoes: '',
  });

  const { toast } = useToast();

  // 🔻 REMOVIDO: efeito de auth/redirect
  // useEffect(() => { ... }, []);

  // ======== CARREGAR UNIDADES (valores reais de ESCOLA) ========
  useEffect(() => {
    (async () => {
      try {
        setLoadingUnidades(true);
        const { data, error } = await supabase
          .from('dados_professores')
          .select('ESCOLA')
          .neq('ESCOLA', null)
          .order('ESCOLA', { ascending: true });

        if (error) throw error;

        const uniq = Array.from(
          new Set((data || []).map((r: any) => (r.ESCOLA || '').replace(/\s+/g, ' ').trim()))
        ).filter(Boolean);

        setUnidades(uniq);
      } catch (err: any) {
        console.error(err);
        toast({ title: 'Erro ao carregar unidades', description: err.message, variant: 'destructive' });
      } finally {
        setLoadingUnidades(false);
      }
    })();
  }, [toast]);

  // ======== BUSCAR PROFESSORES POR UNIDADE ========
  const fetchProfessoresByUnidade = async (unidade: string) => {
    setLoadingProfessores(true);
    setSelectedProfessor(null);
    try {
      const alvo = unidade;

      // 1) match exato
      let { data, error } = await supabase
        .from('dados_professores')
        .select('REGIONAL, Cadastro, Nome, "Admissão", CPF, Cargo, Local, ESCOLA, "Horas_Mes", "Horas_Semana"')
        .eq('ESCOLA', alvo)
        .order('Nome', { ascending: true });

      if (error) throw error;

      // 2) fallback: ILIKE %alvo%
      if (!data || data.length === 0) {
        const pattern = `%${escapeILike(alvo)}%`;
        const { data: data2, error: error2 } = await supabase
          .from('dados_professores')
          .select('REGIONAL, Cadastro, Nome, "Admissão", CPF, Cargo, Local, ESCOLA, "Horas_Mes", "Horas_Semana"')
          .ilike('ESCOLA', pattern)
          .order('Nome', { ascending: true });
        if (error2) throw error2;
        data = data2 ?? [];
      }

      const mapped: Professor[] = (data as RawProfessor[]).map((row) => ({
        REGIONAL: row.REGIONAL ?? '',
        Cadastro: String(row.Cadastro ?? ''),
        Nome: row.Nome ?? '',
        Admissao: row['Admissão'] ?? '',
        CPF: row.CPF ?? '',
        Cargo: row.Cargo ?? '',
        Local: row.Local ?? '',
        ESCOLA: row.ESCOLA ?? '',
        ['Horas Mes']: row.Horas_Mes != null ? String(row.Horas_Mes) : '',
        ['Horas Semana']: row.Horas_Semana != null ? String(row.Horas_Semana) : '',
      }));

      setProfessores(mapped);
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Erro ao carregar professores',
        description: err.message || 'Não foi possível buscar os professores da unidade.',
        variant: 'destructive',
      });
      setProfessores([]);
    } finally {
      setLoadingProfessores(false);
    }
  };

  const handleUnidadeChange = (unidade: string) => {
    setSelectedUnidade(unidade);
    if (unidade) fetchProfessoresByUnidade(unidade);
  };

  const handleProfessorChange = (cadastro: string) => {
    const professor = professores.find((p) => p.Cadastro === cadastro);
    setSelectedProfessor(professor || null);
  };

  // 🔻 REMOVIDO: logout
  // const handleLogout = async () => { ... }

  // ======== SUBMIT ========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProfessor) {
      toast({
        title: 'Selecione um professor',
        description: 'Por favor, selecione um professor antes de enviar.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.planejamento || !formData.didatica || !formData.comunicacao || !formData.postura) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todas as avaliações.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const feedbackData: FeedbackFormData = {
        unidade: selectedUnidade,
        nome_professor: selectedProfessor.Nome,
        regional: selectedProfessor.REGIONAL,
        cadastro: selectedProfessor.Cadastro,
        admissao: selectedProfessor.Admissao,
        cpf: selectedProfessor.CPF,
        cargo: selectedProfessor.Cargo,
        local: selectedProfessor.Local,
        escola: selectedProfessor.ESCOLA,
        horas_mes: selectedProfessor['Horas Mes'],
        horas_semana: selectedProfessor['Horas Semana'],
        planejamento: formData.planejamento!,
        didatica: formData.didatica!,
        comunicacao: formData.comunicacao!,
        postura: formData.postura!,
        consideracoes: formData.consideracoes || '',
      };

      // ✅ Insert público: não enviar user_id
      const { error: supabaseError } = await supabase
        .from('feedback_professores')
        .insert([{user_id: '123456', ...feedbackData }]);

      if (supabaseError) throw supabaseError;

      // ✅ Google Sheets sem autenticação do usuário (use identificador genérico)
      try {
        await sendToGoogleSheets({
          user_id: 'Anônimo',
          user_name: 'Anônimo',
          ...feedbackData,
        });
      } catch (sheetsError) {
        console.error('Erro ao enviar para Google Sheets:', sheetsError);
      }

      toast({
        title: 'Feedback registrado com sucesso!',
        description: 'O feedback foi salvo e enviado.',
      });

      // Reset do formulário
      setSelectedUnidade('');
      setSelectedProfessor(null);
      setProfessores([]);
      setFormData({
        planejamento: undefined,
        didatica: undefined,
        comunicacao: undefined,
        postura: undefined,
        consideracoes: '',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar feedback',
        description: error.message || 'Ocorreu um erro ao tentar salvar o feedback.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 🔻 REMOVIDO: tela de loading por causa de auth
  // if (loading) { ... }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rede APOGEU</h1>
            <p className="text-sm text-gray-600">Avaliação Docente</p>
          </div>

          {/* 🔻 REMOVIDO: bloco de usuário e botão Sair */}
          {/* <div className="flex items-center gap-4"> ... </div> */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Etapa 1 - Seleção da Unidade e Professor</CardTitle>
              <CardDescription>Selecione a unidade e o professor que será avaliado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* UNIDADE */}
              <div className="space-y-2">
                <Label htmlFor="unidade">Selecione a Unidade *</Label>
                <Select value={selectedUnidade} onValueChange={handleUnidadeChange}>
                  <SelectTrigger id="unidade">
                    <SelectValue placeholder={loadingUnidades ? 'Carregando unidades...' : 'Escolha uma unidade'} />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                    {!loadingUnidades && unidades.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">Nenhuma unidade encontrada.</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* PROFESSOR */}
              <div className="space-y-2">
                <Label htmlFor="professor">Selecione o Professor *</Label>
                <Select
                  value={selectedProfessor?.Cadastro || ''}
                  onValueChange={handleProfessorChange}
                  disabled={!selectedUnidade || loadingProfessores}
                >
                  <SelectTrigger id="professor">
                    <SelectValue placeholder={loadingProfessores ? 'Carregando...' : 'Escolha um professor'} />
                  </SelectTrigger>
                  <SelectContent>
                    {professores.map((professor) => (
                      <SelectItem
                        key={professor.Cadastro}
                        value={professor.Cadastro}
                      >
                        {professor.Nome} — {professor.Cargo} ({professor.Cadastro})
                      </SelectItem>
                    ))}
                    {!loadingProfessores && professores.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">Nenhum professor para esta unidade.</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* DADOS DO PROFESSOR */}
              {selectedProfessor && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Regional</Label>
                    <Input value={selectedProfessor.REGIONAL} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Cadastro</Label>
                    <Input value={selectedProfessor.Cadastro} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Admissão</Label>
                    <Input value={selectedProfessor.Admissao} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <Input value={selectedProfessor.CPF} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Cargo</Label>
                    <Input value={selectedProfessor.Cargo} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Local</Label>
                    <Input value={selectedProfessor.Local} readOnly />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Escola</Label>
                    <Input value={selectedProfessor.ESCOLA} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Horas Mês</Label>
                    <Input value={selectedProfessor['Horas Mes']} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Horas Semana</Label>
                    <Input value={selectedProfessor['Horas Semana']} readOnly />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AVALIAÇÃO */}
          {selectedProfessor && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Etapa 2 - Avaliação</CardTitle>
                  <CardDescription>Avalie o desempenho do professor em cada critério</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RatingScale
                    title={RATING_DESCRIPTIONS.planejamento.title}
                    question={RATING_DESCRIPTIONS.planejamento.question}
                    options={RATING_DESCRIPTIONS.planejamento.options}
                    value={formData.planejamento || null}
                    onChange={(value) => setFormData({ ...formData, planejamento: value })}
                    name="planejamento"
                  />
                  <RatingScale
                    title={RATING_DESCRIPTIONS.didatica.title}
                    question={RATING_DESCRIPTIONS.didatica.question}
                    options={RATING_DESCRIPTIONS.didatica.options}
                    value={formData.didatica || null}
                    onChange={(value) => setFormData({ ...formData, didatica: value })}
                    name="didatica"
                  />
                  <RatingScale
                    title={RATING_DESCRIPTIONS.comunicacao.title}
                    question={RATING_DESCRIPTIONS.comunicacao.question}
                    options={RATING_DESCRIPTIONS.comunicacao.options}
                    value={formData.comunicacao || null}
                    onChange={(value) => setFormData({ ...formData, comunicacao: value })}
                    name="comunicacao"
                  />
                  <RatingScale
                    title={RATING_DESCRIPTIONS.postura.title}
                    question={RATING_DESCRIPTIONS.postura.question}
                    options={RATING_DESCRIPTIONS.postura.options}
                    value={formData.postura || null}
                    onChange={(value) => setFormData({ ...formData, postura: value })}
                    name="postura"
                  />
                  <div className="space-y-2">
                    <Label htmlFor="consideracoes">Considerações Finais</Label>
                    <Textarea
                      id="consideracoes"
                      placeholder="Escreva suas considerações finais sobre o professor..."
                      value={formData.consideracoes}
                      onChange={(e) => setFormData({ ...formData, consideracoes: e.target.value })}
                      rows={5}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Feedback'
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </main>
    </div>
  );
}
