import { flushPromises, mount } from "@vue/test-utils";
import PatientListView from "@/views/PatientListView.vue";
import type { Patient } from "@/types/Patient";
import { deletePatientById, fetchPatients } from "@/services/patientService";

jest.mock("@/services/patientService", () => ({
  fetchPatients: jest.fn(),
  deletePatientById: jest.fn(),
}));

jest.mock("vue-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("PatientListView", () => {
  const samplePatients: Patient[] = [
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

  beforeEach(() => {
    (fetchPatients as jest.Mock).mockReset();
    (deletePatientById as jest.Mock).mockReset();
  });

  it("affiche les patients récupérés", async () => {
    (fetchPatients as jest.Mock).mockResolvedValue(samplePatients);

    const wrapper = mount(PatientListView);
    await flushPromises();

    expect(fetchPatients).toHaveBeenCalled();
    expect(wrapper.text()).toContain("Benali");
    expect(wrapper.text()).toContain("Khelifi");
  });

  it("supprime un patient après confirmation", async () => {
    (fetchPatients as jest.Mock)
      .mockResolvedValueOnce(samplePatients)
      .mockResolvedValueOnce(samplePatients.slice(1));

    (deletePatientById as jest.Mock).mockResolvedValue(undefined);

    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);

    const wrapper = mount(PatientListView);
    await flushPromises();

    await wrapper.find("button.danger").trigger("click");
    await flushPromises();

    expect(deletePatientById).toHaveBeenCalledWith(1);
    expect(fetchPatients).toHaveBeenCalledTimes(2);

    confirmSpy.mockRestore();
  });
});
