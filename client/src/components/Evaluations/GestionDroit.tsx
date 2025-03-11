import { useEffect, useState } from "react";
import { MdCheck } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { FaTrash } from "react-icons/fa6";
import { Enseignant, Droit } from "../../types/types"; // Importez vos types
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  fetchDroitsAsync,
  getDroits,
  createDroitAsync,
  updateDroitAsync,
  deleteDroitAsync, // Importez l'action de suppression
} from "../../features/DroitSlice"; // Importez updateDroitAsync
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AlertError from "../ui/alert-error";
import { motion } from "framer-motion";

// Définir les types
type EnseignantDisponible = {
  id: number;
  nom: string;
  prenom: string;
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
  const [droitsASupprimer, setDroitsASupprimer] = useState<Droit[]>([]); // Droits à supprimer
  const [error, setError] = useState<string | null>(null);

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

  const handleSupprimerDroit = (droit: Droit) => {
    if (droitsASupprimer.some((d) => d.idEnseignant === droit.idEnseignant)) {
      setDroitsASupprimer((prev) =>
        prev.filter((d) => d.idEnseignant !== droit.idEnseignant)
      );
    } else {
      setDroitsASupprimer((prev) => [...prev, droit]);
    }
  };

  const validerModifications = async () => {
    let resultat = false;
    try {
      for (const droit of droitsAjoutes) {
        const resAjout = await dispatch(createDroitAsync(droit));
        if (resAjout?.type === "droits/createDroitAsync/fulfilled") {
          resultat = true;
        }
      }

      for (const droit of droitsModifies) {
        const resModif = await dispatch(updateDroitAsync(droit));
        if (resModif?.type === "droits/updateDroitAsync/fulfilled") {
          resultat = true;
        }
      }

      for (const droit of droitsASupprimer) {
        const resSuppr = await dispatch(deleteDroitAsync(droit));
        if (resSuppr?.type === "droits/deleteDroitAsync/fulfilled") {
          resultat = true;
        }
      }

      if (resultat) {
        toast.success("Modifications enregistrées avec succès");
        setError(null);
        await dispatch(fetchDroitsAsync(Number(evaluationId)));
        handleClose();
      } else {
        setError("Erreur lors de la sauvegarde des droits");
      }

      setDroitsAjoutes([]);
      setDroitsModifies([]);
      setDroitsASupprimer([]);
      setEditionMode(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des droits:", error);
    }
  };

  const annulerModifications = () => {
    setEditionMode(false);
    setDroitsLocaux(droitsApi);
    setDroitsAjoutes([]);
    setDroitsModifies([]);
    setDroitsASupprimer([]);
  };

  const handleAjoutEnseignant = () => {
    if (enseignantSelectionne) {
      const nouvelDroit: Droit = {
        idEvaluation: Number(evaluationId),
        idEnseignant: enseignantSelectionne.id,
        consultation: droitsAjout.consultation ? "O" : "N",
        duplication: droitsAjout.duplication ? "O" : "N",
        nom: enseignantSelectionne.nom,
        prenom: enseignantSelectionne.prenom,
      };

      const updatedDroits = [...droitsLocaux, nouvelDroit];
      setDroitsLocaux(updatedDroits);

      setDroitsAjoutes((prev) => [...prev, nouvelDroit]);

      setEnseignantSelectionne(null);
      setDroitsAjout({ duplication: false, consultation: false });
    }
  };

  const MotionVariant = {
    initial: {
      opacity: 0,
      y: 10,
    },
    final: (d: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.15,
        delay: 0.1 * d,
      },
    }),
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Gérer les droits d'accès</h3>

        {/* Section pour ajouter un enseignant */}
        <div className="flex flex-row gap-3 w-full justify-between items-center mb-4">
          {editionMode && (
            <>
              <motion.select
                variants={MotionVariant}
                initial="initial"
                animate={MotionVariant.final(1)}
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
                      prenom: selectedEnseignant.prenom,
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
              </motion.select>

              <div className="flex flex-row gap-10 w-full">
                <motion.label
                  className="label cursor-pointer"
                  variants={MotionVariant}
                  initial="initial"
                  animate={MotionVariant.final(1.5)}
                >
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
                </motion.label>
                <motion.label
                  className="label cursor-pointer"
                  variants={MotionVariant}
                  initial="initial"
                  animate={MotionVariant.final(2)}
                >
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
                </motion.label>
              </div>

              <motion.button
                variants={MotionVariant}
                initial="initial"
                animate={MotionVariant.final(2.5)}
                className="btn btn-circle btn-sm"
                onClick={handleAjoutEnseignant}
                disabled={!enseignantSelectionne}
              >
                +
              </motion.button>
            </>
          )}
        </div>

        <table className="table w-full">
          <thead>
            <tr>
              <th>Enseignant</th>
              <th>Duplication</th>
              <th>Consultation</th>
              {editionMode && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {droitsLocaux.map((droit) => {
              const estASupprimer = droitsASupprimer.some(
                (d) => d.idEnseignant === droit.idEnseignant
              );
              return (
                <tr
                  key={droit.idEnseignant}
                  className={estASupprimer ? "bg-red-100" : ""}
                >
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
                  {editionMode && (
                    <td>
                      <button
                        className="cursor-pointer tooltip"
                        data-tip="Supprimer le droit"
                        onClick={() => handleSupprimerDroit(droit)}
                      >
                        <FaTrash
                          className={
                            estASupprimer ? "text-red-500" : "text-black"
                          }
                          size={18}
                        />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {error && <AlertError error={error} />}

        {/* Boutons de gestion */}
        <div className="modal-action flex flex-row gap-3 justify-end mt-4">
          {editionMode ? (
            <>
              <button
                className="btn btn-neutral"
                onClick={validerModifications}
              >
                Enregistrer
              </button>
              <button className="btn" onClick={annulerModifications}>
                Annuler
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-neutral" onClick={toggleEditionMode}>
                Modifier
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
