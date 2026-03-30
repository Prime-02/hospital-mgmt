"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Appointment, AptStatus } from "@/lib/types";
import { api } from "@/lib/api";
import { toDateTimeLocal } from "@/lib/format";

const EMPTY_FORM: Partial<Appointment> = {
  patient_id: undefined,
  doctor_id: undefined,
  department_id: undefined,
  scheduled_at: "",
  duration_min: 30,
  reason: "",
  notes: "",
  status: "scheduled",
};

export function useAppointments(initialAppointments: Appointment[]) {
  const router = useRouter();

  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<Appointment>>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [delId, setDelId] = useState<number | null>(null);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setError("");
    setModal("add");
  };

  const openEdit = (appointment: Appointment) => {
    setForm({
      ...appointment,
      scheduled_at: toDateTimeLocal(appointment.scheduled_at),
    });
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
        await api.update(
          "appointments",
          form.id,
          form as Record<string, unknown>,
        );
      } else {
        await api.create("appointments", form as Record<string, unknown>);
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
      await api.remove("appointments", delId);
      setDelId(null);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const quickStatus = async (id: number, newStatus: AptStatus) => {
    const apt = initialAppointments.find((a) => a.id === id);
    if (!apt) return;
    await api.update("appointments", id, {
      ...(apt as unknown as Record<string, unknown>),
      status: newStatus,
    });
    router.refresh();
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
    quickStatus,
  };
}
