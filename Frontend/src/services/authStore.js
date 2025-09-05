register: async (userData) => {
  set({ isLoading: true, error: null });
  try {
    const response = await authService.register(userData);
    set({ 
      user: response.data.user, 
      student: response.data.student, // Store student data too
      isAuthenticated: true, 
      isLoading: false 
    });
    return response;
  } catch (error) {
    // Handle error
  }
},