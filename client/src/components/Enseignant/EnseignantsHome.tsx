import { useEffect, useState, useRef } from "react";
import { IoMdAdd } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import AddEnseignant from "./AddEnseignant";
import DetailsEnseignant from "./EnseignantDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import UpdateEnseignant from "./UpdateEnseignant";
import {
  deleteEnseignantAsync,
  Enseignant,
  getEnseignantAsync,
} from "../../features/EnseignantSlice";
import { Chercheur, Intervenant } from "../../types/types";
import { ToastContainer, toast } from "react-toastify";
import { RootState } from "../../api/store";

const EnseignantsHome = () => {
  document.title = "UBO | Enseignants";
  const dispatch = useAppDispatch();
  const enseignants = useAppSelector((state: RootState) => state.enseignants.enseignants);
  const [modal, setModal] = useState<{
    enseignant: Enseignant | null;
    index: number;
  }>({ enseignant: null, index: -1 });

  const [modalUpdate, setModalUpdate] = useState<{
    enseignant: Enseignant | null;
    index: number;
  }>({ enseignant: null, index: -1 });

  const updateEnseignantModalRef = useRef<HTMLDialogElement | null>(null);
  const enseignantDetailsModalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    dispatch(getEnseignantAsync());
  }, [dispatch]);

  useEffect(() => {
    if (
      modal.enseignant &&
      modal.index !== -1 &&
      enseignantDetailsModalRef.current
    ) {
      enseignantDetailsModalRef.current.showModal();
    }

    if (
      modalUpdate.enseignant &&
      modalUpdate.index !== -1 &&
      updateEnseignantModalRef.current
    ) {
      updateEnseignantModalRef.current.showModal();
    }
  }, [modal, modalUpdate]);

  const openModal = (name: string) => {
    const dialog = document.getElementById(name) as HTMLDialogElement;
    if (dialog) dialog.showModal();
  };

  const handleClick = (enseignant: Enseignant, index: number) => {
    setModal({ enseignant, index });
  };

  const handleClickUpdate = (enseignant: Enseignant, index: number) => {
    setModalUpdate({ enseignant, index });
  };

  const handleDelete = async (enseignant: Enseignant, e: React.MouseEvent) => {
    e.stopPropagation();
    const response = await dispatch(deleteEnseignantAsync(enseignant));
    if (
              response?.payload ===
              "not deleted"
            ) {
              toast.error(
                "Cet enseignant ne peut pas être supprimé"
              );
            }
            if (response?.payload === "deleted") {
              toast.success("Enseignant supprimé avec succès");
                dispatch(getEnseignantAsync());
            }
  
  };

  return (
    <>
      <ToastContainer theme="colored" />
      <div className="flex flex-col gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen">
        <h1>Liste des enseignants</h1>
        <div className="flex flex-row items-center justify-between gap-5 w-full px-14">
          <button
            className="flex flex-row items-center justify-center gap-5 px-4 py-2 disabled:cursor-not-allowed w-[17%] text-center rounded-md border border-black bg-white text-neutral-700 text-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            onClick={() => openModal("addEnseignant")}
          >
            <IoMdAdd className="text-black" /> Ajouter un enseignant
          </button>
        </div>
        <div className="overflow-y-auto w-[90%]">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Telephone</th>
                <th>Type</th>
                <th>Code Postale</th>
                <th>Pays</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enseignants.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="uppercase tracking-widest text-center text-gray-500"
                  >
                    Pas d'enseignants trouvés.
                  </td>
                </tr>
              ) : (
                enseignants.map((enseignant: Enseignant, index: number) => (
                  <tr
                    key={enseignant.noEnseignant}
                    className="hover:cursor-pointer hover:bg-gray-50 transition-all duration-75"
                  >
                    <td className="px-4 py-2">{enseignant.noEnseignant}</td>
                    <td className="px-4 py-2">{enseignant.nom}</td>
                    <td className="px-4 py-2">{enseignant.prenom}</td>
                    <td className="px-4 py-2">{enseignant.telPort}</td>
                    <td className="px-4 py-2">{enseignant.type}</td>
                    <td className="px-4 py-2">{enseignant.cp}</td>
                    <td className="px-4 py-2">{enseignant.pays || "France"}</td>

                    <td
                      className="flex gap-3 justify-center items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="text-black text-base cursor-pointer"
                        onClick={() => {
                          handleClick({} as Enseignant, index);
                          handleClickUpdate({} as Enseignant, index);
                          handleClickUpdate(enseignant, index);
                          openModal(
                            `updateEnseignant-${enseignant.noEnseignant}`
                          );
                        }}
                      />

                      <FontAwesomeIcon
                        icon={faEye}
                        className="text-black text-base cursor-pointer"
                        onClick={() => {
                          handleClick({} as Enseignant, index);
                          handleClickUpdate({} as Enseignant, index);
                          handleClick(enseignant, index);
                          openModal(`inspect-${enseignant.noEnseignant}`);
                        }}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-black text-base cursor-pointer"
                        onClick={(e) => handleDelete(enseignant, e)}
                      />
                    </td>
                    <dialog
                      id={`updateEnseignant-${enseignant.noEnseignant}`}
                      className="modal"
                    >
                      <UpdateEnseignant
                        typeData={
                          enseignant.type.toUpperCase() == "INT"
                            ? ({
                                intFonction: enseignant.intFonction,
                                intNoInsee: enseignant.intNoInsee,
                                intSocNom: enseignant.intSocNom,
                              } as Intervenant)
                            : ({
                                encPersoEmail: enseignant.encPersoEmail,
                                encUboEmail: enseignant.encUboEmail,
                                encUboTel: enseignant.encUboTel,
                              } as Chercheur)
                        }
                        enseignantData={enseignant}
                      />
                    </dialog>
                    <dialog
                      id={`inspect-${enseignant.noEnseignant}`}
                      className="modal"
                    >
                      <DetailsEnseignant enseignant={enseignant} />
                    </dialog>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <dialog id="addEnseignant" className="modal">
        <AddEnseignant />
      </dialog>
    </>
  );
};

export default EnseignantsHome;
