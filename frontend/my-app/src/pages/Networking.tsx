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

  const researchers: Researcher[] = [
    {
      user_id: "550e8400-e29b-41d4-a716-446655440000",
      email: "kimresearch@snu.ac.kr",
      name: "김연구",
      affiliation: "서울대학교 의과대학",
      google_scholar_id: "mzFEJVIAAAAJ",
      profile_image_url: "https://www.shutterstock.com/image-photo/japanese-scientist-working-research-facility-260nw-2591373147.jpg",
      created_at: "2024-01-15T09:00:00Z",
      linkedin: "https://linkedin.com/in/researcher-kim",
      current_interests: ["AI 기반 신약 개발", "분자 동역학", "단백질 구조 예측"],
      ongoing_research: [
        {
          title: "신약 후보 물질 스크리닝 자동화",
          equipment: ["고성능 컴퓨팅 클러스터", "자동화된 분자 도킹 시스템", "마이크로플레이트 리더기"],
          reagents: ["표준 약물 라이브러리", "세포 배양 배지", "형광 표지 항체"]
        },
        {
          title: "AI 기반 약물 상호작용 예측",
          equipment: ["딥러닝 워크스테이션", "GPU 서버", "분자 시뮬레이션 소프트웨어"],
          reagents: ["단백질 데이터베이스", "약물-단백질 상호작용 데이터셋"]
        }
      ],
      past_research: [
        {
          title: "분자 동역학 시뮬레이션 최적화",
          equipment: ["고성능 컴퓨팅 클러스터", "분자 시뮬레이션 소프트웨어"],
          reagents: ["단백질 구조 데이터베이스", "시뮬레이션 파라미터 세트"]
        },
        {
          title: "QSAR 모델 개발",
          equipment: ["머신러닝 워크스테이션", "화학 구조 분석 소프트웨어"],
          reagents: ["화합물 데이터베이스", "분자 서술자 라이브러리"]
        }
      ]
    },
    {
      user_id: "550e8400-e29b-41d4-a716-446655440001",
      email: "lee.bio@kaist.ac.kr",
      name: "이바이오",
      affiliation: "KAIST 생명과학과",
      google_scholar_id: "kzABCDEAAAAJ",
      created_at: "2024-02-20T09:00:00Z",
      linkedin: "https://linkedin.com/in/bio-lee",
      current_interests: ["유전체학", "시스템 생물학", "생물정보학"],
      ongoing_research: [
        {
          title: "단일세포 시퀀싱 분석",
          equipment: ["10x Genomics Chromium", "Illumina NovaSeq 6000", "세포 분류기"],
          reagents: ["단일세포 시퀀싱 키트", "세포 현탁액", "DNA 추출 키트"]
        },
        {
          title: "유전자 발현 네트워크 연구",
          equipment: ["RNA 시퀀서", "RT-PCR 기기", "세포 배양 인큐베이터"],
          reagents: ["RNA 추출 키트", "cDNA 합성 키트", "PCR 프라이머 세트"]
        }
      ],
      past_research: [
        {
          title: "암 유전체 분석",
          equipment: ["Illumina HiSeq 2500", "세포 분류기", "DNA 추출기"],
          reagents: ["암 세포 라인", "DNA 추출 키트", "시퀀싱 라이브러리"]
        },
        {
          title: "유전자 조절 네트워크 모델링",
          equipment: ["고성능 컴퓨팅 클러스터", "생물정보학 소프트웨어"],
          reagents: ["유전자 발현 데이터셋", "단백질 상호작용 데이터베이스"]
        }
      ]
    },
    {
      user_id: "550e8400-e29b-41d4-a716-446655440002",
      email: "park.health@yonsei.ac.kr",
      name: "박헬스",
      affiliation: "연세대학교 의공학과",
      created_at: "2024-03-01T09:00:00Z",
      current_interests: ["디지털 헬스케어", "의료영상 분석", "웨어러블 디바이스"],
      ongoing_research: [
        {
          title: "실시간 건강 모니터링 시스템 개발",
          equipment: ["심전도 모니터", "혈압계", "활동량 측정기", "데이터 수집 서버"],
          reagents: ["전도 젤", "센서 패치", "보정용 표준 용액"]
        }
      ],
      past_research: [
        {
          title: "의료 영상 분할 알고리즘 개발",
          equipment: ["의료 영상 처리 워크스테이션", "딥러닝 GPU 서버"],
          reagents: ["의료 영상 데이터셋", "분할 알고리즘 라이브러리"]
        },
        {
          title: "생체신호 처리 연구",
          equipment: ["생체신호 증폭기", "데이터 수집 시스템", "신호 처리 소프트웨어"],
          reagents: ["전극 패드", "보정용 표준 신호", "필터링 알고리즘"]
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
        {items.map((item, i) => (
          <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
            {item}
          </span>
        ))}
      </div>
    </div>
  );

  const ResearchItemSection = ({ title, researchItems }: { title: string; researchItems: ResearchItem[] }) => (
    <div>
      <h4 className="font-semibold text-gray-700 mb-4">{title}</h4>
      <div className="space-y-6">
        {researchItems.map((item, i) => (
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
                    사용기기
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
                    사용시약 및 리소스
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
        ))}
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

  return (
    <div className="min-h-screen bg-white">
      {/* Sub Header */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold text-gray-800">Networking</h1>
      </div>

      {/* Main Content */}
      <main className="flex items-center justify-center" style={{ height: 'calc(100vh - 500px)' }}>
        <div className="w-full max-w-4xl mx-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">관심있는 연구를 검색해보세요!</h1>
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="관심있는 연구를 검색해보세요"
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
              <h2 className="text-xl font-semibold text-gray-800 mb-4">검색 결과</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {searchResults.map((researcher, index) => (
                  <div 
                    key={`search-${researcher.user_id}`} 
                    className={`bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer
                      ${selectedSearchResult === index ? 'fixed inset-4 md:inset-20 z-50 overflow-y-auto bg-white rounded-lg' : ''}`}
                    onClick={() => setSelectedSearchResult(selectedSearchResult === index ? null : index)}
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
                        <p className="text-sm text-gray-500">{researcher.affiliation || '소속 미입력'}</p>
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
                            <ResearchSection title="현재 관심있는 연구분야" items={researcher.current_interests} />
                            <ResearchItemSection title="현재 진행중인 연구분야" researchItems={researcher.ongoing_research} />
                            <ResearchItemSection title="과거 진행했던 연구분야" researchItems={researcher.past_research} />
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
                              연구자와 대화하기
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {researcher.papers && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-700 mb-2">연구 논문</h4>
                            <ul className="space-y-2">
                              {researcher.papers.slice(0, 2).map((paper, idx) => (
                                <li key={idx} className="text-sm text-gray-600">
                                  • {paper.title}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="mt-4 flex justify-end">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            자세히 보기 →
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overlay when search result is selected */}
          {selectedSearchResult !== null && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSelectedSearchResult(null)}
            />
          )}

          {/* Original Researchers Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-gray-700">나와 비슷한 연구를 하는 연구자들을 만나보세요</span>
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
                        <p className="text-sm text-gray-500">{researcher.affiliation || '소속 미입력'}</p>
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
                            <ResearchSection title="현재 관심있는 연구분야" items={researcher.current_interests} />
                            <ResearchItemSection title="현재 진행중인 연구분야" researchItems={researcher.ongoing_research} />
                            <ResearchItemSection title="과거 진행했던 연구분야" researchItems={researcher.past_research} />
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
                              연구자와 대화하기
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