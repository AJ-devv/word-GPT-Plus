<template>
  <div class="panel">
    <nav class="tabs">
      <button
        :class="{ active: currentTab === 'chat' }"
        @click="currentTab = 'chat'"
      >
        Chat
      </button>
      <button
        :class="{ active: currentTab === 'review' }"
        @click="currentTab = 'review'"
      >
        Review
      </button>
      <button
        :class="{ active: currentTab === 'playbook' }"
        @click="openPlaybookTab"
      >
        Playbook
      </button>
    </nav>

    <!-- CHAT TAB -->
    <section v-if="currentTab === 'chat'" class="p-4">
      <h2 class="text-xl font-semibold mb-4">Quick Commands</h2>

      <!-- Quick Command Buttons -->
      <ul class="mb-4 space-y-2">
        <li>
          <button class="text-blue-700 underline" @click="alertCommand('Summarize clause')">
            Summarize Clause
          </button>
        </li>
        <li>
          <button class="text-blue-700 underline" @click="alertCommand('Draft arbitration clause')">
            Draft Arbitration Clause
          </button>
        </li>
        <li>
          <button class="text-blue-700 underline" @click="alertCommand('Make clause mutual')">
            Make Clause Mutual
          </button>
        </li>
      </ul>

      <!-- Chat Input + Actions Dropdown -->
      <div class="relative mb-4 flex items-center gap-2">
        <textarea
          v-model="chatMessage"
          placeholder="Ask anything about this agreement..."
          class="w-full border border-gray-300 rounded p-2"
          rows="2"
        ></textarea>

        <!-- ▼ Dropdown -->
        <div class="relative">
          <button
            class="bg-gray-700 text-white px-2 py-2 rounded hover:bg-gray-600"
            @click="showActions = !showActions">
            ▼
          </button>

          <div
            v-if="showActions"
            class="absolute top-full right-0 mt-1 w-48 bg-white shadow-lg border rounded z-10">
            <ul>
              <li v-for="action in actions" :key="action">
                <button
                  class="w-full text-left px-4 py-2 hover:bg-gray-100"
                  @click="runAction(action); showActions = false"
                >
                  {{ action }}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Send -->
        <button
          :disabled="loading"
          class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          @click="sendMessage"
        >
          {{ loading ? 'Thinking...' : 'Send' }}
        </button>
      </div>


      <!-- GPT Response Display -->
      <div v-if="chatResponse" class="response-area border rounded p-4 bg-white shadow">
        <strong>Response:</strong>
        <p class="whitespace-pre-wrap mt-2">{{ chatResponse }}</p>
        <button
          class="mt-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          @click="insertIntoWord"
        >
          Insert into Word
        </button>
      </div>
    </section>


    <!-- REVIEW TAB -->
    <section v-if="currentTab === 'review'">
      <h2>AI Contract Review</h2>

      <!-- Manual Review Form (Only show if no results yet) -->
      <div v-if="!playbookResults.length && !structuredGeneralResults.length" class="review-form">
        <label>What type of contract is this?</label>
        <input v-model="contractType" placeholder="e.g., NDA, Lease, Employment" />

        <label>Which party do you represent?</label>
        <input v-model="partyRole" placeholder="e.g., Disclosing party" />

        <label>Specific concerns about this contract?</label>
        <input v-model="reviewConcerns" placeholder="e.g., Look for uncapped liability" />

        <div class="mt-3" style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button :disabled="reviewLoading" @click="startReview">
            {{ reviewLoading ? 'Reviewing...' : 'Start Review' }}
          </button>
          <button :disabled="reviewLoading" @click="startGeneralReview">
            {{ reviewLoading ? 'Analyzing...' : 'Start General Review' }}
          </button>
        </div>

        <!-- ✅ Debug Output for Contract Text / Errors -->
        <div v-if="debugLog" style="margin-top: 20px; font-size: 11px; color: #666;">
          <strong>Debug Output:</strong>
          <pre style="white-space: pre-wrap; background: #f8f8f8; padding: 10px; border-radius: 6px; border: 1px solid #ccc;">
{{ debugLog }}
      </pre>
        </div>
      </div>
    </section>


    <!-- ✅ REVIEW RESULTS: Playbook Review -->
    <div v-if="playbookResults.length" class="review-result" style="margin-top: 20px">
      <h3>Playbook Review Results</h3>
      <div style="margin: 12px 0">
        <strong>Status:</strong>
        ✔️ {{ compliantCount }} compliant |
        ❌ {{ issueCount }} issues |
        ⚠️ {{ reviewCount }} review
      </div>

      <ul>
        <li
          v-for="r in playbookResults"
          :key="r.name"
          class="mb-4 p-4 border rounded-lg bg-white shadow-sm"
        >
          <div class="flex items-center gap-3 mb-2">
            <span class="text-xl">
              {{ r.status === 'compliant' ? '✅' : r.status === 'issue' ? '❌' : '⚠️' }}
            </span>
           


          </div>

          <div v-if="r.summary" class="mb-2">
            <p class="text-sm text-gray-800 whitespace-pre-wrap">{{ r.summary }}</p>
          </div>

          <div v-if="r.explanation" class="mb-2">
            <p><strong>Explanation:</strong> {{ r.explanation }}</p>
          </div>

          <div v-if="r.redline" class="mb-2">
            <p><strong>Suggested Redline:</strong></p>
            <pre class="bg-gray-50 border border-gray-300 p-2 rounded text-sm whitespace-pre-wrap">{{ r.redline }}</pre>
          </div>

          <div class="flex gap-2 mt-2">
            <button
              class="px-3 py-1 rounded text-sm border border-green-600 text-green-700 hover:bg-green-50"
              :disabled="ruleReviewMap[r.name] === 'applied'"
              @click="ruleReviewMap[r.name] = 'applied'"
            >
              ✅ Apply
            </button>
            <button
              class="px-3 py-1 rounded text-sm border border-gray-400 text-gray-600 hover:bg-gray-100"
              :disabled="ruleReviewMap[r.name] === 'ignored'"
              @click="ruleReviewMap[r.name] = 'ignored'"
            >
              ❌ Ignore
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- ✅ REVIEW RESULTS: General Review (styled to match Playbook results) -->
    <div
      v-if="!playbookResults.length && structuredGeneralResults.length"
      class="review-result"
      style="margin-top: 20px"
    >
      <h3>General Contract Analysis</h3>
      <p style="font-size: 13px; color: #555; margin-bottom: 12px">
        🧠 AI Review of the uploaded agreement
      </p>

      <ul>
        <li
          v-for="(r, i) in structuredGeneralResults"
          :key="i"
          class="mb-4 p-4 border rounded-lg bg-white shadow-sm"
        >
          <div class="flex items-center gap-3 mb-2">
            <span class="text-xl">
              {{ r.status === 'compliant' ? '✅' : r.status === 'issue' ? '❌' : '⚠️' }}
            </span>
            <h3
              class="font-semibold text-lg cursor-pointer text-blue-700 hover:underline"
              @click="highlightClause(r)"
            >
              {{ r.name }}
            </h3>
          </div>

  

          <div v-if="r.summary" class="mb-2">
            <p class="text-sm text-gray-800 whitespace-pre-wrap">{{ r.summary }}</p>
          </div>
          <!-- 👇 Insert quote block here -->


          <!-- ✅ NEW: Show actual quoted text from document -->
          <div v-if="r.originalText" class="mb-2">
            <p class="text-sm text-gray-600 italic whitespace-pre-wrap">{{ r.originalText }}</p>
          </div>

          <div v-if="r.explanation" class="mb-2">
            <p><strong>Explanation:</strong> {{ r.explanation }}</p>
          </div>

          <div v-if="r.redline" class="mb-2">
            <p><strong>Suggested Redline:</strong></p>
            <pre class="bg-gray-50 border border-gray-300 p-2 rounded text-sm whitespace-pre-wrap">{{ r.redline }}</pre>
          </div>

          <div class="flex gap-2 mt-2">
            <button
              class="px-3 py-1 rounded text-sm border border-green-600 text-green-700 hover:bg-green-50"
              :disabled="ruleReviewMap[r.name] === 'applied'"
              @click="applyRedline(r)"
            >
              ✅ Apply
            </button>

            <button
              class="px-3 py-1 rounded text-sm border border-gray-400 text-gray-600 hover:bg-gray-100"
              :disabled="ruleReviewMap[r.name] === 'ignored'"
              @click="ruleReviewMap[r.name] = 'ignored'"
            >
              ❌ Ignore
            </button>
          </div>
        </li>
      </ul>
    </div>



   



    <!-- PLAYBOOK TAB -->
    <section v-if="currentTab === 'playbook'">
      <h2>Create New Playbook Rule</h2>

      <!-- 1: PLAYBOOK LIST -->
      <div v-if="playbookFlow === 'list'" class="playbook-library">
        <h3>Playbook Library</h3>
        <div class="tabs">
          <button
            :class="{ active: activePlaybookTab === 'all' }"
            @click="activePlaybookTab = 'all'"
          >
            All
          </button>
          <button
            :class="{ active: activePlaybookTab === 'standard' }"
            @click="activePlaybookTab = 'standard'"
          >
            Standard
          </button>
          <button
            :class="{ active: activePlaybookTab === 'custom' }"
            @click="activePlaybookTab = 'custom'"
          >
            Custom
          </button>
        </div>
        <ul>
          <li v-for="playbook in filteredPlaybooks" :key="playbook.id">
            <strong>
              {{ playbook.name }}
              <span
                v-if="playbook.name.includes('(Copy)')"
                style="color: #9c27b0; font-size: 12px; margin-left: 6px"
              >
                🧬
              </span>
            </strong>
            <!-- Rule Status Summary -->
            <span v-if="playbook.rules.length" style="margin-left: 8px; font-size: 12px">
              ✅ {{ countReviewStatus(playbook, 'applied') }}
              ❌ {{ countReviewStatus(playbook, 'ignored') }}
              ⚠️ {{
                countReviewStatus(playbook, '') +
                  countReviewStatus(playbook, undefined)
              }}
            </span>

            - {{ playbook.type }}
            <span
              v-if="playbook.type === 'standard'"
              style="
                background: #1976d2;
                color: white;
                font-size: 11px;
                padding: 2px 6px;
                border-radius: 4px;
                margin-left: 8px;
              "
            >
              Standard
            </span>

            <button
              v-if="playbook.type === 'standard'"
              @click="loadStandardPlaybook(playbook.id)"
            >
              Use
            </button>
            <button
              v-if="playbook.type === 'standard'"
              @click="cloneToCustom(playbook)"
            >
              Clone to Custom
            </button>
            <button
              v-if="playbook.type === 'custom'"
              @click="selectPlaybook(playbook)"
            >
              Use
            </button>
            <button
              v-if="playbook.type === 'custom'"
              @click="startRenamePlaybook(playbook)"
            >
              ✏️ Rename
            </button>
            <button
              v-if="playbook.type === 'custom'"
              @click="deletePlaybook(playbook.id)"
            >
              🗑 Delete
            </button>

          </li>
        </ul>
        <button @click="startNewPlaybook">Create New Playbook</button>
      </div>

      <!-- 2: CREATE PLAYBOOK FORM -->
      <div v-if="playbookFlow === 'create' || playbookFlow === 'rename'" class="playbook-form">

        <input
          ref="newPlaybookNameInput"
          v-model="newPlaybookName"
          placeholder="Playbook name"
          class="flash-highlight"

        />        <input
          v-model="newPlaybookDescription"
          placeholder="Agreement type (e.g., NDA, MSA)"
        />
        <button
          @click="() => {
            if (playbookFlow === 'rename') {
              updatePlaybook()
            } else {
              savePlaybook()
            }
          }"
        >
          {{ playbookFlow === 'rename' ? 'Update Playbook' : 'Save Playbook' }}
        </button>


        <button @click="cancelFlow">Cancel</button>
      </div>

      <!-- 3: PLAYBOOK DETAILS + RESULTS -->
      <div
        v-if="playbookFlow === 'detail' && selectedPlaybook"
        class="playbook-form"
      >
        <h3>{{ selectedPlaybook.name }}</h3>
        <p>{{ selectedPlaybook.description }}</p>

        <!-- ✅ Day 6: Status Summary -->
        <div style="font-size: 13px; color: #555; margin-bottom: 8px">
          ✓ {{ countReviewStatus(selectedPlaybook, 'applied') }} applied |
          ❌ {{ countReviewStatus(selectedPlaybook, 'ignored') }} ignored |
          ⏳
          {{
            countReviewStatus(selectedPlaybook, '') +
              countReviewStatus(selectedPlaybook, undefined)
          }}
          undecided
        </div>

        <!-- Rule List & Toggles View -->
        <div v-if="!showPlaybookResults">
          <ul style="margin-bottom: 20px">
            <li
              v-for="(rule, i) in selectedPlaybook.rules"
              :key="i"
              :class="{ 'flash-highlight': rule._isNewlyCloned }"
              :style="{
                marginBottom: '12px',
                border: '1px solid #ccc',
                padding: '8px',
                backgroundColor: isEditingIndex(i) ? '#e8f4ff' : 'white',
                transition: 'background 0.25s ease',
                cursor: 'pointer'
              }"
            >
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong>{{ rule.name }}</strong>

                <!-- ✅ NEW TOGGLE SWITCH HERE -->
                <label class="toggle">
                  <input v-model="ruleEnabledMap[rule.name]" type="checkbox" />
                  <span class="slider"></span>
                </label>

                <!-- ✅ Review Status Indicator -->
                <span v-if="ruleReviewMap[rule.name] === 'applied'" title="Applied">✔️</span>
                <span v-else-if="ruleReviewMap[rule.name] === 'ignored'" title="Ignored">❌</span>
                <span v-else title="No decision yet">⏺️</span>

                <!-- Tags -->
                <div v-if="rule.tags && rule.tags.length" style="margin-top: 4px; display: flex; gap: 6px; flex-wrap: wrap;">
                  <span
                    v-for="(tag, idx) in rule.tags"
                    :key="idx"
                    style="background: #e0e0e0; color: #333; font-size: 11px; padding: 2px 6px; border-radius: 8px"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Edit/Delete -->
                <div style="display: flex; gap: 8px">
                  <button @click="startEditRule(i)">✏️ Edit</button>
                  <button @click="removeRule(i)">🗑 Delete</button>
                </div>
              </div>

              <p style="margin: 6px 0">{{ rule.instruction }}</p>
              <p style="margin: 4px 0; font-style: italic">Condition: {{ rule.condition }}</p>
              <p style="margin: 4px 0">Response: {{ rule.response }}</p>
              <p style="margin: 4px 0; color: gray">Comment: {{ rule.comment || 'None' }}</p>
            </li>
          </ul>

          <!-- Controls -->
          <button
            v-if="selectedPlaybook.type === 'custom'"
            @click="playbookFlow = 'rule'"
          >
            + Add New Rule
          </button>
          <!-- Save & Run Button -->
          <button
            :disabled="!hasEnabledRules"
            :title="!hasEnabledRules ? 'Please enable at least one rule to run the playbook.' : ''"
            @click="runPlaybook"
          >
            Save & Run
          </button>
          <button
            v-if="hasRedlineBackup"
            style="margin-top: 8px; background: #ffc107; color: black; border: none; padding: 6px 12px; border-radius: 4px"
            @click="restoreRedlinesFromBackup"
          >
            🔁 Restore Redlines from Backup
          </button>


          <!-- 🛠️ Dev Tools (only in dev mode) -->
          <div v-if="showDevTools" style="margin-top: 12px; background: #f9f9f9; padding: 8px; border: 1px dashed #ccc;">
            <strong>🛠️ Dev Tools</strong>
            <button style="margin-left: 8px; background: #eee;" @click="addTestRules">
              🧪 Add 50 Test Rules
            </button>
          </div>

          <button @click="uploadStandardPlaybooks">
            📤 Upload Standard Playbooks to Firebase
          </button>




          <!-- Results Section View -->
          <div
            v-if="showPlaybookResults"
            class="review-result"
            style="margin-top: 20px"
          >
            <!-- ✅ Back to Rules Button -->
            <button
              style="margin-bottom: 12px"
              @click="showPlaybookResults = false"
            >
              ← Back to Rules
            </button>

            <h3>Playbook Analysis</h3>
            <!-- ✅ Advanced Mode Toggle -->
            <div style="margin-bottom: 12px">
              <label>
                <input v-model="advancedMode" type="checkbox" />
                🧠 Advanced Mode
              </label>
            </div>
            <!-- Visual Compliance Bar -->
            <div
              style="
              display: flex;
              height: 12px;
              margin-bottom: 8px;
              width: 100%;
              max-width: 400px;
              border-radius: 6px;
              overflow: hidden;
              border: 1px solid #ccc;
            "
            >
              <div
                :style="{
                  width: totalResults
                    ? (100 * compliantCount) / totalResults + '%'
                    : '0%',
                  background: '#4CAF50'
                }"
              ></div>
              <div
                :style="{
                  width: totalResults
                    ? (100 * issueCount) / totalResults + '%'
                    : '0%',
                  background: '#F44336'
                }"
              ></div>
              <div
                :style="{
                  width: totalResults
                    ? (100 * reviewCount) / totalResults + '%'
                    : '0%',
                  background: '#FFC107'
                }"
              ></div>
            </div>

            <!-- Percent Labels -->
            <p>
              ✔ Compliant:
              {{ Math.round((compliantCount / totalResults) * 100 || 0) }}% | ❌
              Issues: {{ Math.round((issueCount / totalResults) * 100 || 0) }}% |
              ⚠ Review:
              {{ Math.round((reviewCount / totalResults) * 100 || 0) }}%
            </p>
            <div style="margin-bottom: 12px">
              <label for="tagFilter" style="margin-right: 6px">
                <strong>Filter by Tag:</strong></label
              >
              <select id="tagFilter" v-model="selectedTag" style="padding: 4px">
                <option value="">-- All Tags --</option>

                <option v-for="tag in uniqueTags" :key="tag" :value="tag">
                  {{ tag }}
                </option>
              </select>
            </div>
            <ul>
              <li
                v-for="(r, i) in filteredResults"
                :key="i"
                class="mb-4 p-4 border rounded-2xl shadow-sm bg-white"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">
                      {{
                        r.status === 'compliant'
                          ? '✅'
                          : r.status === 'issue'
                            ? '❌'
                            : '⚠️'
                      }}
                    </span>
                    <h3
                      class="font-semibold text-lg cursor-pointer text-blue-700 hover:underline"
                      @click="highlightClause(r.summary || r.name)" 
                    >
                      {{ r.name }}
                    </h3>

                    <span
                      v-if="ruleReviewMap[r.name] === 'applied'"
                      title="Applied"
                    >✅</span>
                    <span
                      v-else-if="ruleReviewMap[r.name] === 'ignored'"
                      title="Ignored"
                    >❌</span>
                    <span v-else title="No decision yet">⏺️</span>
                  </div>
                  <div class="flex gap-2">
                    <button
                      class="px-3 py-1 rounded-lg text-sm border border-green-600 text-green-700 hover:bg-green-50"
                      :disabled="ruleReviewMap[r.name] === 'applied'"
                      @click="ruleReviewMap[r.name] = 'applied'"
                    >
                      Apply
                    </button>
                    <button
                      class="px-3 py-1 rounded-lg text-sm border border-gray-400 text-gray-600 hover:bg-gray-100"
                      :disabled="ruleReviewMap[r.name] === 'ignored'"
                      @click="ruleReviewMap[r.name] = 'ignored'"
                    >
                      Ignore
                    </button>
                  </div>
                </div>

                <div v-if="r.summary" class="mb-2">
                  <p class="text-sm text-gray-800 whitespace-pre-wrap">{{ r.summary }}</p>
                </div>

                <div v-if="showRuleDetail[r.name]" class="mb-2">
                  <p><strong>Explanation:</strong> {{ r.explanation || 'N/A' }}</p>
                  
                  <p class="mb-1 flex items-center gap-2">
                    <strong>Suggested Redline:</strong>
                    <span
                      v-if="r.redline !== originalRedlines[r.name]"
                      class="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full"
                    >
                      🔄 Edited
                    </span>
                  </p>

                  <!-- EDITABLE TOGGLE BLOCK -->
                  <div v-if="!redlineEditMode[r.name]">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div
                      :class="[
                        'p-3 rounded-lg text-sm whitespace-pre-wrap font-serif border',
                        r.redline !== originalRedlines[r.name]
                          ? 'bg-yellow-50 border-yellow-300 text-yellow-900'
                          : 'bg-red-50 border-red-300 text-red-900'
                      ]"
                      v-html="formatRedlineText(r.redline)"
                    ></div>
                    <button
                      class="text-blue-600 text-sm mt-1"
                      @click="redlineEditMode[r.name] = true"
                    >
                      ✏️ Edit
                    </button>
                  </div>


                  <div v-else>
                    <textarea
                      v-model="r.redline"
                      class="w-full border border-gray-300 rounded-lg p-2 text-sm font-mono"
                      rows="5"
                    ></textarea>
                    <div class="flex gap-3 mt-1">
                      <button
                        class="text-green-700 text-sm border border-green-600 px-2 py-1 rounded hover:bg-green-50"
                        @click="redlineEditMode[r.name] = false"
                      >
                        ✅ Save
                      </button>
                      <button
                        class="text-gray-600 text-sm border border-gray-400 px-2 py-1 rounded hover:bg-gray-100"
                        @click="redlineEditMode[r.name] = false"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>








                </div>

                <div v-if="advancedMode">
                  <p><strong>Clause Example:</strong></p>
                  <pre class="bg-gray-50 p-2 rounded">{{ r.clauseExample || 'None provided' }}</pre>
                  <p><strong>Clarification:</strong></p>
                  <pre class="bg-gray-50 p-2 rounded">{{ r.clarification || 'None provided' }}</pre>
                </div>

                <div class="mt-2">
                  <button class="text-blue-600 text-sm" @click="showRuleDetail[r.name] = !showRuleDetail[r.name]">
                    {{ showRuleDetail[r.name] ? 'Hide' : 'Show' }} Details
                  </button>
                </div>
              </li>
            </ul>

          </div>
        </div>
      </div>
  
      <!-- 4: ADD RULE TO PLAYBOOK -->
      <!-- eslint-disable-next-line -->
          <div v-if="(playbookFlow as string) === 'rule'" class="playbook-form">
        <input v-model="playbookRuleName" placeholder="Review rule name" />
        <textarea
          v-model="playbookRuleInstruction"
          placeholder="Instructions for AI review"
        ></textarea>
        <textarea
          v-model="playbookRuleCondition"
          placeholder="How to identify the rule (e.g. Choice of law, Term)"
        ></textarea>
        <select v-model="playbookRuleResponse">
          <option disabled value="">Select Response Type</option>
          <option value="suggestion">Suggestion</option>
          <option value="redline">Redline</option>
        </select>
        <input
          v-model="playbookRuleComment"
          placeholder="Optional comment for reviewer"
        />
        <textarea
          v-model="playbookRuleClauseExample"
          placeholder="Clause example to guide GPT (optional)"
        ></textarea>

        <textarea
          v-model="playbookRuleClarification"
          placeholder="Clarification or extra instruction for AI (optional)"
        ></textarea>
       


        <button @click="addRule">Create Rule</button>
        <button @click="playbookFlow = 'detail'">Back to Playbook</button>
      </div>
    </section> <!-- ✅ Properly closes the playbook tab section -->

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick,onMounted } from 'vue'
import { enhancedMndaPlaybook } from '../data/playbooks/enhancedMnda'
import { standardPlaybooks } from '../data/playbooks/standardPlaybooks'




