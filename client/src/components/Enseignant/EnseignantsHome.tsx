import React, { useEffect, useState, useRef } from "react";
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
  getEnseignantAsync,
  getEnseignants,
  getTotalePages,
} from "../../features/EnseignantSlice";
import { Enseignant } from "../../types/types";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { enseignantMapper } from "../../mappers/mappers";
import { MdClear } from "react-icons/md";

const EnseignantsHome = () => {
  document.title = "UBO | Enseignants";
  const dispatch = useAppDispatch();
  const enseignants = useAppSelector(getEnseignants);
  const totalPages = useAppSelector(getTotalePages);
  const [search, setSearch] = useState<string>("");
  const [sortField, setSortField] = useState<string>("nom");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [filterType, setFilterType] = useState<string>("");
  const [filteredEnseignants, setFilteredEnseignants] = useState<Enseignant[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const modalVariant = {
    hidden: { opacity: 0, scale: 0.8 }, // Opacité 0 au départ pour éviter les flashs
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const [modal, setModal] = useState<{
    enseignant: Enseignant | null;
    index: number;
  }>({
    enseignant: null,
    index: -1,
  });

  const [modalUpdate, setModalUpdate] = useState<{
    enseignant: Enseignant | null;
    index: number;
  }>({
    enseignant: null,
    index: -1,
  });
  const [modalDelete, setModalDelete] = useState<{
    enseignant: Enseignant | null;
    open: boolean;
  }>({
    enseignant: null,
    open: false,
  });
  const openDeleteModal = (enseignant: Enseignant, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalDelete({ enseignant, open: true });
  };
  const confirmDelete = async () => {
    if (!modalDelete.enseignant) return;

    const response = await dispatch(
      deleteEnseignantAsync(modalDelete.enseignant)
    );

    if (deleteEnseignantAsync.fulfilled.match(response)) {
      toast.success("Enseignant supprimé avec succès.");
      dispatch(getEnseignantAsync({ page: currentPage, size: 10 }));
    } else {
      toast.error(
        "Cet enseignant ne peut pas être supprimé, il est responsable d'une promotion."
      );
    }

    // Fermer la modal après suppression
    setModalDelete({ enseignant: null, open: false });
  };
  const formatPhoneNumber = (value: string): string => {
    return value.replace(/\D/g, "") // Supprime tous les caractères non numériques
                .replace(/(\d{2})(?=\d)/g, "$1 ") // Ajoute un espace tous les deux chiffres
                .trim();
  };
  const updateEnseignantModalRef = useRef<HTMLDialogElement | null>(null);
  const enseignantDetailsModalRef = useRef<HTMLDialogElement | null>(null);


  useEffect(() => {
    const filtered = enseignants.filter((enseignant) => {
      const matchesSearch = Object.values(enseignant).some((value) =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      );
      const matchesType = filterType ? enseignant.type === filterType : true;
      return matchesSearch && matchesType;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField as keyof typeof a];
        const bValue = b[sortField as keyof typeof b];
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    setFilteredEnseignants(filtered);
  }, [enseignants, search, sortField, sortOrder, filterType]);

  const handleSortChange = (field: string) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

  };

  useEffect(() => {
    if (modal.enseignant && enseignantDetailsModalRef.current) {
      enseignantDetailsModalRef.current.showModal();
    }

    if (modalUpdate.enseignant && updateEnseignantModalRef.current) {
      updateEnseignantModalRef.current.showModal();
    }
  }, [modal, modalUpdate]);

  useEffect(() => {
    dispatch(getEnseignantAsync({ page: currentPage, size: 10 }));
  }, [dispatch, currentPage]);

  const openModal = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) dialog.showModal();
  };
  const closeModal = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) dialog.close();
  };

  const handleClick = (enseignant: Enseignant, index: number) => {
    setModal({ enseignant, index });
  };

  const handleClickUpdate = (enseignant: Enseignant, index: number) => {
    setModalUpdate({ enseignant, index });
  };

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setSearch(value);
    if (value.trim() === "") {
      setFilteredEnseignants(enseignants);
    } else {
      setFilteredEnseignants(
        enseignants.filter(
          (ens) =>
            ens.nom.toLowerCase().includes(value.toLowerCase()) ||
            ens.prenom.toLowerCase().includes(value.toLowerCase()) ||
            ens.emailUbo.toLowerCase().includes(value.toLowerCase()) ||
            ens.mobile.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <div className="flex flex-col gap-5 items-center pt-[10%] mx-auto rounded-s-3xl bg-white w-full h-screen">

        <h1 className="text-xl font-bold">Liste des enseignants</h1>
        <div className="flex flex-row items-center justify-between gap-5 w-full px-[5%]">
          <div className="w-2/3 flex flex-row items-center gap-5 hover:cursor-text">
            <label className="input input-bordered flex items-center gap-2 shadow-md">
              <input
                disabled={enseignants?.length == 0}
                name="search"
                value={search}
                onChange={handleSearchChange}
                type="text"
                className="grow placeholder:font-medium "
                placeholder="Rechercher..."
              />
              <FaSearch />
            </label>

            <>
              <select
                className="select select-bordered"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Tous les types</option>
                <option value="MCF">Maître de Conférences</option>
                <option value="INT">Intervenant-Extérieur</option>
                <option value="PR">Professeur des Universités</option>
                <option value="PRAST">Professionnel Associé</option>
                <option value="PRAG">Professeur Agrégé</option>
              </select>
              <div className="tooltip" data-tip="Réinitialiser le filtre">
                <button
                  onClick={() => setFilterType("")}
                  disabled={filterType === ""}
                  className="flex justify-center items-center rounded-full disabled:cursor-not-allowed disabled:text-gray-400 w-8  hover:cursor-pointer"
                >
                  <MdClear size={20} />
                </button>
              </div>
            </>
          </div>
          <div className="tooltip" data-tip="Ajouter un enseignant">
            <button
              className="flex flex-row hover:cursor-pointer items-center justify-center gap-5 px-4 py-2 text-center rounded-full border border-black bg-white text-neutral-700 text-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              onClick={() => openModal("addEnseignant")}
            >
              +
            </button>
          </div>
        </div>

        <div className="overflow-y-auto w-[90%]">
          <motion.table
            variants={{
              initial: { opacity: 0, y: 30 },
              final: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            }}
            initial="initial"
            animate="final"
            className="table table-zebra"
          >
            <thead>
              <tr>
                <th onClick={() => handleSortChange("nom")}>
                  Nom {sortField === "nom" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSortChange("prenom")}>
                  Prénom{" "}
                  {sortField === "prenom" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSortChange("emailUbo")}>
                  Email professionnel{" "}
                  {sortField === "emailUbo" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSortChange("mobile")}>
                  Téléphone{" "}
                  {sortField === "mobile" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>Type</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enseignants.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="uppercase tracking-widest text-center "
                  >
                    <span className="loading loading-dots loading-lg"></span>
                  </td>
                </tr>
              ) : filteredEnseignants.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}

                    className="uppercase tracking-widest text-center text-gray-500"
                  >
                    Pas d'enseignants trouvés.
                  </td>
                </tr>
              ) : (
                filteredEnseignants.map(
                  (enseignant: Enseignant, index: number) => (
                    <tr
                      key={enseignant.id}
                      className="hover:cursor-pointer hover:bg-gray-50 transition-all duration-75"
                    >

                      <td className="px-4 py-2">
                        {enseignant.nom.toUpperCase()}
                      </td>
                      <td className="px-4 py-2">{enseignant.prenom}</td>
                      <td className="px-4 py-2">{enseignant.emailUbo}</td>
                      <td className="px-4 py-2">
                        {formatPhoneNumber(enseignant.mobile)}
                      </td>

                      <td className="px-4 py-2">
                        {enseignantMapper(enseignant.type)}
                      </td>
                      <td className="flex gap-3 justify-center items-center">
                        <FontAwesomeIcon
                          icon={faEye}
                          className=" text-base cursor-pointer"
                          onClick={() => {
                            handleClick(enseignant, index);
                            openModal(`inspect-${index}`);
                          }}
                        />

                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className=" text-base cursor-pointer"
                          onClick={() => {
                            handleClickUpdate(enseignant, index);
                            openModal(`updateEnseignant-${index}`);
                          }}
                        />

                        <FontAwesomeIcon
                          icon={faTrash}
                          className=" text-base cursor-pointer"
                          onClick={(e) => openDeleteModal(enseignant, e)}
                        />
                      </td>
                      <dialog
                        id={`updateEnseignant-${index}`}
                        className="modal"
                      >
                        <UpdateEnseignant enseignantData={enseignant} />
                      </dialog>

                      {/* Modal de mise à jour */}
                      <dialog
                        id={`updateEnseignant-${index}`}
                        className="modal"
                      >
                        <UpdateEnseignant enseignantData={enseignant} />
                      </dialog>

                      {/* Modal de détails */}
                      <dialog id={`inspect-${index}`} className="modal">
                        <DetailsEnseignant enseignant={enseignant} />
                      </dialog>
                    </tr>
                  )
                )
              )}
            </tbody>
          </motion.table>
        </div>

        <div className="flex justify-center mt-4">
          <button
            className="btn"
            disabled={currentPage === 1 || totalPages === 0}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Precedent
          </button>
          <span className="mx-2">
            Page {currentPage} sur {totalPages === 0 ? 1 : totalPages}
          </span>
          <button
            className="btn"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Suivant
          </button>
        </div>
      </div>

      <dialog id="addEnseignant" className="modal">
        <AddEnseignant onClose={() => closeModal("addEnseignant")} />
      </dialog>

      {modalDelete.open && (
        <>
          {/* Fond semi-transparent avec flou */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
            onClick={() => setModalDelete({ enseignant: null, open: false })}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          />

          {/* Modal de confirmation */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       bg-white p-6 rounded-xl shadow-lg w-96 border border-gray-300 
                       z-50 flex flex-col gap-5 pointer-events-auto"
            variants={modalVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-xl font-bold text-gray-800">Confirmation</h2>
            <p className="text-gray-700">
              Êtes-vous sûr de vouloir supprimer l'enseignant :{" "}
              <strong>
                {modalDelete.enseignant?.nom} {modalDelete.enseignant?.prenom}
              </strong>{" "}
              ?
            </p>

            <div className="flex justify-end space-x-3">
              <motion.button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setModalDelete({ enseignant: null, open: false })
                }
              >
                Annuler
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmDelete}
              >
                Supprimer
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default EnseignantsHome;
