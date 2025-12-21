<template>
  <div class="form-container">
    <h2>{{ isEditing ? "Modifier un patient" : "Ajouter un patient" }}</h2>

    <form @submit.prevent="submitForm">
      <div>
        <label>Nom</label>
        <input v-model="form.lastName" type="text" required />
      </div>

      <div>
        <label>Prénom</label>
        <input v-model="form.firstName" type="text" required />
      </div>

      <div>
        <label>Date</label>
        <input v-model="form.birthDate" type="date" required />
      </div>

      <div>
        <label>Type de vaccin</label>
        <select v-model="form.vaccineType" required>
          <option disabled value="">Choisir</option>
          <option value="Rabique">Rabique</option>
          <option value="VZV">VZV</option>
          <option value="Hepatite B">Hépatite B</option>
        </select>
      </div>

      <div>
        <label>
          <input type="checkbox" v-model="form.reminder" />
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
import { reactive, computed } from "vue";
import type { Patient } from "@/types/Patient";

const props = defineProps<{
  patient?: Patient | null;
}>();

const emit = defineEmits<{
  (e: "save", patient: Patient): void;
  (e: "cancel"): void;
}>();

const isEditing = computed(() => !!props.patient);

const form = reactive<Patient>({
  id: props.patient?.id ?? Date.now(),
  firstName: props.patient?.firstName ?? "",
  lastName: props.patient?.lastName ?? "",
  birthDate: props.patient?.birthDate ?? "",
  vaccineType: props.patient?.vaccineType ?? "Rabique",
  reminder: props.patient?.reminder ?? false,
});

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
</style>
