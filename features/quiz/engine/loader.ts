import type { QuizBank } from './types';

// In a real application, this could be a dynamic list fetched from an index file or an API.
const availableBankIds = ['intro'];

// Cache for loaded banks to avoid re-fetching
const bankCache: Record<string, QuizBank> = {};

/**
 * Asynchronously loads all available quiz banks by fetching their JSON files.
 * @returns A promise that resolves to an array of QuizBank objects.
 */
export const loadAllQuizBanks = async (): Promise<QuizBank[]> => {
  const allBanks = await Promise.all(
    availableBankIds.map(bankId => loadQuizBank(bankId))
  );
  // Filter out any nulls if a bank failed to load
  return allBanks.filter((bank): bank is QuizBank => bank !== null);
};

/**
 * Asynchronously loads a single quiz bank by its ID.
 * It fetches the corresponding JSON file.
 * @param id The ID of the quiz bank to load (e.g., 'intro').
 * @returns A promise that resolves to the QuizBank object, or null if not found.
 */
export const loadQuizBank = async (id: string): Promise<QuizBank | null> => {
  // Return from cache if already loaded
  if (bankCache[id]) {
    return bankCache[id];
  }
  
  try {
    // Paths must be relative to the `index.html` file in the root.
    const response = await fetch(`./features/quiz/banks/${id}.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const bankData: QuizBank = await response.json();
    bankCache[id] = bankData; // Cache the loaded bank
    return bankData;
  } catch (error) {
    console.error(`Failed to load quiz bank '${id}':`, error);
    return null;
  }
};
