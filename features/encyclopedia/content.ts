import type { ArticleMetadata, EncyclopediaArticle, ArticleFrontmatter } from './types';

const contentCache: Record<string, any> = {};

const FALLBACK_LANG = 'pt-BR';

/**
 * A simple YAML-like frontmatter parser.
 * This is not a full YAML parser but handles the simple key: value format.
 */
function parseFrontmatter(markdownText: string): { meta: any, body: string } {
  const meta: any = {};
  let body = markdownText;

  if (markdownText.startsWith('---')) {
    const end = markdownText.indexOf('---', 3);
    if (end !== -1) {
      const frontmatter = markdownText.substring(3, end).trim();
      body = markdownText.substring(end + 3).trim();
      
      frontmatter.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length > 1) {
          const key = parts[0].trim();
          const value = parts.slice(1).join(':').trim();
          // Simple value parsing
          if (value.startsWith('[') && value.endsWith(']')) {
            meta[key] = value.substring(1, value.length - 1).split(',').map(s => s.trim().replace(/['"]/g, ''));
          } else {
            meta[key] = value.replace(/['"]/g, '');
          }
        }
      });
    }
  }
  return { meta, body };
}


async function fetchWithCache(url: string) {
    if (contentCache[url]) {
        return contentCache[url];
    }
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    contentCache[url] = data;
    return data;
}

export const loadArticleIndex = async (lang: string): Promise<ArticleMetadata[]> => {
  let indexData: { path: string, slug: string }[] = [];
  let effectiveLang = lang;

  try {
    const indexJson = await fetchWithCache(`/content/${lang}/encyclopedia/index.json`);
    indexData = JSON.parse(indexJson);
  } catch (e) {
    console.warn(`No index for language '${lang}', falling back to '${FALLBACK_LANG}'.`);
    const indexJson = await fetchWithCache(`/content/${FALLBACK_LANG}/encyclopedia/index.json`);
    indexData = JSON.parse(indexJson);
    effectiveLang = FALLBACK_LANG;
  }
  
  const metadataPromises = indexData.map(async (item) => {
    const markdownText = await fetchWithCache(`/content/${effectiveLang}/encyclopedia/${item.path}`);
    const { meta } = parseFrontmatter(markdownText);
    return {
      ...meta,
      tags: meta.tags?.join(', ') || '' // Fuse.js works better with a single string
    } as ArticleMetadata;
  });

  return Promise.all(metadataPromises);
};


export const loadArticle = async (slug: string, lang: string): Promise<{ article: EncyclopediaArticle, isFallback: boolean } | null> => {
    let isFallback = false;
    let articlePath: string | undefined;

    // Helper to find the article path
    const findPath = async (language: string): Promise<string | undefined> => {
        try {
            const indexJson = await fetchWithCache(`/content/${language}/encyclopedia/index.json`);
            const index: { path: string, slug: string }[] = JSON.parse(indexJson);
            return index.find(item => item.slug === slug)?.path;
        } catch (e) {
            return undefined;
        }
    };
    
    // 1. Try to find path in the selected language
    articlePath = await findPath(lang);
    let effectiveLang = lang;

    // 2. If not found and it's not the fallback lang, try fallback lang
    if (!articlePath && lang !== FALLBACK_LANG) {
        articlePath = await findPath(FALLBACK_LANG);
        if (articlePath) {
            isFallback = true;
            effectiveLang = FALLBACK_LANG;
        }
    }
    
    // 3. If still not found, return null
    if (!articlePath) {
        return null;
    }

    // 4. Fetch and parse the article
    const markdownText = await fetchWithCache(`/content/${effectiveLang}/encyclopedia/${articlePath}`);
    const { meta, body } = parseFrontmatter(markdownText);
    
    return {
        article: {
            meta: meta as ArticleFrontmatter,
            body
        },
        isFallback
    };
};
