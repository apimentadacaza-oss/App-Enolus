# Convenções de Internacionalização (i18n) - Enolus

Este documento estabelece as diretrizes para a internacionalização (i18n) do aplicativo Enolus, garantindo um sistema de tradução consistente, manutenível e escalável.

## 1. Convenção de Chaves (Key Naming)

Todas as chaves de tradução devem seguir um padrão hierárquico e descritivo para facilitar a localização e o gerenciamento. A estrutura padrão é:

**`namespace.contexto.identificador.campo`**

---

### Estrutura Detalhada:

- **`namespace`**: O arquivo onde a chave reside. Corresponde a uma área principal da aplicação. (Obrigatório)
  - *Exemplos: `common`, `home`, `tracks`, `quiz`, `encyclopedia`, `profile`*

- **`contexto`**: O componente ou a seção específica da interface onde o texto aparece. (Obrigatório)
  - *Exemplos: `header`, `patent_card`, `rite_modal`, `question_list`*

- **`identificador`**: Um nome único ou slug que descreve o elemento específico. Pode ser abreviado para manter a chave concisa. (Recomendado)
  - *Exemplos: `welcome`, `unlock_rules`, `final_results`*

- **`campo`**: O tipo de texto que está sendo traduzido. (Obrigatório)
  - *Exemplos: `title`, `subtitle`, `description`, `cta` (Call to Action), `label`, `placeholder`, `error_message`*

---

### Exemplos Práticos:

- **Título do Quiz**: `quiz.header.main.title` -> "Desafios de Quiz"
- **Botão em um card de patente**: `profile.patent_card.action.cta` -> "Ver Detalhes"
- **Placeholder de busca na Enciclopédia**: `encyclopedia.search_bar.main.placeholder` -> "Buscar termo..."
- **Texto de ajuda em um modal**: `common.confirmation_modal.delete_account.help_text` -> "Esta ação não pode ser desfeita."

## 2. Namespaces

Os namespaces organizam as traduções em arquivos separados, correspondentes às principais funcionalidades do aplicativo. Isso melhora a performance e a organização.

- **`common`**: Textos reutilizáveis em toda a aplicação (Ex: "Salvar", "Cancelar", "Carregando...", "Voltar").
- **`home`**: Textos exclusivos da tela "Início" (Explore).
- **`map`**: Textos da tela "Trilhas" (Tracks/Journey Map).
- **`quiz`**: Textos da funcionalidade de Quiz.
- **`encyclopedia`**: Textos da Enciclopédia.
- **`profile`**: Textos da tela "Perfil" e da Confraria (Patentes, Ritos, Círculos).

## 3. Boas Práticas

### Dados e Conteúdo
**NUNCA armazene texto de UI em arquivos de dados (`.json` de níveis, quizzes, etc.).**
Todo conteúdo que será exibido ao usuário deve ser uma chave de i18n. Os arquivos de dados devem conter apenas as chaves.

- **Incorreto**: `data/level1.json` -> `{ "title": "Primeiros Passos no Mundo do Vinho" }`
- **Correto**: `data/level1.json` -> `{ "titleKey": "tracks.level1.main.title" }`
  - No componente: `t(level.titleKey)`

### Interpolação
Use a interpolação para inserir valores dinâmicos nos textos.

- **Chave**: `quiz.header.question_count` -> `"{{count}} perguntas"`
- **Uso**: `t('quiz.header.question_count', { count: 5 })`

### Pluralização
O i18next lida com plurais de forma automática. Adicione sufixos às chaves conforme a necessidade.

- **Chaves**:
  - `key_one`: "1 item"
  - `key_other`: "{{count}} itens"
- **Uso**: `t('key', { count: 1 })` ou `t('key', { count: 5 })`

### Acessibilidade (ARIA)
Traduza também os textos de acessibilidade para garantir uma experiência inclusiva.

- **Exemplo**: `<button aria-label={t('common.actions.close_modal')}>X</button>`

Seguir estas convenções é fundamental para a saúde e a escalabilidade do projeto Enolus.
