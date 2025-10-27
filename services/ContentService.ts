// services/ContentService.ts

// 1. Definição da Estrutura de Conteúdo (Interfaces)

// Representa um passo dentro de uma lição (pode ser um texto, um quiz, ou um vídeo)
export interface Step {
  id: string;
  type: 'content' | 'quiz'; // Tipo de conteúdo do passo
  title: string;
  xpReward: number; // XP que o usuário ganha ao completar este passo
  // ... Outros campos como 'text', 'questions', etc., serão adicionados depois
}

// Representa uma única Lição (o item clicável dentro do Módulo)
export interface Lesson {
  id: string;
  title: string;
  progress: string; // Ex: "0/3"
  steps: Step[]; // Os passos que compõem a lição
}

// Representa um Módulo (o item que se expande na aba 'Trilhas')
export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[]; // As lições contidas neste módulo
}

// 2. O Conteúdo Real (Dados Iniciais)

const initialModules: Module[] = [
  {
    id: 'module-1',
    title: 'Módulo 1: O Básico',
    description: 'O que é vinho e como ele é feito?',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'O que é Vinho?',
        progress: '0/1',
        steps: [
          { id: 'step-1-1-1', type: 'content', title: 'Definição e História', xpReward: 5 },
        ],
      },
      {
        id: 'lesson-1-2',
        title: 'Principais Tipos de Uva',
        progress: '0/1',
        steps: [
          { id: 'step-1-2-1', type: 'content', title: 'Tannat, Merlot e mais', xpReward: 5 },
        ],
      },
      {
        id: 'lesson-1-3',
        title: 'O Processo de Vinificação',
        progress: '0/1',
        steps: [
          { id: 'step-1-3-1', type: 'content', title: 'Da Uva à Garrafa', xpReward: 10 },
        ],
      },
    ],
  },
  {
    id: 'module-2',
    title: 'Módulo 2: Degustação',
    description: 'Aprenda a arte de degustar um vinho.',
    lessons: [
      // Adicionar lições de degustação aqui
    ],
  },
];

// 3. O Serviço em si

class ContentService {
  private modules: Module[] = initialModules;

  /**
   * Retorna todos os módulos de aprendizado.
   */
  getAllModules(): Module[] {
    return this.modules;
  }

  /**
   * Busca uma lição específica pelo ID.
   */
  getLessonById(id: string): Lesson | undefined {
    for (const module of this.modules) {
      const lesson = module.lessons.find(l => l.id === id);
      if (lesson) return lesson;
    }
    return undefined;
  }
}

export const contentService = new ContentService();
