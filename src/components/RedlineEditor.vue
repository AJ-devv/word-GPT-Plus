<template>
  <div>
    <!-- ✅ Redline Section: Editable if toggled, otherwise read-only -->
    <div v-if="editingRedlineRule === rule.name">
      <textarea
        :value="rule.redline"
        style="width: 100%; background: #f9f9f9; padding: 6px; font-family: monospace"
        rows="4"
        @input="$emit('update-redline', ($event.target as HTMLTextAreaElement)?.value)"
      ></textarea>
    </div>

    <pre
      v-else
      style="white-space: pre-wrap; background: #f9f9f9; padding: 6px; font-family: monospace"
    >
{{ rule.redline || 'None' }}
    </pre>

    <!-- 📝 Edit / ✅ Done Toggle -->
    <div style="display: flex; gap: 8px; margin-top: 4px">
      <button
        v-if="editingRedlineRule !== rule.name"
        @click="$emit('toggle-edit', rule.name)"
      >
        ✏️ Edit Redline
      </button>

      <button
        v-else
        @click="$emit('toggle-edit', null)"
      >
        ✅ Done
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  rule: any
  editingRedlineRule: string | null
}>()

defineEmits<{
  (e: 'toggle-edit', ruleName: string | null): void
  (e: 'update-redline', value: string): void
}>()
</script>
