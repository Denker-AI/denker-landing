type ProductionUser = {
  agent_avatar_style?: string | null;
};

export function useAuth() {
  return {
    user: { agent_avatar_style: "glass" } satisfies ProductionUser,
    isLoading: false,
    isAuthenticated: true,
  };
}
