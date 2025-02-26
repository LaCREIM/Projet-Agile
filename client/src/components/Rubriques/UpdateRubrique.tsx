/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useAppDispatch } from "../../hook/hooks";
import { updateRubriqueAsync, getRubriquesAsync } from "../../features/RubriqueSlice";
import { Rubrique } from "../../types/types";
import { toast } from "react-toastify";

interface UpdateRubriqueProps {
  rubriqueData: Rubrique;
}

const UpdateRubrique = ({ rubriqueData }: UpdateRubriqueProps) => {
  const dispatch = useAppDispatch();

  const [rubrique, setRubrique] = useState<Rubrique>({
    ...rubriqueData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRubrique({ ...rubrique, [name]: value });
  };

  const handleSubmit = async () => {
    if (rubrique.type && rubrique.designation) {
      try {
        await dispatch(updateRubriqueAsync({ id: rubrique.id, designation: rubrique.designation }));
        dispatch(getRubriquesAsync());
        toast.success("Rubrique mise à jour avec succès !");
      } catch (error) {
        toast.error("Erreur lors de la mise à jour.");
      }
    } else {
      toast.error("Tous les champs doivent être remplis.");
    }
  };

  const canSave = rubrique.type && rubrique.designation;

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[30em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Modifier une rubrique</h3>
        <form className="flex flex-col gap-5">
          <label className="input input-bordered flex items-center gap-2">
            <span className="font-semibold">Type</span>
            <input
              type="text"
              name="type"
              value={rubrique.type}
              onChange={handleChange}
              className="grow"
              placeholder="Type de la rubrique"
            />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <span className="font-semibold">Désignation</span>
            <input
              type="text"
              name="designation"
              value={rubrique.designation}
              onChange={handleChange}
              className="grow"
              placeholder="Désignation de la rubrique"
            />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <span className="font-semibold">Ordre</span>
            <input
              type="number"
              name="ordre"
              value={rubrique.ordre}
              onChange={handleChange}
              className="grow"
              placeholder="Ordre de la rubrique"
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

export default UpdateRubrique;
