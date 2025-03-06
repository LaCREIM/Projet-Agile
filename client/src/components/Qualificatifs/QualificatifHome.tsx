import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import AddQualificatif from "./AddQualificatif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faPenToSquare,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import {
  fetchQualificatifsPagedAsync,
  updateQualificatifAsync,
} from "../../features/QualificatifSlice";
import { Qualificatif } from "../../types/types";
import { toast } from "react-toastify";
import { RootState } from "../../api/store";
import DeleteQualificatifConfirmation from "./DeleteQualificatifConfirmation";

const QualificatifHome = () => {
  document.title = "UBO | Qualificatifs";
  const dispatch = useAppDispatch();
  const qualificatifs = useAppSelector(
    (state: RootState) => state.qualificatif.qualificatifs
  );
  const totalPages = useAppSelector((state) => state.qualificatif.totalPages);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [updatingIndex, setUpdatingIndex] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchQualificatifsPagedAsync({ page: currentPage, size: 10 }));
  }, [dispatch, currentPage]);

  const [editingValues, setEditingValues] = useState<{
    [key: number]: Qualificatif;
  }>({});

  const openModal = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) dialog.showModal();
  };

  const closeModal = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) dialog.close();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setEditingValues((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [name]: value, 
      },
    }));
  };

  const handleClickUpdate = (index: number) => {
    setUpdatingIndex(index);
    setEditingValues((prev) => ({
      ...prev,
      [index]: { ...qualificatifs[index] }, 
    }));
  };

  const handleUpdate = async (index: number) => {
    if (editingValues[index]) {
      const res = await dispatch(updateQualificatifAsync(editingValues[index]));
      setUpdatingIndex(null);
      if(res?.type === "qualificatifs/update/rejected") {
        toast.error(res.payload as string);
      } else if (res?.type === "qualificatifs/update/fulfilled") {
      toast.success(res.payload as string);
      dispatch(fetchQualificatifsPagedAsync({ page: currentPage, size: 10 }));
      }
    } else {
      toast.error("Veuillez remplir tous les champs avant de sauvegarder.");
    }
  };

  const handleCancelEdit = (index: number) => {
    setEditingValues((prev) => {
      const updatedValues = { ...prev };
      delete updatedValues[index]; 
      return updatedValues;
    });
    setUpdatingIndex(null); 
  };

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    const res = await dispatch(fetchQualificatifsPagedAsync({ page: currentPage, size: 10 }));
    console.log(res);
  };

  const MotionVariant = {
    initial: {
      opacity: 0,
      y: 10,
    },
    final: () => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    }),
  };

  return (
    <>
      <div className="flex flex-col gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen">
        <h1 className="text-xl">Liste des couples qualificatifs</h1>
        <div className="flex flex-row items-center justify-end gap-5 w-[60%] px-14">
          <div className="tooltip" data-tip="Ajouter un couple qualifactif">
            <button
              className="disabled:cursor-not-allowed flex flex-row hover:cursor-pointer items-center justify-center gap-5 px-4 py-2 text-center rounded-full border border-black bg-white text-neutral-700 text-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              onClick={() => openModal("addQualificatif")}
            >
              +
            </button>
          </div>
        </div>

        <div className="overflow-y-auto w-[60%]">
          <motion.table
            className="table table-zebra"
            variants={MotionVariant}
            initial="initial"
            animate={MotionVariant.final()}
          >
            <thead>
              <tr>
                <th>Minimal</th>
                <th>Maximal</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {qualificatifs.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="uppercase tracking-widest text-center text-gray-500"
                  >
                    Pas de qualificatifs trouvés.
                  </td>
                </tr>
              ) : (
                qualificatifs.map(
                  (qualificatif: Qualificatif, index: number) => (
                    <tr
                      key={qualificatif.id}
                      className="hover:cursor-pointer hover:bg-gray-50 transition-all duration-75"
                    >
                      <td className="px-4 py-2">
                        {updatingIndex !== index ? (
                          <span>{qualificatif?.minimal}</span>
                        ) : (
                          <motion.input
                            variants={MotionVariant}
                            initial="initial"
                            animate={MotionVariant.final()}
                            required
                            type="text"
                            name="minimal"
                            value={editingValues[index]?.minimal || ""}
                            onChange={(e) => handleChange(e, index)}
                            className="input input-bordered"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {updatingIndex !== index ? (
                          <span>{qualificatif?.maximal}</span>
                        ) : (
                          <motion.input
                            variants={MotionVariant}
                            initial="initial"
                            animate={MotionVariant.final()}
                            required
                            type="text"
                            name="maximal"
                            value={editingValues[index]?.maximal || ""}
                            onChange={(e) => handleChange(e, index)}
                            className="input input-bordered"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2 flex gap-3 justify-center items-center">
                        {updatingIndex === index ? (
                          <>
                            <FontAwesomeIcon
                              icon={faFloppyDisk}
                              className="text-black text-base cursor-pointer"
                              onClick={() => handleUpdate(index)}
                            />
                            <FontAwesomeIcon
                              icon={faTimes}
                              className="text-black text-base cursor-pointer"
                              onClick={() => handleCancelEdit(index)}
                            />
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              className="text-black text-base cursor-pointer"
                              onClick={() => handleClickUpdate(index)}
                            />
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-black text-base cursor-pointer"
                              onClick={() =>
                                openModal(`delete-${qualificatif.id}`)
                              }
                            />
                          </>
                        )}
                      </td>
                      <dialog
                        id={`delete-${qualificatif.id}`}
                        className="modal"
                      >
                        <DeleteQualificatifConfirmation
                          qualificatif={qualificatif}
                          currentPage={currentPage}
                        />
                      </dialog>
                    </tr>
                  )
                )
              )}
            </tbody>
          </motion.table>
        </div>
        <div className="flex justify-center items-center mt-2">
          <button
            className="btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Précédent
          </button>
          <span className="mx-2">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            className="btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Suivant
          </button>
        </div>
      </div>

      <dialog id="addQualificatif" className="modal">
        <AddQualificatif
          currentPage={currentPage}
          onClose={() => closeModal("addQualificatif")}
        />
      </dialog>
    </>
  );
};

export default QualificatifHome;
