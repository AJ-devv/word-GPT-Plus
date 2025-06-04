import { enhancedMndaPlaybook } from './enhancedMnda'
import { standardMsaPlaybook } from './standardMsaPlaybook'

export const standardPlaybooks = [
  {
    id: 101,
    name: 'Common Paper Mutual NDA',
    description: 'Standard NDA playbook based on Common Paper v1.0 with clause-level AI instructions',
    type: 'standard',
    rules: enhancedMndaPlaybook
  },
  standardMsaPlaybook
]
export type StandardPlaybook = typeof standardPlaybooks[number];
export type StandardPlaybookRule = typeof standardMsaPlaybook.rules[number];