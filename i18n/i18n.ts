import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { detectLanguage } from './detector';

// The content of the JSON files is defined here for simplicity in this environment.
// In a project with a bundler, you would typically import the JSON files directly.
const resources = {
  'en': {
    home: {
      "hero": {
        "title": "Welcome to Enolus",
        "subtitle": "Your journey through the world of wine begins here."
      },
      "mission": {
        "title": "Mission of the Day",
        "body": "Learn about the {{grape}} grape and earn {{xp}} XP!",
        "cta": "Start Mission"
      },
      "recs": {
        "title": "Recommendations for you",
        "track_title": "Track: First Steps",
        "track_desc": "Ideal for beginners. Discover the fundamentals of wine.",
        "quiz_title": "Quiz: Pairing",
        "quiz_desc": "Test your knowledge of wine and food combinations."
      }
    },
    tracks: {
      "title": "Learning Tracks",
      "subtitle": "Follow the paths of knowledge and become a master.",
      "level1": {
        "title": "Level 1: First Steps in the World of Wine",
        "subtitle": "Start your journey by learning the fundamental concepts every wine lover should know."
      },
      "module1": {
        "title": "Module 1: The Basics"
      }
    },
    map: {
      "title": "Learning Tracks",
      "subtitle": "Follow the paths of knowledge and become a master.",
      "loading": "Loading tracks...",
      "progress": "Progress",
      "back_to_map": "Back to Map",
      "choose_activity": "Choose an activity to begin.",
      "read": "Read",
      "listen": "Listen",
      "listen_narration": "Listen to narration",
      "pause_audio": "Pause Audio",
      "watch": "Watch",
      "quiz": "Quiz",
      "completed": "Completed ✓",
      "complete_to_earn_xp": "Complete to earn +{{xp}} XP",
      "back": "Back",
      "reading": "Reading",
      "mark_as_completed": "Mark as Completed",
      "lesson_locked": "Lesson locked: {{title}}",
      "open_lesson": "Open lesson: {{title}}"
    },
    quiz: {
      "title": "Quiz Challenges",
      "subtitle": "Choose a quiz and test your knowledge.",
      "loading": "Loading quizzes...",
      "load_error": "Could not load quizzes. Please try reloading the page.",
      "question_load_error": "An error occurred while loading the question.",
      "test_your_knowledge": "Test your knowledge.",
      "question_progress": "Question {{current}} of {{total}}",
      "score": "Score: {{score}}",
      "confirm": "Confirm",
      "next_question": "Next Question",
      "view_result": "View Result",
      "quiz_finished": "Quiz Finished!",
      "achievement_unlocked": "🎉 Achievement Unlocked: {{achievement}}!",
      "results_summary": "You answered {{score}} out of {{total}} questions correctly.",
      "choose_another_quiz": "Choose another Quiz",
      "banks": {
        "intro": {
          "title": "Intro Module",
          "count": "{{count}} questions"
        }
      },
      "actions": {
        "start": "Start"
      }
    },
    encyclopedia: {
        "title": "Wine Encyclopedia",
        "subtitle": "Your reference library, always at hand.",
        "search_placeholder": "Search term... (e.g., 'cabernet')",
        "all_categories": "All",
        "no_results": "No results found for \"{{term}}\".",
        "loading": "Loading encyclopedia...",
        "select_an_article": "Select an article to read.",
        "back_to_list": "Back to list",
        "loading_article": "Loading article...",
        "article_load_error": "Could not load the article. Please try again.",
        "fallback_notice_title": "Translation Notice",
        "fallback_notice_body": "This article is not yet available in your language. Showing the Portuguese version."
    },
    quiz_questions: {
      "q_bank": {
        "intro": {
          "basics_q01": {
            "stem": "What is the main compound responsible for the color of red wines?",
            "choices": { "a": "Anthocyanins", "b": "Tannins", "c": "Resveratrol", "d": "Carotenoids" },
            "expl": "Anthocyanins are phenolic pigments found in the skins of red grapes and are responsible for their ruby or violet coloring."
          },
          "basics_q02": {
            "stem": "Which elegant red grape is the star of Burgundy, France?",
            "choices": { "a": "Merlot", "b": "Syrah", "c": "Pinot Noir", "d": "Gamay" },
            "expl": "Pinot Noir is famous for producing the highly sought-after red wines of Burgundy, known for their elegance and complexity."
          },
          "basics_q03": {
            "stem": "What is the primary role of fermentation in winemaking?",
            "choices": { "a": "To clarify the wine", "b": "To convert sugar into alcohol", "c": "To add oak flavors", "d": "To cool down the grape juice" },
            "expl": "Yeast consumes the sugar present in grape juice (must) and converts it into alcohol and carbon dioxide, the fundamental process of winemaking."
          },
          "basics_q04": {
            "stem": "What are the three main steps in wine tasting?",
            "choices": { "a": "Visual, Olfactory, Gustatory (See, Smell, Taste)", "b": "Chill, Open, Pour", "c": "Buy, Store, Serve", "d": "Swirl, Sniff, Spit" },
            "expl": "The professional method for tasting wine involves analyzing its appearance (Visual), its aromas (Olfactory), and its flavors and texture (Gustatory)."
          },
          "basics_q05": {
            "stem": "Which white grape is famous for its vibrant, grassy, and citrusy aromas?",
            "choices": { "a": "Chardonnay", "b": "Pinot Grigio", "c": "Riesling", "d": "Sauvignon Blanc" },
            "expl": "Sauvignon Blanc is renowned for its high acidity and aromatic profile, often featuring notes of grapefruit, lime, and fresh-cut grass."
          },
          "basics_q06": {
            "stem": "What sensation do tannins primarily cause in the mouth?",
            "choices": { "a": "Sweetness", "b": "Dryness or astringency", "c": "Acidity", "d": "Bitterness" },
            "expl": "Tannins are compounds that bind to proteins in your saliva, creating a drying or puckering sensation in the mouth, crucial for the structure of red wine."
          },
          "basics_q07": {
            "stem": "What is the main purpose of aging wine in oak barrels?",
            "choices": { "a": "To make it more alcoholic", "b": "To filter the wine", "c": "To add complexity, aromas, and texture", "d": "To make it redder" },
            "expl": "Oak barrels allow for slow oxygenation and impart flavors like vanilla, spice, and toast, adding layers of complexity and softening the wine's texture."
          },
          "basics_q08": {
            "stem": "Malbec is the signature red grape of which country?",
            "choices": { "a": "Argentina", "b": "Chile", "c": "Spain", "d": "South Africa" },
            "expl": "While originating in France, Malbec found its most famous expression in Mendoza, Argentina, producing rich, dark-fruited wines."
          },
          "basics_q09": {
            "stem": "What does the French term 'terroir' refer to?",
            "choices": { "a": "The type of grape", "b": "The brand of the winery", "c": "The age of the wine", "d": "The complete natural environment (soil, climate, etc.)" },
            "expl": "'Terroir' encompasses all the environmental factors of a vineyard that give a wine its unique character, its 'sense of place'."
          },
          "basics_q10": {
            "stem": "Why do you swirl wine in the glass before smelling it?",
            "choices": { "a": "To warm it up", "b": "To release its aromatic compounds", "c": "It's just for show", "d": "To check for sediment" },
            "expl": "Swirling increases the wine's surface area and incorporates oxygen, which helps volatilize and release the complex aromas for you to smell."
          },
          "basics_q11": {
            "stem": "A classic food pairing for a crisp, high-acid white wine like Sauvignon Blanc is...",
            "choices": { "a": "A rich chocolate cake", "b": "A grilled steak", "c": "Oysters or goat cheese", "d": "A spicy curry" },
            "expl": "The high acidity in Sauvignon Blanc cuts through the richness of goat cheese and complements the briny character of oysters perfectly."
          },
          "basics_q12": {
            "stem": "What is a key difference between making red wine and white wine?",
            "choices": { "a": "Red wine is fermented with the grape skins, white is not", "b": "Red wine uses more sugar", "c": "White wine is always aged in steel tanks", "d": "There is no major difference" },
            "expl": "For red wine, the juice ferments in contact with the grape skins, which imparts color, tannins, and flavor. For most white wines, the juice is pressed off the skins before fermentation."
          }
        }
      }
    },
    confraria: {
      "title": "Enolus Guild",
      "subtitle": "Your journey through glasses, knowledge, and achievements.",
      "stats": {
        "current_patent": "Current Patent",
        "accumulated_wisdom": "Accumulated Wisdom",
        "completed_rites": "Completed Rites"
      },
      "progress_bar": {
        "label": "{{currentXp}} / {{nextXp}} XP for the next patent.",
        "max_level": "You have reached the maximum patent!"
      },
      "patents": {
        "title": "Guild Patents",
        "subtitle": "Continue your journey to achieve the title of {{nextPatentName}}.",
        "subtitle_max": "Continue your journey to achieve the title of Grand Sommelier.",
        "tooltip": {
          "current": "Your current patent",
          "owned": "Patent achieved",
          "locked": "Requires {{xp}} XP"
        },
        "achievement_title": "Patent Achievements",
        "locked_aria_label": "Locked",
        "unlocked_aria_label": "Unlocked",
        "open_details_aria": "Open details for patent {{patentName}}",
        "locked_details_aria": "Locked patent: {{patentName}}"
      },
      "circles": {
        "title": "Guild Circles",
        "subtitle": "Find your circle and connect with fellow members of the same rank.",
        "open_aria": "Open Circle: {{circleName}}",
        "locked_aria": "Locked Circle: {{circleName}}",
        "locked_label": "LOCKED"
      },
      "ranking": {
        "title": "Hall of Members",
        "subtitle": "The most active members of this vintage.",
        "you": "You"
      },
      "achievements": {
        "title": "📜 Ceremonial Achievements",
        "empty": "Continue your journey to unlock achievements!"
      },
      "footer": {
        "quote": "\"Wine teaches, time reveals.\"",
        "author": "— Dom Sommelius"
      },
      "circle_detail": {
        "back_to_guild": "Back to Guild",
        "locked_title": "Circle Locked",
        "locked_body": "This circle will be revealed when you achieve the patent of",
        "locked_cta": "Back to the Guild",
        "purpose_title": "Purpose of the Circle",
        "rites_title": "Current Challenges and Rites",
        "rites_empty": "New rites will be revealed soon...",
        "members_title": "Circle Members",
        "start_rite": "Start Rite →",
        "footer_quote": "\"Here, wine becomes word, and word becomes friendship.\""
      },
      "rite_detail": {
        "back_to_circle": "Back to Circle",
        "steps_title": "Steps of the Rite",
        "log_title": "Sensory Log",
        "log_color_label": "Wine Color",
        "log_aroma_label": "Predominant Aroma",
        "log_notes_label": "Personal Observations",
        "log_notes_placeholder": "Tasting notes, impressions...",
        "cta_complete": "Save and Complete Rite",
        "cta_disabled": "Complete all steps to save"
      },
      "rite_success_modal": {
        "title": "Rite Completed",
        "subtitle": "+{{xp}} Accumulated Wisdom",
        "body": "Your chalice fills with wisdom. Time now dwells in your glass.",
        "cta": "Toast and Return to the Guild"
      },
      "patent_detail_modal": {
        "close_aria": "Close modal",
        "rites_title": "Dominated Rites",
        "rites_empty": "The rites that led to this achievement will be revealed soon."
      },
      "ritual": {
        "start": "Start Rite",
        "in_progress": "Rite in progress...",
        "completed": "Congratulations! You have completed the rite and earned the patent of level {{level}}.",
        "failed": "The rite could not be completed. Please try again."
      },
      "errors": {
        "generic": "An unexpected error occurred. Please try again later.",
        "network": "Could not connect. Please check your network connection."
      },
      "data": {
        "patents": {
          "p1": { "name": "Vine Apprentice", "phrase": "First steps in the art of wine." },
          "p2": { "name": "Chalice Disciple", "phrase": "The aroma reveals what the soul understands." },
          "p3": { "name": "Aroma Guardian", "phrase": "Guards the secrets of the glass." },
          "p4": { "name": "Terroir Initiate", "phrase": "The soil teaches, time perfects." },
          "p5": { "name": "Vintage Custodian", "phrase": "Patience is the best wine." },
          "p6": { "name": "Sage of Fermentation", "phrase": "Transforms the fruit into essence." },
          "p7": { "name": "Knight of the Glass", "phrase": "Defends knowledge and honors the table." },
          "p8": { "name": "Chalice Curator", "phrase": "The light of the glass guides the members." },
          "p9": { "name": "Guardian of Varietals", "phrase": "Knows the wine like a sibling." },
          "p10": { "name": "Master of Pairing", "phrase": "Unites flavors, times, and people." },
          "p11": { "name": "Enologist of the Word", "phrase": "Teaches with the glass, speaks with time." },
          "p12": { "name": "Sommelier of Time", "phrase": "Every sip is an eternal moment." },
          "p13": { "name": "Wine Ambassador", "phrase": "Carries the Guild's name to the world." },
          "p14": { "name": "Grand Sommelier of the Order", "phrase": "Eternal master of wine and wisdom." }
        },
        "circles": {
          "c1": { "name": "Circle of the Vine", "description": "Beginners in the art of wine, discovering grapes and aromas.", "ritual": "Every glass begins at the root." },
          "c2": { "name": "Circle of the Chalice", "description": "Adepts of taste and fermentation.", "ritual": "The glass is the master of patience." },
          "c3": { "name": "Circle of Terroir", "description": "Members who explore regions and the origin of wine.", "ritual": "The soil holds the memory of time." },
          "c4": { "name": "Circle of the Table", "description": "Masters of pairing and table culture.", "ritual": "Where wine and bread become celebration." },
          "c5": { "name": "Circle of Masters", "description": "Guardians of knowledge, mentors, and ambassadors of the Guild.", "ritual": "Wine is eternal, and so is knowledge." }
        },
        "rites": {
            "c1_r1": {
              "title": "Rite of the Grape", "description": "Discover the main red and white varietals.",
              "phrase": "The essence of wine is born in the fruit that time chooses.",
              "intro": "In this rite, you will learn about the main red and white varietals, understanding how each grape holds a unique personality. Observe, compare, taste, and record your perceptions—wine is the voice of the earth.",
              "step1_title": "The Red Grapes", "step1_desc": "Learn the main varieties and their characteristics: Cabernet Sauvignon, Merlot, and Pinot Noir.",
              "step2_title": "The White Grapes", "step2_desc": "Discover aromas and notes of Chardonnay, Sauvignon Blanc, and Riesling.",
              "step3_title": "Sensory Log", "step3_desc": "Choose a wine from one of the studied grapes and write down your impressions."
            },
            "c1_r2": {
              "title": "Rite of the Chalice", "description": "Learn to hold, swirl, and sense the wine.",
              "phrase": "The chalice is the altar where the wine reveals itself.",
              "intro": "The way we interact with the glass transforms the tasting. This rite teaches the fundamental gestures to release aromas and prepare the palate for the full experience.",
              "step1_title": "The Correct Grip", "step1_desc": "Understand why we hold the glass by the stem and practice the correct posture.",
              "step2_title": "The Ritualistic Swirl", "step2_desc": "Learn to swirl the wine in the glass to oxygenate it and release its complex aromas.",
              "step3_title": "Visual Analysis", "step3_desc": "Tilt the glass against a white background and observe the wine's color, clarity, and legs."
            },
            "c1_r3": {
              "title": "Rite of the Aroma", "description": "Identify floral and fruity notes in a guided tasting.",
              "phrase": "Every aroma is a memory waiting to be awakened.",
              "intro": "The nose is our portal to the complexity of wine. In this rite, we will train our sense of smell to identify the families of primary aromas, those that come directly from the grape.",
              "step1_title": "Primary Aromas", "step1_desc": "Get to know the aroma wheel and the main categories: fruits, flowers, and herbs.",
              "step2_title": "Blind Tasting", "step2_desc": "With a wine in hand, close your eyes and try to identify at least three distinct aromas.",
              "step3_title": "Olfactory Notes", "step3_desc": "Use the log section to describe the aromas you found."
            },
            "c2_r1": {
              "title": "Rite of Fermentation", "description": "Understand how sugar turns into alcohol and flavor.",
              "phrase": "Magic happens in the silence of the cellar.",
              "intro": "Fermentation is the heart of winemaking. We will explore how yeasts work to create the beverage we love.",
              "step1_title": "Yeasts", "step1_desc": "Understand the role of yeasts.",
              "step2_title": "Temperature", "step2_desc": "See how temperature affects the result."
            },
            "c2_r2": {
                "title": "Rite of the Oak", "description": "Compare an oak-aged wine with an unoaked one.",
                "phrase": "The wood teaches the wine the wisdom of time.",
                "intro": "Oak is more than a container; it's an ingredient. Discover the aromas and textures it imparts to the wine.",
                "step1_title": "Types of Oak", "step1_desc": "French vs. American.",
                "step2_title": "Toast Levels", "step2_desc": "How the charring of the wood impacts the flavor."
            }
        }
      }
    },
    common: {
      "nav": {
        "explore": "Home",
        "tracks": "Tracks",
        "quiz": "Quiz",
        "encyclopedia": "Encyclopedia",
        "profile": "Profile",
        "settings": "Settings"
      }
    },
    settings: {
      "title": "Settings",
      "subtitle": "Manage your application preferences.",
      "language": {
        "title": "Language",
        "description": "Choose the language for the application interface.",
        "pt": "Português",
        "en": "English"
      },
      "coverage": {
        "title": "Translation Coverage",
        "description": "Status of translation for different app modules (PT-BR vs EN).",
        "keys_translated": "{{ptKeys}} / {{enKeys}} keys translated"
      }
    },
    lesson_ui: {
      "title_with_icon": "{{title}}",
      "subtitle": "Choose an activity to begin.",
      "actions": {
        "read": "Read",
        "read_xp": "Complete to earn +{{xp}} XP",
        "listen": "Listen",
        "listen_xp": "Complete to earn +{{xp}} XP",
        "back": "Back to Map"
      }
    },
    lessons: {
      "what_is_wine": {
        "title": "What is Wine?",
        "sections": [
          {
            "heading": "What is Wine?",
            "paragraphs": [
              "Wine is, above all, nature expressed through human craftsmanship.",
              "It is not born in a lab, nor is it the result of mere chance.",
              "It emerges from a precise meeting of soil, climate, grape, and time.",
              "An alchemy that has crossed millennia."
            ]
          },
          {
            "heading": "The Vine and Terroir",
            "paragraphs": [
              "Everything begins in the vineyard.",
              "Each grape variety responds differently to sun, rain, soil type, and altitude.",
              "These factors, which we call terroir, shape a wine’s character even before harvest.",
              "Limestone tends to yield more mineral wines; clay-rich soils often produce fuller, denser reds."
            ]
          },
          {
            "heading": "Fermentation",
            "paragraphs": [
              "Once the grapes are ripe, the winemaker chooses the right moment to harvest.",
              "The fruit is pressed and the juice — the must — begins to ferment.",
              "Yeasts transform sugar into alcohol and create complex, unique, and unrepeatable aromas."
            ]
          }
        ]
      }
    }
  },
  'pt-BR': {
    home: {
      "hero": {
        "title": "Bem-vindo ao Enolus",
        "subtitle": "Sua jornada pelo mundo do vinho começa aqui."
      },
      "mission": {
        "title": "Missão do Dia",
        "body": "Aprenda sobre a uva {{grape}} e ganhe {{xp}} XP!",
        "cta": "Iniciar missão"
      },
      "recs": {
        "title": "Recomendações para você",
        "track_title": "Trilha: Primeiros Passos",
        "track_desc": "Ideal para iniciantes. Descubra os fundamentos do vinho.",
        "quiz_title": "Quiz: Harmonização",
        "quiz_desc": "Teste seus conhecimentos sobre combinações de vinhos e pratos."
      }
    },
    tracks: {
      "title": "Trilhas de Aprendizado",
      "subtitle": "Siga os caminhos do conhecimento e torne-se um mestre.",
      "level1": {
        "title": "Nível 1: Primeiros Passos no Mundo do Vinho",
        "subtitle": "Comece sua jornada aprendendo os conceitos fundamentais que todo amante de vinho deve conhecer."
      },
      "module1": {
        "title": "Módulo 1: O Básico"
      }
    },
    map: {
      "title": "Trilhas de Aprendizado",
      "subtitle": "Siga os caminhos do conhecimento e torne-se um mestre.",
      "loading": "Carregando trilhas...",
      "progress": "Progresso",
      "back_to_map": "Voltar para o Mapa",
      "choose_activity": "Escolha uma atividade para começar.",
      "read": "Ler",
      "listen": "Ouvir",
      "listen_narration": "Ouvir narração",
      "pause_audio": "Pausar Áudio",
      "watch": "Assistir",
      "quiz": "Quiz",
      "completed": "Concluído ✓",
      "complete_to_earn_xp": "Concluir para ganhar +{{xp}} XP",
      "back": "Voltar",
      "reading": "Leitura",
      "mark_as_completed": "Marcar como Concluído",
      "lesson_locked": "Lição bloqueada: {{title}}",
      "open_lesson": "Abrir lição: {{title}}"
    },
    quiz: {
      "title": "Desafios de Quiz",
      "subtitle": "Escolha um quiz e teste seus conhecimentos.",
      "loading": "Carregando quizzes...",
      "load_error": "Não foi possível carregar os quizzes. Tente recarregar a página.",
      "question_load_error": "Ocorreu um erro ao carregar a pergunta.",
      "test_your_knowledge": "Teste seus conhecimentos.",
      "question_progress": "Pergunta {{current}} de {{total}}",
      "score": "Pontuação: {{score}}",
      "confirm": "Confirmar",
      "next_question": "Próxima Pergunta",
      "view_result": "Ver Resultado",
      "quiz_finished": "Quiz Finalizado!",
      "achievement_unlocked": "🎉 Conquista Desbloqueada: {{achievement}}!",
      "results_summary": "Você acertou {{score}} de {{total}} perguntas.",
      "choose_another_quiz": "Escolher outro Quiz",
      "banks": {
        "intro": {
          "title": "Módulo Introdutório",
          "count": "{{count}} perguntas"
        }
      },
      "actions": {
        "start": "Começar"
      }
    },
     encyclopedia: {
        "title": "Enciclopédia do Vinho",
        "subtitle": "Sua biblioteca de referência, sempre à mão.",
        "search_placeholder": "Buscar termo... (ex: 'cabernet')",
        "all_categories": "Todos",
        "no_results": "Nenhum resultado encontrado para \"{{term}}\".",
        "loading": "Carregando enciclopédia...",
        "select_an_article": "Selecione um artigo para ler.",
        "back_to_list": "Voltar à lista",
        "loading_article": "Carregando artigo...",
        "article_load_error": "Não foi possível carregar o artigo. Tente novamente.",
        "fallback_notice_title": "Aviso de Tradução",
        "fallback_notice_body": "Este artigo ainda não está disponível no seu idioma. Exibindo a versão em Português."
    },
    quiz_questions: {
      "q_bank": {
        "intro": {
          "basics_q01": {
            "stem": "Qual é o principal composto responsável pela cor dos vinhos tintos?",
            "choices": { "a": "Antocianinas", "b": "Taninos", "c": "Resveratrol", "d": "Carotenoides" },
            "expl": "As antocianinas são pigmentos fenólicos encontrados na casca das uvas tintas e são responsáveis pela sua coloração rubi ou violácea."
          },
          "basics_q02": {
            "stem": "Qual uva tinta elegante é a estrela da Borgonha, na França?",
            "choices": { "a": "Merlot", "b": "Syrah", "c": "Pinot Noir", "d": "Gamay" },
            "expl": "A Pinot Noir é famosa por produzir os vinhos tintos mais cobiçados da Borgonha, conhecidos por sua elegância e complexidade."
          },
          "basics_q03": {
            "stem": "Qual é o papel principal da fermentação na vinificação?",
            "choices": { "a": "Clarificar o vinho", "b": "Converter açúcar em álcool", "c": "Adicionar sabores de carvalho", "d": "Esfriar o suco da uva" },
            "expl": "As leveduras consomem o açúcar presente no suco da uva (mosto) e o convertem em álcool e dióxido de carbono, o processo fundamental da vinificação."
          },
          "basics_q04": {
            "stem": "Quais são os três passos principais na degustação de vinhos?",
            "choices": { "a": "Visual, Olfativo, Gustativo", "b": "Gelar, Abrir, Servir", "c": "Comprar, Armazenar, Servir", "d": "Girar, Cheirar, Cuspir" },
            "expl": "O método profissional para degustar vinhos envolve analisar sua aparência (Visual), seus aromas (Olfativo) e seus sabores e textura (Gustativo)."
          },
          "basics_q05": {
            "stem": "Qual uva branca é famosa por seus aromas vibrantes, herbáceos e cítricos?",
            "choices": { "a": "Chardonnay", "b": "Pinot Grigio", "c": "Riesling", "d": "Sauvignon Blanc" },
            "expl": "A Sauvignon Blanc é renomada por sua alta acidez e perfil aromático, frequentemente com notas de maracujá, limão e grama cortada."
          },
          "basics_q06": {
            "stem": "Qual sensação os taninos causam principalmente na boca?",
            "choices": { "a": "Doçura", "b": "Secura ou adstringência", "c": "Acidez", "d": "Amargor" },
            "expl": "Taninos são compostos que se ligam às proteínas da sua saliva, criando uma sensação de secura na boca, crucial para a estrutura do vinho tinto."
          },
          "basics_q07": {
            "stem": "Qual o principal propósito de envelhecer vinhos em barris de carvalho?",
            "choices": { "a": "Torná-lo mais alcoólico", "b": "Filtrar o vinho", "c": "Adicionar complexidade, aromas e textura", "d": "Deixá-lo mais tinto" },
            "expl": "Barris de carvalho permitem uma lenta oxigenação e conferem sabores como baunilha, especiarias e tosta, adicionando camadas de complexidade e suavizando a textura do vinho."
          },
          "basics_q08": {
            "stem": "Malbec é a uva tinta emblemática de qual país?",
            "choices": { "a": "Argentina", "b": "Chile", "c": "Espanha", "d": "África do Sul" },
            "expl": "Embora originária da França, a Malbec encontrou sua expressão mais famosa em Mendoza, Argentina, produzindo vinhos ricos e de frutas escuras."
          },
          "basics_q09": {
            "stem": "A que se refere o termo francês 'terroir'?",
            "choices": { "a": "Ao tipo de uva", "b": "À marca da vinícola", "c": "À idade do vinho", "d": "Ao ambiente natural completo (solo, clima, etc.)" },
            "expl": "'Terroir' engloba todos os fatores ambientais de um vinhedo que dão ao vinho seu caráter único, seu 'senso de lugar'."
          },
          "basics_q10": {
            "stem": "Por que giramos o vinho na taça antes de cheirá-lo?",
            "choices": { "a": "Para aquecê-lo", "b": "Para liberar seus compostos aromáticos", "c": "É apenas por exibição", "d": "Para verificar se há sedimentos" },
            "expl": "Girar o vinho aumenta sua área de superfície e incorpora oxigênio, o que ajuda a volatilizar e liberar os aromas complexos para que você possa senti-los."
          },
          "basics_q11": {
            "stem": "Uma harmonização clássica para um vinho branco fresco e de alta acidez como o Sauvignon Blanc é...",
            "choices": { "a": "Um bolo de chocolate denso", "b": "Um bife grelhado", "c": "Ostras ou queijo de cabra", "d": "Um curry apimentado" },
            "expl": "A alta acidez do Sauvignon Blanc corta a gordura do queijo de cabra e complementa perfeitamente o caráter salino das ostras."
          },
          "basics_q12": {
            "stem": "Qual é a principal diferença entre a produção de vinho tinto e vinho branco?",
            "choices": { "a": "O tinto fermenta com as cascas da uva, o branco não", "b": "O tinto usa mais açúcar", "c": "O branco sempre envelhece em tanques de aço", "d": "Não há grande diferença" },
            "expl": "No vinho tinto, o suco fermenta em contato com as cascas da uva, o que confere cor, taninos e sabor. Na maioria dos brancos, o suco é separado das cascas antes da fermentação."
          }
        }
      }
    },
    confraria: {
      "title": "Confraria Enolus",
      "subtitle": "Sua jornada entre taças, saberes e conquistas.",
      "stats": {
        "current_patent": "Patente Atual",
        "accumulated_wisdom": "Sabedoria Acumulada",
        "completed_rites": "Ritos Completos"
      },
      "progress_bar": {
        "label": "{{currentXp}} / {{nextXp}} XP para a próxima patente.",
        "max_level": "Você alcançou a patente máxima!"
      },
      "patents": {
        "title": "Patentes da Confraria",
        "subtitle": "Continue sua jornada para alcançar o título de {{nextPatentName}}.",
        "subtitle_max": "Continue sua jornada para alcançar o título de Grão-Sommelier.",
        "tooltip": {
          "current": "Sua patente atual",
          "owned": "Patente conquistada",
          "locked": "Requer {{xp}} XP"
        },
        "achievement_title": "Conquistas da Patente",
        "locked_aria_label": "Bloqueada",
        "unlocked_aria_label": "Desbloqueada",
        "open_details_aria": "Abrir detalhes da patente {{patentName}}",
        "locked_details_aria": "Patente bloqueada: {{patentName}}"
      },
      "circles": {
        "title": "Círculos da Confraria",
        "subtitle": "Encontre seu círculo e conecte-se com confrades do mesmo grau.",
        "open_aria": "Abrir Círculo: {{circleName}}",
        "locked_aria": "Círculo bloqueado: {{circleName}}",
        "locked_label": "BLOQUEADO"
      },
      "ranking": {
        "title": "Salão dos Confrades",
        "subtitle": "Os confrades mais ativos desta safra.",
        "you": "Você"
      },
      "achievements": {
        "title": "📜 Conquistas Cerimoniais",
        "empty": "Continue sua jornada para desbloquear conquistas!"
      },
      "footer": {
        "quote": "“O vinho ensina, o tempo revela.”",
        "author": "— Dom Sommelius"
      },
      "circle_detail": {
        "back_to_guild": "Voltar à Confraria",
        "locked_title": "Círculo Bloqueado",
        "locked_body": "Este círculo será revelado quando você alcançar a patente de",
        "locked_cta": "Voltar à Confraria",
        "purpose_title": "Propósito do Círculo",
        "rites_title": "Desafios e Ritos Atuais",
        "rites_empty": "Novos ritos serão revelados em breve...",
        "members_title": "Confrades do Círculo",
        "start_rite": "Iniciar Rito →",
        "footer_quote": "\"Aqui, o vinho se torna palavra, e a palavra se torna amizade.\""
      },
      "rite_detail": {
        "back_to_circle": "Voltar ao Círculo",
        "steps_title": "Etapas do Rito",
        "log_title": "Registro Sensorial",
        "log_color_label": "Cor do Vinho",
        "log_aroma_label": "Aroma Predominante",
        "log_notes_label": "Observações Pessoais",
        "log_notes_placeholder": "Notas de degustação, impressões...",
        "cta_complete": "Salvar e Concluir Rito",
        "cta_disabled": "Complete todas as etapas para salvar"
      },
      "rite_success_modal": {
        "title": "Rito Concluído",
        "subtitle": "+{{xp}} Sabedoria Acumulada",
        "body": "Seu cálice se enche de sabedoria. O tempo agora habita em sua taça.",
        "cta": "Brindar e Voltar à Confraria"
      },
      "patent_detail_modal": {
        "close_aria": "Fechar modal",
        "rites_title": "Ritos Dominados",
        "rites_empty": "Os ritos que levaram a esta conquista serão revelados em breve."
      },
      "ritual": {
        "start": "Iniciar Rito",
        "in_progress": "Rito em progresso...",
        "completed": "Parabéns! Você completou o rito e ganhou a patente de nível {{level}}.",
        "failed": "O rito não pôde ser concluído. Por favor, tente novamente."
      },
      "errors": {
        "generic": "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
        "network": "Não foi possível conectar. Por favor, verifique sua conexão com a internet."
      },
      "data": {
        "patents": {
          "p1": { "name": "Aprendiz da Videira", "phrase": "Primeiros passos na arte do vinho." },
          "p2": { "name": "Discípulo do Cálice", "phrase": "O aroma revela o que a alma entende." },
          "p3": { "name": "Guardião do Aroma", "phrase": "Zela pelos segredos da taça." },
          "p4": { "name": "Iniciado do Terroir", "phrase": "O solo ensina, o tempo aperfeiçoa." },
          "p5": { "name": "Custódio da Safra", "phrase": "A paciência é o melhor vinho." },
          "p6": { "name": "Sábio da Fermentação", "phrase": "Transforma o fruto em essência." },
          "p7": { "name": "Cavaleiro da Taça", "phrase": "Defende o saber e honra a mesa." },
          "p8": { "name": "Curador do Cálice", "phrase": "A luz da taça guia os confrades." },
          "p9": { "name": "Guardião das Castas", "phrase": "Conhece o vinho como um irmão." },
          "p10": { "name": "Mestre da Harmonização", "phrase": "Une sabores, tempos e pessoas." },
          "p11": { "name": "Enólogo da Palavra", "phrase": "Ensina com a taça, fala com o tempo." },
          "p12": { "name": "Sommelier do Tempo", "phrase": "Cada gole é um instante eterno." },
          "p13": { "name": "Embaixador do Vinho", "phrase": "Leva o nome da Confraria ao mundo." },
          "p14": { "name": "Grão-Sommelier da Ordem", "phrase": "Mestre eterno do vinho e da sabedoria." }
        },
        "circles": {
          "c1": { "name": "Círculo da Videira", "description": "Iniciantes da arte do vinho, descobrindo uvas e aromas.", "ritual": "Toda taça começa na raiz." },
          "c2": { "name": "Círculo do Cálice", "description": "Adeptos do paladar e da fermentação.", "ritual": "A taça é a mestra da paciência." },
          "c3": { "name": "Círculo do Terroir", "description": "Confrades que exploram as regiões e a origem do vinho.", "ritual": "O solo guarda a memória do tempo." },
          "c4": { "name": "Círculo da Mesa", "description": "Mestres da harmonização e cultura da mesa.", "ritual": "Onde o vinho e o pão se tornam celebração." },
          "c5": { "name": "Círculo dos Mestres", "description": "Guardiões do saber, mentores e embaixadores da Confraria.", "ritual": "O vinho é eterno, e o saber também." }
        },
        "rites": {
            "c1_r1": {
              "title": "Rito da Uva", "description": "Descubra as principais castas tintas e brancas.",
              "phrase": "A essência do vinho nasce na fruta que o tempo escolhe.",
              "intro": "Neste rito, você conhecerá as principais castas tintas e brancas, compreendendo como cada uva guarda uma personalidade única. Observe, compare, deguste e registre suas percepções — o vinho é a voz da terra.",
              "step1_title": "As Uvas Tintas", "step1_desc": "Aprenda as principais variedades e suas características: Cabernet Sauvignon, Merlot e Pinot Noir.",
              "step2_title": "As Uvas Brancas", "step2_desc": "Descubra aromas e notas de Chardonnay, Sauvignon Blanc e Riesling.",
              "step3_title": "Registro Sensorial", "step3_desc": "Escolha um vinho de uma das uvas estudadas e anote suas impressões."
            },
            "c1_r2": {
              "title": "Rito do Cálice", "description": "Aprenda a segurar, girar e sentir o vinho.",
              "phrase": "O cálice é o altar onde o vinho se revela.",
              "intro": "A forma como interagimos com a taça transforma a degustação. Este rito ensina os gestos fundamentais para liberar os aromas e preparar o paladar para a experiência completa.",
              "step1_title": "A Pega Correta", "step1_desc": "Entenda por que seguramos a taça pela haste e pratique a postura correta.",
              "step2_title": "O Giro Ritualístico", "step2_desc": "Aprenda a girar o vinho na taça para oxigená-lo e liberar seus aromas complexos.",
              "step3_title": "Análise Visual", "step3_desc": "Incline a taça contra um fundo branco e observe a cor, a limpidez e as lágrimas do vinho."
            },
            "c1_r3": {
              "title": "Rito do Aroma", "description": "Identifique notas florais e frutadas em uma degustação guiada.",
              "phrase": "Cada aroma é uma memória esperando para ser despertada.",
              "intro": "O nariz é o nosso portal para a complexidade do vinho. Neste rito, treinaremos o olfato para identificar as famílias de aromas primários, aqueles que vêm diretamente da uva.",
              "step1_title": "Aromas Primários", "step1_desc": "Conheça a roda de aromas e as principais categorias: frutas, flores e ervas.",
              "step2_title": "Degustação Cega", "step2_desc": "Com um vinho em mãos, feche os olhos e tente identificar pelo menos três aromas distintos.",
              "step3_title": "Anotação Olfativa", "step3_desc": "Use a seção de registro para descrever os aromas que você encontrou."
            },
            "c2_r1": {
              "title": "Rito da Fermentação", "description": "Entenda como o açúcar se transforma em álcool e sabor.",
              "phrase": "A magia acontece no silêncio da adega.",
              "intro": "A fermentação é o coração da vinificação. Vamos explorar como as leveduras trabalham para criar a bebida que amamos.",
              "step1_title": "Leveduras", "step1_desc": "Entenda o papel das leveduras.",
              "step2_title": "Temperatura", "step2_desc": "Veja como a temperatura afeta o resultado."
            },
            "c2_r2": {
                "title": "Rito do Carvalho", "description": "Compare um vinho maturado em carvalho com um sem.",
                "phrase": "A madeira ensina ao vinho a sabedoria do tempo.",
                "intro": "O carvalho é mais que um recipiente; é um ingrediente. Descubra os aromas e texturas que ele confere ao vinho.",
                "step1_title": "Tipos de Carvalho", "step1_desc": "Francês vs. Americano.",
                "step2_title": "Níveis de Tosta", "step2_desc": "Como a queima da madeira impacta o sabor."
            }
        }
      }
    },
    common: {
      "nav": {
        "explore": "Início",
        "tracks": "Trilhas",
        "quiz": "Quiz",
        "encyclopedia": "Enciclopédia",
        "profile": "Perfil",
        "settings": "Ajustes"
      }
    },
    settings: {
      "title": "Ajustes",
      "subtitle": "Gerencie as preferências do seu aplicativo.",
      "language": {
        "title": "Idioma",
        "description": "Escolha o idioma para a interface do aplicativo.",
        "pt": "Português",
        "en": "Inglês"
      },
      "coverage": {
        "title": "Cobertura de Tradução",
        "description": "Status da tradução para diferentes módulos do aplicativo (PT-BR vs EN).",
        "keys_translated": "{{ptKeys}} / {{enKeys}} chaves traduzidas"
      }
    },
    lesson_ui: {
      "title_with_icon": "{{title}}",
      "subtitle": "Escolha uma atividade para começar.",
      "actions": {
        "read": "Ler",
        "read_xp": "Conclua para ganhar +{{xp}} XP",
        "listen": "Ouvir",
        "listen_xp": "Conclua para ganhar +{{xp}} XP",
        "back": "Voltar ao Mapa"
      }
    },
    lessons: {
      "what_is_wine": {
        "title": "O que é Vinho?",
        "sections": [
          {
            "heading": "O que é Vinho?",
            "paragraphs": [
              "O vinho é, antes de tudo, uma expressão da natureza interpretada pelo homem.",
              "Ele não nasce em laboratório, nem é fruto do acaso.",
              "É o resultado de um encontro preciso entre terra, clima, uva e tempo.",
              "Uma alquimia que atravessa milênios."
            ]
          },
          {
            "heading": "A videira e o terroir",
            "paragraphs": [
              "Tudo começa na videira.",
              "Cada variedade de uva reage de forma diferente ao sol, à chuva, ao tipo de solo e à altitude.",
              "Esses fatores, que chamamos de terroir, moldam o caráter do vinho antes mesmo da colheita.",
              "Um solo calcário gera vinhos mais minerais; um solo argiloso produz tintos encorpados e densos."
            ]
          },
          {
            "heading": "A fermentação",
            "paragraphs": [
              "Quando a uva amadurece, o enólogo decide o momento certo da colheita.",
              "As frutas são prensadas, e o suco — o mosto — começa a fermentar.",
              "As leveduras transformam o açúcar em álcool e criam aromas complexos, únicos e irrepetíveis."
            ]
          }
        ]
      }
    }
  }
};

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: detectLanguage(),
    fallbackLng: 'pt-BR',
    ns: ['home', 'map', 'quiz', 'quiz_questions', 'encyclopedia', 'confraria', 'settings', 'common', 'tracks', 'lesson_ui', 'lessons'],
    defaultNS: 'home',
    interpolation: {
      escapeValue: false, // React already protects from xss
    },
  });

export default i18next;