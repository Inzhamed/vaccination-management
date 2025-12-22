import cors from "cors";
import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3001;

type VaccineType = "Rabique" | "VZV" | "Hepatite B";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  vaccineType: VaccineType;
  reminder: boolean;
}

app.use(cors());
app.use(express.json());

let patients: Patient[] = [
  {
    id: 1,
    firstName: "Ali",
    lastName: "Benali",
    birthDate: "1995-06-10",
    vaccineType: "Rabique",
    reminder: true,
  },
  {
    id: 2,
    firstName: "Sara",
    lastName: "Khelifi",
    birthDate: "1991-04-18",
    vaccineType: "VZV",
    reminder: false,
  },
];

let nextId = patients.length + 1;

function validatePayload(body: Partial<Patient>): body is Omit<Patient, "id"> {
  return (
    typeof body.firstName === "string" &&
    typeof body.lastName === "string" &&
    typeof body.birthDate === "string" &&
    typeof body.vaccineType === "string" &&
    ["Rabique", "VZV", "Hepatite B"].includes(body.vaccineType) &&
    typeof body.reminder === "boolean"
  );
}

app.get("/patients", (_req: Request, res: Response) => {
  res.json(patients);
});

app.get("/patients/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const patient = patients.find((item) => item.id === id);

  if (!patient) {
    return res.status(404).json({ message: "Patient introuvable" });
  }

  return res.json(patient);
});

app.post("/patients", (req: Request, res: Response) => {
  if (!validatePayload(req.body)) {
    return res.status(400).json({ message: "Données invalides" });
  }

  const newPatient: Patient = { ...req.body, id: nextId++ };
  patients.push(newPatient);

  return res.status(201).json(newPatient);
});

app.put("/patients/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!validatePayload(req.body)) {
    return res.status(400).json({ message: "Données invalides" });
  }

  const index = patients.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Patient introuvable" });
  }

  patients[index] = { ...req.body, id };

  return res.json(patients[index]);
});

app.delete("/patients/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const nextPatients = patients.filter((patient) => patient.id !== id);

  if (nextPatients.length === patients.length) {
    return res.status(404).json({ message: "Patient introuvable" });
  }

  patients = nextPatients;

  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`API de vaccination prête sur http://localhost:${PORT}`);
});
