import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signupSuccess: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  clearError: () => void;
  clearSignupSuccess: () => void;
}

// 임시 사용자 데이터 (실제로는 서버에서 관리되어야 함)
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password123', // 실제로는 해시된 비밀번호를 사용해야 함
    name: '테스트 사용자',
    role: 'researcher'
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      signupSuccess: false,
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // mockUsers에서 사용자 찾기
          const user = mockUsers.find(u => u.email === email && u.password === password);

          if (user) {
            // 비밀번호를 제외한 사용자 정보 저장
            const { password, ...userWithoutPassword } = user;
            const token = 'mock-jwt-token'; // 실제로는 서버에서 받아와야 함

            set({
              user: { ...userWithoutPassword, token },
              token,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            set({
              error: '이메일 또는 비밀번호가 올바르지 않습니다.',
              isLoading: false
            });
            throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
          }
        } catch (error) {
          set({
            error: '로그인 중 오류가 발생했습니다.',
            isLoading: false
          });
          throw error;
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },
      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          // 실제로는 API 호출을 통해 회원가입을 처리해야 함
          // 여기서는 임시로 성공했다고 가정
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // 이미 존재하는 이메일인지 확인
          if (mockUsers.some(u => u.email === email)) {
            set({
              error: '이미 사용 중인 이메일입니다.',
              isLoading: false
            });
            return;
          }
          
          // 새 사용자 추가 (실제로는 서버에 저장)
          const newUser = {
            id: String(mockUsers.length + 1),
            email,
            password,
            name,
            role: 'researcher'
          };
          
          mockUsers.push(newUser);
          
          set({
            isLoading: false,
            signupSuccess: true
          });
        } catch (error) {
          set({
            error: '회원가입 중 오류가 발생했습니다.',
            isLoading: false
          });
        }
      },
      clearError: () => set({ error: null }),
      clearSignupSuccess: () => set({ signupSuccess: false })
    }),
    {
      name: 'auth-storage',
    }
  )
); 