import React, { useState, useMemo, useEffect } from 'react';
import type { EncyclopediaEntry } from '../types';
import Fuse from 'fuse.js';

const EncyclopediaPage: React.FC = () => {
  const [allEntries, setAllEntries] = useState<EncyclopediaEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | EncyclopediaEntry['category']>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const responses = await Promise.all([
          fetch('./data/encyclopedia/grapes.json'),
          fetch('./data/encyclopedia/regions.json'),
          fetch('./data/encyclopedia/styles.json'),
          fetch('./data/encyclopedia/vocabulary.json'),
        ]);
        const data = await Promise.all(responses.map(res => res.json()));
        setAllEntries(data.flat());
      } catch (error) {
        console.error("Failed to load encyclopedia data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const fuse = useMemo(() => new Fuse(allEntries, {
    keys: [
      { name: 'term', weight: 0.7 },
      { name: 'description', weight: 0.3 }
    ],
    threshold: 0.3, // Stricter search for more precise results
    ignoreLocation: true,
  }), [allEntries]);


  const categories: ('All' | EncyclopediaEntry['category'])[] = ['All', 'Grapes', 'Regions', 'Styles', 'Vocabulary'];

  const filteredEntries = useMemo(() => {
    const results = searchTerm.trim()
      ? fuse.search(searchTerm).map(result => result.item)
      : allEntries;

    if (selectedCategory === 'All') {
      return results;
    }
    
    return results.filter(entry => entry.category === selectedCategory);
  }, [searchTerm, selectedCategory, allEntries, fuse]);

  return (
    <div className="animate-fade-in space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-vinifero-purple">Enciclopédia do Vinho</h1>
        <p className="mt-1 text-lg text-soft-graphite/80">Sua biblioteca de referência, sempre à mão.</p>
      </header>

      <div className="sticky top-4 z-10 bg-champagne-light/80 backdrop-blur-sm p-2 -mx-2 rounded-lg">
        <input
          type="text"
          placeholder="Buscar termo... (ex: 'cabarnet')"
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
                    {category}
                </button>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-soft-graphite/70">Carregando enciclopédia...</p>
          </div>
        ) : filteredEntries.length > 0 ? (
          filteredEntries.map(entry => (
            <div key={entry.term} className="bg-white p-5 rounded-lg shadow-md border border-velvet-gray/30 animate-fade-in">
              <h3 className="font-serif text-xl text-vinifero-purple">{entry.term}</h3>
              <p className="text-xs font-bold uppercase text-aged-gold mt-1">{entry.category}</p>
              <p className="mt-2 text-soft-graphite/90">{entry.description}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-soft-graphite/70">Nenhum resultado encontrado para "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncyclopediaPage;