// Nome da chave que usaremos no LocalStorage para salvar o progresso
const PROGRESS_STORAGE_KEY = 'enolus_progress';

// Interface para definir o formato do nosso progresso (TypeScript)
interface Progress {
  completedLessons: string[]; // Lista de IDs de lições concluídas
  xp: number; // Pontos de experiência
}

class ProgressService {
  private getProgress(): Progress {
    
    // 1. Tenta buscar o progresso do LocalStorage
    const storedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (storedProgress) {
      // Se encontrar, retorna o objeto JSON
      return JSON.parse(storedProgress);
    }
    // Se não encontrar, retorna o progresso inicial
    return { completedLessons: [], xp: 0 };
  }

  private saveProgress(progress: Progress): void {
    // 2. Salva o objeto de progresso no LocalStorage
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }

  public getCompletedLessons(): string[] {
    // Retorna a lista de lições concluídas
    return this.getProgress().completedLessons;
  }

  public markLessonCompleted(lessonId: string, xpGained: number = 5): void {
    const currentProgress = this.getProgress();

    // Evita marcar a mesma lição duas vezes
    if (currentProgress.completedLessons.includes(lessonId)) {
      console.log(`Lição ${lessonId} já estava concluída.`);
      return;
    }

    // Adiciona a lição à lista
    currentProgress.completedLessons.push(lessonId);
    
    // Adiciona a XP
    currentProgress.xp += xpGained;

    // Salva o novo estado
    this.saveProgress(currentProgress);
    console.log(`Lição ${lessonId} concluída. XP atual: ${currentProgress.xp}`);
  }

    public isLessonCompleted(lessonId: string): boolean {
    // Checa se o ID da lição está no array de lições concluídas
    return this.getProgress().completedLessons.includes(lessonId);
}
}

// Exporta uma única instância do serviço para ser usada em todo o app
export const progressService = new ProgressService();