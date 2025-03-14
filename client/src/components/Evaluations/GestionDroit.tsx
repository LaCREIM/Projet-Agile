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
  const [recherche, setRecherche] = useState<string>("");
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
      !droitsLocaux.some((droit) => droit.idEnseignant === enseignant.id) &&
      enseignant.id !== Number(localStorage.getItem("id"))
  );

  const toggleEditionMode = () => {
    setEditionMode(!editionMode);
  };

  const handleClose = () => {
    setEditionMode(false);
    onClose();
  };

  const handleDuplicationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setDroitsAjout({
      duplication: isChecked,
      consultation: isChecked ? true : droitsAjout.consultation, // Cocher automatiquement "Consultation" si "Duplication" est coché
    });
  };

  const handleConsultationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!droitsAjout.duplication) {
      setDroitsAjout({
        ...droitsAjout,
        consultation: e.target.checked,
      });
    }
  };

  const handleDroitChange = (idEnseignant: number, droit: keyof Droit) => {
    const updatedDroits = droitsLocaux.map((d) => {
      if (d.idEnseignant === idEnseignant) {
        const newDroit = { ...d, [droit]: d[droit] === "O" ? "N" : "O" };

        // Si les deux droits sont désactivés, ajouter à la liste des droits à supprimer
        if (newDroit.duplication === "N" && newDroit.consultation === "N") {
          setDroitsASupprimer((prev) => [...prev, newDroit]);
        } else {
          // Si un droit est réactivé, retirer de la liste des droits à supprimer
          setDroitsASupprimer((prev) =>
            prev.filter((d) => d.idEnseignant !== idEnseignant)
          );
        }

        return newDroit;
      }
      return d;
    });

    setDroitsLocaux(updatedDroits);

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

  const enseignantsFiltres = enseignantsDisponibles.filter((enseignant) =>
    `${enseignant.nom} ${enseignant.prenom}`
      .toLowerCase()
      .includes(recherche.toLowerCase())
  );

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
    setRecherche("");
  };

  const handleAjoutEnseignant = () => {
    if (enseignantSelectionne) {
      const nouvelDroit: Droit = {
        idEvaluation: Number(evaluationId),
        idEnseignant: enseignantSelectionne.id,
        consultation: droitsAjout.duplication
          ? "O"
          : droitsAjout.consultation
          ? "O"
          : "N",
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
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Rechercher un enseignant..."
                    className="input input-bordered w-[55%]"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                  />
                  <div className="flex flex-row gap-10 w-[40%]">
                    {/* Cases à cocher pour les droits */}
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
                        onChange={handleDuplicationChange}
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
                        disabled={
                          !enseignantSelectionne || droitsAjout.duplication
                        }
                        checked={droitsAjout.consultation}
                        onChange={handleConsultationChange}
                        className="checkbox checkbox-sm"
                      />
                    </motion.label>
                  </div>
                </div>
                {/* Barre de recherche */}

                {/* Liste des enseignants filtrés (affichée uniquement lors de la recherche) */}
                {recherche && (
                  <div className="dropdown menu w-[55%] rounded-box bg-base-100 shadow-sm relative z-50">
                    {enseignantsFiltres.length > 0 ? (
                      <>
                        {enseignantsFiltres.slice(0, 5).map((ens) => (
                          <div
                            key={ens.id}
                            className={`p-2 hover:bg-gray-100 cursor-pointer rounded-lg ${
                              enseignantSelectionne?.id === ens.id
                                ? "bg-blue-100"
                                : ""
                            }`}
                            onClick={() =>
                              setEnseignantSelectionne({
                                id: ens.id,
                                nom: ens.nom,
                                prenom: ens.prenom,
                              })
                            }
                          >
                            {ens.nom} {ens.prenom}
                          </div>
                        ))}
                        {enseignantsFiltres.length > 5 && (
                          <div className="p-2 text-gray-500">
                            {enseignantsFiltres.length - 5} autres résultats...
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-2 text-gray-500">
                        Aucun enseignant trouvé
                      </div>
                    )}
                  </div>
                )}
              </div>

              <motion.button
                variants={MotionVariant}
                initial="initial"
                animate={MotionVariant.final(2.5)}
                className="btn btn-circle btn-sm"
                onClick={handleAjoutEnseignant}
                disabled={!droitsAjout.duplication && !droitsAjout.consultation}
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
            {droitsLocaux.length === 0 ? (
              <tr>
                <td
                  colSpan={editionMode ? 4 : 3}
                  className="text-center py-4 text-base text-gray-600"
                >
                  Pas de droit affecté à cette évaluation pour le moment
                </td>
              </tr>
            ) : (
              droitsLocaux.map((droit) => {
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
                            handleDroitChange(
                              droit.idEnseignant,
                              "consultation"
                            )
                          }
                          disabled={droit.duplication === "O"} // Désactiver si duplication est activé
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
              })
            )}
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
