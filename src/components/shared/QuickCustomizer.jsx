import { motion } from 'framer-motion';
import { Settings2, Check, X } from 'lucide-react';
import { LANGUAGES, GENRES } from '../../data/preferences';
import { useMusic } from '../../context/music';

const QuickCustomizer = ({ isOpen, onClose }) => {
  const { preferences, updatePreferences } = useMusic();

  const toggleLanguage = (id) => {
    const isSelected = preferences.preferredLanguages.includes(id);
    const next = isSelected 
      ? preferences.preferredLanguages.filter(langId => langId !== id)
      : [...preferences.preferredLanguages, id];
    updatePreferences({ preferredLanguages: next });
  };

  const toggleGenre = (id) => {
    const isSelected = preferences.preferredGenres.includes(id);
    const next = isSelected 
      ? preferences.preferredGenres.filter(genreId => genreId !== id)
      : [...preferences.preferredGenres, id];
    updatePreferences({ preferredGenres: next });
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/20 text-brand">
            <Settings2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Tune Your Feed</h3>
            <p className="text-xs text-text-subdued">Select what you want to hear right now.</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-text-subdued hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-subdued">Languages</p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(lang => {
              const isSelected = preferences.preferredLanguages.includes(lang.id);
              return (
                <button
                  key={lang.id}
                  onClick={() => toggleLanguage(lang.id)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                    isSelected 
                      ? 'bg-brand/20 border-brand text-white' 
                      : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                  {isSelected && <Check className="h-3 w-3 text-brand" />}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-subdued">Vibes & Genres</p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map(genre => {
              const isSelected = preferences.preferredGenres.includes(genre.id);
              return (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                    isSelected 
                      ? 'bg-white text-black' 
                      : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10'
                  }`}
                >
                  <span>{genre.label}</span>
                  {isSelected && <Check className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="mt-6 border-t border-white/10 pt-4 text-center">
        <p className="text-[10px] italic text-text-subdued">
          Your home feed will update instantly as you change your selections.
        </p>
      </div>
    </motion.div>
  );
};

export default QuickCustomizer;
