import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  deleteEtudiantAsync,
  getEtudiantAsync,
  getEtudiants,
  getEtudiantByPromotionAsync,
} from "../../features/EtudiantSlice";
import { Etudiant } from "../../types/types";

import {
  getPromotionAsync,
  getPromotions,
} from "../../features/PromotionSlice";

import { IoMdAdd } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import AddStudent from "./AddStudent";
import EtudiantDetails from "./EtudiantDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HiOutlineChevronLeft } from "react-icons/hi";
import {
  faEye,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import UpdateStudent from "./UpdateStudent";
import { PromotionDetails } from "../../types/types";
import { ToastContainer, toast } from "react-toastify";

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
  const dispatch = useAppDispatch();
  const etudiants = useAppSelector(getEtudiants);
  const promotions = useAppSelector(getPromotions);

  const [modal, setModal] = useState<{
    etudiant: Etudiant | null;
    index: number;
  }>({ etudiant: null, index: -1 });

  const [modalUpdate, setModalUpdate] = useState<{
    etudiant: Etudiant | null;
    index: number;
  }>({ etudiant: null, index: -1 });

  const [pro, setPro] = useState<PromotionDetails>({} as PromotionDetails);

  const updateStudentModalRef = useRef<HTMLDialogElement | null>(null);
  const etudiantDetailsModalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    dispatch(getPromotionAsync());
    if (etudiants.length === 0) {
      dispatch(getEtudiantAsync());
    }
    if (
      pro.anneeUniversitaire === "-1" &&
      promotionDetails.anneeUniversitaire === "-1"
    ) {
      dispatch(getEtudiantAsync());
    } else if (pro.anneeUniversitaire !== "-1" && pro.codeFormation !== "") {
      
      console.log("heeeeeere");
      
      dispatch(getEtudiantByPromotionAsync(pro as PromotionDetails));
    } else if (
      promotionDetails.anneePro !== "-1" &&
      promotionDetails.codeFormation !== ""
    ) {
      dispatch(getEtudiantByPromotionAsync(promotionDetails as PromotionDetails));
    }
  }, [dispatch, pro, promotionDetails]);

  useEffect(() => {
    if (
      modal.etudiant &&
      modal.index !== -1 &&
      etudiantDetailsModalRef.current
    ) {
      etudiantDetailsModalRef.current.showModal();
    }

    if (
      modalUpdate.etudiant &&
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

  const handleClick = (etudiant: Etudiant, index: number) => {
    setModal({ etudiant, index });
  };

  const handleClickUpdate = (etudiant: Etudiant, index: number) => {
    setModalUpdate({ etudiant, index });
  };

  const handleDelete = async (etudiant: Etudiant, e: React.MouseEvent) => {
    e.stopPropagation();
    const response = await dispatch(deleteEtudiantAsync(etudiant.noEtudiant));
    dispatch(getEtudiantAsync());
    if (
      response?.payload ===
      "Can not delete this student because it's related to an internship"
    ) {
      toast.error(
        "Impossible de supprimer cet étudiant car il est lié à un stage"
      );
    }
    if (response?.payload === "Student deleted successfully") {
      toast.success("Etudiant supprimé avec succès");
    }
  };

  const handlePromotionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === "-1") {
      setPro({
        anneeUniversitaire: "-1",
        codeFormation: "",
      } as PromotionDetails);
    } else {
      try {
        const selectedPromotion = JSON.parse(selectedValue) as PromotionDetails;
        setPro(selectedPromotion);
        console.log("Selected promotion:", selectedPromotion);
        
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

  return (
    <>
      <motion.div className="flex flex-col gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen">
        <ToastContainer theme="colored" />
        {promotionDetails.siglePro ? (
          <h1>Liste des étudiants de {promotionDetails.siglePro} </h1>
        ) : (
          <h1>Liste des étudiants</h1>
        )}

        <div className="flex flex-row items-center  justify-between gap-5 w-full px-14">
          {!promotionDetails.siglePro ? (
            <select
              defaultValue="default"
              className="select hover:cursor-pointer"
              onChange={handlePromotionChange}
            >
              <option value="default" disabled>
                Sélectionnez une promotion
              </option>
              <option
                value="-1"
                onClick={() =>
                  setPro({
                    anneeUniversitaire: "-1",
                    codeFormation: "",
                  } as PromotionDetails)
                }
              >
                Tous les promotions
              </option>
              {promotions.map((promotion, idx) => (
                <option
                  key={idx}
                  value={JSON.stringify({
                    anneeUniversitaire: promotion.anneeUniversitaire,
                    codeFormation: promotion.codeFormation,
                  })}
                >
                  {promotion.anneeUniversitaire} : {promotion.codeFormation}
                </option>
              ))}
            </select>
          ) : (
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
              <HiOutlineChevronLeft className="text-lg " size={20} /> Retournez
              à la liste des promotions
            </div>
          )}

          <button
            className="flex flex-row items-center justify-center  hover:cursor-pointer gap-5 px-4 py-2 disabled:cursor-not-allowed w-[17%] text-center rounded-md border border-black bg-white text-neutral-700 text-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            onClick={() => openModal("addStudent")}
          >
            <IoMdAdd className="text-black" /> Ajouter un étudiant
          </button>
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
                <th></th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Nationalité</th>
                <th>Email</th>
                <th>Promotion</th>
                <th>Université</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {etudiants.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="uppercase tracking-widest text-center text-gray-500"
                  >
                    Pas d'étudiants trouvés.
                  </td>
                </tr>
              ) : (
                etudiants.map((etudiant: Etudiant, index: number) => (
                  <tr
                    key={index}
                    className="hover:cursor-pointer hover:bg-gray-50 transition-all duration-75"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{etudiant.nom}</td>
                    <td className="px-4 py-2">{etudiant.prenom}</td>
                    <td className="px-4 py-2">
                      {etudiant.nationalite || "Française"}
                    </td>
                    <td className="px-4 py-2">{etudiant.email}</td>
                    <td className="px-4 py-2">{etudiant.codeFormation}</td>
                    <td className="px-4 py-2">{etudiant.universiteOrigine}</td>
                    <td
                      className="flex gap-3 justify-center items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="text-black text-base cursor-pointer"
                        onClick={() => {
                          handleClickUpdate(etudiant, index);
                          openModal(`updateStudent-${etudiant.noEtudiant}`);
                        }}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-black text-base cursor-pointer"
                        onClick={(e) => handleDelete(etudiant, e)}
                      />
                      <FontAwesomeIcon
                        icon={faEye}
                        className="text-black text-base cursor-pointer"
                        onClick={() => {
                          handleClick(etudiant, index);
                          openModal(`inspect-${etudiant.noEtudiant}`);
                        }}
                      />
                    </td>
                    <dialog
                      id={`updateStudent-${etudiant.noEtudiant}`}
                      className="modal"
                    >
                      <UpdateStudent studentData={etudiant} />
                    </dialog>
                    <dialog
                      id={`inspect-${etudiant.noEtudiant}`}
                      className="modal"
                    >
                      <EtudiantDetails etudiant={etudiant} />
                    </dialog>
                  </tr>
                ))
              )}
            </tbody>
          </motion.table>
        </div>
      </motion.div>
      <dialog id="addStudent" className="modal">
        <AddStudent />
      </dialog>
    </>
  );
};

export default StudentHome;
