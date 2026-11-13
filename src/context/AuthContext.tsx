'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@/lib/types';
import { initialUsers } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  users: User[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => { success: boolean; message?: string };
  updateUser: (id: string, userData: Partial<User>) => { success: boolean; message?: string };
  deleteUser: (id: string) => { success: boolean; message?: string };
  hasRole: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_USERS_KEY = 'eloh_crm_registered_users';
const STORAGE_SESSION_KEY = 'eloh_crm_session_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados na inicialização
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_USERS_KEY);
      let currentUsers = initialUsers;

      if (storedUsers) {
        try {
          const parsed = JSON.parse(storedUsers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentUsers = parsed;
            setUsers(parsed);
          }
        } catch (e) {
          console.error('Erro ao ler usuários do localStorage:', e);
        }
      } else {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(initialUsers));
      }

      // Carregar sessão ativa
      const storedSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (storedSession) {
        try {
          const parsedSession = JSON.parse(storedSession);
          // Confirmar se o usuário da sessão ainda existe e está ativo
          const freshUser = currentUsers.find((u) => u.id === parsedSession.id);
          if (freshUser && freshUser.status === 'ACTIVE') {
            setUser(freshUser);
          } else {
            localStorage.removeItem(STORAGE_SESSION_KEY);
            setUser(null);
          }
        } catch (e) {
          console.error('Erro ao ler sessão do localStorage:', e);
        }
      }
    } catch (e) {
      console.error('Falha no armazenamento local de auth:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login com validação de email e senha cadastrados
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const targetUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!targetUser) {
      return { success: false, message: 'Nenhum usuário cadastrado com este e-mail.' };
    }

    if (targetUser.password !== cleanPassword) {
      return { success: false, message: 'Senha incorreta. Verifique a senha digitada.' };
    }

    if (targetUser.status === 'INACTIVE') {
      return { success: false, message: 'Acesso bloqueado: este usuário foi inativado pelo administrador.' };
    }

    // Login com sucesso: atualizar último login
    const updatedUser: User = {
      ...targetUser,
      lastLogin: new Date().toISOString(),
    };

    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedUsers);
    setUser(updatedUser);

    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.error('Erro ao persistir sessão:', e);
    }

    return { success: true };
  };

  // Logout e limpeza de sessão
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch (e) {
      console.error('Erro ao limpar sessão:', e);
    }
    router.push('/login');
  };

  // Cadastrar novo usuário (Apenas Administrador)
  const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): { success: boolean; message?: string } => {
    if (user?.role !== 'ADMIN') {
      return { success: false, message: 'Apenas Administradores podem cadastrar novos usuários.' };
    }

    const emailExists = users.some((u) => u.email.toLowerCase() === userData.email.trim().toLowerCase());
    if (emailExists) {
      return { success: false, message: 'Já existe um usuário cadastrado com este e-mail.' };
    }

    if (!userData.password || userData.password.length < 4) {
      return { success: false, message: 'A senha deve possuir pelo menos 4 caracteres.' };
    }

    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      email: userData.email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    const updatedList = [newUser, ...users];
    setUsers(updatedList);
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Erro ao salvar usuário:', e);
    }

    return { success: true };
  };

  // Atualizar dados de um usuário (Apenas Administrador)
  const updateUser = (id: string, userData: Partial<User>): { success: boolean; message?: string } => {
    if (user?.role !== 'ADMIN') {
      return { success: false, message: 'Apenas Administradores podem alterar usuários.' };
    }

    // Verificar e-mail duplicado se alterou o e-mail
    if (userData.email) {
      const emailClash = users.some(
        (u) => u.id !== id && u.email.toLowerCase() === userData.email!.trim().toLowerCase()
      );
      if (emailClash) {
        return { success: false, message: 'Este e-mail já está sendo utilizado por outro usuário.' };
      }
    }

    const updatedList = users.map((u) => {
      if (u.id !== id) return u;
      return {
        ...u,
        ...userData,
        email: userData.email ? userData.email.trim().toLowerCase() : u.email,
        password: userData.password && userData.password.trim() !== '' ? userData.password : u.password,
      };
    });

    setUsers(updatedList);
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Erro ao atualizar usuário:', e);
    }

    // Se o usuário atualizou os próprios dados, sincronizar a sessão
    if (user?.id === id) {
      const refreshedCurrentUser = updatedList.find((u) => u.id === id);
      if (refreshedCurrentUser) {
        setUser(refreshedCurrentUser);
        try {
          localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(refreshedCurrentUser));
        } catch (e) {
          console.error('Erro ao atualizar sessão do usuário atual:', e);
        }
      }
    }

    return { success: true };
  };

  // Excluir usuário (Apenas Administrador)
  const deleteUser = (id: string): { success: boolean; message?: string } => {
    if (user?.role !== 'ADMIN') {
      return { success: false, message: 'Apenas Administradores podem excluir usuários.' };
    }

    if (user?.id === id) {
      return { success: false, message: 'Você não pode excluir sua própria conta conectada.' };
    }

    const updatedList = users.filter((u) => u.id !== id);
    setUsers(updatedList);
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Erro ao excluir usuário:', e);
    }

    return { success: true };
  };

  // Helper para checar se o usuário atual possui um dos níveis permitidos
  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true; // Administrador tem acesso a tudo
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isLoading,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

