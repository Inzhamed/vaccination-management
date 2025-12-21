export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  vaccineType: "Rabique" | "VZV" | "Hepatite B";
  reminder: boolean;
}
