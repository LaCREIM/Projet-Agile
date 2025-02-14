import { useEffect, useState, useRef } from "react";
import { IoMdAdd } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import AddQualificatif from "./AddQualificatif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import UpdateQualificatif from "./UpdateQualificatif";
import { deleteQualificatifAsync, fetchQualificatifsAsync } from "../../features/QualificatifSlice";
import { Qualificatif } from "../../types/types";
import { ToastContainer, toast } from "react-toastify";
import { RootState } from "../../api/store";

const QualificatifHome = () => {
  document.title = "UBO | Qualificatifs";
  const dispatch = useAppDispatch();
  const qualificatifs = useAppSelector((state: RootState) => state.qualificatif.qualificatifs);

  const [modal, setModal] = useState<{ qualificatif: Qualificatif | null; index: number }>({
    qualificatif: null,
    index: -1,
  });

  const [modalUpdate, setModalUpdate] = useState<{ qualificatif: Qualificatif | null; index: number }>({
    qualificatif: null,
    index: -1,
  });

  const updateQualificatifModalRef = useRef<HTMLDialogElement | null>(null);
  const qualificatifDetailsModalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    dispatch(fetchQualificatifsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (modal.qualificatif && qualificatifDetailsModalRef.current) {
      qualificatifDetailsModalRef.current.showModal();
    }

    if (modalUpdate.qualificatif && updateQualificatifModalRef.current) {
      updateQualificatifModalRef.current.showModal();
    }
  }, [modal, modalUpdate]);

  const openModal = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) dialog.showModal();
  };


  const handleClickUpdate = (qualificatif: Qualificatif, index: number) => {
    setModal({
      qualificatif: null,
      index: -1,
    });
    setModalUpdate({ qualificatif, index });
  };

  const handleDelete = async (qualificatif: Qualificatif, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await dispatch(deleteQualificatifAsync(qualificatif.id));

      if (response?.payload === "not deleted") {
        toast.error("Ce qualificatif ne peut pas être supprimé.");
      } else if (response?.payload === "deleted") {
        toast.success("Qualificatif supprimé avec succès.");
  
        // Vérifiez si cette action est bien exécutée et rafraîchit la liste
        const refreshResponse = await dispatch(fetchQualificatifsAsync());
        console.log("refreshResponse", refreshResponse);
        if (refreshResponse?.payload) {
          console.log("Liste des qualificatifs rafraîchie :", refreshResponse.payload);
        } else {
          console.warn("Échec du rafraîchissement.");
        }

      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast.error("Une erreur est survenue lors de la suppression.");
    }
  };
  

  return (
    <>
      <ToastContainer theme="colored" />
      <div className="flex flex-col gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen">
        <h1>Liste des qualificatifs</h1>
        <div className="flex flex-row items-center justify-between gap-5 w-full px-14">
          <button
            className="flex flex-row items-center justify-center gap-5 px-4 py-2 w-[17%] text-center rounded-md border border-black bg-white text-neutral-700 text-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            onClick={() => openModal("addQualificatif")}
          >
            <IoMdAdd className="text-black" /> Ajouter un qualificatif
          </button>
        </div>

        <div className="overflow-y-auto w-[90%]">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>ID</th>
                <th>Maximal</th>
                <th>Minimal</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {qualificatifs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="uppercase tracking-widest text-center text-gray-500">
                    Pas de qualificatifs trouvés.
                  </td>
                </tr>
              ) : (
                qualificatifs.map((qualificatif: Qualificatif, index: number) => (
                  <tr key={qualificatif.id} className="hover:cursor-pointer hover:bg-gray-50 transition-all duration-75">
                    <td className="px-4 py-2">{qualificatif.id}</td>
                    <td className="px-4 py-2">{qualificatif.maximal}</td>
                    <td className="px-4 py-2">{qualificatif.minimal}</td>
                    <td className="flex gap-3 justify-center items-center">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="text-black text-base cursor-pointer"
                        onClick={() => {
                          handleClickUpdate(qualificatif, index);
                          openModal(`updateQualificatif-${index}`);
                        }}
                      />

                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-black text-base cursor-pointer"
                        onClick={(e) => handleDelete(qualificatif, e)}
                      />
                    </td>

                    {/* Modal de mise à jour */}
                    <dialog id={`updateQualificatif-${index}`} className="modal">
                      <UpdateQualificatif qualificatifData={qualificatif} />
                    </dialog>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <dialog id="addQualificatif" className="modal">
        <AddQualificatif />
      </dialog>
    </>
  );
};

export default QualificatifHome;
