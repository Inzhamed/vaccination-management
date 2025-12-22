<template>
  <section class="editor">
    <div class="editor-card">
      <header class="editor-header">
        <div>
          <p class="eyebrow">
            {{ isEdit ? "Fiche patient" : "Nouvelle inscription" }}
          </p>
        </div>
        <button class="ghost" type="button" @click="goBack">
          Retour à la liste
        </button>
      </header>
      <div v-if="error" class="alert">{{ error }}</div>
      <div v-if="loading" class="loading">Chargement des données...</div>

      <div class="form-surface">
        <PatientForm
          v-if="!isEdit || patient"
          :patient="patient"
          @save="handleSave"
          @cancel="goBack"
        />
        <p v-else class="placeholder">
          Sélectionnez un patient valide depuis la liste.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PatientForm from "@/components/PatientForm.vue";
import type { Patient, PatientPayload } from "@/types/Patient";
import {
  createPatient,
  fetchPatientById,
  updatePatient,
} from "@/services/patientService";

const route = useRoute();
const router = useRouter();

const patient = ref<Patient | null>(null);
const loading = ref(false);
const error = ref("");
const isEdit = computed(() => Boolean(route.params.id));

onMounted(async () => {
  if (isEdit.value) {
    await loadPatient();
  }
});

async function loadPatient() {
  try {
    loading.value = true;
    patient.value = await fetchPatientById(Number(route.params.id));
  } catch (err) {
    console.error(err);
    error.value = "Impossible de charger le patient.";
  } finally {
    loading.value = false;
  }
}

async function handleSave(payload: PatientPayload) {
  try {
    loading.value = true;
    if (isEdit.value) {
      await updatePatient({ ...payload, id: Number(route.params.id) });
    } else {
      await createPatient(payload);
    }
    router.push({ name: "patients" });
  } catch (err) {
    console.error(err);
    error.value = "Impossible d'enregistrer les données.";
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push({ name: "patients" });
}
</script>

<style scoped>
.editor {
  display: flex;
  justify-content: center;
  padding: 32px 16px 48px;
}

.editor-card {
  width: min(760px, 100%);
  background: #fff;
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 24px 45px rgba(15, 23, 42, 0.08);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
  color: #94a3b8;
}

.helper {
  margin: 8px 0 0;
  color: #475569;
}

.status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 24px 0 16px;
}

.status-chip {
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
}

.status-edit {
  background: #fef3c7;
  color: #92400e;
}

.status-new {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-chip.neutral {
  background: #f1f5f9;
  color: #475569;
}

.alert {
  margin-bottom: 12px;
  padding: 12px 16px;
  background: #fee2e2;
  border-radius: 10px;
  color: #b91c1c;
}

.loading {
  margin-bottom: 12px;
  color: #475569;
}

.form-surface {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  background: linear-gradient(180deg, #f9fbff 0%, #ffffff 100%);
}

.form-surface :deep(form) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px 20px;
}

.form-surface :deep(form div) {
  display: flex;
  flex-direction: column;
}

.form-surface :deep(label) {
  font-size: 13px;
  font-weight: 600;
  color: #1f2933;
  margin-bottom: 6px;
}

.form-surface :deep(input),
.form-surface :deep(select) {
  border: 1px solid #cbd5f5;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
}

.form-surface :deep(button[type="submit"]) {
  grid-column: 1 / -1;
  background: #2563eb;
  color: #fff;
  border: none;
}

.form-surface :deep(button[type="button"]) {
  grid-column: 1 / -1;
  background: #e2e8f0;
  color: #1f2933;
  border: none;
}

.placeholder {
  margin: 16px 0 0;
  color: #94a3b8;
}

button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
}

button.ghost {
  background: transparent;
  color: #2563eb;
}

@media (max-width: 640px) {
  .editor-card {
    padding: 24px 16px;
  }

  .form-surface :deep(form) {
    grid-template-columns: 1fr;
  }
}
</style>
