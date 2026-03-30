'use client';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog';
import { FilterBar } from './FilterBar';
import { AppointmentTable } from './AppointmentTable';
import { AppointmentModal } from './AppointmentModal';
import { Appointment, Department, Doctor, Patient } from '@/lib/types';
import { useAppointments } from '@/hooks/appointments/useAppointments';
import { useAppointmentFilters } from '@/hooks/appointments/useAppointmentFilters';


interface Props {
  appointments: Appointment[];
  patients: Partial<Patient>[];
  doctors: Partial<Doctor>[];
  departments: Department[];
  search: string;
  status: string;
  date: string;
}

export function AppointmentsClient({
  appointments,
  patients,
  doctors,
  departments,
  search,
  status,
  date,
}: Props) {
  const {
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
  } = useAppointments(appointments);

  const {
    searchInput,
    statusFilter,
    dateFilter,
    filteredAppointments,
    setSearchInput,
    setStatusFilter,
    setDateFilter,
    clearFilters,
  } = useAppointmentFilters(appointments, search, status, date);

  return (
    <div className="p-7 page-enter">
      <PageHeader
        title="Appointments"
        subtitle={`${filteredAppointments.length} appointments`}
        action={
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={16} /> Schedule Appointment
          </button>
        }
      />

      <FilterBar
        searchInput={searchInput}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onSearchChange={setSearchInput}
        onStatusChange={setStatusFilter}
        onDateChange={setDateFilter}
        onClear={clearFilters}
      />

      <AppointmentTable
        appointments={filteredAppointments}
        onEdit={openEdit}
        onDelete={setDelId}
        onStatusChange={quickStatus}
      />

      <AppointmentModal
        isOpen={modal !== null}
        mode={modal === 'add' ? 'add' : 'edit'}
        form={form}
        patients={patients}
        doctors={doctors}
        departments={departments}
        error={error}
        loading={loading}
        onClose={closeModal}
        onChange={setForm}
        onSubmit={save}
      />

      <DeleteConfirmDialog
        open={delId !== null}
        title="Cancel Appointment?"
        description="This will permanently delete the appointment record."
        confirmLabel="Delete"
        cancelLabel="Keep It"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDelId(null)}
      />
    </div>
  );
}