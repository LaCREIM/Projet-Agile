import React, { useState } from "react";
import { useAppDispatch } from "../../hook/hooks";
import {
  createRubriqueAsync,
  getRubriquesAsync,
} from "../../features/RubriqueSlice";
import { Rubrique, Enseignant } from "../../types/types";
import { toast } from "react-toastify";
import AlertError from "../ui/alert-error";

interface AddRubriqueProps {
  onClose: () => void;
}

const AddRubrique = ({ onClose }: AddRubriqueProps) => {
  const dispatch = useAppDispatch();

  const [rubrique, setRubrique] = useState<Rubrique>({
    id: 0,
    type: "",
    noEnseignant: {} as Enseignant,
    designation: "",
    ordre: 0,
    questions: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRubrique((prev) => ({
      ...prev,
      [name]: name === "ordre" ? Number(value) : value,
    }));
  };
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(createRubriqueAsync(rubrique));

    if (res?.type === "rubriques/create/rejected") {
      setError(res.payload as string);
    } else if (res?.type === "rubriques/create/fulfilled") {
      toast.success(res?.payload as string);
      handleClose();
      dispatch(getRubriquesAsync());
    }
  };
  
  const handleClose = () => {
    setRubrique({
      id: 0,
      type: "",
      noEnseignant: {} as Enseignant,
      designation: "",
      ordre: 0,
      questions: [],
    });
    setError(null);
    onClose();
  };

  const canSave = rubrique.designation;

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Ajouter une Rubrique</h3>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Désignation</span>
              <input
                required
                type="text"
                name="designation"
                value={rubrique.designation}
                onChange={handleChange}
                className="grow"
                placeholder="Nom de la rubrique"
              />
            </label>
          </div>
        </form>
        {error && <AlertError error={error} />}

        <div className="modal-action">
          <button className="btn" type="button" onClick={() => handleClose()}>
            Annuler
          </button>
          <button className="btn btn-neutral" type="submit" disabled={!canSave}>
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRubrique;
