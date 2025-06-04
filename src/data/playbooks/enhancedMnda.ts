export const enhancedMndaPlaybook = [
  {
    name: 'Confidential Information',
    instruction:
      'Define what qualifies as confidential information and what is excluded from that definition.',
    condition:
      'This rule applies to any non-public information disclosed by one party to the other in connection with the agreement.',
    responseType: 'redline',
    comment:
      'Typically includes written, oral, electronic info, and often excludes info that is public, independently developed, or known prior to disclosure.',
    clauseExample: `“Confidential Information” means any information disclosed by a party that is marked as confidential or which a reasonable person would understand to be confidential given the nature of the information and the circumstances of disclosure.`,
    clarification:
      'Helps both parties clearly define what counts as confidential, which is essential in avoiding disputes later.',
    tags: ['confidentiality', 'definition', 'core']
  },
  {
    name: 'Permitted Disclosures',
    instruction:
      'List the circumstances under which confidential information may be disclosed without breaching the agreement.',
    condition:
      'This rule applies to disclosures required by law, regulation, or court order.',
    responseType: 'redline',
    comment:
      'Includes disclosures to employees, contractors, or affiliates who need to know for business purposes.',
    clauseExample: `The Receiving Party may disclose Confidential Information to its employees, contractors, or legal advisors who have a need to know such information, provided they are bound by confidentiality obligations no less restrictive than those in this Agreement.`,
    clarification:
      'Allows for flexibility when disclosures are legally required or operationally necessary, reducing risk of breach.',
    tags: ['confidentiality', 'exceptions', 'compliance']
  },
  {
    name: 'Term of Confidentiality',
    instruction:
      'Specify the duration for which the confidentiality obligations will remain in effect.',
    condition:
      'This rule applies to all confidential information disclosed under the agreement.',
    responseType: 'redline',
    comment:
      'Typically lasts for a specified number of years after termination of the agreement.',
    clauseExample: `The confidentiality obligations shall survive for a period of three (3) years following the termination of this Agreement.`,
    clarification:
      'Ensures sensitive information is protected for a reasonable period after the business relationship ends.',
    tags: ['confidentiality', 'duration', 'survival']
  },
  {
    name: 'Purpose Limitation',
    instruction:
      'State the specific purpose for which the confidential information may be used.',
    condition:
      'This rule applies to clauses that restrict how the receiving party may use the disclosed information.',
    responseType: 'redline',
    comment:
      'Prevents overbroad use of information beyond the intended transaction or relationship.',
    clauseExample: `The Receiving Party shall use the Confidential Information solely for the purpose of evaluating a potential business relationship between the Parties.`,
    clarification:
      'Restricts usage of confidential info to only the purpose agreed upon, reducing risk of misuse.',
    tags: ['confidentiality', 'scope', 'usage']
  },
  {
    name: 'Non-Disclosure Obligations',
    instruction:
      'Specify that the receiving party must not disclose confidential information to unauthorized parties.',
    condition:
      'This rule applies to obligations requiring the receiving party to keep the information confidential.',
    responseType: 'redline',
    comment:
      'Ensures confidentiality is maintained and that information is not shared beyond permitted personnel.',
    clauseExample: `The Receiving Party agrees not to disclose any Confidential Information to any third party except as expressly permitted under this Agreement.`,
    clarification:
      'Establishes the default confidentiality expectation and who is allowed to access the information.',
    tags: ['confidentiality', 'restriction', 'obligation']
  },
  {
    name: 'Return or Destruction of Information',
    instruction:
      'Outline the process for returning or destroying confidential information upon termination of the agreement.',
    condition:
      'This rule applies when the business relationship ends or when requested by the disclosing party.',
    responseType: 'redline',
    comment:
      'Ensures that confidential information is not retained longer than necessary.',
    clauseExample:
      'Upon termination of this Agreement, the Receiving Party shall promptly return or destroy all Confidential Information, including all copies, whether written or electronic.',
    clarification:
      'Provides a clear process for handling confidential information at the end of the relationship, reducing risk of future misuse.',
    tags: ['termination', 'data retention', 'cleanup']
  },
  {
    name: 'Use of Confidential Information',
    instruction:
      'Define the permitted use of confidential information by the receiving party.',
    condition:
      'This rule applies to how the receiving party may or may not use confidential information disclosed under the agreement.',
    responseType: 'redline',
    comment:
      'Limits use of confidential information to specific business purposes and prohibits misuse.',
    clauseExample:
      'The Receiving Party shall use the Confidential Information solely for evaluating a potential business relationship and for no other purpose.',
    clarification:
      'Helps prevent confidential information from being used for competitive advantage or unauthorized activities.',
    tags: ['usage', 'restriction', 'confidentiality']
  },
  {
    name: 'Exceptions to Confidentiality',
    instruction:
      'List the categories of information that are not subject to confidentiality obligations.',
    condition:
      'This rule applies to information that is already public, independently developed, or received from a third party without restriction.',
    responseType: 'redline',
    comment: 'Clarifies what is excluded from confidentiality protections.',
    clauseExample:
      'Confidential Information shall not include information that is or becomes publicly available without breach, or was already known by the Receiving Party before disclosure.',
    clarification:
      'Protects the receiving party from unfair liability over information that is not genuinely confidential.',
    tags: ['exceptions', 'confidentiality', 'boundary']
  },
  {
    name: 'Governing Law and Jurisdiction',
    instruction:
      'Specify the legal jurisdiction and governing law that will apply to the agreement.',
    condition:
      'This rule applies to dispute resolution and interpretation of the agreement.',
    responseType: 'redline',
    comment:
      'Common clause in nearly all NDAs to reduce ambiguity about legal venue.',
    clauseExample:
      'This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles.',
    clarification:
      'Ensures both parties know what legal system will apply and where disputes will be handled.',
    tags: ['disputes', 'legal', 'jurisdiction']
  },
  {
    name: 'Intellectual Property Rights',
    instruction:
      'Clarify that disclosure of confidential information does not transfer ownership of any intellectual property.',
    condition:
      'This rule applies when parties share proprietary inventions, content, code, or ideas.',
    responseType: 'redline',
    comment:
      'Prevents misunderstanding about who owns what — especially important for creative, software, or R&D deals.',
    clauseExample:
      'Nothing in this Agreement grants the Receiving Party any rights in or to the Disclosing Party’s intellectual property.',
    clarification:
      'Protects each party’s preexisting IP and avoids accidental transfers of rights during collaboration.',
    tags: ['ownership', 'ip', 'clarification']
  },
  {
    name: 'Severability',
    instruction:
      'Ensure that if one clause is found unenforceable, the remainder of the agreement still applies.',
    condition:
      'This rule applies when a specific clause is deemed invalid by a court or authority.',
    responseType: 'redline',
    comment:
      'Prevents the entire NDA from being voided due to one unenforceable clause.',
    clauseExample:
      'If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.',
    clarification:
      'A standard legal safeguard that keeps the rest of the NDA enforceable even if one section fails.',
    tags: ['boilerplate', 'enforceability', 'fallback']
  },
  {
    name: 'Entire Agreement',
    instruction:
      'State that the NDA constitutes the entire agreement between the parties regarding confidentiality.',
    condition:
      'This rule applies to ensure no prior agreements or understandings contradict the NDA.',
    responseType: 'redline',
    comment:
      'Prevents claims based on verbal agreements or previous drafts that are not included in the final document.',
    clauseExample:
      'This Agreement constitutes the entire understanding between the parties with respect to the subject matter hereof.',
    clarification:
      'Clarifies that only what is written in this NDA matters, reducing risk of disputes over past communication.',
    tags: ['boilerplate', 'integration', 'limitation']
  },
  {
    name: 'Amendments',
    instruction:
      'Specify how the NDA can be modified or amended in the future.',
    condition:
      'This rule applies when changes to the NDA are needed after it has been signed.',
    responseType: 'redline',
    comment:
      'Ensures that any changes are documented and agreed upon by both parties.',
    clauseExample:
      'This Agreement may only be amended or modified by a written instrument signed by both parties.',
    clarification:
      'Prevents unilateral changes and ensures both parties agree to any modifications, maintaining clarity and mutual understanding.',
    tags: ['modification', 'formalities', 'consent']
  },
  {
    name: 'No Waiver',
    instruction:
      'Clarify that failure to enforce any provision of the NDA does not constitute a waiver of that provision.',
    condition:
      'This rule applies when one party does not immediately enforce a right or obligation under the NDA.',
    responseType: 'redline',
    comment:
      'Protects parties from losing rights simply because they did not enforce them immediately.',
    clauseExample:
      'The failure of either party to enforce any provision of this Agreement shall not be construed as a waiver.',
    clarification:
      'Ensures that just because one party doesn’t act on a breach right away, it doesn’t mean they lose that right.',
    tags: ['enforcement', 'boilerplate', 'rights']
  },
  {
    name: 'Notice',
    instruction:
      'Specify how formal notices under the NDA should be delivered and to whom.',
    condition:
      'This rule applies when one party needs to notify the other of changes, breaches, or other official matters.',
    responseType: 'redline',
    comment:
      'Clarifies communication expectations and ensures both parties are reachable for official matters.',
    clauseExample:
      'All notices under this Agreement shall be in writing and delivered to the addresses listed above via email or courier.',
    clarification:
      'Ensures both parties know how to send and receive official communications related to the NDA.',
    tags: ['communication', 'process', 'logistics']
  },
  {
    name: 'Counterparts',
    instruction:
      'State that the NDA may be executed in multiple counterparts, each of which is deemed an original.',
    condition:
      'This rule applies when parties sign the NDA at different times or locations.',
    responseType: 'redline',
    comment:
      'Facilitates flexibility in execution and ensures legal validity even with separately signed copies.',
    clauseExample:
      'This Agreement may be executed in counterparts, each of which shall be deemed an original and together shall constitute one instrument.',
    clarification:
      'Allows for modern signing workflows without affecting enforceability.',
    tags: ['execution', 'signing', 'boilerplate']
  },
  {
    name: 'Assignment',
    instruction:
      'Specify whether either party can assign their rights or obligations under the NDA to another party.',
    condition:
      'This rule applies when one party wants to transfer their rights or obligations to a third party.',
    responseType: 'redline',
    comment:
      'Typically restricts assignment without consent to maintain control over who is bound by the NDA.',
    clauseExample:
      'Neither party may assign this Agreement or any of its rights or obligations without the prior written consent of the other party.',
    clarification:
      'Protects both parties from having their confidential information shared with unknown third parties.',
    tags: ['transfer', 'rights', 'control']
  },
  {
    name: 'Force Majeure',
    instruction:
      'Define circumstances under which a party is excused from performing its obligations due to events beyond its control.',
    condition:
      'This rule applies when unforeseen events prevent a party from fulfilling its obligations under the NDA.',
    responseType: 'redline',
    comment:
      'Commonly includes natural disasters, war, or other major disruptions that make performance impossible.',
    clauseExample:
      'Neither party shall be liable for any failure to perform its obligations under this Agreement due to causes beyond its reasonable control, including acts of God, war, or government action.',
    clarification:
      'Provides protection against liability for non-performance due to extraordinary circumstances.',
    tags: ['exceptions', 'liability', 'unforeseen events']
  },
  {
    name: 'Survival',
    instruction:
      'Specify which obligations will continue to apply after the termination of the NDA.',
    condition:
      'This rule applies to obligations that should remain in effect even after the NDA ends.',
    responseType: 'redline',
    comment:
      'Typically includes confidentiality obligations, return of information, and intellectual property rights.',
    clauseExample:
      'The confidentiality obligations set forth in this Agreement shall survive the termination of this Agreement for a period of three (3) years.',
    clarification:
      'Ensures that critical protections remain in place even after the business relationship ends.',
    tags: ['termination', 'survival', 'obligations']
  },
  {
    name: 'Dispute Resolution',
    instruction:
      'Outline the process for resolving disputes arising from the NDA, such as mediation or arbitration.',
    condition:
      'This rule applies when parties need to resolve disagreements without going to court.',
    responseType: 'redline',
    comment:
      'Provides a structured approach to resolving conflicts, often preferred over litigation for confidentiality reasons.',
    clauseExample:
      'Any dispute arising out of or relating to this Agreement shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.',
    clarification:
      'Encourages resolution through less formal means, which can be faster and more private than court proceedings.',
    tags: ['disputes', 'resolution', 'arbitration']
  },
  {
    name: 'Non-Solicitation',
    instruction:
      'Prevent either party from soliciting the other’s employees or contractors for a specified period after the NDA ends.',
    condition:
      'This rule applies to protect each party’s workforce from being poached after sharing confidential information.',
    responseType: 'redline',
    comment:
      'Common in NDAs to prevent loss of talent and maintain business stability after collaboration.',
    clauseExample:
      'For a period of one (1) year following the termination of this Agreement, neither party shall solicit for employment any employee or contractor of the other party who was involved in the performance of this Agreement.',
    clarification:
      'Helps maintain business relationships and prevents disruption by ensuring employees are not recruited away immediately after sharing sensitive information.',
    tags: ['employment', 'protection', 'post-termination']
  },
  {
    name: 'Non-Compete',
    instruction:
      'Restrict either party from engaging in competitive activities that could harm the other’s business for a specified period.',
    condition:
      'This rule applies when parties want to prevent direct competition after sharing sensitive information.',
    responseType: 'redline',
    comment:
      'Often controversial; must be reasonable in scope and duration to be enforceable.',
    clauseExample:
      'For a period of one (1) year following the termination of this Agreement, neither party shall engage in any business that competes directly with the other party’s business as conducted at the time of termination.',
    clarification:
      'Helps protect business interests but must be carefully crafted to avoid legal challenges.',
    tags: ['competition', 'restriction', 'post-termination']
  },
  {
    name: 'Publicity',
    instruction:
      'Restrict either party from using the other’s name or trademarks in marketing or publicity without consent.',
    condition:
      'This rule applies when parties want to control how their names and brands are used publicly.',
    responseType: 'redline',
    comment:
      'Prevents unauthorized use of branding that could mislead customers or damage reputation.',
    clauseExample:
      'Neither party shall use the other party’s name, logo, or trademarks in any advertising, promotional materials, or publicity without prior written consent.',
    clarification:
      'Protects brand integrity and ensures both parties agree on how their names can be used publicly.',
    tags: ['branding', 'marketing', 'permission']
  },
  {
    name: 'Third-Party Beneficiaries',
    instruction: 'Clarify whether any third parties have rights under the NDA.',
    condition:
      'This rule applies when parties want to specify if anyone other than the signatories can enforce the NDA.',
    responseType: 'redline',
    comment:
      'Typically, NDAs are not intended to benefit third parties unless explicitly stated.',
    clauseExample:
      'This Agreement is intended solely for the benefit of the parties hereto and does not confer any rights or remedies upon any third party.',
    clarification:
      'Ensures that only the parties involved can enforce the NDA, preventing unexpected claims from outsiders.',
    tags: ['enforceability', 'third parties', 'limitation']
  },
  {
    name: 'Electronic Signatures',
    instruction:
      'Allow the NDA to be signed electronically, ensuring it is legally binding.',
    condition:
      'This rule applies when parties prefer to sign the NDA digitally rather than in person.',
    responseType: 'redline',
    comment:
      'Facilitates modern business practices and remote signing, which is increasingly common.',
    clauseExample:
      'The parties agree that this Agreement may be executed by electronic signature, which shall have the same legal effect as an original signature.',
    clarification:
      'Ensures that electronic signatures are valid and enforceable, streamlining the signing process.',
    tags: ['execution', 'signing', 'modernization']
  },
  {
    name: 'Acknowledgment of Understanding',
    instruction:
      'Require both parties to acknowledge that they have read and understood the NDA before signing.',
    condition:
      'This rule applies to ensure both parties are fully aware of their rights and obligations under the NDA.',
    responseType: 'redline',
    comment:
      'Helps prevent claims of misunderstanding or lack of knowledge about the agreement’s terms.',
    clauseExample:
      'Each party acknowledges that it has read this Agreement, understands its terms, and agrees to be bound by them.',
    clarification:
      'Reinforces that both parties are entering into the NDA knowingly and voluntarily.',
    tags: ['clarification', 'intent', 'awareness']
  },
  {
    name: 'No License Granted',
    instruction:
      'Clarify that the NDA does not grant any licenses or rights to use the other party’s intellectual property.',
    condition:
      'This rule applies when parties want to ensure that sharing confidential information does not imply any transfer of rights.',
    responseType: 'redline',
    comment:
      'Prevents misunderstandings about ownership and usage rights of shared information.',
    clauseExample:
      'Nothing in this Agreement shall be construed as granting any license or rights to the Receiving Party under any intellectual property of the Disclosing Party.',
    clarification:
      'Protects each party’s intellectual property and ensures that sharing information does not imply permission to use it commercially.',
    tags: ['ip', 'ownership', 'restriction']
  },
  {
    name: 'No Partnership or Joint Venture',
    instruction:
      'Clarify that the NDA does not create a partnership, joint venture, or agency relationship between the parties.',
    condition:
      'This rule applies to prevent misunderstandings about the nature of the relationship established by the NDA.',
    responseType: 'redline',
    comment:
      'Ensures that sharing confidential information does not imply a deeper business relationship than intended.',
    clauseExample:
      'Nothing in this Agreement shall be construed to create a partnership, joint venture, or agency relationship between the parties.',
    clarification:
      'Helps maintain clear boundaries regarding the nature of the business relationship, reducing risk of liability.',
    tags: ['structure', 'relationship', 'disclaimer']
  },
  {
    name: 'Compliance with Laws',
    instruction:
      'Require both parties to comply with applicable laws and regulations in relation to the NDA.',
    condition:
      'This rule applies when parties want to ensure that their actions under the NDA are lawful.',
    responseType: 'redline',
    comment:
      'Ensures that both parties are aware of and agree to adhere to relevant legal requirements.',
    clauseExample:
      'Each party agrees to comply with all applicable laws and regulations in connection with this Agreement.',
    clarification:
      'Reinforces the expectation that both parties will act lawfully, reducing risk of legal issues arising from non-compliance.',
    tags: ['legal', 'regulatory', 'obligation']
  },
  {
    name: 'No Assignment of Confidential Information',
    instruction:
      'Prohibit the assignment of confidential information to third parties without consent.',
    condition:
      'This rule applies when parties want to maintain control over who has access to their confidential information.',
    responseType: 'redline',
    comment:
      'Ensures that confidential information remains protected and is not shared with unauthorized parties.',
    clauseExample:
      'The Receiving Party shall not assign or transfer any of its rights or obligations under this Agreement, including any Confidential Information, without the prior written consent of the Disclosing Party.',
    clarification:
      'Protects the integrity of confidential information by preventing unauthorized sharing or transfer.',
    tags: ['transfer', 'confidentiality', 'control']
  },
  {
    name: 'No Implied Rights',
    instruction:
      'Clarify that the NDA does not imply any rights or licenses beyond those explicitly stated.',
    condition:
      'This rule applies to prevent assumptions about rights that are not clearly defined in the NDA.',
    responseType: 'redline',
    comment:
      'Helps avoid misunderstandings about what is allowed under the NDA.',
    clauseExample:
      'Nothing in this Agreement shall be construed to grant any rights or licenses not expressly set forth herein.',
    clarification:
      'Ensures that both parties understand that only explicitly stated rights are granted, reducing risk of disputes.',
    tags: ['limitation', 'ip', 'clarification']
  },
  {
    name: 'No Third-Party Rights',
    instruction:
      'Clarify that the NDA does not confer any rights or benefits to third parties.',
    condition:
      'This rule applies when parties want to ensure that only they can enforce the NDA.',
    responseType: 'redline',
    comment:
      'Prevents third parties from claiming rights under the NDA, which could complicate enforcement.',
    clauseExample:
      'This Agreement is intended solely for the benefit of the parties hereto and does not confer any rights or remedies upon any third party.',
    clarification:
      'Reinforces that only the parties involved in the NDA have rights under it, simplifying enforcement and reducing risk of claims from outsiders.',
    tags: ['third parties', 'rights', 'boilerplate']
  },
  {
    name: 'No Public Disclosure',
    instruction:
      'Prohibit either party from publicly disclosing the existence or terms of the NDA without consent.',
    condition:
      'This rule applies when parties want to keep the NDA confidential, including its existence.',
    responseType: 'redline',
    comment:
      'Ensures that the terms and existence of the NDA remain private, protecting sensitive business information.',
    clauseExample:
      'Neither party shall disclose the existence or terms of this Agreement to any third party without the prior written consent of the other party.',
    clarification:
      'Helps maintain confidentiality about the agreement itself, which can be important for competitive reasons.',
    tags: ['confidentiality', 'visibility', 'branding']
  },
  {
    name: 'No License to Use Proprietary Assets',
    instruction:
      'Clarify that the NDA does not grant rights to use the other party’s proprietary assets beyond what is explicitly agreed.',
    condition:
      'This rule applies when the parties share proprietary information such as software, data, content, inventions, etc.',
    responseType: 'redline',
    comment:
      'Prevents unauthorized use of various business assets and clarifies limitations of shared access.',
    clauseExample:
      'Nothing in this Agreement shall be construed as granting any rights to use the Disclosing Party’s proprietary assets including software, data, content, inventions, or any similar materials unless explicitly stated.',
    clarification:
      'Consolidates asset protections under one clause while maintaining clarity over what remains protected.',
    tags: ['ip', 'restriction', 'ownership']
  },
  {
    name: 'No Joint Ownership',
    instruction:
      'Clarify that sharing confidential information does not create joint ownership of any intellectual property.',
    condition:
      'This rule applies when parties want to ensure that sharing information does not imply shared ownership of IP.',
    responseType: 'redline',
    comment:
      'Prevents misunderstandings about ownership rights over jointly developed or shared information.',
    clauseExample:
      'Nothing in this Agreement shall be construed to create joint ownership of any intellectual property developed by either party as a result of the disclosure of Confidential Information.',
    clarification:
      'Ensures that each party retains full ownership of its intellectual property, even if it is developed using shared confidential information.',
    tags: ['ip', 'ownership', 'structure']
  }
]
