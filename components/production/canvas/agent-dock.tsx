import { Icons } from "@/components/production/ui/icons";
import { AgentAvatarPreview } from "@/components/production/ui/agent-avatar-preview";
import { useAuth } from "@/components/production/hooks/use-auth";
import { cn } from "@/lib/cn";
import type { AgentAvatarStyleKey } from "@/components/production/lib/dicebear-styles";

interface Agent {
  id: string;
  letter: string;
  avatarSeed?: string;
  statusColor?: string;
  color?: string;
}

interface AgentDockProps {
  agents: Agent[];
  onAddAgent?: () => void;
  className?: string;
  "data-testid"?: string;
}

export function AgentDock({
  agents,
  onAddAgent,
  className,
  "data-testid": testId = "agent-dock",
}: AgentDockProps) {
  const { user } = useAuth();
  const avatarStyleKey = (user?.agent_avatar_style ?? "glass") as AgentAvatarStyleKey;

  return (
    <div
      className={cn(
        "group/dock inline-flex items-center rounded-full border border-glass-stroke bg-glass-fill p-1 shadow-glass backdrop-blur-glass",
        className,
      )}
      data-testid={testId}
    >
      <div className="flex items-center" data-testid="agent-avatars">
        {agents.map((agent, index) => (
          <AgentAvatarPreview
            key={agent.id}
            styleKey={avatarStyleKey}
            seed={agent.avatarSeed || agent.letter}
            size={28}
            className={cn(index > 0 && "-ml-1.5")}
            data-testid={`agent-avatar-${agent.id}`}
          />
        ))}
        <button
          type="button"
          onClick={onAddAgent}
          aria-label="Add agent"
          className={cn(
            "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            "border border-dashed border-glass-stroke-subtle bg-transparent",
            "text-muted transition-all hover:border-accent hover:text-accent",
            agents.length > 0 && "-ml-1.5",
          )}
          data-testid="agent-dock-add"
        >
          <Icons.Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export type { Agent, AgentDockProps };
