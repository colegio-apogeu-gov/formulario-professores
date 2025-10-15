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
  planejamento: number;
  didatica: number;
  comunicacao: number;
  postura: number;
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
  planejamento: {
    title: 'Planejamento e Organização',
    question: 'O(A) professor(a) demonstra um planejamento de aulas consistente, organizado e alinhado aos objetivos de aprendizagem?',
    options: [
      {
        value: 1,
        label: 'Insuficiente',
        description: 'Não apresenta planejamento ou suas aulas são desorganizadas e sem objetivos claros.'
      },
      {
        value: 2,
        label: 'Necessita Melhoria',
        description: 'Planejamento é irregular, pouco detalhado ou nem sempre alinhado aos objetivos de aprendizagem.'
      },
      {
        value: 3,
        label: 'Satisfatório',
        description: 'Planejamento é adequado, organizado e, na maioria das vezes, alinhado aos objetivos.'
      },
      {
        value: 4,
        label: 'Bom',
        description: 'Planejamento é consistente, bem estruturado e alinhado aos objetivos, demonstrando boa organização.'
      },
      {
        value: 5,
        label: 'Excelente',
        description: 'Planejamento é exemplar, altamente organizado, detalhado e perfeitamente alinhado aos objetivos de aprendizagem.'
      }
    ]
  },
  didatica: {
    title: 'Didática e Gestão',
    question: 'O(A) professor(a) domina o conteúdo, utiliza metodologias que engajam os alunos e mantém um ambiente de aprendizado positivo e produtivo?',
    options: [
      {
        value: 1,
        label: 'Insuficiente',
        description: 'Não domina o conteúdo, não engaja os alunos e o ambiente de aula é desorganizado ou improdutivo.'
      },
      {
        value: 2,
        label: 'Necessita Melhoria',
        description: 'Domínio do conteúdo é básico, metodologias são pouco variadas e o engajamento dos alunos é limitado.'
      },
      {
        value: 3,
        label: 'Satisfatório',
        description: 'Domina o conteúdo, utiliza metodologias adequadas e mantém um ambiente de aprendizado funcional.'
      },
      {
        value: 4,
        label: 'Bom',
        description: 'Domínio sólido do conteúdo, metodologias variadas e engajadoras, com ambiente positivo e produtivo.'
      },
      {
        value: 5,
        label: 'Excelente',
        description: 'Domínio excepcional do conteúdo, metodologias inovadoras e altamente engajadoras, promovendo um ambiente inspirador.'
      }
    ]
  },
  comunicacao: {
    title: 'Comunicação e Relacionamento',
    question: 'O(A) professor(a) mantém uma comunicação clara, respeitosa e colaborativa com os alunos e a equipe escolar?',
    options: [
      {
        value: 1,
        label: 'Insuficiente',
        description: 'Comunicação é confusa, pouco respeitosa ou não colabora com alunos e equipe.'
      },
      {
        value: 2,
        label: 'Necessita Melhoria',
        description: 'Comunicação é básica, por vezes pouco clara ou a colaboração com a equipe é limitada.'
      },
      {
        value: 3,
        label: 'Satisfatório',
        description: 'Comunicação é clara e respeitosa na maioria das vezes, colabora adequadamente com alunos e equipe.'
      },
      {
        value: 4,
        label: 'Bom',
        description: 'Comunicação é clara, respeitosa e colaborativa, promovendo bom relacionamento com todos.'
      },
      {
        value: 5,
        label: 'Excelente',
        description: 'Comunicação é exemplar, altamente respeitosa e colaborativa, sendo referência em relacionamento interpessoal.'
      }
    ]
  },
  postura: {
    title: 'Postura Profissional e Comprometimento',
    question: 'O(A) professor(a) demonstra responsabilidade, ética, pontualidade e engajamento com as diretrizes e projetos da escola?',
    options: [
      {
        value: 1,
        label: 'Insuficiente',
        description: 'Não demonstra responsabilidade, pontualidade ou engajamento com as diretrizes da escola.'
      },
      {
        value: 2,
        label: 'Necessita Melhoria',
        description: 'Demonstra responsabilidade básica, mas há inconsistências em pontualidade, ética ou engajamento.'
      },
      {
        value: 3,
        label: 'Satisfatório',
        description: 'É responsável, pontual e demonstra engajamento adequado com as diretrizes e projetos da escola.'
      },
      {
        value: 4,
        label: 'Bom',
        description: 'Demonstra alta responsabilidade, ética, pontualidade e engajamento consistente com a escola.'
      },
      {
        value: 5,
        label: 'Excelente',
        description: 'Postura profissional exemplar, totalmente comprometido, ético e engajado, sendo modelo para a equipe.'
      }
    ]
  }
};
