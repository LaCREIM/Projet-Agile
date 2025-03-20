import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {getAllEtudiantsAsync, getEtudiantByPromotionAsync,} from "../../features/EtudiantSlice";
import {Etudiant, PromotionDetails} from "../../types/types";

import {getPromotionAsync, getPromotions,} from "../../features/PromotionSlice";

import {useAppDispatch, useAppSelector} from "../../hooks/hooks";
import AddEtudiant from "./AddEtudiant.tsx";
import EtudiantDetails from "./EtudiantDetails";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {HiOutlineChevronLeft} from "react-icons/hi";
import {faEye, faPenToSquare, faTrash,} from "@fortawesome/free-solid-svg-icons";
import UpdateEtudiant from "./UpdateEtudiant.tsx";
import {FaSearch} from "react-icons/fa";
import DeleteEtudiantConfirmation from "./DeleteEtudiantConfirmation.tsx";
import {universiteMapper} from "../../mappers/mappers.ts";
import {MdClear} from "react-icons/md";

interface StudentHomeProps {
  promotionDetails: PromotionDetails;
  setPromotionDetails: (promotionDetails: PromotionDetails) => void;
  switchStudent: (anneePro: string, siglePro: string) => void;
}

const StudentHome = ({
  promotionDetails,
  setPromotionDetails,
  switchStudent,
}: StudentHomeProps) => {
  document.title = "UBO | Étudiants";
  const role = localStorage.getItem("role");
  const dispatch = useAppDispatch();
  const etudiants = useAppSelector((state) => state.etudiants.etudiants);
  const promotions = useAppSelector(getPromotions) || [];
  
  const [search, setSearch] = useState<string>("");
  const [sortField, setSortField] = useState<string>("nom");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [filteredEtudiants, setfilteredEtudiants] = useState<Etudiant[]>([]);
  
  const [pro, setPro] = useState<PromotionDetails>({
    anneeUniversitaire: "-1",
    codeFormation: "",
  } as PromotionDetails);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const etudiantPerPage = 8;
  const [selectedPromotion, setSelectedPromotion] = useState<string>("-1");


  /**********************  UseEffect *********************/

  const handleFetch = async () => {
    await dispatch(getAllEtudiantsAsync());
  };

  const handleFetchByPage = async () => {
    await dispatch(getAllEtudiantsAsync());
  };

  const handleFetchByPromotion = async (promotion: PromotionDetails) => {
    await dispatch(getEtudiantByPromotionAsync(promotion));
  };

  useEffect(() => {
    dispatch(getPromotionAsync());
    if (
      promotionDetails.anneeUniversitaire == "-1" &&
      promotionDetails.codeFormation == ""
    ) {
      handleFetch();
      setfilteredEtudiants(etudiants);
    } else {
      handleFetchByPromotion(promotionDetails);
      setfilteredEtudiants(etudiants);
    }
  }, [dispatch, currentPage, promotionDetails]);

  useEffect(() => {
    setfilteredEtudiants(etudiants);
  }, [etudiants]);

  /**********************  Functions ********************/
    const handleNextPage = () => {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

      const paginatedEtudiants = filteredEtudiants.slice(
        (currentPage - 1) * etudiantPerPage,
        currentPage * etudiantPerPage
      );
  const totalPages = Math.ceil(filteredEtudiants.length / etudiantPerPage);

  const openModal = (name: string) => {
    const dialog = document.getElementById(name) as HTMLDialogElement;
    if (dialog) dialog.showModal();
  };

  const closeModal = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) dialog.close();
  };


  const handlePromotionChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = e.target.value;

    if (selectedValue === "-1") {
      setPro({
        anneeUniversitaire: "-1",
        codeFormation: "",
      } as PromotionDetails);
      setCurrentPage(1); // Réinitialiser à la première page
      await handleFetch();
    } else {
      try {
        const selectedPromotion = JSON.parse(selectedValue) as PromotionDetails;
        setPro(selectedPromotion);
        setCurrentPage(1); // Réinitialiser à la première page
        await handleFetchByPromotion(selectedPromotion);
      } catch (error) {
        console.error("Error parsing promotion details:", error);
      }
    }
  };

  const MotionVariant = {
    initial: {
      opacity: 0,
      y: 30,
    },
    final: () => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    }),
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase().trim());
  };


  useEffect(() => {
    if (search.trim() === "") {
      setfilteredEtudiants(etudiants);
    } else {
      setfilteredEtudiants(
          etudiants.filter(
              (etudiant) =>
                  etudiant.nom.toLowerCase().includes(search.toLowerCase()) ||
                  etudiant.prenom.toLowerCase().includes(search.toLowerCase()) ||
                  etudiant.email.toLowerCase().includes(search.toLowerCase())
          )
      );
    }
  }, [search, etudiants]);


  const handleSortChange = (field: string) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
    const sortedEtudiants = [...etudiants].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setfilteredEtudiants(sortedEtudiants);
  };

  return (
    <>
      <motion.div className="flex flex-col gap-5 items-center pt-[10%] mx-auto rounded-s-3xl bg-white w-full h-screen">
        {promotionDetails.codeFormation ? (
          <h3 className="text-xl">
            Liste des étudiants de {promotionDetails.codeFormation} -{" "}
            {promotionDetails.anneeUniversitaire}{" "}
          </h3>
        ) : (
          <h1 className={"font-bold text-xl"}>Liste des étudiants</h1>
        )}

        <div className="flex flex-row items-center  justify-between gap-5 w-full px-[5%]">
          {!(
            promotionDetails.codeFormation != "" &&
            promotionDetails.anneeUniversitaire != ""
          ) ? (
            <div className="flex flex-row items-center gap-5 w-2/3 ">
              {localStorage.getItem("role") === "ADM" && (
                <>
                  <select
                    value={selectedPromotion}
                    className="w-1/3 select hover:cursor-pointer shadow-md"
                    onChange={(e) => {
                      setSelectedPromotion(e.target.value);
                      handlePromotionChange(e);
                    }}
                  >
                    <option value="default" disabled>
                      Sélectionnez une promotion
                    </option>
                    <option value="-1">Toutes les promotions</option>
                    {promotions.map((promotion, idx) => (
                      <option
                        key={idx}
                        value={JSON.stringify({
                          anneeUniversitaire: promotion.anneeUniversitaire,
                          codeFormation: promotion.codeFormation,
                        })}
                      >
                        {promotion.codeFormation} :{" "}
                        {promotion.anneeUniversitaire}
                      </option>
                    ))}
                  </select>
                  <div className="tooltip" data-tip="Réinitialiser le filtre">
                    <button
                      onClick={() => {
                        setPro({
                          anneeUniversitaire: "-1",
                          codeFormation: "",
                        } as PromotionDetails);
                        setPromotionDetails({
                          anneeUniversitaire: "-1",
                          codeFormation: "",
                        } as PromotionDetails);
                        setSelectedPromotion("-1");
                        handleFetch();
                      }}
                      disabled={
                        pro.anneeUniversitaire == "-1" &&
                        pro.codeFormation == ""
                      }
                      className="flex justify-center items-center rounded-full disabled:cursor-not-allowed disabled:text-gray-400 w-8 hover:cursor-pointer"
                    >
                      <MdClear size={20} />
                    </button>
                  </div>
                </>
              )}

              <div className="w-1/3 block hover:cursor-text">
                <label className="input input-bordered flex items-center gap-2 shadow-md">
                  <input
                    disabled={etudiants.length == 0}
                    name="search"
                    value={search}
                    onChange={handleSearchChange}
                    type="text"
                    className="grow placeholder:font-medium "
                    placeholder="Rechercher..."
                  />
                  <FaSearch />
                </label>
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-between w-1/2">
              <div
                className="flex flex-row justify-between items-center hover:cursor-pointer hover:text-gray-500 duration-150"
                onClick={() => {
                  setPromotionDetails({
                    anneeUniversitaire: "-1",
                    codeFormation: "",
                  } as PromotionDetails);
                  switchStudent("-1", "");
                }}
              >
                <HiOutlineChevronLeft className="text-lg " size={20} />{" "}
                Retournez à la liste des promotions
              </div>
              <div className="w-1/2 block hover:cursor-text">
                <label className="input input-bordered flex items-center gap-2 shadow-md">
                  <input
                    disabled={!etudiants || etudiants.length === 0}
                    name="search"
                    value={search}
                    onChange={handleSearchChange}
                    type="text"
                    className="grow placeholder:font-medium "
                    placeholder="Rechercher..."
                  />
                  <FaSearch />
                </label>
              </div>
            </div>
          )}
          {role === "ADM" && (
            <div className="tooltip" data-tip="Ajouter un etudiant">
              <button
                className="disabled:cursor-not-allowed flex flex-row hover:cursor-pointer items-center justify-center gap-5 px-4 py-2 text-center rounded-full border border-black bg-white text-neutral-700 text-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                onClick={() => openModal("addStudent")}
              >
                +
              </button>
            </div>
          )}
        </div>
        <div className="overflow-y-auto w-[90%] py-5">
          <motion.table
            className="table table-zebra"
            variants={MotionVariant}
            initial="initial"
            animate={MotionVariant.final()}
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
                <th onClick={() => handleSortChange("nationalite")}>
                  Nationalité{" "}
                  {sortField === "nationalite" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSortChange("email")}>
                  Email{" "}
                  {sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSortChange("codeFormation")}>
                  Promotion{" "}
                  {sortField === "codeFormation" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSortChange("universiteOrigine")}>
                  Université d'origine{" "}
                  {sortField === "universiteOrigine" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEtudiants.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="uppercase tracking-widest text-center text-gray-500"
                  >
                    Pas d'étudiants trouvés.
                  </td>
                </tr>
              ) : (
                paginatedEtudiants.map((etudiant: Etudiant, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{etudiant.nom}</td>
                    <td className="px-4 py-2">{etudiant.prenom}</td>
                    <td className="px-4 py-2">{etudiant.nationalite}</td>
                    <td className="px-4 py-2">{etudiant.email}</td>
                    <td className="px-4 py-2">
                      <div
                        className="tooltip"
                        data-tip={`${etudiant.codeFormation} - ${etudiant.anneeUniversitaire}`}
                      >
                        {etudiant.codeFormation}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div
                        className="tooltip"
                        data-tip={universiteMapper(etudiant.universiteOrigine)}
                      >
                        {universiteMapper(etudiant.universiteOrigine)}
                      </div>
                    </td>
                    <td
                      className="flex gap-3 justify-center items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="tooltip" data-tip="Consulter">
                        <FontAwesomeIcon
                          icon={faEye}
                          className="text-base cursor-pointer"
                          onClick={() => {
                            openModal(`inspect-${etudiant.noEtudiant}`);
                          }}
                        />
                      </div>

                      {role === "ADM" && (
                        <div className="tooltip" data-tip="Modifer">
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            className="text-base cursor-pointer"
                            onClick={() => {
                              openModal(`updateStudent-${etudiant.noEtudiant}`);
                            }}
                          />
                        </div>
                      )}
                      {role === "ADM" && (
                        <div className="tooltip" data-tip="Supprimer">
                          <FontAwesomeIcon
                            icon={faTrash}
                            className=" text-base cursor-pointer"
                            onClick={() =>
                              openModal(`delete-${etudiant.noEtudiant}`)
                            }
                          />
                        </div>
                      )}
                    </td>

                    <dialog
                      id={`updateStudent-${etudiant.noEtudiant}`}
                      className="modal"
                    >
                      <UpdateEtudiant
                        onClose={() =>
                          closeModal(`updateStudent-${etudiant.noEtudiant}`)
                        }
                        promotions={promotions}
                        studentData={etudiant}
                        currentpage={currentPage}
                      />
                    </dialog>

                    <dialog
                      id={`inspect-${etudiant.noEtudiant}`}
                      className="modal"
                    >
                      <EtudiantDetails etudiant={etudiant} />
                    </dialog>

                    <dialog
                      id={`delete-${etudiant.noEtudiant}`}
                      className="modal"
                    >
                      <DeleteEtudiantConfirmation
                          setPro={setPro}
                          etudiant={etudiant}
                          handleFetchByPage={handleFetchByPage}
                          currentPage={currentPage}
                          promotionDetails={promotionDetails}
                          pro={pro}/>
                    </dialog>
                  </tr>
                ))
              )}
            </tbody>
          </motion.table>
        </div>
        <div className="flex justify-center items-center gap-4 mt-4 mb-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="btn"
          >
            Précédent
          </button>
          <span>
            Page {currentPage} sur {totalPages === 0 ? 1 : totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="btn"
          >
            Suivant
          </button>
        </div>
      </motion.div>

      <dialog id="addStudent" className="modal">
        <AddEtudiant
          promotions={promotions}
          promotionDetails={promotionDetails}
          pro={pro}
          onClose={() => closeModal("addStudent")}
        />
      </dialog>
    </>
  );
};

export default StudentHome;
