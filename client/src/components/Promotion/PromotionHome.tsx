import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

import {
  deletePromotionAsync,
  getPromotionAsync,
  getPromotions,
} from "../../features/PromotionSlice";
import { IoMdAdd } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faGraduationCap,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import AddPromotion from "./AddPromotion";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import UpdatePromotion from "./UpdatePromotion";
import StudentHome from "../Student/StudentHome";
import {
  Enseignant,
  PromotionCreate,
  PromotionDetails,
  PromotionId,
} from "../../types/types";
import { Promotion } from "../../types/types";
import { DetailsPromotions } from "./DetailsPromotions";
import {
  getAllEnseignant,
  getAllEnseignantAsync,
} from "../../features/EnseignantSlice";
import { FaSearch } from "react-icons/fa";
import { diplomeMapper } from "../../mappers/mappers";

const PromotionHome = () => {
  document.title = "UBO | Promotions";
  const dispatch = useAppDispatch();
  const promotions = useAppSelector<Promotion[]>(getPromotions);
  const enseignants = useAppSelector<Enseignant[]>(getAllEnseignant);
  const [search, setSearch] = useState<string>("");
  const [promotionDetails, setPromotionDetails] = useState<PromotionDetails>(
    {} as PromotionDetails
  );
  const [showStudents, setShowStudent] = useState<Boolean>(false);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);

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

  const dispatchPromotion = () => {
    dispatch(getPromotionAsync());
  };

  const [modal, setModal] = useState<{
    promotion: Promotion | null;
    index: number;
  }>({ promotion: null, index: -1 });

  const [modalUpdate, setModalUpdate] = useState<{
    promotion: Promotion | null;
    index: number;
  }>({ promotion: null, index: -1 });

  const updateStudentModalRef = useRef<HTMLDialogElement | null>(null);
  const etudiantDetailsModalRef = useRef<HTMLDialogElement | null>(null);

  useEffect( () => {
    dispatch(getPromotionAsync());
    dispatch(getAllEnseignantAsync());
    setFilteredPromotions(promotions);
  }, [dispatch]);

  useEffect(() => {
    setFilteredPromotions(promotions);
  }, [promotions]);

  useEffect(() => {
    if (
      modal.promotion &&
      modal.index !== -1 &&
      etudiantDetailsModalRef.current
    ) {
      etudiantDetailsModalRef.current.showModal();
    }

    if (
      modalUpdate.promotion &&
      modalUpdate.index !== -1 &&
      updateStudentModalRef.current
    ) {
      updateStudentModalRef.current.showModal();
    }
  }, [modal, modalUpdate]);

  const openModal = (name: string) => {
    const dialog = document.getElementById(name) as HTMLDialogElement;
    if (dialog) dialog.showModal();
  };

  const handleClick = (promotion: Promotion, index: number) => {
    setModal({ promotion, index });
  };

  const handleClickUpdate = (promotion: Promotion, index: number) => {
    setModalUpdate({ promotion, index });
  };

  const handleDelete = async (promotion: Promotion, e: React.MouseEvent) => {
    e.stopPropagation();
    const response = await dispatch(
      deletePromotionAsync({
        anneeUniversitaire: promotion.anneeUniversitaire,
        codeFormation: promotion.codeFormation,
      } as PromotionId)
    );
    if (response?.payload === "not deleted") {
      toast.error("Cette promotion ne peut pas être supprimée");
    } else {
      toast.success("Promotion supprimée avec succès");
    }
    dispatch(getPromotionAsync());
  };

  const switchToStudent = (
    anneeUniversitaire: string,
    codeFormation: string
  ) => {
    setPromotionDetails({} as PromotionDetails);
    setPromotionDetails({
      anneeUniversitaire: anneeUniversitaire,
      codeFormation: codeFormation,
    } as PromotionDetails);

    setShowStudent(!showStudents);
  };

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setSearch(value);
    if (value.trim() === "") {
      setFilteredPromotions(promotions);
    } else {
      setFilteredPromotions(
        promotions.filter(
          (promotion) =>
            promotion.siglePromotion
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            promotion.nomFormation
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            (promotion.nom + " " + promotion.prenom)
              .toLowerCase()
              .includes(value.toLowerCase())
        )
      );
    }
  };

  return (
    <>
      <ToastContainer theme="colored" />
      {showStudents ? (
        <StudentHome
          promotionDetails={promotionDetails}
          setPromotionDetails={setPromotionDetails}
          switchStudent={switchToStudent}
        />
      ) : (
        <div className="flex flex-col gap-5 items-center pt-[10%] mx-auto rounded-s-3xl bg-white w-full h-screen">
          <h1>Liste des promotions</h1>
          <div className="flex flex-row items-center justify-between gap-5  hover:cursor-pointer w-full px-[5%]">
            <div className="w-1/3 block hover:cursor-text">
              <label className="input input-bordered flex items-center gap-2 shadow-md">
                <input
                  disabled={promotions.length == 0}
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
            <button
              className="flex flex-row items-center justify-center hover:cursor-pointer gap-5 px-4 py-2 disabled:cursor-not-allowed w-[17%] text-center rounded-md border border-black bg-white text-neutral-700 text-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              onClick={() => openModal("addPromotion")}
            >
              <IoMdAdd className="text-black" /> Ajouter une Promotion
            </button>
          </div>
          <div className="overflow-y-auto w-[90%]">
            <motion.table
              className="table table-zebra"
              variants={MotionVariant}
              initial="initial"
              animate={MotionVariant.final()}
            >
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Promotion</th>
                  <th>Diplome</th>
                  <th>Formation</th>
                  <th>Responsable</th>
                  <th>Email</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promotions.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center w-full">
                      <span className="loading loading-dots loading-lg"></span>
                    </td>
                  </tr>
                ) : filteredPromotions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="uppercase tracking-widest text-center text-gray-500"
                    >
                      Pas de promotions trouvées.
                    </td>
                  </tr>
                ) : (
                  filteredPromotions.map(
                    (promotion: Promotion, index: number) => (
                      <tr
                        key={index}
                        className="hover:cursor-pointer hover:bg-gray-50 transition-all duration-75"
                      >
                        <td className="px-4 py-2">
                          {promotion.siglePromotion}
                        </td>
                        <td className="px-4 py-2">
                          {promotion.anneeUniversitaire}
                        </td>
                        <td className="px-4 py-2">{diplomeMapper(promotion.diplome)}</td>
                        <td className="px-4 py-2">{promotion.nomFormation}</td>

                        <td className="px-4 py-2">
                          {promotion.nom?.toUpperCase() +
                            " " +
                            promotion.prenom}
                        </td>
                        <td className="px-4 py-2">
                          {promotion.emailEnseignant}
                        </td>
                        <td
                          className="flex flex-row gap-3 justify-center items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FontAwesomeIcon
                            icon={faGraduationCap}
                            className="text-black text-base cursor-pointer"
                            onClick={() =>
                              switchToStudent(
                                promotion.anneeUniversitaire,
                                promotion.codeFormation
                              )
                            }
                          />
                          <FontAwesomeIcon
                            icon={faEye}
                            className="text-black text-base cursor-pointer"
                            onClick={() => {
                              handleClick({} as Promotion, index);
                              handleClickUpdate({} as Promotion, index);
                              handleClick(promotion, index);
                              openModal(
                                `detailsPromotion-${
                                  (promotion.anneeUniversitaire,
                                  promotion.siglePromotion)
                                }`
                              );
                            }}
                          />
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            className="text-black text-base cursor-pointer"
                            onClick={() => {
                              handleClick({} as Promotion, index);
                              handleClickUpdate({} as Promotion, index);
                              handleClickUpdate(promotion, index);
                              openModal(
                                `updatePromotion-${
                                  (promotion.anneeUniversitaire,
                                  promotion.siglePromotion)
                                }`
                              );
                            }}
                          />

                          <FontAwesomeIcon
                            icon={faTrash}
                            className="text-black text-base cursor-pointer"
                            onClick={(e) => handleDelete(promotion, e)}
                          />
                        </td>
                        <dialog
                          id={`updatePromotion-${
                            (promotion.anneeUniversitaire,
                            promotion.siglePromotion)
                          }`}
                          className="modal"
                        >
                          <UpdatePromotion
                            enseignants={enseignants}
                            promotionData={promotion as PromotionCreate}
                            dispatchPromotion={dispatchPromotion}
                          />
                        </dialog>
                        <dialog
                          id={`detailsPromotion-${
                            (promotion.anneeUniversitaire,
                            promotion.siglePromotion)
                          }`}
                          className="modal"
                        >
                          <DetailsPromotions promotion={promotion} />
                        </dialog>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </motion.table>
          </div>
        </div>
      )}
      <dialog id="addPromotion" className="modal">
        <AddPromotion
          enseignants={enseignants}
          dispatchPromotion={dispatchPromotion}
        />
      </dialog>
    </>
  );
};

export default PromotionHome;
