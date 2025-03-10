import React, { useState } from "react";
import { useAppDispatch } from "../../hook/hooks";
import { editEnseignantAsync, getEnseignantAsync, getPays } from "../../features/EnseignantSlice";
import { Enseignant } from "../../types/types";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/hooks";

interface UpdateEnseignantProps {
  enseignantData: Enseignant;
}

const UpdateEnseignant = ({ enseignantData }: UpdateEnseignantProps) => {
  const dispatch = useAppDispatch();
  const [enseignant, setEnseignant] = useState<Enseignant>({ ...enseignantData });
  const pays = useAppSelector(getPays);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEnseignant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      enseignant.nom &&
      enseignant.prenom &&
      enseignant.sexe &&
      enseignant.adresse &&
      enseignant.emailPerso &&
      enseignant.codePostal &&
      enseignant.mobile &&
      enseignant.type
    ) {
      const enseignantComplet = {
        ...enseignant,
        ...(enseignant.type.toUpperCase() === "ENC"
          ? {
              encPersoEmail: enseignant.emailPerso,
              encUboEmail: enseignant.emailUbo,
              encUboTel: enseignant.telephone,
            }
          : {}),
      };

      toast.done("Tous les champs requis doivent être remplis.");
      await dispatch(editEnseignantAsync(enseignantComplet));
      dispatch(getEnseignantAsync({ page: 1, size: 10 }));

    } else {
      toast.error("Tous les champs requis doivent être remplis.");
    }
  };

  const canSave = [
    enseignant.adresse,
    enseignant.type,
    enseignant.pays,
    enseignant.nom,
    enseignant.prenom,
    enseignant.sexe,
    enseignant.codePostal,
  ].every(Boolean);

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Modifier un enseignant</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-5">
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Nom<span className="text-red-500">*</span></span>
              <input type="text" name="nom" value={enseignant.nom} onChange={handleChange} required className="grow" />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Prénom<span className="text-red-500">*</span></span>
              <input type="text" name="prenom" value={enseignant.prenom} onChange={handleChange} required className="grow" />
            </label>

            <label className="flex items-center gap-2">
              <select name="sexe" value={enseignant.sexe} onChange={handleChange} required className="select select-bordered">
                <option disabled value="">Sélectionnez un sexe<span className="text-red-500">*</span></option>
                <option value="H">Homme</option>
                <option value="F">Femme</option>
              </select>
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Mobile<span className="text-red-500">*</span></span>
              <input type="number" name="mobile" value={enseignant.mobile} onChange={handleChange} required className="grow" />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Téléphone</span>
              <input type="text" name="telephone" value={enseignant.telephone} onChange={handleChange} className="grow" placeholder="Ex: 02 98 XX XX XX" />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Adresse<span className="text-red-500">*</span></span>
              <input type="text" name="adresse" value={enseignant.adresse} onChange={handleChange} required className="grow" />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Code Postal<span className="text-red-500">*</span></span>
              <input type="number" name="codePostal" value={enseignant.codePostal} onChange={handleChange} required className="grow" />
            </label>

            <label className="flex flex-row items-center gap-2">
              <select name="pays" value={enseignant.pays} onChange={handleChange} required className="select select-bordered">
                <option value="">Sélectionnez un pays<span className="text-red-500">*</span></option>
                {pays?.length > 0 ? (
                  pays.map((p, idx) => (
                    <option key={idx} value={p.rvLowValue}>{p.rvMeaning}</option>
                  ))
                ) : (
                  <option>Chargement des pays...</option>
                )}
              </select>
            </label>

            <label className="flex items-center gap-2">
              <select name="type" value={enseignant.type} onChange={handleChange} required className="select select-bordered">
                <option value="">Type d'enseignant<span className="text-red-500">*</span></option>
                <option value="MCF">Maître de Conférences</option>
                <option value="INT">Intervenant-Exterieur</option>
                <option value="PR">Professeur des Universités</option>
                <option value="PRAST">Professionnel Associé</option>
                <option value="PRAG">Professeur Agrégé</option>
              </select>
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Email Personnel</span>
              <input type="email" name="emailPerso" value={enseignant.emailPerso} onChange={handleChange} className="grow" placeholder="Ex: john.doe@gmail.com" />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Email UBO<span className="text-red-500">*</span></span>
              <input type="email" name="emailUbo" value={enseignant.emailUbo} onChange={handleChange} required className="grow" placeholder="Ex: john.doe@ubo.fr" />
            </label>
          </div>

          <div className="modal-action">
            <form method="dialog" className="flex flex-row gap-5">
              <button className="btn">Annuler</button>
              <button className="btn btn-neutral" onClick={handleSubmit} disabled={!canSave}>Mettre à jour</button>
            </form>
          </div>
        </form>
      </div>
    </div>

  );
};

export default UpdateEnseignant;
