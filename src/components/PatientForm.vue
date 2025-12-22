<template>
  <div class="form-container">
    <h2>{{ isEditing ? "Modifier un patient" : "Ajouter un patient" }}</h2>

    <form @submit.prevent="submitForm">
      <div>
        <label for="lastName">Nom</label>
        <input
          id="lastName"
          v-model="form.lastName"
          name="lastName"
          type="text"
          required
        />
      </div>

      <div>
        <label for="firstName">Prénom</label>
        <input
          id="firstName"
          v-model="form.firstName"
          name="firstName"
          type="text"
          required
        />
      </div>

      <div>
        <label for="birthDate">Date</label>
        <input
          id="birthDate"
          v-model="form.birthDate"
          name="birthDate"
          type="date"
          required
        />
      </div>

      <div>
        <label for="vaccineType">Type de vaccin</label>
        <select
          id="vaccineType"
          v-model="form.vaccineType"
          name="vaccineType"
          required
        >
          <option value="Rabique">Rabique</option>
          <option value="VZV">VZV</option>
          <option value="Hepatite B">Hépatite B</option>
        </select>
      </div>

      <div class="reminder-div">
        <label>
          <input
            id="reminder"
            v-model="form.reminder"
            name="reminder"
            type="checkbox"
          />
          Rappel
        </label>
      </div>

      <button type="submit">Enregistrer</button>
      <button type="button" @click="$emit('cancel')">Annuler</button>
    </form>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import { reactive, computed, watch } from "vue";
import type { Patient, PatientPayload } from "@/types/Patient";

const props = defineProps<{
  patient?: Patient | null;
}>();

const emit = defineEmits<{
  (e: "save", patient: PatientPayload): void;
  (e: "cancel"): void;
}>();

const blankPatient = (): PatientPayload => ({
  id: undefined,
  firstName: "",
  lastName: "",
  birthDate: "",
  vaccineType: "Rabique",
  reminder: false,
});

const isEditing = computed(() => !!props.patient);
const form = reactive<PatientPayload>(blankPatient());

watch(
  () => props.patient,
  (patient) => {
    Object.assign(form, patient ?? blankPatient());
  },
  { immediate: true }
);

function submitForm() {
  emit("save", { ...form });
}
</script>

<style scoped>
.form-container {
  margin-top: 20px;
}

form div {
  margin-bottom: 10px;
}
form label {
  display: block;
  margin-bottom: 4px;
}
form input,
form select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
form button {
  margin-right: 10px;
  padding: 8px 16px;
}
.reminder-div {
  display: flex;
  align-items: center;
}
.reminder-div label {
  display: flex;
  align-items: center;
}
.reminder-div input {
  margin-right: 6px;
}
</style>
