
import React from 'react';
import type { GroundingChunk } from '../types';

interface SourceListProps {
  sources: GroundingChunk[];
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  const validSources = sources.filter(source => source.web && source.web.uri);

  if (validSources.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 p-6">
      <h3 className="text-2xl font-bold mb-4 text-purple-400">Sources</h3>
      <ul className="space-y-3">
        {validSources.map((source, index) => (
          <li key={index} className="flex items-start">
            <span className="text-purple-400 mr-3 mt-1">&#10148;</span>
            <a
              href={source.web?.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors break-all"
            >
              {source.web?.title || source.web?.uri}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SourceList;
