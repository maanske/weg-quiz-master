/**
 * Google Apps Script para o Quiz de Comunicação WEG
 * 
 * Este script gerencia as requisições GET e POST para:
 * - Buscar perguntas da planilha
 * - Salvar respostas do quiz
 * - Salvar feedback dos alunos
 */

// Configuração - altere para o ID da sua planilha
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

/**
 * Função para requisições GET
 * Retorna as perguntas do quiz
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Perguntas');
    
    if (!sheet) {
      return createJsonResponse({ error: 'Aba "Perguntas" não encontrada' });
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const questions = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0]) { // Se tem ID
        questions.push({
          id: row[0],
          category: row[1],
          text: row[2],
          options: [
            { id: row[0] + 'a', text: row[3], isCorrect: row[6] === 'A' },
            { id: row[0] + 'b', text: row[4], isCorrect: row[6] === 'B' },
            { id: row[0] + 'c', text: row[5], isCorrect: row[6] === 'C' },
          ]
        });
      }
    }
    
    return createJsonResponse({ questions });
  } catch (error) {
    return createJsonResponse({ error: error.toString() });
  }
}

/**
 * Função para requisições POST
 * Salva respostas do quiz ou feedback
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    if (data.type === 'answer') {
      return saveAnswer(ss, data.data);
    } else if (data.type === 'feedback') {
      return saveFeedback(ss, data.data);
    } else {
      return createJsonResponse({ error: 'Tipo de requisição inválido' });
    }
  } catch (error) {
    return createJsonResponse({ error: error.toString() });
  }
}

/**
 * Salva uma resposta do quiz
 */
function saveAnswer(ss, answer) {
  const sheet = ss.getSheetByName('Respostas');
  
  if (!sheet) {
    return createJsonResponse({ error: 'Aba "Respostas" não encontrada' });
  }
  
  // Adiciona cabeçalhos se a planilha estiver vazia
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Nome', 'Equipe', 'Pergunta', 'Resposta', 'Certo/Errado', 'Categoria', 'Data/Hora']);
  }
  
  const categoryLabels = {
    'primary': 'Primária',
    'intermediate': 'Intermediária',
    'secondary': 'Secundária'
  };
  
  sheet.appendRow([
    answer.name,
    answer.team,
    answer.questionText,
    answer.selectedOption,
    answer.isCorrect ? 'Certo' : 'Errado',
    categoryLabels[answer.category] || answer.category,
    new Date(answer.timestamp).toLocaleString('pt-BR')
  ]);
  
  return createJsonResponse({ success: true, message: 'Resposta salva' });
}

/**
 * Salva o feedback do aluno
 */
function saveFeedback(ss, feedback) {
  const sheet = ss.getSheetByName('Feedback');
  
  if (!sheet) {
    return createJsonResponse({ error: 'Aba "Feedback" não encontrada' });
  }
  
  // Adiciona cabeçalhos se a planilha estiver vazia
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Nome', 'Equipe', 'Dificuldade', 'Clareza', 'Organização', 'Sugestões', 'Data/Hora']);
  }
  
  const difficultyLabels = {
    'muito_facil': 'Muito fácil',
    'facil': 'Fácil',
    'moderado': 'Moderado',
    'dificil': 'Difícil',
    'muito_dificil': 'Muito difícil'
  };
  
  const clarityLabels = {
    'sim_totalmente': 'Sim, totalmente',
    'sim_algumas_partes': 'Sim, mas algumas partes confundiram',
    'mais_ou_menos': 'Mais ou menos',
    'nao_muito_claro': 'Não muito claro',
    'nao_entendi': 'Não entendi bem'
  };
  
  const orgLabels = {
    'muito_ruim': 'Muito ruim',
    'ruim': 'Ruim',
    'neutra': 'Neutra',
    'bom': 'Bom',
    'muito_bom': 'Muito bom'
  };
  
  sheet.appendRow([
    feedback.name,
    feedback.team,
    difficultyLabels[feedback.difficulty] || feedback.difficulty,
    clarityLabels[feedback.clarity] || feedback.clarity,
    orgLabels[feedback.organization] || feedback.organization,
    feedback.suggestions || '',
    new Date(feedback.timestamp).toLocaleString('pt-BR')
  ]);
  
  return createJsonResponse({ success: true, message: 'Feedback salvo' });
}

/**
 * Cria uma resposta JSON
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Função de teste para verificar se o script está funcionando
 */
function testScript() {
  Logger.log('Script funcionando!');
  Logger.log('Planilha ID: ' + SPREADSHEET_ID);
}
