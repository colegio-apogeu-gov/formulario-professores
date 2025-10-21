export interface Professor {
  REGIONAL: string;
  Cadastro: string;
  Nome: string;
  Admissao: string;
  CPF: string;
  Cargo: string;
  Local: string;
  ESCOLA: string;
  'Horas Mes': string;
  'Horas Semana': string;
}

export interface FeedbackFormData {
  unidade: string;
  nome_professor: string;
  regional: string;
  cadastro: string;
  admissao: string;
  cpf: string;
  cargo: string;
  local: string;
  escola: string;
  horas_mes: string;
  horas_semana: string;
  observacoes_sala_aula: number;
  feedback_evolucao: number;
  planejamento_org: number;
  dominio_conteudo: number;
  gestao_aprendizagem: number;
  comunicacao_rel: number;
  postura_prof: number;
  consideracoes: string;
}

export interface FeedbackRecord extends FeedbackFormData {
  id: string;
  user_id: string;
  timestamp: string;
}

export const UNIDADES = [
  '41137329- ANITA CANET, C E-EF M P',
  '41133188- SANTO AGOSTINHO, C E-EF M',
  '41129970- IVO LEAO, C E-EF M',
  '41130138- JOAO DE OLIVEIRA FRANCO, C E-E',
  '41130162- JOAO MAZZAROTTO, C E-EF M',
  '41134516- DECIO DOSSI, C E DR-EF M PROFI',
  '41129920- ISABEL L S SOUZA, C E PROFA-EF',
  '41100719- LIANE MARTA DA COSTA, C E-EF M',
  '41099591- ANTONIO TUPY PINHEIRO, C E-EF M',
  '41100379- FRANCISCO C MARTINS, C E-M P',
  '41100042- CRISTO REI, C E-EF M PROFIS',
  '41137558- COSTA VIANA, C E-EF M PROFIS N',
  '41137809- GODOFREDO MACHADO, E E-EF',
  'BU103 - SJP',
  '41396030- PAULO FREIRE, C E PROF-E F M N',
  '41140060- TEREZA DA S RAMOS, C E PROFA-E',
  '41600894- TARSILA DO AMARAL, C E-EF M PR',
  'BU101 - CWT',
  'BU102 - GUA',
  '41600894- TARSILA DO AMARAL, C E-EF M PROFIS',
  '41134516- DECIO DOSSI, C E DR-EF M PROFIS',
  '41140060- TEREZA DA S RAMOS, C E PROFA-EF M',
  '41100719- LIANE MARTA DA COSTA, C E-EF M PROFIS',
  '41129920- ISABEL L S SOUZA, C E PROFA-EF M PROFIS',
  '41099591- ANTONIO TUPY PINHEIRO, C E-EF M PROFIS',
  '41130138- JOAO DE OLIVEIRA FRANCO, C E-EF M',
];

export interface RatingOption {
  value: number;
  label: string;
  description: string;
}

