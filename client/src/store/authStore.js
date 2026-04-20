import create from 'zustand';
import apiClient from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoading: false,
  error: null,

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      set({
        user: response.data.user,
        token: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        isLoading: false
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  // Register
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/register', userData);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      set({
        user: response.data.user,
        token: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        isLoading: false
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  // Request OTP
  requestOTP: async (email, type = 'email_verification') => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/request-otp', { email, type });
      set({ isLoading: false });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to request OTP';
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp, type) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/verify-otp', { email, otp, type });
      set({ isLoading: false });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'OTP verification failed';
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  // Get Current User
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      set({ user: response.data.user });
      return response.data.user;
    } catch (err) {
      set({ user: null });
    }
  },

  // Logout
  logout: async () => {
    try {
      const state = get();
      if (state.refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken: state.refreshToken });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, token: null, refreshToken: null });
    }
  },

  // Clear Error
  clearError: () => set({ error: null }),

  // Set User
  setUser: (user) => set({ user })
}));

export const useElectionStore = create((set) => ({
  elections: [],
  activeElection: null,
  isLoading: false,
  error: null,

  // Get Elections
  getElections: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/elections');
      set({ elections: response.data.elections, isLoading: false });
      return response.data.elections;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch elections';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Get Active Election
  getActiveElection: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/elections/active');
      set({ activeElection: response.data.election, isLoading: false });
      return response.data.election;
    } catch (err) {
      set({ activeElection: null, isLoading: false });
    }
  },

  // Set Active Election
  setActiveElection: (election) => set({ activeElection: election }),
  clearError: () => set({ error: null })
}));

export const useVotingStore = create((set) => ({
  hasVoted: false,
  voteStatus: null,
  isLoading: false,
  error: null,

  // Cast Vote
  castVote: async (candidateId, electionId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/votes/cast', { candidateId, electionId });
      set({ hasVoted: true, voteStatus: response.data.vote, isLoading: false });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cast vote';
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  // Get Vote Status
  getVoteStatus: async (electionId) => {
    try {
      const response = await apiClient.get(`/votes/status/${electionId}`);
      set({ hasVoted: response.data.hasVoted, voteStatus: response.data.vote });
      return response.data;
    } catch (err) {
      set({ hasVoted: false, voteStatus: null });
    }
  },

  // Get Results
  getResults: async (electionId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/votes/results/${electionId}`);
      set({ isLoading: false });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch results';
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
  resetVote: () => set({ hasVoted: false, voteStatus: null })
}));
