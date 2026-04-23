import React, { useState } from 'react';
import { Check, Music2, Languages, UserCircle2, X, ArrowRight, Sparkles } from 'lucide-react';
import { useMusic } from '../../context/music';

import { LANGUAGES, GENRES } from '../../data/preferences';

const OnboardingOverlay = () => {
  const { preferences, updatePreferences } = useMusic();
  const [step, setStep] = useState(1);
  const [selectedLangs, setSelectedLangs] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  if (preferences.hasSetPreferences) return null;

  const toggleLang = (id) => {
    setSelectedLangs(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const toggleGenre = (id) => {
    setSelectedGenres(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    updatePreferences({
      preferredLanguages: selectedLangs,
      preferredGenres: selectedGenres,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-700">
      <div className="relative w-full max-w-2xl px-6 py-12">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand/20 blur-[100px] rounded-full" />
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="h-3 w-3" />
            <span>Personalize your feed</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            {step === 1 ? "What do you listen to?" : "Pick your favorite vibes"}
          </h2>
          <p className="text-text-muted">
            {step === 1 
              ? "Select the languages you'd like to see in your home feed." 
              : "Tell us what genres you enjoy for better recommendations."}
          </p>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-500">
            {LANGUAGES.map(lang => (
              <button
                key={lang.id}
                onClick={() => toggleLang(lang.id)}
                className={`relative group p-4 rounded-2xl border transition-all duration-300 ${
                  selectedLangs.includes(lang.id) 
                    ? 'bg-brand/20 border-brand shadow-[0_0_20px_rgba(30,215,96,0.2)]' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="text-2xl mb-2 block">{lang.flag}</span>
                <span className="font-bold text-white block">{lang.label}</span>
                {selectedLangs.includes(lang.id) && (
                  <div className="absolute top-3 right-3 bg-brand rounded-full p-0.5">
                    <Check className="h-3 w-3 text-black" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 animate-in slide-in-from-bottom-4 duration-500">
            {GENRES.map(genre => (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`relative h-24 rounded-xl flex items-center justify-center p-2 text-center transition-all duration-300 ${genre.color} ${
                  selectedGenres.includes(genre.id)
                    ? 'ring-4 ring-white ring-inset scale-95 shadow-2xl'
                    : 'opacity-80 hover:opacity-100 hover:scale-[1.02]'
                }`}
              >
                <span className="font-black text-sm uppercase tracking-tighter text-white drop-shadow-md">
                  {genre.label}
                </span>
                {selectedGenres.includes(genre.id) && (
                  <div className="absolute top-2 right-2 bg-white rounded-full p-0.5">
                    <Check className="h-2 w-2 text-black" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="mt-16 flex items-center justify-between">
          <div className="flex gap-2">
            <div className={`h-1.5 w-8 rounded-full transition-colors ${step === 1 ? 'bg-brand' : 'bg-white/10'}`} />
            <div className={`h-1.5 w-8 rounded-full transition-colors ${step === 2 ? 'bg-brand' : 'bg-white/10'}`} />
          </div>

          <button
            onClick={() => step === 1 ? (selectedLangs.length > 0 && setStep(2)) : handleFinish()}
            disabled={step === 1 ? selectedLangs.length === 0 : selectedGenres.length === 0}
            className={`group px-8 py-4 rounded-full flex items-center gap-3 font-bold transition-all ${
              (step === 1 ? selectedLangs.length > 0 : selectedGenres.length > 0)
                ? 'bg-white text-black hover:scale-105 active:scale-95 shadow-xl'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <span>{step === 1 ? "Next Step" : "Get Started"}</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingOverlay;
