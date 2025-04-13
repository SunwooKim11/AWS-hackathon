import { useState } from 'react';
import axios from 'axios';

interface ResearchItem {
  title: string;
  equipment?: string[];
  reagents?: string[];
}

interface Researcher {
  user_id: string;
  email: string;
  name: string;
  affiliation?: string;
  google_scholar_id?: string;
  profile_image_url?: string;
  created_at: string;
  linkedin?: string;
  current_interests: string[];
  ongoing_research: ResearchItem[];
  past_research: ResearchItem[];
  papers?: { title: string }[];
}

export function Networking() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedResearcher, setSelectedResearcher] = useState<number | null>(null);
  const [selectedSearchResult, setSelectedSearchResult] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Researcher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedSearchResearcher, setSelectedSearchResearcher] = useState<Researcher | null>(null);

  const researchers: Researcher[] = [
    {
      user_id: "550e8400-e29b-41d4-a716-446655440000",
      email: "kim.ai@snu.ac.kr",
      name: "김인공",
      affiliation: "서울대학교 약학대학",
      google_scholar_id: "mzFEJVIAAAAJ",
      profile_image_url: "https://www.shutterstock.com/image-photo/japanese-scientist-working-research-facility-260nw-2591373147.jpg",
      created_at: "2024-01-15T09:00:00Z",
      linkedin: "https://linkedin.com/in/researcher-kim",
      current_interests: ["AI 기반 신약 개발", "딥러닝 신약 설계", "약물-단백질 상호작용 예측"],
      ongoing_research: [
        {
          title: "AI 기반 항암제 후보물질 발굴",
          equipment: ["GPU 클러스터", "분자 도킹 시뮬레이션 서버", "고성능 워크스테이션"],
          reagents: ["항암 약물 라이브러리", "단백질 구조 데이터셋", "세포주 패널"]
        },
        {
          title: "딥러닝 기반 약물 독성 예측",
          equipment: ["AI 모델링 서버", "독성 예측 플랫폼", "데이터 분석 시스템"],
          reagents: ["독성 데이터베이스", "약물 대사체 라이브러리", "생물학적 마커"]
        }
      ],
      past_research: [
        {
          title: "생성형 AI를 활용한 신약 구조 설계",
          equipment: ["분자 생성 AI 시스템", "구조 최적화 서버", "분자 특성 분석기"],
          reagents: ["분자 구조 데이터베이스", "약물 물성 데이터셋"]
        }
      ]
    },
    {
      user_id: "550e8400-e29b-41d4-a716-446655440001",
      email: "lee.drug@kaist.ac.kr",
      name: "이신약",
      affiliation: "KAIST 생명화학공학과",
      google_scholar_id: "kzABCDEAAAAJ",
      created_at: "2024-02-20T09:00:00Z",
      linkedin: "https://linkedin.com/in/drug-lee",
      current_interests: ["멀티모달 AI 신약개발", "단백질 구조 예측", "약물 설계 자동화"],
      ongoing_research: [
        {
          title: "멀티모달 AI 기반 신약 스크리닝",
          equipment: ["고성능 AI 서버", "분자 스크리닝 시스템", "자동화 실험 플랫폼"],
          reagents: ["후보 물질 라이브러리", "표적 단백질 패널", "세포 실험 키트"]
        }
      ],
      past_research: [
        {
          title: "AI 기반 약물 재창출 연구",
          equipment: ["데이터 마이닝 서버", "약물 분석 시스템", "임상 데이터 분석 플랫폼"],
          reagents: ["승인 약물 데이터베이스", "질병 유전체 데이터", "약물 반응 데이터셋"]
        }
      ]
    },
    {
      user_id: "550e8400-e29b-41d4-a716-446655440002",
      email: "park.pharma@yonsei.ac.kr",
      name: "박약학",
      affiliation: "연세대학교 약학대학",
      created_at: "2024-03-01T09:00:00Z",
      current_interests: ["AI 기반 약물 동태 예측", "약물 상호작용 분석", "맞춤형 신약 개발"],
      ongoing_research: [
        {
          title: "AI 기반 약물 동태학 예측 모델 개발",
          equipment: ["머신러닝 서버", "약물 동태 분석기", "생체 시료 분석 시스템"],
          reagents: ["약물 동태 데이터셋", "대사체 라이브러리", "생체 지표 분석 키트"]
        }
      ],
      past_research: [
        {
          title: "AI 활용 약물 상호작용 네트워크 분석",
          equipment: ["네트워크 분석 서버", "상호작용 예측 시스템"],
          reagents: ["약물 상호작용 데이터베이스", "부작용 데이터셋"]
        }
      ]
    }
  ];

  const getInitials = (name: string) => {
    return name.charAt(0);
  };

  const ResearchSection = ({ title, items }: { title: string; items: string[] }) => (
    <div>
      <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items && items.length > 0 ? (
          items.map((item, i) => (
            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
              {item}
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm">정보 없음</span>
        )}
      </div>
    </div>
  );

  const ResearchItemSection = ({ title, researchItems }: { title: string; researchItems: ResearchItem[] }) => (
    <div>
      <h4 className="font-semibold text-gray-700 mb-4">{title}</h4>
      <div className="space-y-6">
        {researchItems && researchItems.length > 0 ? (
          researchItems.map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <h5 className="font-medium text-blue-700">{item.title}</h5>
              </div>
              
              <div className="p-4 space-y-4">
                {item.equipment && item.equipment.length > 0 && (
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                      Equipment
                    </h6>
                    <div className="flex flex-wrap gap-2">
                      {item.equipment.map((equip, j) => (
                        <span key={j} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {equip}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {item.reagents && item.reagents.length > 0 && (
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Reagents & Resources
                    </h6>
                    <div className="flex flex-wrap gap-2">
                      {item.reagents.map((reagent, j) => (
                        <span key={j} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {reagent}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm p-4 bg-gray-50 rounded-lg">정보 없음</div>
        )}
      </div>
    </div>
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/search?query=${encodeURIComponent(searchQuery)}`);
      console.log('🔍 검색 쿼리:', searchQuery);
      console.log('📦 받은 검색 결과:', response.data);
      console.log('📊 검색 결과 개수:', response.data.length);
      if (response.data.length > 0) {
        console.log('📑 첫 번째 결과 상세:', {
          'User ID': response.data[0].user_id,
          '이름': response.data[0].name,
          '소속': response.data[0].affiliation,
          '논문 수': response.data[0].papers?.length || 0,
          '첫 번째 논문 제목': response.data[0].papers?.[0]?.title || '없음'
        });
      }
      setSearchResults(response.data);
    } catch (error) {
      console.error('❌ 검색 중 오류가 발생했습니다:', error);
      // 에러 발생 시 더미 데이터 사용
      setSearchResults(researchers);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (researcher: Researcher) => {
    const enrichedResearcher = {
      ...researcher,
      current_interests: researcher.current_interests || [
        '줄기세포 분화 조절', 
        '조직 재생 메커니즘', 
        '줄기세포 치료제 개발'
      ],
      ongoing_research: researcher.ongoing_research || [
        {
          title: "줄기세포 기반 심장 조직 재생 연구",
          equipment: [
            "줄기세포 배양 시스템",
            "공초점 현미경",
            "유세포 분석기",
            "저산소 배양기"
          ],
          reagents: [
            "줄기세포 배양 배지",
            "성장인자",
            "ECM 단백질",
            "형광 표지 항체"
          ]
        }
      ],
      past_research: researcher.past_research || [
        {
          title: "줄기세포의 자가재생 기전 연구",
          equipment: [
            "단일세포 분석기",
            "유전자 발현 분석기",
            "세포 추적 시스템"
          ],
          reagents: [
            "줄기세포 표지자",
            "시그널링 억제제",
            "RNA 추출 키트"
          ]
        }
      ]
    };
    setSelectedSearchResearcher(enrichedResearcher);
    setShowSearchModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sub Header */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800">Networking</h1>
      </div>

      {/* Main Content */}
      <main className="flex items-center justify-center py-8">
        <div className="w-full max-w-4xl mx-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Search for Research You're Interested In!</h1>
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for research you're interested in"
              className="w-full p-4 pr-16 border rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white w-12 h-12 rounded-full hover:bg-blue-700 text-lg font-semibold transition-colors flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Search Results Section */}
          {searchResults.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {searchResults.map((researcher, index) => (
                  <div 
                    key={`search-${researcher.user_id}`} 
                    className={`
                      bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer
                      ${selectedSearchResult === index ? 
                        'fixed inset-4 md:inset-20 z-50 overflow-y-auto bg-white rounded-lg max-h-[90vh]' : ''}
                    `}
                    style={{ minHeight: selectedSearchResult === index ? '80vh' : undefined }}
                    onClick={() => handleViewDetails(researcher)}
                  >
                    <div className="flex items-center mb-4 relative">
                      {researcher.profile_image_url ? (
                        <img 
                          src={researcher.profile_image_url} 
                          alt={researcher.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                          {getInitials(researcher.name)}
                        </div>
                      )}
                      <div className="ml-4">
                        <h3 className="font-semibold text-lg">{researcher.name}</h3>
                        <p className="text-sm text-gray-500">{researcher.affiliation || 'No affiliation'}</p>
                      </div>
                      
                      {selectedSearchResult === index && (
                        <button 
                          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSearchResult(null);
                          }}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Extended Information (only shown when selected) */}
                    {selectedSearchResult === index ? (
                      <div className="mt-6 pt-6 border-t">
                        <div className="space-y-6">
                          <div className="space-y-6">
                            <ResearchSection 
                              title="Current Research Interests" 
                              items={researcher.current_interests || []} 
                            />
                            <ResearchItemSection 
                              title="Ongoing Research" 
                              researchItems={researcher.ongoing_research || []} 
                            />
                            <ResearchItemSection 
                              title="Past Research" 
                              researchItems={researcher.past_research || []} 
                            />
                          </div>
                          <div className="flex flex-wrap gap-4 justify-center pt-6 border-t">
                            {researcher.google_scholar_id && (
                              <a 
                                href={`https://scholar.google.com/citations?user=${researcher.google_scholar_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5 12 0z"/>
                                </svg>
                                Google Scholar
                              </a>
                            )}
                            {researcher.linkedin && (
                              <a 
                                href={researcher.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                LinkedIn
                              </a>
                            )}
                          </div>
                          <div className="mt-6 flex justify-center">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                              Chat with Researcher
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {researcher.papers && researcher.papers.length > 0 ? (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-700 mb-2">Recent Papers</h4>
                            <ul className="space-y-2">
                              {researcher.papers.slice(0, 2).map((paper, idx) => (
                                <li key={idx} className="text-sm text-gray-600">
                                  • {paper.title}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-700 mb-2">Recent Papers</h4>
                            <p className="text-sm text-gray-500">No information available</p>
                          </div>
                        )}
                        <div className="mt-4 flex justify-end">
                          <button 
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(researcher);
                            }}
                          >
                            View Details →
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Result Modal */}
          {showSearchModal && selectedSearchResearcher && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      {selectedSearchResearcher.profile_image_url ? (
                        <img 
                          src={selectedSearchResearcher.profile_image_url} 
                          alt={selectedSearchResearcher.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                          {getInitials(selectedSearchResearcher.name)}
                        </div>
                      )}
                      <div className="ml-4">
                        <h3 className="font-semibold text-xl">{selectedSearchResearcher.name}</h3>
                        <p className="text-gray-500">{selectedSearchResearcher.affiliation || '소속 미입력'}</p>
                      </div>
                    </div>
                    <button 
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setShowSearchModal(false)}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                    <ResearchSection 
                      title="Current Research Interests" 
                      items={selectedSearchResearcher.current_interests || []} 
                    />
                    <ResearchItemSection 
                      title="Ongoing Research" 
                      researchItems={selectedSearchResearcher.ongoing_research || []} 
                    />
                    <ResearchItemSection 
                      title="Past Research" 
                      researchItems={selectedSearchResearcher.past_research || []} 
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center pt-6 mt-6 border-t">
                    {selectedSearchResearcher.google_scholar_id && (
                      <a 
                        href={`https://scholar.google.com/citations?user=${selectedSearchResearcher.google_scholar_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5 12 0z"/>
                        </svg>
                        Google Scholar
                      </a>
                    )}
                    {selectedSearchResearcher.linkedin && (
                      <a 
                        href={selectedSearchResearcher.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                      연구자와 대화하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Original Researchers Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-gray-700">Meet researchers working on similar research</span>
              <button 
                className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-blue-600 transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <svg 
                  className={`w-8 h-8 transition-transform duration-300 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* Researcher Cards */}
            {isDropdownOpen && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {researchers.map((researcher, index) => (
                  <div 
                    key={researcher.user_id} 
                    className={`bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer
                      ${selectedResearcher === index ? 'fixed inset-4 md:inset-20 z-50 overflow-y-auto bg-white' : ''}`}
                    onClick={() => setSelectedResearcher(selectedResearcher === index ? null : index)}
                  >
                    <div className="flex items-center mb-4 relative">
                      {researcher.profile_image_url ? (
                        <img 
                          src={researcher.profile_image_url} 
                          alt={researcher.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                          {getInitials(researcher.name)}
                        </div>
                      )}
                      <div className="ml-4">
                        <h3 className="font-semibold text-lg">{researcher.name}</h3>
                        <p className="text-sm text-gray-500">{researcher.affiliation || 'No affiliation'}</p>
                      </div>
                      
                      {selectedResearcher === index && (
                        <button 
                          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResearcher(null);
                          }}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Extended Information (only shown when selected) */}
                    {selectedResearcher === index && (
                      <div className="mt-6 pt-6 border-t">
                        <div className="space-y-6">
                          <div className="space-y-6">
                            <ResearchSection 
                              title="Current Research Interests" 
                              items={researcher.current_interests || []} 
                            />
                            <ResearchItemSection 
                              title="Ongoing Research" 
                              researchItems={researcher.ongoing_research || []} 
                            />
                            <ResearchItemSection 
                              title="Past Research" 
                              researchItems={researcher.past_research || []} 
                            />
                          </div>
                          <div className="flex flex-wrap gap-4 justify-center pt-6 border-t">
                            {researcher.google_scholar_id && (
                              <a 
                                href={`https://scholar.google.com/citations?user=${researcher.google_scholar_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5 12 0z"/>
                                </svg>
                                Google Scholar
                              </a>
                            )}
                            {researcher.linkedin && (
                              <a 
                                href={researcher.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                LinkedIn
                              </a>
                            )}
                          </div>
                          <div className="mt-6 flex justify-center">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                              Chat with Researcher
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Overlay when card is selected */}
            {selectedResearcher !== null && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setSelectedResearcher(null)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Networking; 