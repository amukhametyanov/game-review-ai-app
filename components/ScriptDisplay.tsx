
import React from 'react';

interface ScriptDisplayProps {
  language: string;
  script: string;
}

const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ language, script }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm border border-gray-700">
      <div className="bg-gray-900/70 p-4 border-b border-gray-700">
        <h3 className="text-xl font-bold text-purple-400">{language} Script</h3>
      </div>
      <pre className="p-6 text-gray-300 whitespace-pre-wrap font-sans text-base leading-relaxed">{script}</pre>
    </div>
  );
};

export default ScriptDisplay;
