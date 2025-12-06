import { Question } from '@/types/quiz';

export const quizQuestions: Question[] = [
  // Perguntas Primárias
  {
    id: 'p1',
    category: 'primary',
    text: 'No processo de comunicação, qual definição descreve corretamente o papel do emissor?',
    options: [
      { id: 'p1a', text: 'A pessoa que recebe e reage à mensagem', isCorrect: false },
      { id: 'p1b', text: 'A pessoa que estrutura o conteúdo e o envia ao destinatário', isCorrect: true },
      { id: 'p1c', text: 'A pessoa que apenas escolhe o canal sem participar do envio', isCorrect: false },
    ],
  },
  {
    id: 'p2',
    category: 'primary',
    text: 'Dentro da comunicação, qual é a função essencial desempenhada pelo receptor?',
    options: [
      { id: 'p2a', text: 'Criar novos sinais para alterar o código usado', isCorrect: false },
      { id: 'p2b', text: 'Compreender a mensagem recebida a partir dos sinais enviados', isCorrect: true },
      { id: 'p2c', text: 'Modificar o canal para ajustar a transmissão', isCorrect: false },
    ],
  },
  {
    id: 'p3',
    category: 'primary',
    text: 'O que caracteriza a mensagem em um processo comunicativo?',
    options: [
      { id: 'p3a', text: 'O conteúdo organizado que será transmitido ao interlocutor', isCorrect: true },
      { id: 'p3b', text: 'O objeto físico responsável por carregar o som', isCorrect: false },
      { id: 'p3c', text: 'O conjunto de regras linguísticas usadas no idioma', isCorrect: false },
    ],
  },

  // Perguntas Intermediárias
  {
    id: 'i1',
    category: 'intermediate',
    text: 'Como podemos definir o canal dentro da comunicação?',
    options: [
      { id: 'i1a', text: 'Um caminho fictício sem relação com a mensagem', isCorrect: false },
      { id: 'i1b', text: 'O meio utilizado para transportar o conteúdo comunicado', isCorrect: true },
      { id: 'i1c', text: 'Um elemento aleatório sem função no processo', isCorrect: false },
    ],
  },
  {
    id: 'i2',
    category: 'intermediate',
    text: 'Qual é um exemplo real de ruído que prejudica a interpretação de uma mensagem?',
    options: [
      { id: 'i2a', text: 'O interlocutor ouvir “quatro” como “nove” por causa de barulho', isCorrect: true },
      { id: 'i2b', text: 'O emissor trocar o sobrenome durante uma conversa', isCorrect: false },
      { id: 'i2c', text: 'O receptor esquecer onde colocou um objeto', isCorrect: false },
    ],
  },
  {
    id: 'i3',
    category: 'intermediate',
    text: 'De que forma o canal escolhido pode influenciar a clareza da comunicação?',
    options: [
      { id: 'i3a', text: 'O canal altera automaticamente o conteúdo enviado', isCorrect: false },
      { id: 'i3b', text: 'O canal determina o tipo de personalidade do emissor', isCorrect: false },
      { id: 'i3c', text: 'Alguns canais tornam o entendimento mais simples do que outros', isCorrect: true },
    ],
  },
  {
    id: 'i4',
    category: 'intermediate',
    text: 'Quando comunicação verbal e não verbal são usadas juntas, o que ocorre?',
    options: [
      { id: 'i4a', text: 'Elas tornam desnecessário qualquer tipo de fala', isCorrect: false },
      { id: 'i4b', text: 'Elas reforçam o sentido transmitido e facilitam a compreensão', isCorrect: true },
      { id: 'i4c', text: 'Elas convertem qualquer conversa em uma linguagem formal', isCorrect: false },
    ],
  },

  // Perguntas Secundárias
  {
    id: 's1',
    category: 'secondary',
    text: 'Por que é importante que emissor e receptor utilizem o mesmo código?',
    options: [
      { id: 's1a', text: 'Porque deixa a mensagem mais rápida de produzir', isCorrect: false },
      { id: 's1b', text: 'Porque reduz o esforço na escolha do canal', isCorrect: false },
      { id: 's1c', text: 'Porque garante que ambos entendam o mesmo sentido do que é dito', isCorrect: true },
    ],
  },
  {
    id: 's2',
    category: 'secondary',
    text: 'Quando o ruído interfere de forma mais direta na compreensão da mensagem?',
    options: [
      { id: 's2a', text: 'Quando a atenção se dispersa e parte do conteúdo não é percebida', isCorrect: true },
      { id: 's2b', text: 'Quando o tema não agrada quem está ouvindo', isCorrect: false },
      { id: 's2c', text: 'Quando o ambiente está silencioso e organizado', isCorrect: false },
    ],
  },
  {
    id: 's3',
    category: 'secondary',
    text: 'Por que o feedback melhora o processo comunicativo?',
    options: [
      { id: 's3a', text: 'Porque torna desnecessária uma explicação inicial clara', isCorrect: false },
      { id: 's3b', text: 'Porque impede totalmente qualquer forma de ruído', isCorrect: false },
      { id: 's3c', text: 'Porque confirma a compreensão e permite ajustes imediatos', isCorrect: true },
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