export const RATING_DESCRIPTIONS = {
  observacoes_sala_aula: {
    title: 'Observação de Sala de Aula',
    question: 'Quantas vezes o(a) professor(a) foi observado(a) em sala de aula durante o período de seu inicio até agora?',
    options: [
      {
        value: 1,
        label: 'Nenhuma vez',
        description: 'Nenhuma vez.'
      },
      {
        value: 2,
        label: 'Uma vez',
        description: 'Uma vez.'
      },
      {
        value: 3,
        label: 'Duas a três vezes',
        description: 'Duas a três vezes.'
      },
      {
        value: 4,
        label: 'Quatro a cinco vezes',
        description: 'Quatro a cinco vezes.'
      },
      {
        value: 5,
        label: 'Mais de cinco vezes',
        description: 'Mais de cinco vezes.'
      }
    ]
  },
  feedback_evolucao: {
    title: 'Feedback e Evolução',
    question: 'Após as observações em sala de aula, foram oferecidos feedbacks estruturados ao(a) professor(a) e qual evolução foi percebida em sua prática.',
    options: [
      {
        value: 1,
        label: 'Sem feedback ou evolução',
        description: 'Não houve feedback ou não foi possível observar evolução.'
      },
      {
        value: 2,
        label: 'Evolução mínima',
        description: 'Houve feedbacks pontuais ou genéricos, com evolução mínima.'
      },
      {
        value: 3,
        label: 'Evolução moderada',
        description: 'Houve feedbacks informais, com evolução moderada observada.'
      },
      {
        value: 4,
        label: 'Evolução significativa',
        description: 'Foram oferecidos feedbacks estruturados, com evolução significativa nas práticas pedagógicas.'
      },
      {
        value: 5,
        label: 'Evolução expressiva e sustentável',
        description: 'Foram oferecidos feedbacks estruturados e contínuos, com evolução expressiva e sustentável na prática docente.'
      }
    ]
  },
  planejamento_org: {
    title: 'Planejamento e Organização',
    question: 'O(A) professor(a) demonstra um planejamento de aulas consistente, organizado e alinhado aos objetivos de aprendizagem?',
    options: [
      {
        value: 1,
        label: 'Insatisfatório',
        description: 'Há uma ausência de planejamento formal ou o que existe é desorganizado e ineficaz. As aulas são majoritariamente improvisadas, sem uma sequência lógica clara, comprometendo a aprendizagem.'
      },
      {
        value: 2,
        label: 'Pouco Satisfatório',
        description: 'O planejamento é frequentemente incompleto, superficial ou desalinhado com os objetivos curriculares. A falta de organização é visível e impacta a fluidez das aulas.'
      },
      {
        value: 3,
        label: 'Regular',
        description: 'O planejamento cumpre os requisitos básicos, mas por vezes é genérico ou feito de última hora. Pode faltar uma conexão mais clara entre as atividades e os objetivos. É funcional, mas com pouca profundidade ou adaptação.'
      },
      {
        value: 4,
        label: 'Satisfatório',
        description: 'O planejamento é consistente, claro e bem organizado. Os planos de aula atendem plenamente aos objetivos de aprendizagem e são entregues nos prazos. Os recursos são preparados com antecedência.'
      },
      {
        value: 5,
        label: 'Muito Satisfatório',
        description: 'O planejamento é exemplar, proativo e inovador. As aulas são criativas, bem estruturadas e antecipam as necessidades dos alunos. O alinhamento com a Proposta Pedagógica é impecável e serve de modelo.'
      }
    ]
  },
  dominio_conteudo: {
    title: 'Domínio do Conteúdo',
    question: 'O(A) professor(a) demonstra domínio conceitual, procedimental e atitudinal do conteúdo que leciona, articulando-o com contextos reais e interdisciplinares?',
    options: [
      {
        value: 1,
        label: 'Insatisfatório',
        description: 'Evidencia lacunas conceituais importantes e apresenta informações imprecisas ou desconectadas do currículo e dos objetivos da aprendizagem.'
      },
      {
        value: 2,
        label: 'Pouco Satisfatório',
        description: 'Revela insegurança em alguns conceitos e dificuldade em estabelecer relações significativas com a realidade dos alunos ou entre áreas do conhecimento.'
      },
      {
        value: 3,
        label: 'Regular',
        description: 'Possui domínio adequado do conteúdo, mas limita-se à exposição tradicional. As relações interdisciplinares e contextualizações são pontuais.'
      },
      {
        value: 4,
        label: 'Satisfatório',
        description: 'Apresenta bom domínio do conteúdo e conduz explicações claras, relacionando-as adequadamente aos objetivos de aprendizagem. Responde às dúvidas dos alunos com segurança.'
      },
      {
        value: 5,
        label: 'Muito Satisfatório',
        description: 'Demonstra domínio profundo e seguro do conteúdo, contextualizando-o de forma interdisciplinar e relacionando teoria e prática com clareza. Estimula a curiosidade intelectual e o pensamento crítico dos alunos.'
      }
    ]
  },
  gestao_aprendizagem: {
    title: 'Gestão da Aprendizagem',
    question: 'O(A) professor(a) utiliza metodologias diversificadas e estratégias didáticas que engajam os alunos, estimulam a participação e favorecem um ambiente de aprendizado colaborativo e produtivo?',
    options: [
      {
        value: 1,
        label: 'Insatisfatório',
        description: 'Perde o controle da turma com frequência, resultando em um ambiente caótico e pouco propício à aprendizagem. A didática é ineficaz e não favorece a participação ou a compreensão dos alunos.'
      },
      {
        value: 2,
        label: 'Pouco Satisfatório',
        description: 'Apresenta dificuldade em manter o foco e o engajamento dos alunos. A gestão da turma é inconsistente, com interrupções frequentes e pouca variedade didática.'
      },
      {
        value: 3,
        label: 'Regular',
        description: 'A condução da aula é adequada, mas o engajamento dos alunos varia. Utiliza um repertório limitado de metodologias e a gestão de sala é mais reativa do que proativa. O ambiente é ordenado, porém pouco estimulante.'
      },
      {
        value: 4,
        label: 'Satisfatório',
        description: 'Conduz as aulas com segurança e clareza, aplicando estratégias eficazes que mantêm os alunos engajados. Gerencia o comportamento da turma com respeito e firmeza, garantindo um ambiente produtivo.'
      },
      {
        value: 5,
        label: 'Muito Satisfatório',
        description: 'Demonstra excelente domínio didático, utilizando uma ampla variedade de estratégias, recursos e tecnologias. Cria um ambiente de aula vibrante, inclusivo e altamente engajador, no qual os alunos são protagonistas. A gestão da turma é proativa e positiva.'
      }
    ]
  },
  comunicacao_rel: {
    title: 'Comunicação e Relacionamento',
    question: 'O(A) professor(a) mantém uma comunicação clara, respeitosa e colaborativa com os alunos e a equipe escolar?',
    options: [
      {
        value: 1,
        label: 'Insatisfatório',
        description: 'A comunicação é inadequada, conflituosa ou ausente. Isola-se da equipe, gerando atritos e dificultando o trabalho colaborativo. A interação com os alunos é distante ou desrespeitosa.'
      },
      {
        value: 2,
        label: 'Pouco Satisfatório',
        description: 'A comunicação apresenta falhas, gerando ruídos ou mal-entendidos com alunos ou colegas. Demonstra dificuldade em trabalhar em equipe e em manter uma postura aberta ao diálogo.'
      },
      {
        value: 3,
        label: 'Regular',
        description: 'A comunicação é funcional, mas majoritariamente reativa (responde quando procurado). O relacionamento com os colegas é cordial, mas pouco colaborativo. Mantém o respeito com os alunos, mas a interação é limitada.'
      },
      {
        value: 4,
        label: 'Satisfatório',
        description: 'Comunica-se de forma clara, profissional e respeitosa com alunos e colegas. Colabora ativamente com a equipe e a coordenação, contribuindo para o bom andamento dos trabalhos.'
      },
      {
        value: 5,
        label: 'Muito Satisfatório',
        description: 'A comunicação com alunos e colegas é exemplar, inspirando confiança e respeito. É uma referência de colaboração na equipe, mediando conflitos de forma construtiva e promovendo ativamente um clima escolar positivo.'
      }
    ]
  },
  postura_prof: {
    title: 'Postura Profissional e Comprometimento',
    question: 'O(A) professor(a) demonstra responsabilidade, ética, pontualidade e engajamento com as diretrizes e projetos da escola?',
    options: [
      {
        value: 1,
        label: 'Insatisfatório',
        description: 'Demonstra falta de comprometimento e postura profissional. Atrasos e faltas são recorrentes, não cumpre prazos e sua atitude pode ser negativa ou resistente às normas da instituição.'
      },
      {
        value: 2,
        label: 'Pouco Satisfatório',
        description: 'O comprometimento é irregular. Apresenta atrasos ou faltas pontuais, perde prazos ocasionalmente ou demonstra baixa adesão às iniciativas e regras da escola.'
      },
      {
        value: 3,
        label: 'Regular',
        description: 'Cumpre suas obrigações básicas de forma satisfatória (pontualidade, entrega de notas), mas sua participação em projetos e na vida escolar é passiva. Faz o esperado, sem demonstrar maior engajamento.'
      },
      {
        value: 4,
        label: 'Satisfatório',
        description: 'É um(a) profissional responsável, ético e comprometido. Cumpre prazos, é pontual, assíduo e participa ativamente das reuniões e formações. Adere e apoia as diretrizes da escola.'
      },
      {
        value: 5,
        label: 'Muito Satisfatório',
        description: 'É um(a) profissional exemplar que vai além de suas obrigações. Demonstra liderança, toma iniciativa em projetos, apoia os colegas e atua como um(a) embaixador(a) dos valores da escola. Engajamento e ética irrepreensíveis.'
      }
    ]
  }
};
