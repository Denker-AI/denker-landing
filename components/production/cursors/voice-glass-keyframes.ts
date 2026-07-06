/**
 * Keyframes for the voice indicator glass visuals, shared between the
 * desktop voice indicator (which injects them as a singleton <style> tag)
 * and the glass audit presence view (which inlines them in a <style>
 * element). Kept in a leaf module so consumers don't pull the desktop
 * voice-indicator's store imports into their bundles.
 */
const VOICE_GLASS_KEYFRAMES_ID = "denker-voice-wave-keyframes";

export const VOICE_GLASS_KEYFRAMES_CSS = `
@keyframes denker-pulse {
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 1; }
}

@keyframes denker-voice-glass-reflect {
  0%, 100% { transform: translateX(calc(var(--voice-glass-travel, 18%) * -1)) skewX(-8deg); }
  50%      { transform: translateX(var(--voice-glass-travel, 18%)) skewX(8deg); }
}

@keyframes denker-voice-handoff-layout-in {
  0%   { opacity: 0.84; transform: scaleX(0.88); }
  100% { opacity: 1; transform: scaleX(1); }
}

@keyframes denker-voice-handoff-controls-in {
  0%   { transform: translateX(18px); }
  100% { transform: translateX(0); }
}

@keyframes denker-voice-handoff-state-in {
  0%   { opacity: 0; transform: translateX(-8px); }
  100% { opacity: 1; transform: translateX(0); }
}
`;

export function ensureVoiceGlassKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(VOICE_GLASS_KEYFRAMES_ID)) return;
  const style = document.createElement("style");
  style.id = VOICE_GLASS_KEYFRAMES_ID;
  style.textContent = VOICE_GLASS_KEYFRAMES_CSS;
  document.head.appendChild(style);
}
