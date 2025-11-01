// This file provides a centralized mapping for lesson titles, used by the tLessonTitle helper.
// It ensures that even with a complex i18n setup, there is a simple, reliable way to get a lesson title.

interface LessonTitleMap {
  [key: string]: string;
}

interface StringsStructure {
  'pt-BR': {
    lessons: LessonTitleMap;
  };
  en: {
    lessons: LessonTitleMap;
  };
}

export const STRINGS: StringsStructure = {
  'pt-BR': {
    lessons: {
      // Level 1
      'lesson-1-1-1': 'O que é Vinho?',
      'lesson-1-1-2': 'Do Vinhedo à Garrafa',
      'lesson-1-1-3': 'Tipos de Vinho',
      'lesson-1-2-1': 'Uvas Tintas Clássicas',
      'lesson-1-2-2': 'Uvas Brancas Essenciais',
      'lesson-1-3-1': 'Análise Visual: A Cor',
      'lesson-1-3-2': 'Análise Olfativa: Os Aromas',
      'lesson-1-3-3': 'Análise Gustativa: O Sabor',
      'lesson-1-4-1': 'Temperatura e Taças',
      'lesson-1-4-2': 'Abertura e Aeração',
      'lesson-1-5-1': 'Princípios Básicos da Harmonização',
      'lesson-1-5-2': 'Combinações Clássicas',

      // Level 2
      'lesson-2-1-1': 'França Essencial: Bordeaux, Borgonha e Champagne',
      'lesson-2-1-2': 'Itália & Espanha: Toscana, Piemonte, Rioja e Jerez',
      'lesson-2-1-3': 'Portugal & Europa Clássica',
      'lesson-2-2-1': 'América do Sul: Chile, Argentina, Brasil e Uruguai',
      'lesson-2-2-2': 'América do Norte: Califórnia, Oregon e Canadá',
      'lesson-2-2-3': 'Oceania e África do Sul',
      'lesson-2-3-1': 'Espumantes: Tradicional, Charmat e Ancestral',
      'lesson-2-3-2': 'Fortificados & Sobremesa',
      'lesson-2-4-1': 'Denominações de Origem',
      'lesson-2-4-2': 'Safra, Uva e Termos de Envelhecimento',

      // Level 3
      'lesson-3-1-1': 'Viticultura Avançada',
      'lesson-3-1-2': 'Enologia Avançada',
      'lesson-3-1-3': 'Defeitos do Vinho',
      'lesson-3-2-1': 'França Alternativa: Loire, Rhône, Alsácia e Jura',
      'lesson-3-2-2': 'Mediterrâneo & Leste Europeu',
      'lesson-3-3-1': 'Serviço Profissional',
      'lesson-3-3-2': 'Carta de Vinhos & Gestão de Adega',
      'lesson-3-3-3': 'Degustação às Cegas (Método Dedutivo)',
      'lesson-3-4-1': 'Destilados & Cervejas',
      'lesson-3-4-2': 'Saquê, Chá, Café & Águas',

      // Level 4
      'lesson-4-1-1': 'Além das Uvas Clássicas',
      'lesson-4-1-2': 'O Mundo dos Vinhos Rosé e Espumantes',
      'lesson-4-1-3': 'Vinhos de Guarda e Envelhecimento',
      'lesson-4-2-1': 'Vinhos Orgânicos, Naturais e Biodinâmicos',
      'lesson-4-2-2': 'Vinificação Alternativa e Inovações Técnicas',
      'lesson-4-2-3': 'Sustentabilidade e Futuro do Vinho',
      'lesson-4-3-1': 'Novas Regiões do Vinho',
      'lesson-4-3-2': 'Tendências de Mercado e Comportamento do Consumidor',
      
      // Level 5
      'lesson-5-1-1': 'O Método Dedutivo Avançado',
      'lesson-5-1-2': 'Erros Comuns e o Treinamento Sensorial',
      'lesson-5-1-3': 'Degustação Cega Prática',
      'lesson-5-2-1': 'Grands Crus da França',
      'lesson-5-2-2': 'Ícones da Itália, Espanha e Portugal',
      'lesson-5-2-3': 'Lendas do Novo Mundo',
      'lesson-5-3-1': 'Gestão Estratégica de Carta e Estoque',
      'lesson-5-3-2': 'O Sommelier Contemporâneo',
    },
  },
  en: {
    lessons: {
      // Level 1
      'lesson-1-1-1': 'What is Wine?',
      'lesson-1-1-2': 'From Vineyard to Bottle',
      'lesson-1-1-3': 'Types of Wine',
      'lesson-1-2-1': 'Classic Red Grapes',
      'lesson-1-2-2': 'Essential White Grapes',
      'lesson-1-3-1': 'Visual Analysis: The Color',
      'lesson-1-3-2': 'Olfactory Analysis: The Aromas',
      'lesson-1-3-3': 'Gustatory Analysis: The Flavor',
      'lesson-1-4-1': 'Temperature and Glassware',
      'lesson-1-4-2': 'Opening and Aeration',
      'lesson-1-5-1': 'Basic Principles of Pairing',
      'lesson-1-5-2': 'Classic Pairings',

      // Level 2
      'lesson-2-1-1': 'Essential France: Bordeaux, Burgundy & Champagne',
      'lesson-2-1-2': 'Italy & Spain: Tuscany, Piedmont, Rioja & Sherry',
      'lesson-2-1-3': 'Portugal & Classic Europe',
      'lesson-2-2-1': 'South America: Chile, Argentina, Brazil & Uruguay',
      'lesson-2-2-2': 'North America: California, Oregon & Canada',
      'lesson-2-2-3': 'Oceania & South Africa',
      'lesson-2-3-1': 'Sparkling Wines: Traditional, Charmat & Ancestral',
      'lesson-2-3-2': 'Fortified & Dessert Wines',
      'lesson-2-4-1': 'Appellations of Origin',
      'lesson-2-4-2': 'Vintage, Grape, and Aging Terms',

      // Level 3
      'lesson-3-1-1': 'Advanced Viticulture',
      'lesson-3-1-2': 'Advanced Enology',
      'lesson-3-1-3': 'Wine Flaws',
      'lesson-3-2-1': 'Alternative France: Loire, Rhône, Alsace & Jura',
      'lesson-3-2-2': 'Mediterranean & Eastern Europe',
      'lesson-3-3-1': 'Professional Service',
      'lesson-3-3-2': 'Wine List & Cellar Management',
      'lesson-3-3-3': 'Blind Tasting (Deductive Method)',
      'lesson-3-4-1': 'Spirits & Beers',
      'lesson-3-4-2': 'Sake, Tea, Coffee & Waters',

      // Level 4
      'lesson-4-1-1': 'Beyond the Classic Grapes',
      'lesson-4-1-2': 'The World of Rosé and Sparkling Wines',
      'lesson-4-1-3': 'Age-Worthy Wines and Aging',
      'lesson-4-2-1': 'Organic, Natural, and Biodynamic Wines',
      'lesson-4-2-2': 'Alternative Vinification and Technical Innovations',
      'lesson-4-2-3': 'Sustainability and the Future of Wine',
      'lesson-4-3-1': 'New Wine Regions',
      'lesson-4-3-2': 'Market Trends and Consumer Behavior',
      
      // Level 5
      'lesson-5-1-1': 'The Advanced Deductive Method',
      'lesson-5-1-2': 'Common Mistakes and Sensory Training',
      'lesson-5-1-3': 'Practical Blind Tasting',
      'lesson-5-2-1': 'Grands Crus of France',
      'lesson-5-2-2': 'Icons of Italy, Spain, and Portugal',
      'lesson-5-2-3': 'Legends of the New World',
      'lesson-5-3-1': 'Strategic Wine List and Inventory Management',
      'lesson-5-3-2': 'The Contemporary Sommelier',
    },
  },
};