// Firebase Firestore
import { collection, setDoc, doc, getDocs} from 'firebase/firestore'
import { db } from '../firebase/firebase'

// Firebase Custom Playbook Utilities
import {
  saveCustomPlaybookToFirestore,
  updateCustomPlaybookInFirestore,
  deleteCustomPlaybookFromFirestore,
  fetchCustomPlaybooksForUser
} from '../firebase/playbookUtils'

import DOMPurify from 'dompurify'




const showActions = ref(false)


const redlineBackupKey = computed(() =>
  selectedPlaybook.value ? `redlineBackup_${selectedPlaybook.value.id}` : null
)

const allPlaybooks = ref<any[]>([
  {
    id: 1,
    name: 'NDA Review Playbook',
    description: 'Standard NDA guidance',
    type: 'standard',
    rules: []
  },
  {
    id: 2,
    name: 'Contractor Agreement',
    description: 'Freelance clause review',
    type: 'standard',
    rules: []
  },
  {
    id: 3,
    name: 'Custom NDA Playbook',
    description: 'Custom NDA version',
    type: 'custom',
    rules: []
  }
])






// --- Firebase Playbook Loaders ---
const loadPlaybooksFromFirebase = async () => {
  const querySnapshot = await getDocs(collection(db, 'standardPlaybooks'))
  querySnapshot.forEach(docSnap => {
    const existing = allPlaybooks.value.some(pb => pb.id === docSnap.id)
    if (!existing) {
      allPlaybooks.value.push({
        id: docSnap.id,
        ...docSnap.data(),
        type: 'standard',
        rules: docSnap.data().rules || []
      })
    }
  })
}


