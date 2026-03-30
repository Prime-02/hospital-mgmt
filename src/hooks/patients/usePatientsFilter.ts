"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Patient } from "@/lib/types";

export function usePatientFilters(
  patients: Patient[],
  initialSearch: string,
  initialStatus: string,
) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);

  const pushFilter = (key: string, val: string) => {
    const p = new URLSearchParams({
      search: initialSearch,
      status: initialStatus,
      page: "1",
    });
    p.set(key, val);
    router.push(`/patients?${p}`);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    pushFilter("search", value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    pushFilter("status", value);
  };

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        !search ||
        patient.first_name.toLowerCase().includes(search.toLowerCase()) ||
        patient.last_name.toLowerCase().includes(search.toLowerCase()) ||
        patient.email?.toLowerCase().includes(search.toLowerCase()) ||
        patient.phone?.includes(search);

      const matchesStatus = !status || patient.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [patients, search, status]);

  return {
    search,
    status,
    filteredPatients,
    handleSearch,
    handleStatusChange,
  };
}
