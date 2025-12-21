import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import PatientListView from "@/views/PatientListView.vue";

const PatientEditorView = () => import("@/views/PatientEditorView.vue");

const routes: RouteRecordRaw[] = [
  {
    path: "/patients",
    name: "patients",
    component: PatientListView,
  },
  {
    path: "/patients/new",
    name: "patient-create",
    component: PatientEditorView,
  },
  {
    path: "/patients/:id",
    name: "patient-edit",
    component: PatientEditorView,
    props: true,
  },
  {
    path: "/",
    redirect: "/patients",
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/patients",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
