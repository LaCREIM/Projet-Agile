import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoMdAdd } from "react-icons/io";
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
  deleteQualificatifAsync,
  fetchQualificatifsAsync,
  updateQualificatifAsync,
} from "../../features/QualificatifSlice";
import { Qualificatif } from "../../types/types";
import { ToastContainer, toast } from "react-toastify";
import { RootState } from "../../api/store";

const QualificatifHome = () => {
  document.title = "UBO | Qualificatifs";
  const dispatch = useAppDispatch();
  const qualificatifs = useAppSelector(
    (state: RootState) => state.qualificatif.qualificatifs
  );
  const [updatingIndex, setUpdatingIndex] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchQualificatifsAsync());
  }, [dispatch]);

  const [editingValues, setEditingValues] = useState<{
    [key: number]: Qualificatif;
  }>({});

  const openModal = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) dialog.showModal();
  };

  const handleDelete = async (
    qualificatif: Qualificatif,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      const response = await dispatch(deleteQualificatifAsync(qualificatif.id));

      if (response?.payload === "not deleted") {
        toast.error("Ce qualificatif ne peut pas être supprimé.");
      } else if (response?.payload === "deleted") {
        toast.success("Qualificatif supprimé avec succès.");
        const refreshResponse = await dispatch(fetchQualificatifsAsync());
        if (refreshResponse?.payload) {
          console.log(
            "Liste des qualificatifs rafraîchie :",
            refreshResponse.payload
          );
        } else {
          console.warn("Échec du rafraîchissement.");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast.error("Une erreur est survenue lors de la suppression.");
    }
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
        [name]: value, // Met à jour uniquement la ligne en édition
      },
    }));
  };

  const handleClickUpdate = (index: number) => {
    setUpdatingIndex(index);
    setEditingValues((prev) => ({
      ...prev,
      [index]: { ...qualificatifs[index] }, // Cloner les valeurs de la ligne actuelle
    }));
  };

  const handleUpdate = async (index: number) => {
    if (editingValues[index]) {
      await dispatch(updateQualificatifAsync(editingValues[index]));
      setUpdatingIndex(null);
      toast.success("Qualificatif mis à jour avec succès.");
      dispatch(fetchQualificatifsAsync());
    } else {
      toast.error("Veuillez remplir tous les champs avant de sauvegarder.");
    }
  };

  const handleCancelEdit = (index: number) => {
    setEditingValues((prev) => {
      const updatedValues = { ...prev };
      delete updatedValues[index]; // Supprime les modifications en cours
      return updatedValues;
    });
    setUpdatingIndex(null); // Sort du mode édition
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
      <ToastContainer theme="colored" />
      <div className="flex flex-col gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen">
        <h1>Liste des qualificatifs</h1>
        <div className="flex flex-row items-center justify-between gap-5 w-full px-14">
          <button
            className="flex flex-row items-center justify-center hover:cursor-pointer gap-5 px-4 py-2 w-[17%] text-center rounded-md border border-black bg-white text-neutral-700 text-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            onClick={() => openModal("addQualificatif")}
          >
            <IoMdAdd className="text-black" /> Ajouter un qualificatif
          </button>
        </div>

        <div className="overflow-y-auto w-[80%]">
          <motion.table
            className="table table-zebra"
            variants={MotionVariant}
            initial="initial"
            animate={MotionVariant.final()}
          >
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
                      <td className="px-4 py-2">{qualificatif.id}</td>

                      <td className="px-4 py-2">
                        {updatingIndex !== index ? (
                          <span>{qualificatif.minimal}</span>
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
                          <span>{qualificatif.maximal}</span>
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
                              onClick={(e) => handleDelete(qualificatif, e)}
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </motion.table>
        </div>
      </div>

      <dialog id="addQualificatif" className="modal">
        <AddQualificatif />
      </dialog>
    </>
  );
};

export default QualificatifHome;
