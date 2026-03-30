"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Patient } from "@/lib/types";
import { api } from "@/lib/api";

const EMPTY_FORM: Partial<Patient> = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  gender: undefined,
  blood_type: undefined,
  address: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  medical_notes: "",
  status: "active",
};

export function usePatients() {
  const router = useRouter();

  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<Patient>>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [delId, setDelId] = useState<number | null>(null);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setError("");
    setModal("add");
  };

  const openEdit = (patient: Patient) => {
    setForm({ ...patient });
    setError("");
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setError("");
  };

  const save = async () => {
    setLoading(true);
    setError("");

    try {
      if (modal === "edit" && form.id != null) {
        await api.update("patients", form.id, form as Record<string, unknown>);
      } else {
        await api.create("patients", form as Record<string, unknown>);
      }
      closeModal();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (delId == null) return;
    setLoading(true);
    try {
      await api.remove("patients", delId);
      setDelId(null);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return {
    modal,
    form,
    loading,
    error,
    delId,
    openAdd,
    openEdit,
    closeModal,
    setForm,
    save,
    confirmDelete,
    setDelId,
  };
}
