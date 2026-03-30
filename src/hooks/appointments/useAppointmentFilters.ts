"use client";
import { useState, useMemo } from "react";
import { Appointment } from "@/lib/types";

export function useAppointmentFilters(
  appointments: Appointment[],
  initialSearch: string,
  initialStatus: string,
  initialDate: string,
) {
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [dateFilter, setDateFilter] = useState(initialDate);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const q = searchInput.toLowerCase();
      const matchesSearch =
        !searchInput ||
        a.patient_name?.toLowerCase().includes(q) ||
        a.doctor_name?.toLowerCase().includes(q);

      const matchesStatus = !statusFilter || a.status === statusFilter;

      const matchesDate =
        !dateFilter ||
        new Date(a.scheduled_at).toISOString().startsWith(dateFilter);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, searchInput, statusFilter, dateFilter]);

  const clearFilters = () => {
    setSearchInput("");
    setStatusFilter("");
    setDateFilter("");
  };

  return {
    searchInput,
    statusFilter,
    dateFilter,
    filteredAppointments,
    setSearchInput,
    setStatusFilter,
    setDateFilter,
    clearFilters,
  };
}
