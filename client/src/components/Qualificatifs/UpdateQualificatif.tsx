import React, { useState } from "react";
import { useAppDispatch } from "../../hook/hooks";
import { fetchQualificatifsAsync, updateQualificatifAsync } from "../../features/QualificatifSlice";
import { Qualificatif } from "../../types/types";
import { toast } from "react-toastify";

interface UpdateQualificatifProps {
  qualificatifData: Qualificatif;
}

const UpdateQualificatif = ({ qualificatifData }: UpdateQualificatifProps) => {
  const dispatch = useAppDispatch();

  const [qualificatif, setQualificatif] = useState<Qualificatif>({
    ...qualificatifData,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setQualificatif({ ...qualificatif, [name]: value });
  };

  const handleSubmit = async () => {
    if (qualificatif.maximal && qualificatif.minimal) {
      await dispatch(updateQualificatifAsync({id:qualificatif.id, data:qualificatif}));
      dispatch(fetchQualificatifsAsync());
      toast.success("Qualificatif mis à jour avec succès !");
    } else {
      toast.error("Tous les champs doivent être remplis.");
    }
  };

  const canSave = [qualificatif.maximal, qualificatif.minimal].every(Boolean);

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[30em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Modifier un qualificatif</h3>
        <form className="flex flex-col gap-5">
          <label className="input input-bordered flex items-center gap-2">
            <span className="font-semibold">Maximal</span>
            <input
              type="text"
              name="maximal"
              value={qualificatif.maximal}
              onChange={handleChange}
              className="grow"
              placeholder="Valeur maximale"
            />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <span className="font-semibold">Minimal</span>
            <input
              type="text"
              name="minimal"
              value={qualificatif.minimal}
              onChange={handleChange}
              className="grow"
              placeholder="Valeur minimale"
            />
          </label>

          <div className="modal-action">
            <form method="dialog" className="flex flex-row gap-5">
              <button type="button" className="btn">
                Annuler
              </button>
              <button onClick={handleSubmit} className="btn btn-neutral" disabled={!canSave}>
                Mettre à jour
              </button>
            </form>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQualificatif;