const loadCustomPlaybooksFromFirebase = async () => {
  try {
    const playbooks = await fetchCustomPlaybooksForUser('demoUser')

    playbooks.forEach((pb: any) => {
      const exists = allPlaybooks.value.some(p => p.id === pb.id)
      if (!exists) {
        allPlaybooks.value.push({
          ...pb,
          type: 'custom',
          rules: (pb.rules || []).map((rule: any) => ({
  ...rule,
  clauseExample: rule.clauseExample || '',
  clarification: rule.clarification || ''
}))

        })
      }
    })
  } catch (err) {
    console.error('❌ Failed to load custom playbooks:', err)
  }
}


// Inject from Firebase
onMounted(() => {
  loadPlaybooksFromFirebase()
  loadCustomPlaybooksFromFirebase()

  // ✅ Restore redline results from localStorage backup
  const redlineBackupKey = selectedPlaybook.value?.id
    ? `redlineBackup_${selectedPlaybook.value.id}`
    : null

  if (redlineBackupKey) {
    const saved = localStorage.getItem(redlineBackupKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          playbookResults.value = parsed
          console.log('🩹 Restored redlines from localStorage backup.')
        }
      } catch (e) {
        console.warn('⚠️ Failed to parse redline backup:', e)
      }
    }
  }
})




