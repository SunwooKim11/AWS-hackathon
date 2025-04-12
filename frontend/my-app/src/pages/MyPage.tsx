import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ResearchItem {
  title: string;
  equipment: string[];
  reagents: string[];
}

interface ProfileData {
  name: string;
  email: string;
  affiliation: string;
  position: string;
  research_interests: string[];
  profile_image: string | null;
  ongoing_research: ResearchItem[];
  past_research: ResearchItem[];
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'research'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    affiliation: '',
    position: '',
    research_interests: [],
    profile_image: null,
    ongoing_research: [],
    past_research: []
  });
  const [newResearch, setNewResearch] = useState<ResearchItem>({
    title: '',
    equipment: [],
    reagents: []
  });
  const [showAddResearchModal, setShowAddResearchModal] = useState(false);
  const [googleScholarUrl, setGoogleScholarUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [researchToDelete, setResearchToDelete] = useState<{ index: number; type: 'ongoing' | 'past' } | null>(null);
  const [showEditResearchModal, setShowEditResearchModal] = useState(false);
  const [researchToEdit, setResearchToEdit] = useState<{ index: number; type: 'ongoing' | 'past'; data: ResearchItem } | null>(null);

  // 로그인 상태 확인 및 초기 데이터 로드
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    // 로그인한 사용자 정보로 프로필 데이터 초기화
    setProfileData(prevData => ({
      ...prevData,
      name: user.name || '',
      email: user.email || '',
      // 나머지 데이터는 서버에서 가져와야 하지만, 현재는 임시 데이터 사용
      affiliation: '서울대학교 생명과학부',
      position: '박사과정',
      research_interests: ['유전체학', '단백체학', '생물정보학'],
      profile_image: null,
      ongoing_research: [
        {
          title: '암세포의 대사 변화 연구',
          equipment: ['세포 배양기', '유세포 분석기', 'PCR 기기'],
          reagents: ['DMEM 배지', 'FBS', 'Trypsin-EDTA']
        },
        {
          title: '신경세포 분화 메커니즘 연구',
          equipment: ['현미경', '세포 배양기', 'Western Blot 장비'],
          reagents: ['NGF', 'BDNF', 'Laminin']
        }
      ],
      past_research: [
        {
          title: '줄기세포 분화 연구',
          equipment: ['세포 배양기', '유세포 분석기'],
          reagents: ['FGF2', 'BMP4', 'Retinoic acid']
        }
      ]
    }));
  }, [isAuthenticated, user, navigate]);

  const handleSaveProfile = async () => {
    try {
      // API 호출을 통해 프로필 정보를 저장
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}` // JWT 토큰 추가
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error('프로필 저장에 실패했습니다.');
      }

      // 성공 메시지 표시
      alert('프로필이 성공적으로 저장되었습니다.');
      setIsEditing(false);
    } catch (error) {
      console.error('프로필 저장 중 오류:', error);
      alert('프로필 저장 중 오류가 발생했습니다.');
    }
  };

  const handleAddResearch = () => {
    setShowAddResearchModal(true);
  };

  const handleCloseAddResearchModal = () => {
    setShowAddResearchModal(false);
    setNewResearch({
      title: '',
      equipment: [],
      reagents: []
    });
    setGoogleScholarUrl('');
  };

  const handleProcessGoogleScholar = async () => {
    if (!googleScholarUrl) return;
    
    setIsProcessing(true);
    
    try {
      // 실제로는 Google Scholar API를 호출하여 데이터를 가져와야 함
      // 여기서는 임시 데이터를 사용
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setNewResearch({
        title: '새로운 연구 프로젝트',
        equipment: ['장비 1', '장비 2'],
        reagents: ['시약 1', '시약 2']
      });
    } catch (error) {
      console.error('Google Scholar 데이터 처리 중 오류:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveResearch = () => {
    if (!newResearch.title) return;
    
    setProfileData(prev => ({
      ...prev,
      ongoing_research: [...prev.ongoing_research, newResearch]
    }));
    
    handleCloseAddResearchModal();
  };

  const handleDeleteResearch = (index: number, type: 'ongoing' | 'past') => {
    setResearchToDelete({ index, type });
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteResearch = () => {
    if (!researchToDelete) return;
    
    const { index, type } = researchToDelete;
    
    setProfileData(prev => {
      const updatedData = { ...prev };
      if (type === 'ongoing') {
        updatedData.ongoing_research = prev.ongoing_research.filter((_, i) => i !== index);
      } else {
        updatedData.past_research = prev.past_research.filter((_, i) => i !== index);
      }
      return updatedData;
    });
    
    setShowDeleteConfirmModal(false);
    setResearchToDelete(null);
  };

  const cancelDeleteResearch = () => {
    setShowDeleteConfirmModal(false);
    setResearchToDelete(null);
  };

  const handleEditResearch = (index: number, type: 'ongoing' | 'past') => {
    const researchData = type === 'ongoing' 
      ? profileData.ongoing_research[index] 
      : profileData.past_research[index];
    
    setResearchToEdit({ index, type, data: { ...researchData } });
    setShowEditResearchModal(true);
  };

  const handleSaveEdit = () => {
    if (!researchToEdit) return;
    
    const { index, type, data } = researchToEdit;
    
    setProfileData(prev => {
      const updatedData = { ...prev };
      if (type === 'ongoing') {
        updatedData.ongoing_research = prev.ongoing_research.map((item, i) => 
          i === index ? data : item
        );
      } else {
        updatedData.past_research = prev.past_research.map((item, i) => 
          i === index ? data : item
        );
      }
      return updatedData;
    });
    
    setShowEditResearchModal(false);
    setResearchToEdit(null);
  };

  const handleCloseEditModal = () => {
    setShowEditResearchModal(false);
    setResearchToEdit(null);
  };

  const handleAddEquipment = () => {
    if (!researchToEdit) return;
    
    setResearchToEdit({
      ...researchToEdit,
      data: {
        ...researchToEdit.data,
        equipment: [...researchToEdit.data.equipment, '']
      }
    });
  };

  const handleAddReagent = () => {
    if (!researchToEdit) return;
    
    setResearchToEdit({
      ...researchToEdit,
      data: {
        ...researchToEdit.data,
        reagents: [...researchToEdit.data.reagents, '']
      }
    });
  };

  const handleRemoveEquipment = (index: number) => {
    if (!researchToEdit) return;
    
    setResearchToEdit({
      ...researchToEdit,
      data: {
        ...researchToEdit.data,
        equipment: researchToEdit.data.equipment.filter((_, i) => i !== index)
      }
    });
  };

  const handleRemoveReagent = (index: number) => {
    if (!researchToEdit) return;
    
    setResearchToEdit({
      ...researchToEdit,
      data: {
        ...researchToEdit.data,
        reagents: researchToEdit.data.reagents.filter((_, i) => i !== index)
      }
    });
  };

  const handleUpdateEquipment = (index: number, value: string) => {
    if (!researchToEdit) return;
    
    setResearchToEdit({
      ...researchToEdit,
      data: {
        ...researchToEdit.data,
        equipment: researchToEdit.data.equipment.map((item, i) => 
          i === index ? value : item
        )
      }
    });
  };

  const handleUpdateReagent = (index: number, value: string) => {
    if (!researchToEdit) return;
    
    setResearchToEdit({
      ...researchToEdit,
      data: {
        ...researchToEdit.data,
        reagents: researchToEdit.data.reagents.map((item, i) => 
          i === index ? value : item
        )
      }
    });
  };

  const ResearchItemSection: React.FC<{ 
    items: ResearchItem[], 
    title: string,
    onDelete: (index: number) => void,
    onEdit: (index: number) => void
  }> = ({ items, title, onDelete, onEdit }) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      {items.length === 0 ? (
        <p className="text-gray-500 italic">등록된 연구 정보가 없습니다.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-medium text-gray-800">{item.title}</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">사용장비</h5>
                  <div className="flex flex-wrap gap-2">
                    {item.equipment.map((equip, i) => (
                      <span key={i} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {equip}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">사용시약 및 리소스</h5>
                  <div className="flex flex-wrap gap-2">
                    {item.reagents.map((reagent, i) => (
                      <span key={i} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                        {reagent}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (!isAuthenticated || !user) {
    return <div className="min-h-screen flex items-center justify-center">로그인이 필요합니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* 탭 메뉴 */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                프로필 정보
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'research'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('research')}
              >
                연구 정보
              </button>
            </nav>
          </div>

          {/* 프로필 정보 탭 */}
          {activeTab === 'profile' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">프로필 정보</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    편집
                  </button>
                ) : (
                  <button
                    onClick={handleSaveProfile}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    저장
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* 프로필 이미지 */}
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    {profileData.profile_image ? (
                      <img
                        src={profileData.profile_image}
                        alt={profileData.name}
                        className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center border-4 border-gray-200">
                        <span className="text-5xl font-bold text-blue-600">
                          {profileData.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {isEditing && (
                      <button className="mt-4 text-blue-600 hover:text-blue-800">
                        이미지 변경
                      </button>
                    )}
                  </div>
                </div>

                {/* 프로필 상세 정보 */}
                <div className="md:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이름
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({ ...profileData, name: e.target.value })
                          }
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-lg text-gray-900">{profileData.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이메일
                      </label>
                      <p className="text-lg text-gray-900">{profileData.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        소속
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.affiliation}
                          onChange={(e) =>
                            setProfileData({ ...profileData, affiliation: e.target.value })
                          }
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-lg text-gray-900">{profileData.affiliation}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        직위
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.position}
                          onChange={(e) =>
                            setProfileData({ ...profileData, position: e.target.value })
                          }
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-lg text-gray-900">{profileData.position}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연구 관심 분야
                    </label>
                    {isEditing ? (
                      <div className="space-y-2">
                        {profileData.research_interests.map((interest, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="text"
                              value={interest}
                              onChange={(e) => {
                                const newInterests = [...profileData.research_interests];
                                newInterests[index] = e.target.value;
                                setProfileData({
                                  ...profileData,
                                  research_interests: newInterests,
                                });
                              }}
                              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              onClick={() => {
                                const newInterests = profileData.research_interests.filter(
                                  (_, i) => i !== index
                                );
                                setProfileData({
                                  ...profileData,
                                  research_interests: newInterests,
                                });
                              }}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() =>
                            setProfileData({
                              ...profileData,
                              research_interests: [
                                ...profileData.research_interests,
                                '',
                              ],
                            })
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          + 관심 분야 추가
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profileData.research_interests.map((interest, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 연구 정보 탭 */}
          {activeTab === 'research' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">연구 정보</h2>
                <button
                  onClick={handleAddResearch}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  연구 정보 추가
                </button>
              </div>

              <div className="space-y-12">
                <ResearchItemSection 
                  items={profileData.ongoing_research} 
                  title="진행 중인 연구" 
                  onDelete={(index) => handleDeleteResearch(index, 'ongoing')}
                  onEdit={(index) => handleEditResearch(index, 'ongoing')}
                />
                <ResearchItemSection 
                  items={profileData.past_research} 
                  title="과거 연구" 
                  onDelete={(index) => handleDeleteResearch(index, 'past')}
                  onEdit={(index) => handleEditResearch(index, 'past')}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 연구 정보 추가 모달 */}
      {showAddResearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">연구 정보 추가</h3>
              <button
                onClick={handleCloseAddResearchModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Scholar URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={googleScholarUrl}
                      onChange={(e) => setGoogleScholarUrl(e.target.value)}
                      placeholder="https://scholar.google.com/..."
                      className="flex-1 p-3 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleProcessGoogleScholar}
                      disabled={isProcessing || !googleScholarUrl}
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isProcessing ? '처리 중...' : '가져오기'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연구 제목
                  </label>
                  <input
                    type="text"
                    value={newResearch.title}
                    onChange={(e) =>
                      setNewResearch({ ...newResearch, title: e.target.value })
                    }
                    placeholder="연구 제목을 입력하세요"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사용 장비
                  </label>
                  <div className="min-h-[120px] border border-gray-300 rounded-md p-4 space-y-2">
                    {newResearch.equipment.length === 0 ? (
                      <p className="text-gray-500 text-sm">장비를 추가해주세요</p>
                    ) : (
                      newResearch.equipment.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const newEquipment = [...newResearch.equipment];
                              newEquipment[index] = e.target.value;
                              setNewResearch({
                                ...newResearch,
                                equipment: newEquipment,
                              });
                            }}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="장비 이름"
                          />
                          <button
                            onClick={() => {
                              const newEquipment = newResearch.equipment.filter(
                                (_, i) => i !== index
                              );
                              setNewResearch({
                                ...newResearch,
                                equipment: newEquipment,
                              });
                            }}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                    <button
                      onClick={() =>
                        setNewResearch({
                          ...newResearch,
                          equipment: [...newResearch.equipment, ''],
                        })
                      }
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + 장비 추가
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사용 시약 및 리소스
                  </label>
                  <div className="min-h-[120px] border border-gray-300 rounded-md p-4 space-y-2">
                    {newResearch.reagents.length === 0 ? (
                      <p className="text-gray-500 text-sm">시약 및 리소스를 추가해주세요</p>
                    ) : (
                      newResearch.reagents.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const newReagents = [...newResearch.reagents];
                              newReagents[index] = e.target.value;
                              setNewResearch({
                                ...newResearch,
                                reagents: newReagents,
                              });
                            }}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="시약 또는 리소스 이름"
                          />
                          <button
                            onClick={() => {
                              const newReagents = newResearch.reagents.filter(
                                (_, i) => i !== index
                              );
                              setNewResearch({
                                ...newResearch,
                                reagents: newReagents,
                              });
                            }}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                    <button
                      onClick={() =>
                        setNewResearch({
                          ...newResearch,
                          reagents: [...newResearch.reagents, ''],
                        })
                      }
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + 시약/리소스 추가
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleCloseAddResearchModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveResearch}
                  disabled={!newResearch.title}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">연구 정보 삭제</h3>
            <p className="text-gray-700 mb-6">
              이 연구 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDeleteResearch}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={confirmDeleteResearch}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 연구 정보 편집 모달 */}
      {showEditResearchModal && researchToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">연구 정보 편집</h3>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연구 제목
                </label>
                <input
                  type="text"
                  value={researchToEdit.data.title}
                  onChange={(e) =>
                    setResearchToEdit({
                      ...researchToEdit,
                      data: { ...researchToEdit.data, title: e.target.value },
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사용 장비
                  </label>
                  <div className="min-h-[120px] border border-gray-300 rounded-md p-4 space-y-2">
                    {researchToEdit.data.equipment.length === 0 ? (
                      <p className="text-gray-500 text-sm">장비를 추가해주세요</p>
                    ) : (
                      researchToEdit.data.equipment.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleUpdateEquipment(index, e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="장비 이름"
                          />
                          <button
                            onClick={() => handleRemoveEquipment(index)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                    <button
                      onClick={handleAddEquipment}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + 장비 추가
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사용 시약 및 리소스
                  </label>
                  <div className="min-h-[120px] border border-gray-300 rounded-md p-4 space-y-2">
                    {researchToEdit.data.reagents.length === 0 ? (
                      <p className="text-gray-500 text-sm">시약 및 리소스를 추가해주세요</p>
                    ) : (
                      researchToEdit.data.reagents.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleUpdateReagent(index, e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="시약 또는 리소스 이름"
                          />
                          <button
                            onClick={() => handleRemoveReagent(index)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                    <button
                      onClick={handleAddReagent}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + 시약/리소스 추가
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={!researchToEdit.data.title}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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
};

export default MyPage; 