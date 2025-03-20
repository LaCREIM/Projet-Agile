import React, { useEffect, useState } from "react";
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
  fetchQualificatifsAsync,
  updateQualificatifAsync,
} from "../../features/QualificatifSlice";
import { Qualificatif } from "../../types/types";
import { toast } from "react-toastify";
import { RootState } from "../../api/store";
import DeleteQualificatifConfirmation from "./DeleteQualificatifConfirmation";
import { FaSearch } from "react-icons/fa";

const QualificatifHome = () => {
  document.title = "UBO | Qualificatifs";
  const dispatch = useAppDispatch();
  const qualificatifs = useAppSelector(
    (state: RootState) => state.qualificatif.qualificatifs
  );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [updatingIndex, setUpdatingIndex] = useState<number | null>(null);
  const [search, setSearch] = useState<string>("");
  const [sortField, setSortField] = useState<string>("minimal");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const itemsPerPage = 10; // Nombre d'éléments par page

  // Filtrer les qualificatifs
  const filteredQualificatifs = qualificatifs.filter((qualificatif) => {
    return (
      qualificatif.minimal?.toLowerCase().includes(search.toLowerCase()) ||
      qualificatif.maximal?.toLowerCase().includes(search.toLowerCase())
    );
  });
  
  // Trier les qualificatifs
  const sortedQualificatifs = filteredQualificatifs.sort((a, b) => {
    const aValue = a[sortField as keyof Qualificatif];
    const bValue = b[sortField as keyof Qualificatif];
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedQualificatifs.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedQualificatifs.length / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
  };

  const handleSortChange = (field: string) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

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
      if (res?.type === "qualificatifs/update/rejected") {
        toast.error(res.payload as string);
      } else if (res?.type === "qualificatifs/update/fulfilled") {
        toast.success(res.payload as string);
        dispatch(fetchQualificatifsAsync());
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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

      <div className="flex flex-col gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen overflow-y-auto">
        <h1 className="text-xl">Liste des couples qualificatifs</h1>

        <div className="flex flex-row items-center justify-end gap-5 w-[60%] px-14">
          <div className="tooltip" data-tip="Ajouter un couple qualificatif">
            <button
              className="disabled:cursor-not-allowed flex flex-row hover:cursor-pointer items-center justify-center gap-5 px-4 py-2 text-center rounded-full border border-black bg-white text-neutral-700 text-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              onClick={() => openModal("addQualificatif")}
            >
              +
            </button>
          </div>
        </div>

        <div className="w-[60%] flex flex-col gap-3">
          <label className="input input-bordered flex items-center gap-2 shadow-md">
            <input
              type="text"
              className="grow placeholder:font-medium"
              placeholder="Rechercher..."
              value={search}
              onChange={handleSearchChange}
            />
            <FaSearch />
          </label>

          <div className="overflow-y-auto">
            <motion.table
              className="table table-zebra"
              variants={MotionVariant}
              initial="initial"
              animate={MotionVariant.final()}
            >
              <thead>
                <tr>
                  <th onClick={() => handleSortChange("minimal")}>
                    Minimal{" "}
                    {sortField === "minimal" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSortChange("maximal")}>
                    Maximal{" "}
                    {sortField === "maximal" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="uppercase tracking-widest text-center text-gray-500"
                    >
                      Pas de qualificatifs trouvés.
                    </td>
                  </tr>
                ) : (
                  currentItems.map(
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
                              <div className="tooltip" data-tip="Enregistrer">
                                <FontAwesomeIcon
                                  icon={faFloppyDisk}
                                  className="text-black text-base cursor-pointer"
                                  onClick={() => handleUpdate(index)}
                                />
                              </div>
                              <div className="tooltip" data-tip="Annuler">
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  className="text-black text-base cursor-pointer"
                                  onClick={() => handleCancelEdit(index)}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="tooltip" data-tip="Modifier">
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  className="text-black text-base cursor-pointer"
                                  onClick={() => handleClickUpdate(index)}
                                />
                              </div>
                              <div className="tooltip" data-tip="Supprimer">
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className="text-black text-base cursor-pointer"
                                  onClick={() =>
                                    openModal(`delete-${qualificatif.id}`)
                                  }
                                />
                              </div>
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
        </div>
        <div className="flex justify-center items-center mt-2">
          <button
            className="btn disabled:cursor-not-allowed hover:cursor-pointer"
            disabled={currentPage === 1 || totalPages === 0}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Précédent
          </button>
          <span className="mx-2">
            Page {currentPage} sur {totalPages === 0 ? 1 : totalPages}
          </span>
          <button
            className="btn disabled:cursor-not-allowed hover:cursor-pointer"
            disabled={currentPage === totalPages || totalPages === 0}
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
