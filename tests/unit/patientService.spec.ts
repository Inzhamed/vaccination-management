
import test from "tape";
import sinon from "sinon";

import {
  http,
  fetchPatients,
  fetchPatientById,
  createPatient,
  updatePatient,
  deletePatientById,
} from "../../src/services/patientService";

// Tests pour fetchPatients()

test("fetchPatients - retourne la liste des patients", async (t) => {
  // un sandbox pour nettoyer facilement après
  const sandbox = sinon.createSandbox();

  // ARRANGE - Mes données de test
  const fakePatients = [
    {
      id: 1,
      firstName: "Ali",
      lastName: "Benali",
      birthDate: "1990-01-15",
      vaccineType: "Rabique",
      reminder: true,
    },
    {
      id: 2,
      firstName: "Sara",
      lastName: "Khelifi",
      birthDate: "1985-06-20",
      vaccineType: "VZV",
      reminder: false,
    },
  ];

  const httpStub = sandbox.stub(http, "get").resolves({
    data: fakePatients,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as any,
  });

  try {
    // ACT
    const result = await fetchPatients();

    // ASSERT
    t.ok(httpStub.calledOnce, "http.get a été appelé une fois");
    t.equal(result.length, 2, "2 patients sont retournés");
    t.equal(result[0].firstName, "Ali", "Le premier patient est Ali");
  } finally {
    sandbox.restore();
  }

  t.end();
});

test("fetchPatients - retourne un array vide si pas de patients", async (t) => {
  const sandbox = sinon.createSandbox();

  sandbox.stub(http, "get").resolves({
    data: [],
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as any,
  });

  try {
    const result = await fetchPatients();
    t.equal(result.length, 0, "Retourne un array vide");
    t.deepEqual(result, [], "Array vide correct");
  } finally {
    sandbox.restore();
  }

  t.end();
});

// Tests pour fetchPatientById()
test("fetchPatientById - retourne le patient demandé", async (t) => {
  const sandbox = sinon.createSandbox();

  const fakePatient = {
    id: 5,
    firstName: "Mohamed",
    lastName: "Cherif",
    birthDate: "1992-03-10",
    vaccineType: "Hepatite B",
    reminder: true,
  };

  const httpStub = sandbox.stub(http, "get").resolves({
    data: fakePatient,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as any,
  });

  try {
    const result = await fetchPatientById(5);

    t.ok(httpStub.calledOnce, "http.get a été appelé une fois");
    t.equal(httpStub.firstCall.args[0], "/patients/5", "URL correcte");
    t.equal(result.id, 5, "L'ID est correct");
    t.equal(result.firstName, "Mohamed", "Le prénom est correct");
  } finally {
    sandbox.restore();
  }

  t.end();
});

// Tests pour createPatient()
test("createPatient - crée un patient et retourne l'ID", async (t) => {
  const sandbox = sinon.createSandbox();

  // Les données qu'on envoie (sans ID)
  const newPatientData = {
    firstName: "Nadia",
    lastName: "Boukari",
    birthDate: "1995-11-25",
    vaccineType: "VZV" as const,
    reminder: false,
  };

  // L'API retourne les données AVEC un ID
  const createdPatient = {
    id: 10,
    ...newPatientData,
  };

  const httpStub = sandbox.stub(http, "post").resolves({
    data: createdPatient,
    status: 201,
    statusText: "Created",
    headers: {},
    config: {} as any,
  });

  try {
    const result = await createPatient(newPatientData);

    t.ok(httpStub.calledOnce, "http.post a été appelé");
    t.equal(result.id, 10, "Le patient a reçu l'ID 10");
    t.equal(result.firstName, "Nadia", "Le prénom est correct");
  } finally {
    sandbox.restore();
  }

  t.end();
});

// Tests pour updatePatient()
test("updatePatient - met à jour le patient", async (t) => {
  const sandbox = sinon.createSandbox();

  // Pour update, le payload doit avoir un ID
  const patientData = {
    id: 1,
    firstName: "Ali",
    lastName: "Benali-Modifié",
    birthDate: "1990-01-15",
    vaccineType: "Hepatite B" as const,
    reminder: true,
  };

  const httpStub = sandbox.stub(http, "put").resolves({
    data: patientData,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as any,
  });

  try {
    const result = await updatePatient(patientData);

    t.ok(httpStub.calledOnce, "http.put a été appelé");
    t.equal(httpStub.firstCall.args[0], "/patients/1", "URL correcte");
    t.equal(result.lastName, "Benali-Modifié", "Le nom a été mis à jour");
  } finally {
    sandbox.restore();
  }

  t.end();
});

test("updatePatient - lance une erreur si pas d'ID", async (t) => {
  // Pas besoin de sandbox car on ne mock rien
  
  // Payload sans ID
  const patientSansId = {
    firstName: "Test",
    lastName: "User",
    birthDate: "2000-01-01",
    vaccineType: "Rabique" as const,
    reminder: false,
  };

  try {
    await updatePatient(patientSansId as any);
    t.fail("Aurait dû lancer une erreur");
  } catch (error) {
    t.pass("Une erreur a été lancée comme prévu");
    t.ok(
      (error as Error).message.includes("requis"),
      "Le message mentionne que l'ID est requis"
    );
  }

  t.end();
});

// Tests pour deletePatientById()
test("deletePatientById - supprime le patient", async (t) => {
  const sandbox = sinon.createSandbox();

  const httpStub = sandbox.stub(http, "delete").resolves({
    data: null,
    status: 204,
    statusText: "No Content",
    headers: {},
    config: {} as any,
  });

  try {
    await deletePatientById(7);
    t.ok(httpStub.calledOnce, "http.delete a été appelé");
    t.equal(httpStub.firstCall.args[0], "/patients/7", "URL correcte");
    t.pass("Pas d'erreur = suppression réussie");
  } finally {
    sandbox.restore();
  }

  t.end();
});
