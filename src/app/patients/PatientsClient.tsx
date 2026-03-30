'use client';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog';
import { PatientFilters } from './PatientFilters';
import { PatientTable } from './PatientTable';
import { PatientPagination } from './PatientPagination';
import { PatientModal } from './PatientModal';
import { Patient } from '@/lib/types';
import { usePatients } from '@/hooks/patients/usePatients';
import { usePatientFilters } from '@/hooks/patients/usePatientsFilter';


interface Props {
  patients: Patient[];
  total: number;
  page: number;
  limit: number;
  search: string;
  status: string;
}

export function PatientsClient({
  patients,
  total,
  page,
  limit,
  search,
  status,
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
  } = usePatients();

  const {
    search: currentSearch,
    status: currentStatus,
    filteredPatients,
    handleSearch,
    handleStatusChange,
  } = usePatientFilters(patients, search, status);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-7 page-enter">
      <PageHeader
        title="Patients"
        subtitle={`${total} total patients`}
        action={
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add Patient
          </button>
        }
      />

      <PatientFilters
        search={currentSearch}
        status={currentStatus}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
      />

      <PatientTable
        patients={filteredPatients}
        onEdit={openEdit}
        onDelete={setDelId}
      />

      <PatientPagination
        page={page}
        totalPages={totalPages}
        total={total}
        search={currentSearch}
        status={currentStatus}
      />

      <PatientModal
        isOpen={modal !== null}
        mode={modal === 'add' ? 'add' : 'edit'}
        form={form}
        error={error}
        loading={loading}
        onClose={closeModal}
        onChange={setForm}
        onSubmit={save}
      />

      <DeleteConfirmDialog
        open={delId !== null}
        title="Delete Patient?"
        description="This action cannot be undone. All related records will be removed."
        confirmLabel="Delete"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDelId(null)}
      />
    </div>
  );
}