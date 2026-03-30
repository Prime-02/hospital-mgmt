"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Doctor } from "@/lib/types";

export function useDoctorFilters(
  doctors: Doctor[],
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
    });
    p.set(key, val);
    router.push(`/doctors?${p}`);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    pushFilter("search", value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    pushFilter("status", value);
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        !search ||
        doctor.first_name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.last_name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = !status || doctor.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [doctors, search, status]);

  return {
    search,
    status,
    filteredDoctors,
    handleSearch,
    handleStatusChange,
  };
}