// Fallback: Inject from local file (keep this for now)
standardPlaybooks.forEach(std => {
  const exists = allPlaybooks.value.some(p => p.id === std.id)
  if (!exists) {
    allPlaybooks.value.push(std)
  }
})






const showDevTools = typeof import.meta !== 'undefined' && (import.meta.env?.DEV as boolean)


const newPlaybookNameInput = ref<HTMLInputElement | null>(null)

const advancedMode = ref(false)

const editingRuleIndex = ref<number | null>(null)
const isEditingIndex = (index: number) => editingRuleIndex.value === index

const currentTab = ref<'chat' | 'review' | 'playbook'>('chat')

// Reset views on tab change
watch(currentTab, (newTab) => {
  if (newTab === 'chat') {
    chatMessage.value = ''
    chatResponse.value = ''
    showActions.value = false
  } else if (newTab === 'review') {
   // Do not clear results on tab switch — just reset form inputs
   reviewResult.value = ''
   contractType.value = ''
   partyRole.value = ''
   reviewConcerns.value = ''
   //showPlaybookResults.value = false
  } else if (newTab === 'playbook') {
    playbookFlow.value = 'list'
    selectedPlaybook.value = null
    playbookResults.value = []
    showPlaybookResults.value = false
  }
})


// --- Chat ---
const chatMessage = ref('')
const chatResponse = ref('')
const loading = ref(false)
const selectedText = ref('')

// Predefined actions for clause handling
const actions = ['AI Review', 'Playbook Review', 'Redline', 'Draft']
const alertCommand = (cmd: string) => {
  chatMessage.value = cmd
}


function highlightClause(clause: any) {
  const candidates = [
    clause.originalText,
    clause.name,
    clause.summary,
    clause.explanation,
    clause.clauseExample,
  ].filter(Boolean);

  console.log('📌 Starting highlightClause search for:', clause.name);
  console.log('📄 Word document text preview:', selectedText.value || '[not loaded]');
  console.log('🧠 Candidates:', candidates);

  Word.run(async context => {
    const body = context.document.body;
    let found = false;

    for (const text of candidates) {
      const cleaned = text.replace(/^[\d.]+\s*/, '').trim().toLowerCase();
      console.log('🔍 Trying cleaned search for:', cleaned);

      const results = body.search(cleaned, {
        matchCase: false,
        matchWholeWord: false,
        ignorePunct: true,
        ignoreSpace: true,
      });

      context.load(results, 'items');
      await context.sync();

      if (results.items.length > 0) {
        results.items[0].select();
        await context.sync();

        console.log(`✅ Found and selected clause: ${cleaned}`);
        found = true;
        break;
      }
    }

    if (!found) {
      console.warn(`❌ No match found in Word for: ${clause.name}`);
      console.log('🧠 Candidates tried:', candidates);
      console.log('📄 Word body text (truncated):', body.text?.slice(0, 500));
    }
  }).catch(err => {
    console.error('❌ highlightClause error:', err);
  });
}






















// ✅ Re-search and insert redline when Apply is clicked
function applyRedline(r: any) {
  if (!r.redline) return

  Word.run(async context => {
    const body = context.document.body
    const searchResults = body.search(r.name, {
      matchCase: false,
      matchWholeWord: false,
      ignorePunct: true,
      ignoreSpace: true
    })
    context.load(searchResults, 'items')
    await context.sync()

    if (searchResults.items.length > 0) {
      const target = searchResults.items[0]
      target.insertText(r.redline, Word.InsertLocation.replace)
      ruleReviewMap[r.name] = 'applied'
    } else {
      alert(`❌ Could not find clause text in document for: ${r.name}`)
    }

    await context.sync()
  })
}





// GPT Call: Freeform from textarea
async function sendMessage() {
  if (!chatMessage.value.trim()) return
  loading.value = true
  chatResponse.value = ''

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: chatMessage.value }],
      temperature: 0.4
    })
  })

  const data = await res.json()
  chatResponse.value = data.choices?.[0]?.message?.content || 'No response received.'
  loading.value = false
}

// GPT Call: Action-based from Word selection
async function runAction(action: string) {
  loading.value = true
  chatResponse.value = ''
  selectedText.value = await getSelectedTextFromWord()

  const prompt = generatePrompt(action, selectedText.value || chatMessage.value)
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4
    })
  })

  const data = await res.json()
  chatResponse.value = data.choices?.[0]?.message?.content || 'No response received.'
  loading.value = false
}

// Prompt generator

function generatePrompt(action: string, text: string): string {
  switch (action) {
    case 'AI Review':
      return `Analyze the legal meaning and risks of the following clause:\n\n"${text}"`
    case 'Playbook Review':
      return `Check if this clause complies with common legal playbook rules. Explain any issues:\n\n"${text}"`
    case 'Redline':
      return `Rewrite the following clause for clarity and legal defensibility. Use redline format if appropriate:\n\n"${text}"`
    case 'Draft':
      return `Draft a new clause based on this request:\n\n"${text}"`
    default:
      return `Interpret this clause:\n\n"${text}"`
  }
}

// Read selection from Word document
async function getSelectedTextFromWord(): Promise<string> {
  return new Promise((resolve) => {
    Office.context.document.getSelectedDataAsync(Office.CoercionType.Text, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        resolve(result.value as string)
      } else {
        resolve('')
      }
    })
  })
}


