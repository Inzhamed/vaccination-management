<template>
  <section class="list">
    <header>
      <div>
        <p class="eyebrow">Tableau des patients</p>
        <h2>Suivi des vaccinations</h2>
        <p class="subtitle">
          {{ filteredPatients.length }} patient(s) sélectionné(s) sur
          {{ patients.length }} patients.
        </p>
      </div>
      <button class="primary" type="button" @click="goToCreate">
        Ajouter un patient
      </button>
    </header>

    <div class="filters">
      <label>
        <span>Recherche</span>
        <input v-model="search" type="text" placeholder="Nom ou prénom" />
      </label>
      <div class="filter-buttons">
        <button
          v-for="option in vaccineOptions"
          :key="option"
          :class="{ active: filter === option }"
          type="button"
          @click="toggleFilter(option)"
        >
          {{ option }}
        </button>
        <button
          type="button"
          :class="{ active: filter === null }"
          @click="toggleFilter(null)"
        >
          Tous
        </button>
      </div>
    </div>

    <div v-if="error" class="alert">{{ error }}</div>
    <div v-else-if="loading" class="loading">Chargement des patients…</div>
    <div v-else-if="filteredPatients.length === 0" class="empty">
      Aucun patient ne correspond à cette recherche.
    </div>
    <table v-else>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Date</th>
          <th>Vaccin</th>
          <th>Rappel</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="patient in filteredPatients" :key="patient.id">
          <td>{{ patient.lastName }}</td>
          <td>{{ patient.firstName }}</td>
          <td>{{ formatDate(patient.birthDate) }}</td>
          <td>
            <span class="badge">{{ patient.vaccineType }}</span>
          </td>
          <td>
            <span :class="['reminder', patient.reminder ? 'on' : 'off']">
              {{ patient.reminder ? "Oui" : "Non" }}
            </span>
          </td>
          <td class="actions">
            <button type="button" @click="editPatient(patient.id)">
              Modifier
            </button>
            <button
              type="button"
              class="danger"
              @click="confirmDelete(patient.id)"
            >
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import type { Patient } from "@/types/Patient";
import { deletePatientById, fetchPatients } from "@/services/patientService";

const router = useRouter();
const patients = ref<Patient[]>([]);
const loading = ref(false);
const error = ref("");
const search = ref("");
const filter = ref<Patient["vaccineType"] | null>(null);

const vaccineOptions: Patient["vaccineType"][] = [
  "Rabique",
  "VZV",
  "Hepatite B",
];

const filteredPatients = computed(() => {
  return patients.value.filter((patient) => {
    const matchesFilter = filter.value
      ? patient.vaccineType === filter.value
      : true;
    const term = search.value.trim().toLowerCase();
    const matchesSearch = term
      ? `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(term)
      : true;
    return matchesFilter && matchesSearch;
  });
});

onMounted(() => {
  loadPatients();
});

async function loadPatients() {
  try {
    loading.value = true;
    patients.value = await fetchPatients();
  } catch (err) {
    console.error(err);
    error.value = "Impossible de charger les patients.";
  } finally {
    loading.value = false;
  }
}

function goToCreate() {
  router.push({ name: "patient-create" });
}

function editPatient(id: number) {
  router.push({ name: "patient-edit", params: { id } });
}

function toggleFilter(option: Patient["vaccineType"] | null) {
  filter.value = option;
}

function formatDate(value: string) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("fr-FR");
}

async function confirmDelete(id: number) {
  const confirmed = window.confirm("Supprimer ce patient ?");
  if (!confirmed) {
    return;
  }

  try {
    loading.value = true;
    await deletePatientById(id);
    await loadPatients();
  } catch (err) {
    console.error(err);
    error.value = "Suppression impossible.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.list {
  padding: 32px;
}

header {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
  color: #94a3b8;
}

.subtitle {
  margin: 6px 0 0;
  color: #475569;
}

.filters {
  margin: 24px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
}

.filters label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #475569;
}

.filters input {
  margin-top: 6px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d2d7e3;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-buttons button {
  border-radius: 999px;
  border: 1px solid #cbd5f5;
  padding: 6px 14px;
  background: transparent;
  cursor: pointer;
}

.filter-buttons button.active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}

.alert {
  background: #fee2e2;
  color: #b91c1c;
  padding: 12px 16px;
  border-radius: 10px;
}

.loading,
.empty {
  padding: 24px 0;
  color: #475569;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  font-size: 13px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #94a3b8;
  padding-bottom: 12px;
}

td {
  border-top: 1px solid #edf2fb;
  padding: 16px 0;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #e0e7ff;
  color: #312e81;
  font-size: 12px;
}

.reminder {
  font-weight: 600;
}

.reminder.on {
  color: #16a34a;
}

.reminder.off {
  color: #b91c1c;
}

.actions {
  display: flex;
  gap: 8px;
}

button {
  border: none;
  cursor: pointer;
  border-radius: 8px;
  padding: 8px 14px;
  font-weight: 600;
}

button.primary {
  background: #2563eb;
  color: #fff;
}

button.danger {
  background: #fee2e2;
  color: #b91c1c;
}

@media (max-width: 720px) {
  .list {
    padding: 24px 16px;
  }

  table {
    font-size: 14px;
  }
}
</style>
