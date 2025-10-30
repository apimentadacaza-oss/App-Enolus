const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const BANK_FILE = path.join(ROOT_DIR, 'features/quiz/banks/intro.json');
const EN_QUESTIONS_FILE = path.join(ROOT_DIR, 'i18n/locales/en/quiz_questions.json');
const PT_QUESTIONS_FILE = path.join(ROOT_DIR, 'i18n/locales/pt-BR/quiz_questions.json');

const COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

function main() {
  console.log('🔍 Validating quiz data integrity...');
  let errors = [];

  // 1. Load all files
  let bank, enQuestions, ptQuestions;
  try {
    bank = JSON.parse(fs.readFileSync(BANK_FILE, 'utf8'));
    enQuestions = JSON.parse(fs.readFileSync(EN_QUESTIONS_FILE, 'utf8')).q_bank.intro;
    ptQuestions = JSON.parse(fs.readFileSync(PT_QUESTIONS_FILE, 'utf8')).q_bank.intro;
  } catch (e) {
    errors.push(`Failed to read or parse a required JSON file: ${e.message}`);
    logErrorsAndExit(errors);
    return; // Exit if files can't be read
  }

  const enQuestionIds = new Set(Object.keys(enQuestions));
  const ptQuestionIds = new Set(Object.keys(ptQuestions));

  // 2. Check for missing questions between EN and PT locales
  enQuestionIds.forEach(id => {
    if (!ptQuestionIds.has(id)) {
      errors.push(`Key mismatch: Question ID "${id}" exists in EN but is missing in PT.`);
    }
  });
  ptQuestionIds.forEach(id => {
    if (!enQuestionIds.has(id)) {
      errors.push(`Key mismatch: Question ID "${id}" exists in PT but is missing in EN.`);
    }
  });


  // 3. Iterate through the bank and validate each question
  bank.questions.forEach(qRef => {
    const { id, correct, choices } = qRef;
    const enQ = enQuestions[id];
    const ptQ = ptQuestions[id];

    // 3a. Check if question exists in locales
    if (!enQ) {
      errors.push(`[${id}] Missing in EN locale file.`);
    }
    if (!ptQ) {
      errors.push(`[${id}] Missing in PT locale file.`);
    }
    
    if (!enQ || !ptQ) return; // If a question is missing, we can't do further checks on it.

    // 3b. Check if 'correct' answer is in the 'choices' array
    if (!choices.includes(correct)) {
      errors.push(`[${id}] 'correct' answer ("${correct}") is not listed in its 'choices' array: [${choices.join(', ')}].`);
    }

    // 3c. Check choice consistency between bank and locale files
    const enChoiceKeys = Object.keys(enQ.choices);
    const ptChoiceKeys = Object.keys(ptQ.choices);

    choices.forEach(choiceKey => {
      if (!enChoiceKeys.includes(choiceKey)) {
        errors.push(`[${id}] Choice key "${choiceKey}" from bank is missing in EN locale choices.`);
      }
      if (!ptChoiceKeys.includes(choiceKey)) {
        errors.push(`[${id}] Choice key "${choiceKey}" from bank is missing in PT locale choices.`);
      }
    });
    
    if (choices.length !== enChoiceKeys.length || new Set([...choices, ...enChoiceKeys]).size !== choices.length) {
        errors.push(`[${id}] Mismatch in choices between bank (${choices.join(', ')}) and EN locale (${enChoiceKeys.join(', ')}).`);
    }
    if (choices.length !== ptChoiceKeys.length || new Set([...choices, ...ptChoiceKeys]).size !== choices.length) {
        errors.push(`[${id}] Mismatch in choices between bank (${choices.join(', ')}) and PT locale (${ptChoiceKeys.join(', ')}).`);
    }
  });
  
  // 4. Check for questions in locales that are not in the bank
  enQuestionIds.forEach(id => {
      if (!bank.questions.some(q => q.id === id)) {
          errors.push(`[${id}] exists in locales but is not defined in the quiz bank file.`);
      }
  });


  logErrorsAndExit(errors);
}

function logErrorsAndExit(errors) {
  if (errors.length > 0) {
    console.error(`\n${COLORS.red}❌ Found ${errors.length} error(s) in quiz data:${COLORS.reset}`);
    errors.forEach((err, i) => console.log(`   ${i + 1}. ${err}`));
    process.exit(1);
  } else {
    console.log(`\n${COLORS.green}✅ Quiz data validation passed successfully!${COLORS.reset}`);
    process.exit(0);
  }
}

main();
