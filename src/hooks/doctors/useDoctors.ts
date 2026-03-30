"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Doctor } from "@/lib/types";
import { api } from "@/lib/api";

const EMPTY_FORM: Partial<Doctor> = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  specialization: "",
  department_id: undefined,
  license_number: "",
  status: "active",
  avatar_initials: "",
};

export function useDoctors(initialDoctors: Doctor[]) {
  const router = useRouter();

  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<Doctor>>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [delId, setDelId] = useState<number | null>(null);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setError("");
    setModal("add");
  };

  const openEdit = (doctor: Doctor) => {
    setForm({ ...doctor });
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

    const payload = {
      ...form,
      avatar_initials:
        form.avatar_initials ||
        `${form.first_name?.[0] ?? ""}${form.last_name?.[0] ?? ""}`.toUpperCase(),
    };

    try {
      if (modal === "edit" && form.id != null) {
        await api.update(
          "doctors",
          form.id,
          payload as Record<string, unknown>,
        );
      } else {
        await api.create("doctors", payload as Record<string, unknown>);
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
      await api.remove("doctors", delId);
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
