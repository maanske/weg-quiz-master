# Configuração do Google Sheets

Este documento explica como configurar a integração com Google Sheets para salvar as respostas do quiz.

## Passo 1: Criar a Planilha

1. Acesse [Google Sheets](https://sheets.google.com) e crie uma nova planilha
2. Renomeie para "Quiz Comunicação WEG"
3. Crie 3 abas com os seguintes nomes:
   - `Perguntas`
   - `Respostas`
   - `Feedback`

## Passo 2: Estrutura das Abas

### Aba "Perguntas"
| Coluna A | Coluna B | Coluna C | Coluna D | Coluna E | Coluna F |
|----------|----------|----------|----------|----------|----------|
| ID | Categoria | Pergunta | Opção A | Opção B | Opção C | Resposta Correta |

### Aba "Respostas"
| Coluna A | Coluna B | Coluna C | Coluna D | Coluna E | Coluna F | Coluna G |
|----------|----------|----------|----------|----------|----------|----------|
| Nome | Equipe | Pergunta | Resposta | Certo/Errado | Categoria | Data/Hora |

### Aba "Feedback"
| Coluna A | Coluna B | Coluna C | Coluna D | Coluna E | Coluna F | Coluna G |
|----------|----------|----------|----------|----------|----------|----------|
| Nome | Equipe | Dificuldade | Clareza | Organização | Sugestões | Data/Hora |

## Passo 3: Configurar o Apps Script

1. Na planilha, vá em **Extensões > Apps Script**
2. Cole o código do arquivo `google-apps-script.js` (na pasta docs)
3. Salve o projeto (Ctrl+S)
4. Clique em **Implantar > Nova implantação**
5. Selecione tipo: **Aplicativo da Web**
6. Configure:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
7. Clique em **Implantar**
8. Copie a URL gerada

## Passo 4: Configurar no Projeto

1. Copie a URL do Apps Script
2. No arquivo `src/hooks/useQuizLogic.ts`, substitua as funções mock:

```typescript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzudwHLoaq_LZmYH3vBzHpgq83SGfDjVfWsJJdu9n1LWJChR71ZxVId5xJ3nmV4iDef/exec';

async function sendAnswerToSheets(answer: QuizAnswer) {
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'answer', data: answer }),
    });
  } catch (error) {
    console.error('Erro ao enviar resposta:', error);
  }
}

async function sendFeedbackToSheets(feedback: FeedbackData) {
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'feedback', data: feedback }),
    });
  } catch (error) {
    console.error('Erro ao enviar feedback:', error);
  }
}
```

## Observações

- O Apps Script pode demorar alguns segundos para processar cada requisição
- Os dados são salvos automaticamente na planilha conforme o aluno responde
- Você pode exportar os dados da planilha em CSV ou Excel para análises
