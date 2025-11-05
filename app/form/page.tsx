'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { sendToGoogleSheets } from '@/lib/sheets-client';
import { Professor as BaseProfessor, FeedbackFormData as BaseFeedbackFormData, RATING_DESCRIPTIONS } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingScale } from '@/components/RatingScale';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2 } from 'lucide-react'; // ⭐ novo ícone

// ===== Tipagens locais =====
type RawProfessor = {
  REGIONAL: string;
  Cadastro: string | number;
  Nome: string;
  'Admissão': string | null;
  CPF: string;
  Cargo: string;
  Local: string;
  ESCOLA: string;
  Horas_Mes: string | number | null;
  Horas_Semana: string | number | null;

  // Novas colunas
  tempo_casa_mes: number | null;
  total_carga_horaria: number | null;
  horas_faltas_injustificadas: number | null;
  porcentagem_horas_faltas_injustificadas: string | null;
  horas_faltas_justificadas: number | null;
  porcentagem_horas_faltas_justificadas: string | null;
};

type Professor = BaseProfessor & {
  tempo_casa_mes?: string;
  total_carga_horaria?: string;
  horas_faltas_injustificadas?: string;
  porcentagem_horas_faltas_injustificadas?: string;
  horas_faltas_justificadas?: string;
  porcentagem_horas_faltas_justificadas?: string;
};

type FeedbackFormData = BaseFeedbackFormData & {
  tempo_casa_mes?: string;
  total_carga_horaria?: string;
  horas_faltas_injustificadas?: string;
  porcentagem_horas_faltas_injustificadas?: string;
  horas_faltas_justificadas?: string;
  porcentagem_horas_faltas_justificadas?: string;
};

const escapeILike = (s: string) =>
  s.replace(/[%_]/g, (m) => `\\${m}`).replace(/\s+/g, ' ').trim();