// Insert GPT result into Word at cursor
function insertIntoWord() {
  if (!chatResponse.value) return
  Office.context.document.setSelectedDataAsync(chatResponse.value, {
    coercionType: Office.CoercionType.Text
  })
}





// --- Review ---
const contractType = ref('')
const partyRole = ref('')
const reviewConcerns = ref('')
const reviewResult = ref('')
const reviewLoading = ref(false)


const startReview = async () => {
  reviewLoading.value = true
  const prompt = `You are an AI contract reviewer. The user represents: "${partyRole.value}". Look for: "${reviewConcerns.value}". Provide summary and redline advice.`

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ${import.meta.env.VITE_OPENAI_KEY}'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a legal reviewer.' },
          { role: 'user', content: prompt }
        ]
      })
    })

    const data = await res.json()
    reviewResult.value = data.choices?.[0]?.message?.content || 'No response.'
  } catch (e) {
    console.error(e)
    reviewResult.value = 'Error during review.'
  } finally {
    reviewLoading.value = false
  }
}


function extractBestMatchFromText(name: string, summary: string, explanation: string, text: string): string {
  const candidates = [name, summary, explanation]
    .map(x => x?.toLowerCase().replace(/[^a-z0-9 ]/gi, '').trim())
    .filter(Boolean)

  const lines = text.split('\n').map(line => line.trim())
  for (const candidate of candidates) {
    const match = lines.find(line =>
      line.toLowerCase().replace(/[^a-z0-9 ]/gi, '').includes(candidate) &&
      line.length > 20
    )
    if (match) return match
  }
  return ''
}



const startGeneralReview = async () => {
  reviewLoading.value = true

  const type = contractType.value.trim() || 'unspecified'
  const concerns = reviewConcerns.value.trim() || 'general enforceability and completeness'

  // 🧪 Temporary fallback for dev testing (remove when live)
  let contractText = `
THIS NON-DISCLOSURE AGREEMENT (the “Agreement”) is made between Party A and Party B for the purpose of preventing the unauthorized disclosure of confidential information. The parties agree not to disclose confidential information unless required by law.
`.trim()

  // ✅ Production: Try to read real contract from Word (when sideloaded)
try {
  // Try using Word.run API
  const result = await Word.run(async context => {
    const body = context.document.body
    context.load(body, 'text')
    await context.sync()
    return body.text
  })

  if (result && result.length > 30) {
    contractText = result
    console.log('📄 Word.run contract text:', contractText)
    debugLog.value = '📄 Word.run contract text:\n' + contractText
  } else {
    console.warn('⚠️ Word.run returned insufficient or empty text.')
    debugLog.value = '⚠️ Word.run returned insufficient or empty text.'
  }
} catch (err) {
  console.warn('⚠️ Word.run failed, attempting Office.context fallback:', err)
  debugLog.value = '⚠️ Word.run failed, trying fallback.\n' + (err as Error).message

  // Fallback using Office.context.document.body.getAsync
  await new Promise<void>((resolve) => {
    ;(Office.context.document as any).body.getAsync("text", (result: any) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        contractText = result.value
        console.log('📄 Office.context contract text (fallback):', contractText)
        debugLog.value = '📄 Office.context contract text (fallback):\n' + contractText
      } else {
        console.error('❌ Could not retrieve Word document text:', result.error)
        debugLog.value = '❌ Error retrieving Word text:\n' + result.error?.message || 'Unknown error'
      }
      resolve()
    })
  })
}



const prompt = `
You are a legal contract reviewer AI. The user uploaded the following contract:

"""
${contractText}
"""

They believe it is a "${type}". If this is incorrect, infer the correct contract type.
They are concerned about "${concerns}".

Your tasks:
1. Detect and classify the contract type (e.g., NDA, lease, employment)
2. Intuit the user’s likely legal goal
3. Identify contradictions or clauses that work against that goal
4. Flag missing or risky provisions
5. Return at least 3 clause evaluations, even if they are all compliant or standard.
6. For each clause, return:
   - name: a short label
   - status: "compliant", "issue", or "review"
   - summary: what the clause says in plain English
   - explanation: how it supports or harms the goal
   - redline: suggested revision (if needed)
   - originalText: the exact quote of the clause as it appears in the contract. No paraphrasing. Copy it verbatim.

DO NOT paraphrase in originalText. If you can't find a quote, return "".

Return only one valid JSON array like this:

[
  {
    "name": "Confidentiality",
    "status": "compliant",
    "summary": "This clause requires both parties to keep proprietary information confidential.",
    "explanation": "This protects trade secrets and sensitive data.",
    "originalText": "Each party agrees to keep confidential all proprietary information disclosed during the term of this Agreement.",
    "redline": ""
  }
]

No text before or after the array.
`.trim();





  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ${import.meta.env.VITE_OPENAI_KEY}' 
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a senior legal reviewer. Return only one valid JSON array, no explanations or extra text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

const data = await res.json()
const raw = data.choices?.[0]?.message?.content

if (!raw || raw.trim().length < 10) {
  throw new Error('❌ GPT response was empty or invalid.')
}

// ✅ Log to console
console.log('🧾 General GPT Response:', raw)

// ✅ Append to in-app debug panel
debugLog.value += '\n\n🧾 GPT Response:\n' + raw
debugLog.value += '\n⏳ Attempting to parse GPT JSON output...'

let parsedAll: any[] = []
try {
  // Clean up formatting artifacts, if any
  const fixedRaw = raw.replace(/]\s*\[/g, ',')
  parsedAll = JSON.parse(fixedRaw)
  debugLog.value += '\n✅ JSON parsed successfully.'
} catch (err) {
  debugLog.value += '\n❌ Failed to parse GPT JSON:\n' + (err as Error).message
  throw new Error(`❌ GPT response was not valid JSON:\n${raw}`)
}

// ✅ Normalize the parsed objects
const named = parsedAll.map((r: any) => ({
  name: r.name || r.ruleName || 'Unnamed Clause',
  status: r.status || 'review',
  summary: r.summary || '',
  explanation: r.explanation || '',
  redline: r.redline || '',
originalText:
  r.originalText?.trim() ||
  r.quote?.trim() ||
  extractBestMatchFromText(
    r.name || '',
    r.summary || '',
    r.explanation || '',
    contractText
  )

}));


    structuredGeneralResults.value = named
    named.forEach(r => {
      originalRedlines[r.name] = r.redline || ''
      ruleReviewMap[r.name] = '' // ✅ reset Apply/Ignore state for General Review
    })

    currentTab.value = 'review'
    showPlaybookResults.value = true
  } catch (err) {
    console.error('❌ General Review Error:', err)
    playbookResults.value = [
      {
        name: 'General Review Error',
        status: 'issue',
        summary: 'The AI could not parse its output.',
        explanation: typeof err === 'string' ? err : (err as Error).message || 'Unknown error'
      }
    ]
    currentTab.value = 'review'
    showPlaybookResults.value = true
  } finally {
    reviewLoading.value = false
  }
}


const updatePlaybook = async () => {
  const name = newPlaybookName.value.trim()
  const description = newPlaybookDescription.value.trim()

  if (!name || !description) {
    alert('Playbook name and description are required.')
    return
  }

  const duplicate = allPlaybooks.value.some(
    p =>
      p.id !== selectedPlaybook.value?.id &&
      p.name.trim().toLowerCase() === name.toLowerCase()
  )

  if (duplicate) {
    alert(`A playbook named "${name}" already exists.`)
    return
  }

  selectedPlaybook.value.name = name
  selectedPlaybook.value.description = description

  try {
    if (selectedPlaybook.value?.type === 'custom') {
      await updateCustomPlaybookInFirestore(selectedPlaybook.value, 'demoUser')
      console.log(`✅ Updated "${selectedPlaybook.value.name}" in Firebase`)
    }
  } catch (err) {
    console.error('❌ Failed to update playbook in Firebase:', err)
  }

  playbookFlow.value = 'list'
  selectedPlaybook.value = null
  showPlaybookResults.value = false
}

