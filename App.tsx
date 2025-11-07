
import React, { useState, useCallback } from 'react';
import { generateGameReviewScript } from './services/geminiService';
import type { GroundingChunk } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import ScriptDisplay from './components/ScriptDisplay';
import SourceList from './components/SourceList';

const availableLanguages = ['English', 'Russian'];

const App: React.FC = () => {
    const [gameTitle, setGameTitle] = useState<string>('');
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English']);
    const [scripts, setScripts] = useState<Record<string, string> | null>(null);
    const [sources, setSources] = useState<GroundingChunk[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleLanguageChange = (language: string) => {
        setSelectedLanguages(prev =>
            prev.includes(language)
                ? prev.filter(l => l !== language)
                : [...prev, language]
        );
    };

    const handleGenerate = useCallback(async () => {
        if (!gameTitle.trim() || selectedLanguages.length === 0) {
            setError('Please enter a game title and select at least one language.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setScripts(null);
        setSources(null);

        try {
            const results: Record<string, string> = {};
            let allSources: GroundingChunk[] = [];

            for (const lang of selectedLanguages) {
                const result = await generateGameReviewScript(gameTitle, lang);
                results[lang] = result.script;
                if (allSources.length === 0 && result.sources.length > 0) {
                    allSources = result.sources;
                }
            }

            setScripts(results);
            setSources(allSources);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [gameTitle, selectedLanguages]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans bg-grid-gray-700/[0.2]">
            <main className="container mx-auto px-4 py-8 md:py-16">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400 mb-2">
                        Game Review Scriptwriter AI
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400">
                        Get critical & fair game review scripts, powered by Gemini.
                    </p>
                </header>

                <div className="max-w-3xl mx-auto bg-gray-800/50 p-6 md:p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="gameTitle" className="block text-sm font-medium text-gray-300 mb-2">
                                Game Title
                            </label>
                            <input
                                type="text"
                                id="gameTitle"
                                value={gameTitle}
                                onChange={(e) => setGameTitle(e.target.value)}
                                placeholder="e.g., Elden Ring"
                                className="w-full bg-gray-900/70 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Script Languages
                            </label>
                            <div className="flex flex-wrap gap-4">
                                {availableLanguages.map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => handleLanguageChange(lang)}
                                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                                            selectedLanguages.includes(lang)
                                                ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-500/50'
                                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                        }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !gameTitle.trim() || selectedLanguages.length === 0}
                            className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            {isLoading ? 'Generating...' : 'Generate Script'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="max-w-3xl mx-auto mt-8 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <div className="max-w-4xl mx-auto mt-12">
                    {isLoading && <LoadingSpinner />}
                    {scripts && (
                        <div className="space-y-8">
                            {Object.entries(scripts).map(([lang, script]) => (
                                <ScriptDisplay key={lang} language={lang} script={script} />
                            ))}
                        </div>
                    )}
                    {sources && sources.length > 0 && <SourceList sources={sources} />}
                </div>

            </main>
        </div>
    );
};

export default App;
