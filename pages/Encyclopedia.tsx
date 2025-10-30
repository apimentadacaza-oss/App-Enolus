import React, { useState, useMemo, useEffect } from 'react';
import type { ArticleMetadata, EncyclopediaArticle } from '../features/encyclopedia/types';
import { loadArticle, loadArticleIndex } from '../features/encyclopedia/content';
import { useTranslation } from 'react-i18next';
import Fuse from 'fuse.js';
import { StarIcon } from '../components/icons/Actions';

// Marked is loaded from CDN in index.html
declare const marked: any;

interface ArticleDetailViewProps {
  slug: string;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({ slug, onBack, isFavorite, onToggleFavorite }) => {
  const { t, i18n } = useTranslation('encyclopedia');
  const [article, setArticle] = useState<EncyclopediaArticle | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await loadArticle(slug, i18n.language);
        if (result) {
          setArticle(result.article);
          setIsFallback(result.isFallback);
        } else {
          throw new Error('Article not found');
        }
      } catch (err) {
        setError(t('article_load_error'));
        console.error(`Failed to load article '${slug}':`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug, i18n.language, t]);
  
  const parsedContent = useMemo(() => {
    if (!article?.body) return null;
    return marked.parse(article.body);
  }, [article]);


  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-velvet-gray/50 h-full flex flex-col">
      <header className="mb-4 pb-4 border-b border-velvet-gray/50">
        <button onClick={onBack} className="text-vinifero-purple font-semibold hover:underline mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          {t('back_to_list')}
        </button>
        {isLoading && <p>{t('loading_article')}</p>}
        {error && <p className="text-red-500">{error}</p>}
        {article && (
            <div className="flex justify-between items-start">
              <div>
                  <p className="text-xs font-bold uppercase text-aged-gold">{article.meta.category_display}</p>
                  <h1 className="font-serif text-4xl text-vinifero-purple mt-1">{article.meta.title}</h1>
              </div>
              <button
                onClick={onToggleFavorite}
                className="p-2 rounded-full hover:bg-aged-gold/20 transition-colors ml-4 flex-shrink-0"
                aria-label={isFavorite ? t('favorites.remove') : t('favorites.add')}
              >
                <StarIcon filled={isFavorite} className="w-6 h-6 text-aged-gold" />
              </button>
            </div>
        )}
      </header>
       {isFallback && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded" role="alert">
          <p className="font-bold">{t('fallback_notice_title')}</p>
          <p>{t('fallback_notice_body')}</p>
        </div>
      )}
      <div className="prose max-w-none flex-grow overflow-y-auto pr-2 -mr-2 lesson-reader-view">
        {parsedContent && <div dangerouslySetInnerHTML={{ __html: parsedContent }} />}
      </div>
    </div>
  );
};

interface EncyclopediaPageProps {
  isArticleFavorite: (slug: string) => boolean;
  toggleFavoriteArticle: (slug: string) => void;
  selectedSlug: string | null;
  setSelectedSlug: (slug: string | null) => void;
}

const EncyclopediaPage: React.FC<EncyclopediaPageProps> = ({ 
  isArticleFavorite, 
  toggleFavoriteArticle,
  selectedSlug,
  setSelectedSlug 
}) => {
  const { t, i18n } = useTranslation('encyclopedia');
  const [allEntries, setAllEntries] = useState<ArticleMetadata[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndex = async () => {
      setLoading(true);
      try {
        const index = await loadArticleIndex(i18n.language);
        setAllEntries(index);
      } catch (error) {
        console.error("Failed to load encyclopedia index:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIndex();
  }, [i18n.language]);
  
  const categories = useMemo(() => {
    const cats = new Set(allEntries.map(e => e.category_display));
    return ['All', ...Array.from(cats).sort()];
  }, [allEntries]);

  const fuse = useMemo(() => new Fuse(allEntries, {
    keys: [
      { name: 'title', weight: 0.6 },
      { name: 'summary', weight: 0.3 },
      { name: 'tags', weight: 0.1 }
    ],
    threshold: 0.3,
    ignoreLocation: true,
  }), [allEntries]);


  const filteredEntries = useMemo(() => {
    const results = searchTerm.trim()
      ? fuse.search(searchTerm).map(result => result.item)
      : allEntries;

    if (selectedCategory === 'All') {
      return results;
    }
    
    return results.filter(entry => entry.category_display === selectedCategory);
  }, [searchTerm, selectedCategory, allEntries, fuse]);
  
  return (
    <div className="animate-fade-in space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-vinifero-purple">{t('title')}</h1>
        <p className="mt-1 text-lg text-soft-graphite/80">{t('subtitle')}</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Left Panel: List & Filters */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="sticky top-4 z-10 bg-champagne-light/80 backdrop-blur-sm p-2 -mx-2 rounded-lg">
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-velvet-gray rounded-lg focus:ring-2 focus:ring-aged-gold focus:border-aged-gold outline-none transition"
            />
            <div className="flex space-x-2 overflow-x-auto mt-3 pb-2">
                {categories.map(category => (
                    <button 
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full whitespace-nowrap transition ${
                            selectedCategory === category ? 'bg-vinifero-purple text-white' : 'bg-white text-soft-graphite hover:bg-velvet-gray/50'
                        }`}
                    >
                        {category === 'All' ? t('all_categories') : category}
                    </button>
                ))}
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto space-y-3 pr-2 -mr-2">
            {loading ? (
              <div className="text-center py-10"><p className="text-soft-graphite/70">{t('loading')}</p></div>
            ) : filteredEntries.length > 0 ? (
              filteredEntries.map(entry => (
                <button 
                    key={entry.slug} 
                    onClick={() => setSelectedSlug(entry.slug)}
                    className={`w-full text-left p-4 rounded-lg shadow-sm border transition-all duration-200 ${selectedSlug === entry.slug ? 'bg-aged-gold/20 border-aged-gold' : 'bg-white border-velvet-gray/30 hover:bg-champagne-light hover:border-aged-gold/50'}`}
                >
                  <p className="text-xs font-bold uppercase text-aged-gold">{entry.category_display}</p>
                  <h3 className="font-serif text-lg text-vinifero-purple mt-1">{entry.title}</h3>
                  <p className="mt-1 text-sm text-soft-graphite/80">{entry.summary}</p>
                </button>
              ))
            ) : (
              <div className="text-center py-10"><p className="text-soft-graphite/70">{t('no_results', { term: searchTerm })}</p></div>
            )}
          </div>
        </div>

        {/* Right Panel: Article Detail */}
        <div className="md:col-span-2">
          {selectedSlug ? (
            <ArticleDetailView 
              slug={selectedSlug} 
              onBack={() => setSelectedSlug(null)}
              isFavorite={isArticleFavorite(selectedSlug)}
              onToggleFavorite={() => toggleFavoriteArticle(selectedSlug)}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-white/50 border-2 border-dashed border-velvet-gray rounded-xl">
                <p className="text-soft-graphite/70 font-semibold">{t('select_an_article')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EncyclopediaPage;