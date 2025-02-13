import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../../hook/hooks";
import { createRubriqueAsync, fetchRubriquesAsync } from "../../features/RubriqueSlice";
import { getEnseignantAsync } from "../../features/EnseignantSlice";
import { Rubrique, Enseignant } from "../../types/types";

const AddRubrique = () => {
  const dispatch = useAppDispatch();

  // État pour la nouvelle rubrique et les enseignants
  const [rubrique, setRubrique] = useState<Rubrique>({
    id: 0,
    type: "",
    noEnseignant: {} as Enseignant,
    designation: "",
    ordre: 0,
  });

  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);

  useEffect(() => {
    // Récupérer les enseignants
    const fetchData = async () => {
      const enseignantsData = await dispatch(getEnseignantAsync({ page: 1, size: 10 }));
      if (Array.isArray(enseignantsData?.payload)) {
        setEnseignants(enseignantsData.payload);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRubrique((prev) => ({
      ...prev,
      [name]: name === "ordre" ? Number(value) : value, // Convertir ordre en nombre
    }));
  };

  const handleSelectEnseignant = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEnseignant = enseignants.find((ens) => ens.id === Number(e.target.value));
    setRubrique((prev) => ({
      ...prev,
      noEnseignant: selectedEnseignant || ({} as Enseignant),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rubrique.type || !rubrique.designation || !rubrique.noEnseignant.id) {
      console.error("Tous les champs obligatoires doivent être remplis.");
      return;
    }

    await dispatch(createRubriqueAsync(rubrique));
    dispatch(fetchRubriquesAsync());
  };

  const canSave = rubrique.type && rubrique.designation && rubrique.noEnseignant.id && rubrique.ordre >= 0;

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Ajouter une Rubrique</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Type</span>
              <input
                required
                type="text"
                name="type"
                value={rubrique.type}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Analyse, Synthèse..."
              />
            </label>

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

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Ordre</span>
              <input
                required
                type="number"
                name="ordre"
                value={rubrique.ordre}
                onChange={handleChange}
                className="grow"
                placeholder="Ordre d'affichage"
              />
            </label>

            <label className="flex items-center gap-2">
              <span className="font-semibold">Enseignant</span>
              <select
                required
                onChange={handleSelectEnseignant}
                className="select select-bordered w-full max-w-full"
              >
                <option value="">Sélectionnez un enseignant</option>
                {enseignants.map((ens) => (
                  <option key={ens.id} value={ens.id}>
                    {ens.nom} {ens.prenom}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="modal-action">
            <button type="button" className="btn">Annuler</button>
            <button
              type="submit"
              className="btn btn-neutral disabled:cursor-not-allowed"
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
