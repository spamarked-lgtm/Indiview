import React from 'react';
import { Article, Source } from '../types';
import { SOURCES_DB } from '../constants';
import { ExternalLink, Clock } from 'lucide-react';
import { FactualityBadge } from './FactualityBadge';

interface ArticleListProps {
  articles: Article[];
  title: string;
  headerColor: string;
}

export const ArticleList: React.FC<ArticleListProps> = ({ articles, title, headerColor }) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className={`p-3 border-b border-gray-100 ${headerColor} bg-opacity-10`}>
        <h3 className={`font-bold text-sm uppercase tracking-wide opacity-80 ${headerColor.replace('bg-', 'text-').replace('10', '700')}`}>
          {title} Coverage ({articles.length})
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px] no-scrollbar">
        {articles.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            No sources from this spectrum covering this story yet.
          </div>
        ) : (
          articles.map((article) => {
            const source: Source | undefined = SOURCES_DB[article.sourceId];
            return (
              <div key={article.id} className="group relative">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900">{source?.name || article.sourceId}</span>
                    {source && <FactualityBadge rating={source.factuality} />}
                  </div>
                </div>
                <a href={article.url} className="block hover:underline decoration-gray-400">
                  <h4 className="text-sm font-medium text-gray-800 leading-snug mb-2 group-hover:text-indigo-900 transition-colors">
                    {article.title}
                  </h4>
                </a>
                <div className="flex items-center text-xs text-gray-400 gap-3">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {new Date(article.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <a href={article.url} className="flex items-center gap-1 hover:text-gray-600">
                    Source <ExternalLink size={10} />
                  </a>
                </div>
                <div className="w-full h-px bg-gray-100 mt-3" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};