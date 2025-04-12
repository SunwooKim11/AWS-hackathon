import { useState } from 'react';
import { SearchBar } from '../components/SearchBar';

interface Paper {
  title: string;
  abstract: string;
  year: number;
  journal: string;
  doi: string | null;
  authors: string[];
  equipments: string[];
  reagents: string[];
  vector_embedding_id: string | null;
  score: number;
}

interface SearchResult {
  user_id: string;
  papers: Paper[];
}

export default function Home() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            연구자 추천 시스템
          </h1>
          <p className="text-xl text-gray-600">
            관심있는 연구를 검색하고 관련 연구자를 찾아보세요
          </p>
        </div>

        <SearchBar onSearchResults={handleSearchResults} />

        {hasSearched && (
          <div className="mt-8">
            {searchResults.length > 0 ? (
              <div className="space-y-6">
                {searchResults.map((result, index) => (
                  <div
                    key={`${result.user_id}-${index}`}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    {result.papers.map((paper, paperIndex) => (
                      <div key={paperIndex}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {paper.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{paper.abstract}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div>
                            <span className="font-medium">연구자 ID:</span>
                            <span className="ml-2">{result.user_id}</span>
                          </div>
                          <div className="text-blue-600">
                            유사도: {(paper.score * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">저널:</span>
                            <span className="ml-2">{paper.journal}</span>
                          </div>
                          <div>
                            <span className="font-medium">연도:</span>
                            <span className="ml-2">{paper.year}</span>
                          </div>
                          <div>
                            <span className="font-medium">저자:</span>
                            <span className="ml-2">{paper.authors.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  검색 결과가 없습니다. 다른 키워드로 검색해보세요.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 