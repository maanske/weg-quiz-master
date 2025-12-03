import { Question } from '@/types/quiz';

export const quizQuestions: Question[] = [
  // Perguntas Primárias
  {
    id: 'p1',
    category: 'primary',
    text: 'Em um processo de comunicação, o emissor é a pessoa que…',
    options: [
      { id: 'p1a', text: 'Apenas recebe e interpreta a mensagem', isCorrect: false },
      { id: 'p1b', text: 'Organiza e transmite a mensagem ao receptor', isCorrect: true },
      { id: 'p1c', text: 'Escolhe o canal, mas não envia a mensagem', isCorrect: false },
    ],
  },
  {
    id: 'p2',
    category: 'primary',
    text: 'O receptor é responsável por qual das funções abaixo?',
    options: [
      { id: 'p2a', text: 'Criar símbolos e códigos novos', isCorrect: false },
      { id: 'p2b', text: 'Interpretar a mensagem enviada pelo emissor', isCorrect: true },
      { id: 'p2c', text: 'Controlar o canal para aumentar o volume', isCorrect: false },
    ],
  },
  {
    id: 'p3',
    category: 'primary',
    text: 'A mensagem, dentro da comunicação, corresponde a…',
    options: [
      { id: 'p3a', text: 'O conteúdo organizado pelo emissor para ser transmitido', isCorrect: true },
      { id: 'p3b', text: 'O meio físico que carrega o som', isCorrect: false },
      { id: 'p3c', text: 'O conjunto de regras que define o idioma usado', isCorrect: false },
    ],
  },
  // Perguntas Intermediárias
  {
    id: 'i1',
    category: 'intermediate',
    text: 'O que é o canal da comunicação?',
    options: [
      { id: 'i1a', text: 'Um rio com barcos', isCorrect: false },
      { id: 'i1b', text: 'O meio por onde a mensagem é transmitida', isCorrect: true },
      { id: 'i1c', text: 'Um número aleatório', isCorrect: false },
    ],
  },
  {
    id: 'i2',
    category: 'intermediate',
    text: 'Exemplo de ruído que atrapalha a comunicação:',
    options: [
      { id: 'i2a', text: 'Barulho faz alguém entender "três" como "seis"', isCorrect: true },
      { id: 'i2b', text: 'O emissor muda de nome', isCorrect: false },
      { id: 'i2c', text: 'O receptor esquece o próprio endereço', isCorrect: false },
    ],
  },
  {
    id: 'i3',
    category: 'intermediate',
    text: 'Como a escolha do canal influencia na clareza da mensagem?',
    options: [
      { id: 'i3a', text: 'O canal traduz automaticamente a mensagem', isCorrect: false },
      { id: 'i3b', text: 'O canal define a personalidade do emissor', isCorrect: false },
      { id: 'i3c', text: 'Alguns canais facilitam o entendimento mais do que outros', isCorrect: true },
    ],
  },
  {
    id: 'i4',
    category: 'intermediate',
    text: 'Comunicação verbal e não verbal juntas:',
    options: [
      { id: 'i4a', text: 'Eliminam totalmente a necessidade de falar', isCorrect: false },
      { id: 'i4b', text: 'Elas se combinam para tornar a mensagem mais clara', isCorrect: true },
      { id: 'i4c', text: 'Transformam qualquer diálogo em discurso formal', isCorrect: false },
    ],
  },
  // Perguntas Secundárias
  {
    id: 's1',
    category: 'secondary',
    text: 'Por que é essencial que emissor e receptor compartilhem o mesmo código?',
    options: [
      { id: 's1a', text: 'Porque isso reduz o esforço do emissor', isCorrect: false },
      { id: 's1b', text: 'Porque transmite mais rápido', isCorrect: false },
      { id: 's1c', text: 'Porque garante o mesmo significado e evita interpretações incorretas', isCorrect: true },
    ],
  },
  {
    id: 's2',
    category: 'secondary',
    text: 'Em qual situação o ruído interfere mais diretamente na compreensão da mensagem?',
    options: [
      { id: 's2a', text: 'Quando há distração cognitiva e parte da mensagem não é captada', isCorrect: true },
      { id: 's2b', text: 'Quando o assunto não agrada', isCorrect: false },
      { id: 's2c', text: 'Quando o ambiente está adequado', isCorrect: false },
    ],
  },
  {
    id: 's3',
    category: 'secondary',
    text: 'O feedback é essencial porque…',
    options: [
      { id: 's3a', text: 'Torna desnecessária a clareza da mensagem', isCorrect: false },
      { id: 's3b', text: 'Elimina totalmente ruídos', isCorrect: false },
      { id: 's3c', text: 'Permite confirmar se a intenção foi entendida e ajustar caso necessário', isCorrect: true },
    ],
  },
];

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    primary: 'Primária',
    intermediate: 'Intermediária',
    secondary: 'Secundária',
  };
  return labels[category] || category;
};
