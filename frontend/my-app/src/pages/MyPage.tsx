import { useState } from 'react';

interface ResearchItem {
  title: string;
  equipment?: string[];
  reagents?: string[];
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  affiliation?: string;
  google_scholar_id?: string;
  profile_image_url?: string;
  linkedin?: string;
  current_interests: string[];
  ongoing_research: ResearchItem[];
  past_research: ResearchItem[];
}

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'research' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddResearchModal, setShowAddResearchModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showEditResearchModal, setShowEditResearchModal] = useState(false);
  const [researchToDelete, setResearchToDelete] = useState<{index: number, type: 'ongoing' | 'past'} | null>(null);
  const [researchToEdit, setResearchToEdit] = useState<{index: number, type: 'ongoing' | 'past', item: ResearchItem} | null>(null);
  const [newResearch, setNewResearch] = useState<ResearchItem>({
    title: '',
    equipment: [],
    reagents: []
  });
  const [googleScholarUrl, setGoogleScholarUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 임시 사용자 데이터 (실제로는 API에서 가져와야 함)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "kimresearch@snu.ac.kr",
    name: "김연구",
    affiliation: "서울대학교 의과대학",
    google_scholar_id: "mzFEJVIAAAAJ",
    profile_image_url: "https://www.shutterstock.com/image-photo/japanese-scientist-working-research-facility-260nw-2591373147.jpg",
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
  });

  const getInitials = (name: string) => {
    return name.charAt(0);
  };

  const ResearchItemSection = ({ title, researchItems, type }: { title: string; researchItems: ResearchItem[]; type: 'ongoing' | 'past' }) => (
    <div>
      <h4 className="font-semibold text-gray-700 mb-4">{title}</h4>
      <div className="space-y-6">
        {researchItems.map((item, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex justify-between items-center">
              <h5 className="font-medium text-blue-700">{item.title}</h5>
              <div className="flex space-x-2">
                <button 
                  className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                  onClick={() => handleEditResearch(i, type)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                  onClick={() => handleDeleteResearch(i, type)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {item.equipment && item.equipment.length > 0 && (
                <div>
                  <h6 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
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
                    <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
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

  const handleSaveProfile = () => {
    // 실제로는 API 호출로 프로필 업데이트
    setIsEditing(false);
    // 성공 메시지 표시
    alert('프로필이 성공적으로 업데이트되었습니다.');
  };

  const handleAddResearch = () => {
    setShowAddResearchModal(true);
  };

  const handleCloseModal = () => {
    setShowAddResearchModal(false);
    setNewResearch({
      title: '',
      equipment: [],
      reagents: []
    });
    setGoogleScholarUrl('');
  };

  const handleProcessGoogleScholar = () => {
    if (!googleScholarUrl) {
      alert('Google Scholar URL을 입력해주세요.');
      return;
    }

    setIsProcessing(true);
    
    // 실제로는 API 호출로 Google Scholar 데이터를 가져와야 함
    // 여기서는 임시로 setTimeout으로 처리하는 것처럼 보이게 함
    setTimeout(() => {
      // 임시 데이터 생성
      const extractedData: ResearchItem = {
        title: "Google Scholar에서 추출한 연구 제목",
        equipment: ["추출된 기기 1", "추출된 기기 2"],
        reagents: ["추출된 시약 1", "추출된 시약 2"]
      };
      
      setNewResearch(extractedData);
      setIsProcessing(false);
    }, 2000);
  };

  const handleSaveResearch = () => {
    if (!newResearch.title) {
      alert('연구 제목을 입력해주세요.');
      return;
    }

    // 실제로는 API 호출로 연구 정보를 저장해야 함
    // 여기서는 임시로 상태 업데이트
    setUserProfile({
      ...userProfile,
      ongoing_research: [...userProfile.ongoing_research, newResearch]
    });
    
    handleCloseModal();
    alert('연구 정보가 성공적으로 추가되었습니다.');
  };

  const handleAddEquipment = (equipment: string) => {
    if (equipment.trim()) {
      setNewResearch({
        ...newResearch,
        equipment: [...(newResearch.equipment || []), equipment.trim()]
      });
    }
  };

  const handleAddReagent = (reagent: string) => {
    if (reagent.trim()) {
      setNewResearch({
        ...newResearch,
        reagents: [...(newResearch.reagents || []), reagent.trim()]
      });
    }
  };

  const handleRemoveEquipment = (index: number) => {
    const updatedEquipment = [...newResearch.equipment!];
    updatedEquipment.splice(index, 1);
    setNewResearch({...newResearch, equipment: updatedEquipment});
  };

  const handleRemoveReagent = (index: number) => {
    const updatedReagents = [...newResearch.reagents!];
    updatedReagents.splice(index, 1);
    setNewResearch({...newResearch, reagents: updatedReagents});
  };

  const handleDeleteResearch = (index: number, type: 'ongoing' | 'past') => {
    setResearchToDelete({index, type});
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteResearch = () => {
    if (researchToDelete) {
      const { index, type } = researchToDelete;
      
      if (type === 'ongoing') {
        const updatedResearch = [...userProfile.ongoing_research];
        updatedResearch.splice(index, 1);
        setUserProfile({
          ...userProfile,
          ongoing_research: updatedResearch
        });
      } else {
        const updatedResearch = [...userProfile.past_research];
        updatedResearch.splice(index, 1);
        setUserProfile({
          ...userProfile,
          past_research: updatedResearch
        });
      }
      
      setShowDeleteConfirmModal(false);
      setResearchToDelete(null);
      alert('연구 정보가 성공적으로 삭제되었습니다.');
    }
  };

  const cancelDeleteResearch = () => {
    setShowDeleteConfirmModal(false);
    setResearchToDelete(null);
  };

  const handleEditResearch = (index: number, type: 'ongoing' | 'past') => {
    const researchItem = type === 'ongoing' 
      ? userProfile.ongoing_research[index] 
      : userProfile.past_research[index];
    
    setResearchToEdit({index, type, item: {...researchItem}});
    setNewResearch({...researchItem});
    setShowEditResearchModal(true);
  };

  const handleSaveEdit = () => {
    if (!newResearch.title) {
      alert('연구 제목을 입력해주세요.');
      return;
    }

    if (researchToEdit) {
      const { index, type } = researchToEdit;
      
      if (type === 'ongoing') {
        const updatedResearch = [...userProfile.ongoing_research];
        updatedResearch[index] = {...newResearch};
        setUserProfile({
          ...userProfile,
          ongoing_research: updatedResearch
        });
      } else {
        const updatedResearch = [...userProfile.past_research];
        updatedResearch[index] = {...newResearch};
        setUserProfile({
          ...userProfile,
          past_research: updatedResearch
        });
      }
      
      setShowEditResearchModal(false);
      setResearchToEdit(null);
      setNewResearch({
        title: '',
        equipment: [],
        reagents: []
      });
      alert('연구 정보가 성공적으로 수정되었습니다.');
    }
  };

  const handleCloseEditModal = () => {
    setShowEditResearchModal(false);
    setResearchToEdit(null);
    setNewResearch({
      title: '',
      equipment: [],
      reagents: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sub Header */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold text-gray-800">마이페이지</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button 
              className={`px-6 py-4 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('profile')}
            >
              프로필
            </button>
            <button 
              className={`px-6 py-4 font-medium ${activeTab === 'research' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('research')}
            >
              연구 정보
            </button>
            <button 
              className={`px-6 py-4 font-medium ${activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('settings')}
            >
              설정
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-12">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">프로필 정보</h2>
                  {!isEditing ? (
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      onClick={() => setIsEditing(true)}
                    >
                      프로필 편집
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button 
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                        onClick={() => setIsEditing(false)}
                      >
                        취소
                      </button>
                      <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        onClick={handleSaveProfile}
                      >
                        저장
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-16">
                  {/* Profile Image */}
                  <div className="flex flex-col items-center space-y-8">
                    {userProfile.profile_image_url ? (
                      <img 
                        src={userProfile.profile_image_url} 
                        alt={userProfile.name}
                        className="w-40 h-40 rounded-full object-cover border-4 border-blue-100"
                      />
                    ) : (
                      <div className="w-48 h-48 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-6xl border-4 border-blue-100">
                        {getInitials(userProfile.name)}
                      </div>
                    )}
                    {isEditing && (
                      <button className="text-blue-600 hover:text-blue-700 text-sm">
                        이미지 변경
                      </button>
                    )}
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">이름</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={userProfile.name}
                            onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-800 text-lg">{userProfile.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">이메일</label>
                        <p className="text-gray-800 text-lg">{userProfile.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">소속</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={userProfile.affiliation || ''}
                            onChange={(e) => setUserProfile({...userProfile, affiliation: e.target.value})}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-800 text-lg">{userProfile.affiliation || '소속 미입력'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Google Scholar ID</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={userProfile.google_scholar_id || ''}
                            onChange={(e) => setUserProfile({...userProfile, google_scholar_id: e.target.value})}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-800 text-lg">{userProfile.google_scholar_id || '미입력'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">LinkedIn</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={userProfile.linkedin || ''}
                            onChange={(e) => setUserProfile({...userProfile, linkedin: e.target.value})}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-800 text-lg">{userProfile.linkedin || '미입력'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Research Tab */}
            {activeTab === 'research' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">연구 정보</h2>
                  <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={handleAddResearch}
                  >
                    연구 정보 추가
                  </button>
                </div>

                <div className="space-y-8">
                  <ResearchSection title="현재 관심있는 연구분야" items={userProfile.current_interests} />
                  <ResearchItemSection title="현재 진행중인 연구분야" researchItems={userProfile.ongoing_research} type="ongoing" />
                  <ResearchItemSection title="과거 진행했던 연구분야" researchItems={userProfile.past_research} type="past" />
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-800">설정</h2>
                
                <div className="space-y-6">
                  <div className="border-b pb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">계정 설정</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 변경</label>
                        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                          비밀번호 변경
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이메일 알림 설정</label>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" defaultChecked />
                            <span className="ml-2 text-gray-700">새로운 메시지 알림</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" defaultChecked />
                            <span className="ml-2 text-gray-700">연구자 매칭 알림</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b pb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">프라이버시 설정</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">프로필 공개 설정</label>
                        <select className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="public">모든 사용자에게 공개</option>
                          <option value="registered">가입한 사용자에게만 공개</option>
                          <option value="private">비공개</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">계정 삭제</h3>
                    <p className="text-gray-600 mb-4">계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.</p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                      계정 삭제
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 연구 정보 추가 모달 */}
      {showAddResearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">연구 정보 추가</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleCloseModal}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Google Scholar URL 입력 */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Scholar URL</label>
                    <p className="text-sm text-gray-500 mb-2">Google Scholar에서 연구 정보를 가져오려면 URL을 입력하세요.</p>
                    <div className="flex space-x-2">
                      <input 
                        type="text" 
                        value={googleScholarUrl}
                        onChange={(e) => setGoogleScholarUrl(e.target.value)}
                        placeholder="https://scholar.google.com/citations?user=..."
                        className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        onClick={handleProcessGoogleScholar}
                        disabled={isProcessing}
                      >
                        {isProcessing ? '처리 중...' : '가져오기'}
                      </button>
                    </div>
                    {isProcessing && (
                      <div className="mt-2 flex items-center text-blue-600">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Google Scholar에서 데이터를 가져오는 중입니다...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 수동 입력 */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">연구 제목</label>
                    <input 
                      type="text" 
                      value={newResearch.title}
                      onChange={(e) => setNewResearch({...newResearch, title: e.target.value})}
                      placeholder="연구 제목을 입력하세요"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 사용기기 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">사용기기</label>
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[100px] p-2 border border-gray-200 rounded-md">
                    {newResearch.equipment && newResearch.equipment.length > 0 ? (
                      newResearch.equipment.map((equip, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center">
                          {equip}
                          <button 
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            onClick={() => handleRemoveEquipment(i)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">사용기기를 추가하세요</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="새 기기 추가"
                      className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          handleAddEquipment(input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <button 
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        handleAddEquipment(input.value);
                        input.value = '';
                      }}
                    >
                      추가
                    </button>
                  </div>
                </div>
                
                {/* 사용시약 및 리소스 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">사용시약 및 리소스</label>
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[100px] p-2 border border-gray-200 rounded-md">
                    {newResearch.reagents && newResearch.reagents.length > 0 ? (
                      newResearch.reagents.map((reagent, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center">
                          {reagent}
                          <button 
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            onClick={() => handleRemoveReagent(i)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">사용시약 및 리소스를 추가하세요</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="새 시약/리소스 추가"
                      className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          handleAddReagent(input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <button 
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        handleAddReagent(input.value);
                        input.value = '';
                      }}
                    >
                      추가
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-6 mt-6 border-t">
                <button 
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                  onClick={handleCloseModal}
                >
                  취소
                </button>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={handleSaveResearch}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 연구 정보 삭제 확인 모달 */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">연구 정보 삭제</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={cancelDeleteResearch}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                이 연구 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              
              <div className="flex justify-end space-x-2">
                <button 
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                  onClick={cancelDeleteResearch}
                >
                  취소
                </button>
                <button 
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  onClick={confirmDeleteResearch}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 연구 정보 수정 모달 */}
      {showEditResearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">연구 정보 수정</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleCloseEditModal}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">연구 제목</label>
                  <input 
                    type="text" 
                    value={newResearch.title}
                    onChange={(e) => setNewResearch({...newResearch, title: e.target.value})}
                    placeholder="연구 제목을 입력하세요"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 사용기기 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">사용기기</label>
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[100px] p-2 border border-gray-200 rounded-md">
                    {newResearch.equipment && newResearch.equipment.length > 0 ? (
                      newResearch.equipment.map((equip, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center">
                          {equip}
                          <button 
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            onClick={() => handleRemoveEquipment(i)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">사용기기를 추가하세요</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="새 기기 추가"
                      className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          handleAddEquipment(input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <button 
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        handleAddEquipment(input.value);
                        input.value = '';
                      }}
                    >
                      추가
                    </button>
                  </div>
                </div>
                
                {/* 사용시약 및 리소스 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">사용시약 및 리소스</label>
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[100px] p-2 border border-gray-200 rounded-md">
                    {newResearch.reagents && newResearch.reagents.length > 0 ? (
                      newResearch.reagents.map((reagent, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center">
                          {reagent}
                          <button 
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            onClick={() => handleRemoveReagent(i)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">사용시약 및 리소스를 추가하세요</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="새 시약/리소스 추가"
                      className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          handleAddReagent(input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <button 
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        handleAddReagent(input.value);
                        input.value = '';
                      }}
                    >
                      추가
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-6 mt-6 border-t">
                <button 
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                  onClick={handleCloseEditModal}
                >
                  취소
                </button>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={handleSaveEdit}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 