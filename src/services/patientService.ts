import axios from "axios";
import type { Patient, PatientPayload } from "@/types/Patient";

const API_URL = process.env.VUE_APP_API_URL || "http://localhost:3001";

export const http = axios.create({
  baseURL: API_URL,
});

export async function fetchPatients(): Promise<Patient[]> {
  const { data } = await http.get<Patient[]>("/patients");
  return data;
}

export async function fetchPatientById(id: number): Promise<Patient> {
  const { data } = await http.get<Patient>(`/patients/${id}`);
  return data;
}

export async function createPatient(payload: PatientPayload): Promise<Patient> {
  const { data } = await http.post<Patient>("/patients", payload);
  return data;
}

export async function updatePatient(payload: PatientPayload): Promise<Patient> {
  if (!payload.id) {
    throw new Error("Identifiant requis pour la mise à jour");
  }

  const { data } = await http.put<Patient>(`/patients/${payload.id}`, payload);
  return data;
}

export async function deletePatientById(id: number): Promise<void> {
  await http.delete(`/patients/${id}`);
}
