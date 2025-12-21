import axios from "axios";
import type { Patient } from "@/types/Patient";

const API_URL = "https://mock-api.local/patients";

export async function fetchPatients(): Promise<Patient[]> {
  // Mock data
  return Promise.resolve([
    {
      id: 1,
      firstName: "Ali",
      lastName: "Benali",
      birthDate: "1995-06-10",
      vaccineType: "Rabique",
      reminder: true,
    },
  ]);
}

export async function savePatient(patient: Patient): Promise<Patient> {
  return Promise.resolve(patient);
}

export async function deletePatientById(id: number): Promise<void> {
  return Promise.resolve();
}
