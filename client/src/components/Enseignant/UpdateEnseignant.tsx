import React, { useState } from "react";
import { useAppDispatch } from "../../hook/hooks";
import { editEnseignantAsync, getEnseignantAsync } from "../../features/EnseignantSlice";
import { Intervenant, Chercheur, Enseignant } from "../../types/types";
import { toast } from "react-toastify";

interface UpdateEnseignantProps {
  enseignantData: Enseignant;
  typeData: Chercheur | Intervenant;
}

const UpdateEnseignant = ({
  enseignantData,
  typeData,
}: UpdateEnseignantProps) => {
  const dispatch = useAppDispatch();

  const [enseignant, setEnseignant] = useState<Enseignant>({
    ...enseignantData,
    
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEnseignant({ ...enseignant, [name]: value });
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
          : {
              intFonction: enseignant.intFonction,
              intNoInsee: enseignant.intNoInsee,
              intSocNom: enseignant.intSocNom,
            }),
      };
  
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
        <form className="flex flex-col gap-5">
          <div className="flex flex-row justify-between">
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Nom</span>
              <input
                type="text"
                name="nom"
                value={enseignant.nom}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: John"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Prénom</span>
              <input
                type="text"
                name="prenom"
                value={enseignant.prenom}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Doe"
              />
            </label>
          </div>

          <label className="flex items-center gap-2">
            <select
              name="sexe"
              value={enseignant.sexe}
              onChange={handleChange}
              className="select select-bordered w-full max-w-full"
            >
              <option disabled value="">
                Sélectionnez un sexe
              </option>
              <option value="H">Homme</option>
              <option value="F">Femme</option>
            </select>
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <span className="font-semibold">Telephone</span>
            <input
              required
              type="number"
              name="telPort"
              value={enseignant.mobile}
              onChange={handleChange}
              className="grow"
              placeholder="Ex: 0701010101"
            />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <span className="font-semibold">Pays</span>
            <input
              type="text"
              name="pays"
              value={enseignant.pays}
              onChange={handleChange}
              className="grow"
              placeholder="Ex: Paris"
            />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <span className="font-semibold">Nationalité</span>
            <input
              type="number"
              name="codePostal"
              value={enseignant.codePostal}
              onChange={handleChange}
              className="grow"
              placeholder="Ex: 29200"
            />
          </label>
          <label className="flex items-center gap-2">
            <select
              name="type"
              value={enseignant.type}
              onChange={handleChange}
              className="select select-bordered w-full max-w-full"
            >
              <option disabled value="">
                Sélectionnez un type
              </option>
              <option value="ENC">Chercheur</option>
              <option value="INT">Intervenant</option>
            </select>
          </label>

          {/* Affichage pour un Chercheur (ENC) */}
          {enseignant.type?.toUpperCase() === "ENC" && typeData && "encPersoEmail" in typeData && (
            <div className="flex flex-col gap-5">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Email Personnel</span>
                <input
                  required
                  type="email"
                  name="encPersoEmail"
                  value={typeData.encPersoEmail || ""}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: john.doe@gmail.com"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Email UBO</span>
                <input
                  type="email"
                  name="encUboEmail"
                  value={typeData.encUboEmail || ""}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: john.doe@ubo.fr"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Téléphone UBO</span>
                <input
                  type="text"
                  name="encUboTel"
                  value={typeData.encUboTel || ""}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: 02 98 XX XX XX"
                />
              </label>
            </div>
          )}

          {/* Affichage pour un Intervenant (INT) */}
          {enseignant.type?.toUpperCase() === "INT" && typeData && "intFonction" in typeData && (
            <div className="flex flex-col gap-5">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Fonction</span>
                <input
                  required
                  type="text"
                  name="intFonction"
                  value={typeData.intFonction || ""}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: Consultant"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">No INSEE</span>
                <input
                  required
                  type="number"
                  name="intNoInsee"
                  value={typeData.intNoInsee || ""}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: 108765"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Société</span>
                <input
                  required
                  type="text"
                  name="intSocNom"
                  value={typeData.intSocNom || ""}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: Capgemini Paris"
                />
              </label>
            </div>
          )}


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

export default UpdateEnseignant;
