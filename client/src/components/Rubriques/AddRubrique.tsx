import React, { useState } from "react";
import { useAppDispatch } from "../../hook/hooks";
import {
  createRubriqueAsync,
  searchRubriquesAsync,
} from "../../features/RubriqueSlice";
import { Rubrique } from "../../types/types";
import { toast } from "react-toastify";
import AlertError from "../ui/alert-error";

interface AddRubriqueProps {
  onClose: () => void;
}

const AddRubrique = ({ onClose }: AddRubriqueProps) => {
  const dispatch = useAppDispatch();

  const role = localStorage.getItem("role");
  const [rubrique, setRubrique] = useState<Rubrique>({
    id: 0,
    type: role === "ENS" ? "RBP" : "RBS",
    noEnseignant: Number(localStorage.getItem("id")),
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
    console.log("hhh");
    const idEns = localStorage.getItem("id");
    const res = await dispatch(createRubriqueAsync(rubrique));
    console.log(res);

    if (res?.type === "rubriques/create/rejected") {
      setError(res.payload as string);
    } else if (res?.type === "rubriques/create/fulfilled") {
      toast.success("La rubrique a été crée avec succès!");
      handleClose();
      if (idEns) {
        await dispatch(
          searchRubriquesAsync({ enseignantId: idEns, page: 0, size: 10 })
        );
      } else {
        toast.error("ID de l'enseignant non trouvé.");
      }
    }
  };

  const handleClose = () => {
    setRubrique({
      id: 0,
      type: "",
      noEnseignant: 0,
      designation: "",
      ordre: 0,
      questions: [],
    });
    setError(null);
    onClose();
  };

  const canSave = rubrique.designation;

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[40%] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Ajouter une Rubrique</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <label className="input input-bordered flex items-center w-full gap-2">
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
            {error && <AlertError error={error} />}
          </div>

          <div className="modal-action">
            <button className="btn" type="button" onClick={() => handleClose()}>
              Annuler
            </button>
            <button
              className="btn btn-neutral"
              type="submit"
              disabled={!canSave}
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRubrique;