const syncRulesToFirebase = async () => {
  if (selectedPlaybook.value?.type !== 'custom') return

  try {
    await updateCustomPlaybookInFirestore(
      {
        ...selectedPlaybook.value,
        rules: selectedPlaybook.value.rules
      },
      'demoUser'
    )
    console.log('✅ Synced rule changes to Firebase.')
  } catch (err) {
    console.error('❌ Failed to sync rules to Firebase:', err)
  }
}


const startRenamePlaybook = (playbook: any) => {
  selectedPlaybook.value = playbook
  newPlaybookName.value = playbook.name
  newPlaybookDescription.value = playbook.description
  playbookFlow.value = 'rename'

  nextTick(() => {
    const el = document.querySelector('.playbook-form')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    newPlaybookNameInput.value?.focus()
  })
}

const startNewPlaybook = () => {
  newPlaybookName.value = ''
  newPlaybookDescription.value = ''
  playbookFlow.value = 'create'
  selectedPlaybook.value = null
  showPlaybookResults.value = false

  // Optional cleanup
  for (const key in ruleReviewMap) delete ruleReviewMap[key]
  for (const key in showRuleDetail) delete showRuleDetail[key]

  nextTick(() => {
    newPlaybookNameInput.value?.focus()
  })
}




// --- Playbook ---
import type { Ref } from 'vue'
const playbookFlow: Ref<'list' | 'create' | 'rename' | 'detail' | 'rule'> = ref('list')



const activePlaybookTab = ref<'all' | 'standard' | 'custom'>('all')
const selectedPlaybook = ref<any | null>(null)

const newPlaybookName = ref('')
const newPlaybookDescription = ref('')
const playbookResults = ref<any[]>([])
const structuredGeneralResults = ref<any[]>([])
const showPlaybookResults = ref(false)
const showRuleDetail = reactive<Record<string, boolean>>({})
const ruleEnabledMap = reactive<Record<string, boolean>>({}) // ✅ NEW
const ruleReviewMap = reactive<Record<string, 'applied' | 'ignored' | ''>>({})
const redlineEditMode = reactive<Record<string, boolean>>({})
const originalRedlines = reactive<Record<string, string>>({})
const debugLog = ref('')



const storedReviewMap = localStorage.getItem('ruleReviewMap')
if (storedReviewMap) {
  try {
    Object.assign(ruleReviewMap, JSON.parse(storedReviewMap))
  } catch (e) {
    console.warn('⚠️ Failed to parse ruleReviewMap:', e)
  }
}

// ✅ Save review status to localStorage
watch(
  ruleReviewMap,
  () => {
    localStorage.setItem('ruleReviewMap', JSON.stringify(ruleReviewMap))
  },
  { deep: true }
)

// ✅ Sync redline edits to Firebase
watch(
  playbookResults,
  async (newResults) => {
    if (selectedPlaybook.value?.type === 'custom') {
      try {
        const updatedRules = selectedPlaybook.value.rules.map((rule: any) => {
          if (!rule.name) return rule
          if (!newResults || !Array.isArray(newResults)) return rule
          const updated = newResults.find((r: any) => r.name === rule.name)
          return {
            ...rule,
            redline: updated?.redline || rule.redline
          }
        })

        await updateCustomPlaybookInFirestore(
          { ...selectedPlaybook.value, rules: updatedRules },
          'demoUser'
        )
        redlineSaveStatus.value = 'saving'

await updateCustomPlaybookInFirestore(
  { ...selectedPlaybook.value, rules: updatedRules },
  'demoUser'
)

console.log('✅ Synced redline updates to Firebase.')
redlineSaveStatus.value = 'saved'

setTimeout(() => {
  redlineSaveStatus.value = 'idle'
}, 2000)

        // ✅ Delete backup from localStorage now that it's synced
        const redlineBackupKey = `redlineBackup_${selectedPlaybook.value.id}`
        localStorage.removeItem(redlineBackupKey)
        console.log('🧹 Removed redline backup after sync.')

      } catch (err) {
        console.error('❌ Failed to sync redline edits:', err)
      }
    }
  },
  { deep: true }
)


// ✅ Backup redlines to localStorage
watch(
  playbookResults,
  () => {
    if (selectedPlaybook.value?.id) {
      const backupKey = `redlineBackup_${selectedPlaybook.value.id}`
      localStorage.setItem(backupKey, JSON.stringify(playbookResults.value))
      console.log(`💾 Saved redline backup to localStorage (${backupKey})`)
    }
  },
  { deep: true }
)






const countReviewStatus = (playbook: any, status: 'applied' | 'ignored' | '' | undefined) => {
  return playbook.rules.filter(
    (rule: any) => ruleReviewMap[rule.name] === status
  ).length
}

const selectedTag = ref<string>('')
// Load previously selected tag
const storedTag = localStorage.getItem('selectedTag')
if (storedTag) selectedTag.value = storedTag
// Save to localStorage on change
watch(selectedTag, newTag => {
  localStorage.setItem('selectedTag', newTag)
})

// Compute unique tags from playbook results
const uniqueTags = computed<string[]>(() => {
  const tagSet = new Set<string>()
  for (const r of playbookResults.value) {
    if (r.tags && Array.isArray(r.tags)) {
      r.tags.forEach((tag: string) => tagSet.add(tag))
    }
  }
  return Array.from(tagSet).sort()
})

const filteredResults = computed(() =>
  selectedTag.value
    ? playbookResults.value.filter(
        (r: any) => r.tags && r.tags.includes(selectedTag.value)
      )
    : playbookResults.value
)



try {
  for (const playbook of allPlaybooks.value) {
    if (Array.isArray(playbook.rules)) {
      for (const rule of playbook.rules) {
        if (rule?.name) {
          ruleReviewMap[rule.name] = ''
          redlineEditMode[rule.name] = false

          // ✅ Ensure toggle state is defined (respect user's saved toggle or default to ON)
          if (ruleEnabledMap[rule.name] === undefined) {
            ruleEnabledMap[rule.name] = true
          }
        }
      }
    }
  }
} catch (err) {
  console.warn('⚠️ Failed to initialize ruleReviewMap:', err)
}




const deletePlaybook = async (playbookId: number) => {
  const confirmDelete = confirm('Are you sure you want to delete this playbook?')
  if (!confirmDelete) return

  const index = allPlaybooks.value.findIndex(p => p.id === playbookId)
  if (index !== -1) {
    const playbook = allPlaybooks.value[index]

    if (playbook.type === 'custom') {
      try {
        await deleteCustomPlaybookFromFirestore(playbook.id, 'demoUser')
        console.log(`🗑 Deleted "${playbook.name}" from Firebase`)
      } catch (err) {
        console.error('❌ Failed to delete from Firebase:', err)
      }
    }

    allPlaybooks.value.splice(index, 1)

    if (selectedPlaybook.value?.id === playbookId) {
      selectedPlaybook.value = null
      playbookFlow.value = 'list'
      showPlaybookResults.value = false
    }
  }
}



// 🔁 Auto-save to localStorage whenever allPlaybooks changes
watch(
  allPlaybooks,
  newVal => {
    localStorage.setItem('playbooks', JSON.stringify(newVal))
  },
  { deep: true }
)
const storedPlaybooks = localStorage.getItem('playbooks')
if (storedPlaybooks) {
  try {
    allPlaybooks.value = JSON.parse(storedPlaybooks)
  } catch (e) {
    console.error('⚠️ Failed to parse saved playbooks:', e)
  }
}
// Inject standard playbooks (if not already present)
standardPlaybooks.forEach(std => {
  const exists = allPlaybooks.value.some(p => p.id === std.id)
  if (!exists) {
    allPlaybooks.value.push(std)
  }
})


const filteredPlaybooks = computed(() =>
  activePlaybookTab.value === 'all'
    ? allPlaybooks.value
    : allPlaybooks.value.filter(p => p.type === activePlaybookTab.value)
)

