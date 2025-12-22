import { mount } from "@vue/test-utils";
import PatientForm from "@/components/PatientForm.vue";
import type { Patient } from "@/types/Patient";

describe("PatientForm", () => {
  it("pré-remplit le formulaire en mode édition", () => {
    const patient: Patient = {
      id: 12,
      firstName: "Nadia",
      lastName: "Cherif",
      birthDate: "1993-03-21",
      vaccineType: "VZV",
      reminder: true,
    };

    const wrapper = mount(PatientForm, {
      props: { patient },
    });

    const lastNameInput = wrapper.find("input[name=lastName]");
    expect((lastNameInput.element as HTMLInputElement).value).toBe("Cherif");
  });

  it("émet les données saisies à la soumission", async () => {
    const wrapper = mount(PatientForm);

    await wrapper.find("input[name=lastName]").setValue("Amar");
    await wrapper.find("input[name=firstName]").setValue("Walid");
    await wrapper.find("input[name=birthDate]").setValue("1990-01-01");
    await wrapper.find("select[name=vaccineType]").setValue("Hepatite B");
    await wrapper.find("input[name=reminder]").setValue(true);

    await wrapper.find("form").trigger("submit.prevent");

    const saveEvents = wrapper.emitted("save");
    expect(saveEvents).toBeTruthy();
    const payload = saveEvents?.[0][0];
    expect(payload).toMatchObject({
      lastName: "Amar",
      firstName: "Walid",
      vaccineType: "Hepatite B",
      reminder: true,
    });
  });
});
