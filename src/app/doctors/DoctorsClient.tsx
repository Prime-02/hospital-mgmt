'use client';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog';
import { DoctorFilters } from './DoctorFilters';
import { DoctorGrid } from './DoctorGrid';
import { DoctorModal } from './DoctorModal';
import { Department, Doctor } from '@/lib/types';
import { useDoctors } from '@/hooks/doctors/useDoctors';
import { useDoctorFilters } from '@/hooks/doctors/useDoctorFilters';


interface Props {
  doctors: Doctor[];
  departments: Department[];
  search: string;
  status: string;
}

export function DoctorsClient({ doctors, departments, search, status }: Props) {
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
  } = useDoctors(doctors);

  const {
    search: currentSearch,
    status: currentStatus,
    filteredDoctors,
    handleSearch,
    handleStatusChange,
  } = useDoctorFilters(doctors, search, status);

  return (
    <div className="p-7 page-enter">
      <PageHeader
        title="Doctors"
        subtitle={`${filteredDoctors.length} physicians registered`}
        action={
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add Doctor
          </button>
        }
      />

      <DoctorFilters
        search={currentSearch}
        status={currentStatus}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
      />

      <DoctorGrid
        doctors={filteredDoctors}
        onEdit={openEdit}
        onDelete={setDelId}
      />

      <DoctorModal
        isOpen={modal !== null}
        mode={modal === 'add' ? 'add' : 'edit'}
        form={form}
        departments={departments}
        error={error}
        loading={loading}
        onClose={closeModal}
        onChange={setForm}
        onSubmit={save}
      />

      <DeleteConfirmDialog
        open={delId !== null}
        title="Remove Doctor?"
        description="This action cannot be undone."
        confirmLabel="Remove"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDelId(null)}
      />
    </div>
  );
}