const openPlaybookTab = () => {
  currentTab.value = 'playbook'
  playbookFlow.value = 'list'
}




const loadStandardPlaybook = (playbookId: number) => {
  const playbook = allPlaybooks.value.find(p => p.id === playbookId)
  if (!playbook) return

  // Only load if standard and currently has no rules
  if (playbook.type === 'standard' && playbook.rules.length === 0) {
    playbook.rules = enhancedMndaPlaybook
    selectedPlaybook.value = playbook
    playbookFlow.value = 'detail'
    showPlaybookResults.value = false
    alert(`✅ Standard playbook loaded: "${playbook.name}"`)       
    nextTick(() => {
      const el = document.querySelector('.playbook-form')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
   })

  }

}

const cloneToCustom = (playbook: any) => {
  const cloned = {
    id: Date.now(),
    name: `${playbook.name} (Copy)`,
    description: playbook.description,
    type: 'custom',
    rules: JSON.parse(JSON.stringify(playbook.rules)), // deep-clone
    _isNewlyCloned: true
  }

  // Reset review state
  for (const rule of cloned.rules) {
    ruleReviewMap[rule.name] = ''
    delete showRuleDetail[rule.name]
  }

  allPlaybooks.value.push(cloned)
  selectedPlaybook.value = cloned
  playbookFlow.value = 'detail'
  showPlaybookResults.value = false
}



const savePlaybook = async () => {
  const name = newPlaybookName.value.trim()
  const description = newPlaybookDescription.value.trim()

  if (!name || !description) {
    alert('Playbook name and description are required.')
    return
  }

  const duplicate = allPlaybooks.value.some(p =>
    p.name.trim().toLowerCase() === name.toLowerCase()
  )

  if (duplicate) {
    alert(`A playbook named "${name}" already exists.`)
    return
  }

  const pb = {
    id: Date.now(),
    name,
    description,
    type: 'custom',
    rules: []
  }

  allPlaybooks.value.push(pb)
  selectedPlaybook.value = pb
  playbookFlow.value = 'detail'
  showPlaybookResults.value = false

  // ✅ Save to Firebase
  try {
    await saveCustomPlaybookToFirestore(pb, 'demoUser') // Replace with real user ID if using auth
    console.log(`✅ Saved custom playbook "${pb.name}" to Firestore`)
  } catch (err) {
    console.error(`❌ Error saving playbook to Firestore:`, err)
  }
}


const redlineSaveStatus = ref<'idle' | 'saving' | 'saved'>('idle')




const cancelFlow = () => {
  playbookFlow.value = 'list'
  selectedPlaybook.value = null
  showPlaybookResults.value = false // ✅ Reset results view on cancel
}

const selectPlaybook = (playbook: any) => {
  selectedPlaybook.value = playbook
  playbookFlow.value = 'detail'
  playbookResults.value = [] // Clear previous results
  showPlaybookResults.value = false // Reset view

// 🧠 Initialize maps for selected rules
for (const rule of playbook.rules) {
  if (rule?.name) {
    ruleReviewMap[rule.name] = ruleReviewMap[rule.name] || ''
    redlineEditMode[rule.name] = redlineEditMode[rule.name] || false

    // ✅ Respect toggle from before, or default ON
    if (ruleEnabledMap[rule.name] === undefined) {
      ruleEnabledMap[rule.name] = true
    }
  }
}

}
const playbookRuleName = ref('')
const playbookRuleInstruction = ref('')
const playbookRuleCondition = ref('')
const playbookRuleResponse = ref('')
const playbookRuleComment = ref('')
const playbookRuleTags = ref('')
const playbookRuleClauseExample = ref('')
const playbookRuleClarification = ref('')


const addRule = async () => {
 const name = playbookRuleName.value.trim()
const instruction = playbookRuleInstruction.value.trim()
const condition = playbookRuleCondition.value.trim()
const response = playbookRuleResponse.value
const comment = playbookRuleComment.value.trim()
const clauseExample = playbookRuleClauseExample.value.trim()
const clarification = playbookRuleClarification.value.trim()

console.log('[🧠 Debug] Rule Fields:', {
  name,
  instruction,
  condition,
  response,
  selectedPlaybook: selectedPlaybook.value
})

// Check required fields
if (!selectedPlaybook.value) {
  alert('⚠️ Please select a playbook before creating a rule.')
  return
}

if (!name) {
  alert('⚠️ Rule name is required.')
  return
}

if (!instruction || instruction.length < 10 || /^(none|n\/a)$/i.test(instruction)) {
  alert('⚠️ Instruction must be descriptive. Please explain what GPT should look for.')
  return
}

if (!response) {
  alert('⚠️ Please select a response type.')
  return
}

// Duplicate name check
const nameExists = selectedPlaybook.value.rules.some((r: any, idx: number) => {
  const isSame = r.name.trim().toLowerCase() === name.toLowerCase()
  const isNotEditingSame = editingRuleIndex.value === null || idx !== editingRuleIndex.value
  return isSame && isNotEditingSame
})

if (nameExists) {
  alert(`⚠️ A rule named "${name}" already exists.`)
  return
}

  const timestamp = new Date().toISOString()

  let inferredTags: string[] = []
  try {
    const tagPrompt = `Based on the following rule name, instruction, and condition, return 3 relevant tags that classify this legal review rule (e.g., confidentiality, liability, dispute resolution). Return a plain JSON array of strings.

Rule Name: ${name}
Instruction: ${instruction}
Condition: ${condition}

Respond with: ["tag1", "tag2", "tag3"]`

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ${import.meta.env.VITE_OPENAI_KEY}' 
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a legal assistant that classifies contract clauses.' },
          { role: 'user', content: tagPrompt }
        ]
      })
    })

    const data = await res.json()
    const tagArray = JSON.parse(data.choices?.[0]?.message?.content || '[]')
  if (Array.isArray(tagArray)) {
  inferredTags = tagArray
    .map((t: string) => t.trim().toLowerCase())
    .filter(Boolean)
    
  if (inferredTags.length === 0) {
    alert('⚠️ GPT could not infer any meaningful tags for this rule. Please make sure your instruction is specific and actionable.')
    return
  }
} else {
  alert('⚠️ GPT did not return a valid list of tags. Try adjusting your instruction.')
  return
}

  } catch (err) {
    console.warn('⚠️ GPT tag inference failed. Saving rule with empty tags.', err)
    inferredTags = []
  }

  const newRule = {
    name,
    instruction,
    condition,
    response,
    comment,
    clauseExample,
    clarification,
    tags: inferredTags,
    createdAt: timestamp,
    updatedAt: timestamp,
    author: 'demoUser'
  }

  if (editingRuleIndex.value !== null) {
    const oldRule = selectedPlaybook.value.rules[editingRuleIndex.value]
    selectedPlaybook.value.rules[editingRuleIndex.value] = {
      ...newRule,
      createdAt: oldRule.createdAt || timestamp,
      updatedAt: timestamp
    }
    editingRuleIndex.value = null
  } else {
    selectedPlaybook.value.rules.push(newRule)
    ruleEnabledMap[newRule.name] = true
    ruleReviewMap[newRule.name] = ''
  }

  await syncRulesToFirebase()

  // Clear form
  playbookRuleName.value = ''
  playbookRuleInstruction.value = ''
  playbookRuleCondition.value = ''
  playbookRuleResponse.value = ''
  playbookRuleComment.value = ''
  playbookRuleClauseExample.value = ''
  playbookRuleClarification.value = ''
  playbookRuleTags.value = ''
  playbookFlow.value = 'detail'
}




const startEditRule = (index: number) => {
  const rule = selectedPlaybook.value.rules[index]
  playbookRuleName.value = rule.name
  playbookRuleInstruction.value = rule.instruction
  playbookRuleCondition.value = rule.condition
  playbookRuleResponse.value = rule.response
  playbookRuleComment.value = rule.comment || ''
  playbookRuleClauseExample.value = rule.clauseExample || ''
  playbookRuleClarification.value = rule.clarification || ''
  editingRuleIndex.value = index
  playbookFlow.value = 'rule'
}



