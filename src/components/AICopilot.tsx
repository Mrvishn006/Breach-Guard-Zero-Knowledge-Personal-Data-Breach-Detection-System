import React from 'react';
import { BreachGuardAssistant } from './BreachGuardAssistant';
import { AIChatMessage, CorrelatedIncident } from '../types';

interface AICopilotProps {
  messages: AIChatMessage[];
  onSendMessage: (query: string) => Promise<void>;
  onSelectIncident: (incident: CorrelatedIncident) => void;
  onSimulateAttack?: () => void;
  isTelemetryLive?: boolean;
}

/**
 * Backward compatibility alias forwarding to BreachGuardAssistant
 */
export const AICopilot: React.FC<AICopilotProps> = (props) => {
  return <BreachGuardAssistant {...props} />;
};

export default AICopilot;
