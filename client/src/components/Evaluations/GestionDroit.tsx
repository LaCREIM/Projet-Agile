import { useEffect, useState } from "react";
import { MdCheck } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { Enseignant, Droit } from "../../types/types"; // Importez vos types
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  fetchDroitsAsync,
  getDroits,
  createDroitAsync,
  updateDroitAsync,
} from "../../features/DroitSlice"; // Importez updateDroitAsync
import { useParams } from "react-router-dom";

// Définir les types
type EnseignantDisponible = {
  id: number;
  nom: string;
};

interface GestionDroitProps {
  enseignants: Enseignant[];
  onClose: () => void;
}

const GestionDroit = ({ enseignants, onClose }: GestionDroitProps) => {
  const [editionMode, setEditionMode] = useState<boolean>(false);
  const evaluationId = useParams().evaluationId;

  const dispatch = useAppDispatch();
  const droitsApi = useAppSelector<Droit[]>(getDroits); // Droits provenant de l'API
  const [droitsLocaux, setDroitsLocaux] = useState<Droit[]>([]); // Droits locaux pour les modifications

  const [enseignantSelectionne, setEnseignantSelectionne] =
    useState<EnseignantDisponible | null>(null);
  const [droitsAjout, setDroitsAjout] = useState<{
    duplication: boolean;
    consultation: boolean;
  }>({
    duplication: false,
    consultation: false,
  });

  const [droitsAjoutes, setDroitsAjoutes] = useState<Droit[]>([]); // Droits ajoutés
  const [droitsModifies, setDroitsModifies] = useState<Droit[]>([]); // Droits modifiés

  // Charger les droits depuis l'API au montage du composant
  useEffect(() => {
    dispatch(fetchDroitsAsync(Number(evaluationId)));
  }, [dispatch, evaluationId]);

  // Synchroniser les droits locaux avec les droits de l'API
  useEffect(() => {
    setDroitsLocaux(droitsApi);
  }, [droitsApi]);

  // Fonction pour filtrer les enseignants disponibles
  const enseignantsDisponibles = enseignants.filter(
    (enseignant) =>
      !droitsLocaux.some((droit) => droit.idEnseignant === enseignant.id)
  );

  // Fonction pour basculer le mode édition
  const toggleEditionMode = () => {
    setEditionMode(!editionMode);
  };

  // Fonction pour fermer la modal
  const handleClose = () => {
    setEditionMode(false);
    onClose();
  };

  // Fonction pour modifier les droits d'un enseignant
  const handleDroitChange = (idEnseignant: number, droit: keyof Droit) => {
    const updatedDroits = droitsLocaux.map((d) =>
      d.idEnseignant === idEnseignant
        ? { ...d, [droit]: d[droit] === "O" ? "N" : "O" }
        : d
    );
    setDroitsLocaux(updatedDroits);

    // Ajouter le droit modifié à la liste des droits modifiés
    const droitModifie = updatedDroits.find(
      (d) => d.idEnseignant === idEnseignant
    );
    if (droitModifie) {
      setDroitsModifies((prev) => {
        const existing = prev.find((d) => d.idEnseignant === idEnseignant);
        if (existing) {
          return prev.map((d) =>
            d.idEnseignant === idEnseignant ? droitModifie : d
          );
        } else {
          return [...prev, droitModifie];
        }
      });
    }
  };

  // Fonction pour valider les modifications
  const validerModifications = async () => {
    try {
      // Envoyer les droits ajoutés
      for (const droit of droitsAjoutes) {
        await dispatch(createDroitAsync(droit)).unwrap();
      }

      // Envoyer les droits modifiés
      for (const droit of droitsModifies) {
        await dispatch(updateDroitAsync(droit)).unwrap();
      }

      // Réinitialiser les états
      setDroitsAjoutes([]);
      setDroitsModifies([]);
      setEditionMode(false);
      console.log("Modifications validées et sauvegardées");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des droits:", error);
    }
  };

  // Fonction pour annuler les modifications
  const annulerModifications = () => {
    setEditionMode(false);
    setDroitsLocaux(droitsApi); // Revenir aux droits d'origine
    setDroitsAjoutes([]); // Réinitialiser les droits ajoutés
    setDroitsModifies([]); // Réinitialiser les droits modifiés
    console.log("Modifications annulées");
  };

  // Fonction pour ajouter un enseignant
  const handleAjoutEnseignant = () => {
    if (enseignantSelectionne) {
      const nouvelDroit: Droit = {
        idEvaluation: Number(evaluationId),
        idEnseignant: enseignantSelectionne.id,
        consultation: droitsAjout.consultation ? "O" : "N",
        duplication: droitsAjout.duplication ? "O" : "N",
        nom: enseignantSelectionne.nom,
        prenom: "", // Ajoutez le prénom si disponible
      };

      // Ajouter le nouveau droit à la liste des droits locaux
      const updatedDroits = [...droitsLocaux, nouvelDroit];
      setDroitsLocaux(updatedDroits);

      // Ajouter le nouveau droit à la liste des droits ajoutés
      setDroitsAjoutes((prev) => [...prev, nouvelDroit]);

      // Réinitialiser les états
      setEnseignantSelectionne(null);
      setDroitsAjout({ duplication: false, consultation: false });
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Gérer les droits d'accès</h3>

        {/* Section pour ajouter un enseignant */}
        <div className="flex flex-row gap-3 w-full justify-between items-center mb-4">
          {editionMode && (
            <>
              <select
                className="select select-bordered w-full max-w-xs"
                value={enseignantSelectionne ? enseignantSelectionne.id : ""}
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value);
                  const selectedEnseignant = enseignantsDisponibles.find(
                    (ens) => ens.id === selectedId
                  );
                  if (selectedEnseignant) {
                    setEnseignantSelectionne({
                      id: selectedEnseignant.id,
                      nom: selectedEnseignant.nom,
                    });
                  }
                }}
              >
                <option value="" disabled>
                  Sélectionnez un enseignant
                </option>
                {enseignantsDisponibles.map((ens) => (
                  <option key={ens.id} value={ens.id}>
                    {ens.nom} {ens.prenom}
                  </option>
                ))}
              </select>

              <div className="flex flex-row gap-10 w-full">
                <label className="label cursor-pointer">
                  <span className="label-text mr-2">Duplication</span>
                  <input
                    type="checkbox"
                    disabled={!enseignantSelectionne}
                    checked={droitsAjout.duplication}
                    onChange={(e) =>
                      setDroitsAjout({
                        ...droitsAjout,
                        duplication: e.target.checked,
                      })
                    }
                    className="checkbox checkbox-sm"
                  />
                </label>
                <label className="label cursor-pointer">
                  <span className="label-text mr-2">Consultation</span>
                  <input
                    type="checkbox"
                    disabled={!enseignantSelectionne}
                    checked={droitsAjout.consultation}
                    onChange={(e) =>
                      setDroitsAjout({
                        ...droitsAjout,
                        consultation: e.target.checked,
                      })
                    }
                    className="checkbox checkbox-sm"
                  />
                </label>
              </div>

              <button
                className="btn btn-circle btn-sm"
                onClick={handleAjoutEnseignant}
                disabled={!enseignantSelectionne}
              >
                +
              </button>
            </>
          )}
        </div>

        {/* Tableau des enseignants */}
        <table className="table w-full">
          <thead>
            <tr>
              <th>Enseignant</th>
              <th>Duplication</th>
              <th>Consultation</th>
            </tr>
          </thead>
          <tbody>
            {droitsLocaux.map((droit) => (
              <tr key={droit.idEnseignant}>
                <td>
                  {droit.nom} {droit.prenom}
                </td>
                <td>
                  {editionMode ? (
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={droit.duplication === "O"}
                      onChange={() =>
                        handleDroitChange(droit.idEnseignant, "duplication")
                      }
                    />
                  ) : droit.duplication === "O" ? (
                    <MdCheck size={20} className="font-bold" />
                  ) : (
                    <RxCross2 size={20} className="font-bold" />
                  )}
                </td>
                <td>
                  {editionMode ? (
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={droit.consultation === "O"}
                      onChange={() =>
                        handleDroitChange(droit.idEnseignant, "consultation")
                      }
                    />
                  ) : droit.consultation === "O" ? (
                    <MdCheck size={20} className="font-bold" />
                  ) : (
                    <RxCross2 size={20} className="font-bold" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Boutons de gestion */}
        <div className="modal-action flex flex-row gap-3 justify-end mt-4">
          {editionMode ? (
            <>
              <button
                className="btn btn-neutral"
                onClick={validerModifications}
              >
                Valider
              </button>
              <button className="btn" onClick={annulerModifications}>
                Annuler
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-neutral" onClick={toggleEditionMode}>
                Modifier les droits
              </button>
              <button className="btn" onClick={handleClose}>
                Fermer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionDroit;
