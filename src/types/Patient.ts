export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  vaccineType: "Rabique" | "VZV" | "Hepatite B";
  reminder: boolean;
}

export type PatientPayload = Omit<Patient, "id"> & { id?: number };
