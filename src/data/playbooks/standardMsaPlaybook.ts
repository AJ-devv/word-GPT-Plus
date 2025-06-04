// standardMsaPlaybook.ts

export const standardMsaPlaybook = {
  id: 1001,
  name: 'MSA Review Playbook',
  description: 'Standard Master Services Agreement clauses',
  type: 'standard',
  rules: [
    {
      name: 'Payment Terms',
      instruction: 'Ensure the payment terms specify timing, method, and consequences for late payment.',
      condition: 'Look for "net 30", "invoice due", or "late fee".',
      response: 'suggestion',
      comment: 'Unclear payment terms create disputes.',
      tags: ['payment']
    },
    {
      name: 'Scope of Services',
      instruction: 'Verify the services and deliverables are clearly defined.',
      condition: 'Check sections labeled “Scope” or “Services Provided”.',
      response: 'suggestion',
      comment: 'Vague descriptions weaken enforcement.',
      tags: ['scope']
    },
    {
      name: 'Termination for Convenience',
      instruction: 'Ensure there is clarity on whether either party can terminate without cause.',
      condition: 'Look for "termination without cause" or "for convenience".',
      response: 'suggestion',
      comment: 'This affects the agreement’s reliability.',
      tags: ['termination']
    }
  ]
}