const removeRule = async (index: number) => {
  if (!selectedPlaybook.value) return

  const ruleName = selectedPlaybook.value.rules[index].name
  selectedPlaybook.value.rules.splice(index, 1)
  delete ruleEnabledMap[ruleName]

  showPlaybookResults.value = false // reset results view in case user reruns
  playbookFlow.value = 'detail'

  // ✅ Sync updated rules to Firebase
  await syncRulesToFirebase()
}

const compliantCount = computed(
  () => playbookResults.value.filter(r => r.status === 'compliant').length
)

const issueCount = computed(
  () => playbookResults.value.filter(r => r.status === 'issue').length
)

const reviewCount = computed(
  () => playbookResults.value.filter(r => r.status === 'review').length
)

const totalResults = computed(() => playbookResults.value.length)

const hasEnabledRules = computed(() => {
  if (!selectedPlaybook.value) return false
  return selectedPlaybook.value.rules.some(
    (rule: any) => ruleEnabledMap[rule.name] !== false
  )
})

const hasRedlineBackup = computed(() =>
  redlineBackupKey.value && localStorage.getItem(redlineBackupKey.value)
)


const addTestRules = () => {
  if (!selectedPlaybook.value) {
    alert('No playbook is selected.')
    return
  }

  for (let i = 1; i <= 50; i++) {
    const name = `Test Rule ${i}`
    selectedPlaybook.value.rules.push({
      name,
      instruction: `Instruction for ${name}`,
      condition: `Condition to match ${name}`,
      response: 'suggestion',
      comment: '',
      tags: ['test']
    })
    ruleEnabledMap[name] = true
    ruleReviewMap[name] = ''
  }

  alert('✅ 50 test rules added.')

  nextTick(() => {
    const el = document.querySelector('.playbook-form')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  })
}


function formatRedlineText(raw: string): string {
  if (!raw) return ''
  const highlighted = raw
    // Bold key legal terms
    .replace(/\b(Indemnification|Confidentiality|Liability|Term|Termination|Jurisdiction|Waiver|Breach|Governing Law|Assignment|Notices)\b/gi, '<strong>$1</strong>')
    // Underline defined terms (naive capitalized words)
    .replace(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/g, '<u>$1</u>')
    // Italicize boilerplate
    .replace(/\b(to the fullest extent permitted by law|including but not limited to|without limitation)\b/gi, '<em>$1</em>')

  return DOMPurify.sanitize(highlighted)
}




const runPlaybook = async () => {
  const rules = selectedPlaybook.value?.rules || []

  if (!rules.length) {
    alert('Please add at least one rule before running analysis.')
    return
  }

  const enabledRules = rules.filter((r: any) => ruleEnabledMap[r.name] !== false)

  if (!enabledRules.length) {
    alert('No rules are enabled. Please toggle at least one rule to "Included" before running.')
    return
  }

  // ✅ STEP 1: Try to get real document text
  let contractText = ''
  try {
    const result = await Word.run(async context => {
      const body = context.document.body
      context.load(body, 'text')
      await context.sync()
      return body.text
    })
    contractText = result || ''
  } catch (err) {
    console.warn('⚠️ Could not load Word text:', err)
    alert('Could not read the contract text from Word. Please ensure the add-in has access.')
    return
  }

  playbookResults.value = []

  const formatted = enabledRules
    .map(
      (r: any) => `Rule Name: ${r.name}
Instruction: ${r.instruction}
Clause Example: ${r.clauseExample || 'None provided'}
Clarification: ${r.clarification || 'None provided'}`
    )
    .join('\n---\n')

  const playbookPrompt = `
You are an AI contract reviewer analyzing the following agreement:

"""
${contractText}
"""

The user has provided these playbook rules:

${formatted}

Tasks:
1. Evaluate each rule individually against the contract.
2. Identify conflicts (e.g., multiple governing laws).
3. Return exactly one valid JSON array like this:

[
  {
    "name": "Rule Name",
    "status": "compliant" | "issue" | "review",
    "summary": "Summary of clause or issue",
    "explanation": "Why it complies or not",
    "redline": "Redline version if applicable"
  }
]

DO NOT return any commentary or multiple arrays.
  `.trim()

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert legal reviewer. Return only a single valid JSON array. No commentary.`
          },
          {
            role: 'user',
            content: playbookPrompt
          }
        ]
      })
    })

    const json = await res.json()
    const raw = json.choices?.[0]?.message?.content || '[]'
    console.log('🧾 GPT Response:', raw)

    let parsedAll: any[] = []

    try {
      const fixedRaw = raw.replace(/]\s*\[/g, ',')
      parsedAll = JSON.parse(fixedRaw)
    } catch (parseErr) {
      throw new Error(`GPT response was not valid JSON:\n${raw}`)
    }

    const enabledNames = new Set(enabledRules.map((r: any) => r.name))
    const parsed = parsedAll.filter((r: any) =>
      enabledNames.has(r.name || r.ruleName)
    ).map((r: any) => ({
      name: r.name || r.ruleName,
      status: r.status,
      summary: r.summary,
      redline: r.redline || '',
      explanation: r.explanation
    }))

    playbookResults.value = parsed

    parsed.forEach((r: any) => {
      originalRedlines[r.name] = r.redline || ''
    })

    currentTab.value = 'review'
    showPlaybookResults.value = true
  } catch (err: any) {
    console.error('❌ GPT Error:', err)

    playbookResults.value = [
      {
        name: 'GPT Error',
        status: 'issue',
        summary: 'The AI did not return valid JSON or the request failed.',
        explanation: typeof err === 'string' ? err : err.message || 'Unknown error'
      }
    ]

    currentTab.value = 'review'
    showPlaybookResults.value = true
  }
}



watch(allPlaybooks, async () => {
  await nextTick()

  const newlyCloned = allPlaybooks.value.find(p => p._isNewlyCloned)
  if (newlyCloned) {
    alert(`✅ Custom copy created: "${newlyCloned.name}"`)

    // Optional: scroll into view
    const el = document.getElementById(`playbook-${newlyCloned.id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    // Clear the flag after showing the alert
    newlyCloned._isNewlyCloned = false
  }
})


const uploadStandardPlaybooks = async () => {
  const playbookRef = collection(db, 'standardPlaybooks')

  for (const pb of standardPlaybooks) {
    try {
      await setDoc(doc(playbookRef, String(pb.id)), pb)
      console.log(`✅ Uploaded playbook: ${pb.name}`)
    } catch (err) {
      console.error(`❌ Failed to upload ${pb.name}`, err)
    }
  }

  alert('✅ Standard playbooks uploaded to Firestore.')
}

const restoreRedlinesFromBackup = () => {
  if (!redlineBackupKey.value) return

  const raw = localStorage.getItem(redlineBackupKey.value)
  if (!raw) return alert('⚠️ No backup found.')

  try {
    const backup = JSON.parse(raw)
    if (!Array.isArray(backup)) throw new Error('Invalid format.')

    // Overwrite matching redline values
    for (const restored of backup) {
      const match = playbookResults.value.find(r => r.name === restored.name)
      if (match && typeof restored.redline === 'string') {
        match.redline = restored.redline
      }
    }

    alert('🔁 Redline backup restored from localStorage.')
  } catch (err) {
    console.error('❌ Failed to restore redlines:', err)
    alert('❌ Failed to restore backup. Check console for details.')
  }
}

// force redeploy

</script>
<style scoped>
.flash-highlight {
  animation: flash 1s ease-in-out;
}

@keyframes flash {
  0% {
    background-color: #ffffcc;
  }
  100% {
    background-color: white;
  }
}

/* ✅ Toggle Switch Styles */
.toggle {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  margin-left: 12px;
}
.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.2s;
  border-radius: 20px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #4caf50;
}
input:checked + .slider:before {
  transform: translateX(16px);
}

/* Chat Textarea Styling */
.chat-box textarea,
textarea {
  min-height: 70px;
  resize: none;
}

/* Optional: Remove outline from buttons when clicked */
button:focus {
  outline: none;
}
</style>