export default function FormPage() {
  const [submitting, setSubmitting] = useState(false);

  // ⭐ estado do validador visual de sucesso
  const [submitted, setSubmitted] = useState(false);

  // Unidades vindas do banco
  const [unidades, setUnidades] = useState<string[]>([]);
  const [loadingUnidades, setLoadingUnidades] = useState(true);

  // Seleção e lista de professores
  const [selectedUnidade, setSelectedUnidade] = useState('');
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loadingProfessores, setLoadingProfessores] = useState(false);

  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [formData, setFormData] = useState<Partial<FeedbackFormData>>({
    observacoes_sala_aula: undefined,
    feedback: undefined,
    feedback_evolucao: undefined,
    planejamento_org: undefined,
    dominio_conteudo: undefined,
    gestao_aprendizagem: undefined,
    comunicacao_rel: undefined,
    postura_prof: undefined,
    consideracoes: '',
  });

  const { toast } = useToast();

  // ======== CARREGAR UNIDADES ========
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

      const baseSelect =
        'REGIONAL, Cadastro, Nome, "Admissão", CPF, Cargo, Local, ESCOLA, "Horas_Mes", "Horas_Semana", ' +
        'tempo_casa_mes, total_carga_horaria, horas_faltas_injustificadas, porcentagem_horas_faltas_injustificadas, horas_faltas_justificadas, porcentagem_horas_faltas_justificadas';

      let { data, error } = await supabase
        .from('dados_professores')
        .select(baseSelect)
        .eq('ESCOLA', alvo)
        .order('Nome', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        const pattern = `%${escapeILike(alvo)}%`;
        const { data: data2, error: error2 } = await supabase
          .from('dados_professores')
          .select(baseSelect)
          .ilike('ESCOLA', pattern)
          .order('Nome', { ascending: true });
        if (error2) throw error2;
        data = data2 ?? [];
      }

      const rows = (Array.isArray(data) ? data : []) as unknown as RawProfessor[];

      const mapped: Professor[] = rows.map((row) => ({
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

        // Novos campos
        tempo_casa_mes: row.tempo_casa_mes != null ? String(row.tempo_casa_mes) : '',
        total_carga_horaria: row.total_carga_horaria != null ? String(row.total_carga_horaria) : '',
        horas_faltas_injustificadas:
          row.horas_faltas_injustificadas != null ? String(row.horas_faltas_injustificadas) : '',
        porcentagem_horas_faltas_injustificadas:
          row.porcentagem_horas_faltas_injustificadas ?? '',
        horas_faltas_justificadas:
          row.horas_faltas_justificadas != null ? String(row.horas_faltas_justificadas) : '',
        porcentagem_horas_faltas_justificadas:
          row.porcentagem_horas_faltas_justificadas ?? '',
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

    // Correção de validação
    if (
      formData.observacoes_sala_aula === undefined ||
      formData.feedback === undefined ||
      formData.feedback_evolucao === undefined ||
      formData.planejamento_org === undefined ||
      formData.dominio_conteudo === undefined ||
      formData.gestao_aprendizagem === undefined ||
      formData.comunicacao_rel === undefined ||
      formData.postura_prof === undefined
    ) {
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

        // Novos
        tempo_casa_mes: selectedProfessor.tempo_casa_mes ?? '',
        total_carga_horaria: selectedProfessor.total_carga_horaria ?? '',
        horas_faltas_injustificadas: selectedProfessor.horas_faltas_injustificadas ?? '',
        porcentagem_horas_faltas_injustificadas:
          selectedProfessor.porcentagem_horas_faltas_injustificadas ?? '',
        horas_faltas_justificadas: selectedProfessor.horas_faltas_justificadas ?? '',
        porcentagem_horas_faltas_justificadas:
          selectedProfessor.porcentagem_horas_faltas_justificadas ?? '',

        observacoes_sala_aula: formData.observacoes_sala_aula!,
        feedback_evolucao: formData.feedback_evolucao!,
        planejamento_org: formData.planejamento_org!,
        dominio_conteudo: formData.dominio_conteudo!,
        gestao_aprendizagem: formData.gestao_aprendizagem!,
        comunicacao_rel: formData.comunicacao_rel!,
        postura_prof: formData.postura_prof!,
        consideracoes: formData.consideracoes || '',
        feedback: formData.feedback!,
      };

      console.log(feedbackData);
      const { error: supabaseError } = await supabase
        .from('feedback_professores')
        .insert([{ user_id: '123456', ...feedbackData }]);

      if (supabaseError) throw supabaseError;

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

      // ⭐ exibir banner de confirmação
      setSubmitted(true);
      // opcional: rolar para o topo para ver a confirmação
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      // ocultar automaticamente após 6s
      setTimeout(() => setSubmitted(false), 6000);

      // Reset
      setSelectedUnidade('');
      setSelectedProfessor(null);
      setProfessores([]);
      setFormData({
        observacoes_sala_aula: undefined,
        feedback: undefined,
        feedback_evolucao: undefined,
        planejamento_org: undefined,
        dominio_conteudo: undefined,
        gestao_aprendizagem: undefined,
        comunicacao_rel: undefined,
        postura_prof: undefined,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">APG GOV</h1>
            <p className="text-sm text-gray-600">Acompanhamento Docente</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ⭐ Banner de confirmação persistente/temporário */}
          {submitted && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-start gap-3 rounded-md border border-green-200 bg-green-50 p-4 text-green-900 shadow-sm"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
              <div>
                <p className="font-medium">Sua resposta foi enviada.</p>
                <p className="text-sm text-green-800">
                  Obrigado por contribuir com o acompanhamento docente do APGGov.
                </p>
              </div>
            </div>
          )}

          {/* ===== Card Inicial (Apresentação) ===== */}
          <Card>
            <CardContent className="space-y-4 leading-relaxed text-gray-800">
              <p>
                A Pesquisa de Acompanhamento Docente tem como finalidade analisar, valorizar e
                aprimorar a prática pedagógica dos(as) professores(as) contratados(as) pelo APGGov.
              </p>
              <p>
                Além disso, queremos colher as suas observações (enquanto Diretor/a Pedagógico/a) sobre o ano de 2025.
                A partir da sua perspectiva, poderemos planejar o ano de 2026 com a máxima qualidade.
              </p>
              <p>
                Ressaltamos que esta pesquisa deve ser preenchida exclusivamente pelo(a) Diretor(a)
                Pedagógico do Colégio.
              </p>
              <p>
                Para cada professor(a), avalie os critérios utilizando a escala e as descrições fornecidas.
                As descrições ajudam a calibrar a avaliação, garantindo uma análise consistente e baseada em
                evidências observáveis.
              </p>
              <p>
                Muito obrigado pela sua participação. Ela é muito valiosa para o APGGov.
              </p>
            </CardContent>
          </Card>

          {/* ===== Etapa 1 ===== */}
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
                      <SelectItem key={professor.Cadastro} value={professor.Cadastro}>
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

                  {/* NOVOS CAMPOS */}
                  <div className="space-y-2">
                    <Label>Tempo de Casa (meses)</Label>
                    <Input value={selectedProfessor.tempo_casa_mes ?? ''} readOnly />
                    {selectedProfessor.tempo_casa_mes === '0' && (
                      <div className="text-sm text-gray-500 mt-2">
                        Nos casos em que o tempo de casa é zerado e a carga horária é negativa, significa que o professor foi admitido no mês de outubro.
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Total Carga Horária</Label>
                    <Input value={selectedProfessor.total_carga_horaria ?? ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Horas de Faltas Injustificadas</Label>
                    <Input value={selectedProfessor.horas_faltas_injustificadas ?? ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>% Horas Faltas Injustificadas</Label>
                    <Input value={selectedProfessor.porcentagem_horas_faltas_injustificadas ?? ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Horas de Faltas justificadas</Label>
                    <Input value={selectedProfessor.horas_faltas_justificadas ?? ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>% Horas Faltas justificadas</Label>
                    <Input value={selectedProfessor.porcentagem_horas_faltas_justificadas ?? ''} readOnly />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ===== Etapa 2 - Avaliação ===== */}
          {selectedProfessor && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Etapa 2 - Avaliação</CardTitle>
                  <CardDescription>Avalie o desempenho do professor em cada critério</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RatingScale
                    title={RATING_DESCRIPTIONS.postura_prof.title}
                    question={RATING_DESCRIPTIONS.postura_prof.question}
                    options={RATING_DESCRIPTIONS.postura_prof.options}
                    value={formData.postura_prof || null}
                    onChange={(value) => setFormData({ ...formData, postura_prof: value })}
                    name="postura_prof"
                  />
                  <RatingScale
                    title={RATING_DESCRIPTIONS.observacoes_sala_aula.title}
                    question={RATING_DESCRIPTIONS.observacoes_sala_aula.question}
                    options={RATING_DESCRIPTIONS.observacoes_sala_aula.options}
                    value={formData.observacoes_sala_aula || null}
                    onChange={(value) => setFormData({ ...formData, observacoes_sala_aula: value })}
                    name="observacoes_sala_aula"
                  />
                  <RatingScale
                    title={RATING_DESCRIPTIONS.feedback.title}
                    question={RATING_DESCRIPTIONS.feedback.question}
                    options={RATING_DESCRIPTIONS.feedback.options}
                    value={formData.feedback || null}
                    onChange={(value) => setFormData({ ...formData, feedback: value })}
                    name="feedback"
                  />
                  <RatingScale
                    title={RATING_DESCRIPTIONS.feedback_evolucao.title}
                    question={RATING_DESCRIPTIONS.feedback_evolucao.question}
                    options={RATING_DESCRIPTIONS.feedback_evolucao.options}
                    value={formData.feedback_evolucao || null}
                    onChange={(value) => setFormData({ ...formData, feedback_evolucao: value })}
                    name="feedback_evolucao"
                  />
                  <RatingScale
                    title={RATING_DESCRIPTIONS.planejamento_org.title}
                    question={RATING_DESCRIPTIONS.planejamento_org.question}
                    options={RATING_DESCRIPTIONS.planejamento_org.options}
                    value={formData.planejamento_org || null}
                    onChange={(value) => setFormData({ ...formData, planejamento_org: value })}
                    name="planejamento_org"
                  />
                  <RatingScale
                    title={RATING_DESCRIPTIONS.dominio_conteudo.title}
                    question={RATING_DESCRIPTIONS.dominio_conteudo.question}
                    options={RATING_DESCRIPTIONS.dominio_conteudo.options}
                    value={formData.dominio_conteudo || null}
                    onChange={(value) => setFormData({ ...formData, dominio_conteudo: value })}
                    name="dominio_conteudo"
                  />
                  <RatingScale
                    title={RATING_DESCRIPTIONS.gestao_aprendizagem.title}
                    question={RATING_DESCRIPTIONS.gestao_aprendizagem.question}
                    options={RATING_DESCRIPTIONS.gestao_aprendizagem.options}
                    value={formData.gestao_aprendizagem || null}
                    onChange={(value) => setFormData({ ...formData, gestao_aprendizagem: value })}
                    name="gestao_aprendizagem"
                  />
                  <RatingScale
                    title={RATING_DESCRIPTIONS.comunicacao_rel.title}
                    question={RATING_DESCRIPTIONS.comunicacao_rel.question}
                    options={RATING_DESCRIPTIONS.comunicacao_rel.options}
                    value={formData.comunicacao_rel || null}
                    onChange={(value) => setFormData({ ...formData, comunicacao_rel: value })}
                    name="comunicacao_rel"
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
