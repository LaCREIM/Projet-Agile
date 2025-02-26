import React, { useState } from "react";
import { useAppDispatch } from "../../hook/hooks";
import {
  createRubriqueAsync,
  getRubriquesAsync,
} from "../../features/RubriqueSlice";
import { Rubrique, Enseignant } from "../../types/types";
import { ToastContainer, toast } from "react-toastify";

const AddRubrique = () => {
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

  const handleSubmit = async () => {
    await dispatch(createRubriqueAsync(rubrique));
    setRubrique({
      id: 0,
      type: "",
      noEnseignant: {} as Enseignant,
      designation: "",
      ordre: 0,
      questions: [],
    });
    toast.success("Rubrique ajoutée avec succès.");
    dispatch(getRubriquesAsync());
  };

  const canSave = rubrique.designation;

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <ToastContainer theme="colored" />
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

        <div className="modal-action">
          <form method="dialog" className="flex flex-row gap-5">
            <button  className="btn">
              Annuler
            </button>
            <button
              className="btn btn-neutral"
              onClick={handleSubmit}
              disabled={!canSave}
            >
              Ajouter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRubrique;
