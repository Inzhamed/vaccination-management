<template>
  <div class="container">
    <h1>Vaccination Management</h1>

    <button @click="startCreate">Ajouter un patient</button>

    <table v-if="patients.length > 0">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Date</th>
          <th>Vaccin</th>
          <th>Rappel</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="patient in patients" :key="patient.id">
          <td>{{ patient.lastName }}</td>
          <td>{{ patient.firstName }}</td>
          <td>{{ patient.birthDate }}</td>
          <td>{{ patient.vaccineType }}</td>
          <td>{{ patient.reminder ? "Oui" : "Non" }}</td>
          <td>
            <button @click="editPatient(patient)">Modifier</button>
            <button @click="deletePatient(patient.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>Aucun patient enregistré</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Patient } from "@/types/Patient";

const patients = ref<Patient[]>([
  {
    id: 1,
    firstName: "Ali",
    lastName: "Benali",
    birthDate: "1995-06-10",
    vaccineType: "Rabique",
    reminder: true,
  },
]);

function startCreate() {
  console.log("Create patient");
}

function editPatient(patient: Patient) {
  console.log("Edit", patient);
}

function deletePatient(id: number) {
  patients.value = patients.value.filter((p) => p.id !== id);
}
</script>

<style scoped>
.container {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
</style>
