import { HoverEffect } from "../components/ui/card-hover-effect";
import { AiOutlineTeam } from "react-icons/ai";
import { LuSchool } from "react-icons/lu";
import { IoSchool } from "react-icons/io5";
import { PiSealQuestionFill } from "react-icons/pi";
import { FaArrowsLeftRightToLine } from "react-icons/fa6";
import { BsCardHeading } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa";

import NavBar from "../components/Admin/NavBar";

export function AdminLayout() {
  const role = localStorage.getItem("role");

  const allProjects = [
    {
      title: "Gestion des enseignants",
      icon: <AiOutlineTeam size={60} className="mx-auto" />,
      description: "Gérer les utilisateurs des enseignants.",
      link: "/admin/home/enseignants",
    },
    {
      title: "Gestion des promotions",
      icon: <LuSchool size={60} className="mx-auto" />,
      description: "Gérer les promotions.",
      link: "/admin/home/promotions",
    },
    {
      title: "Consultation des promotions",
      icon: <LuSchool size={60} className="mx-auto" />,
      description: "Consulter les promotions.",
      link: "/admin/home/promotions",
    },
    {
      title: "Gestion des étudiants",
      icon: <IoSchool size={60} className="mx-auto" />,
      description: "Gérer les étudiants.",
      link: "/admin/home/etudiants",
    },
    {
      title: "Gestion des qualificatifs",
      icon: <FaArrowsLeftRightToLine size={60} className="mx-auto" />,
      description: "Gérer les qualificatifs.",
      link: "/admin/home/qualificatifs",
    },
    {
      title: "Gestion des questions",
      icon: <PiSealQuestionFill size={60} className="mx-auto" />,
      description: "Gérer les questions.",
      link: "/admin/home/questions",
    },
    {
      title: "Gestion des rubriques",
      icon: <BsCardHeading size={60} className="mx-auto" />,
      description: "Gérer les rubriques.",
      link: "/admin/home/rubriques",
    },
    {
      title: "Gestion des évaluations",
      icon: <FaFileAlt size={60} className="mx-auto" />,
      description: "Gérer les évaluations.",
      link: "/admin/home/evaluations",
    },
  ];

  const projects =
    role === "ENS"
      ? allProjects.filter((project) =>
          [
            "Gestion des questions",
            "Gestion des rubriques",
            "Consultation des promotions",
          ].includes(project.title)
        )
      : allProjects.filter((project) =>
          [
            "Gestion des questions",
            "Gestion des rubriques",
            "Gestion des promotions",
            "Gestion des qualificatifs",
            "Gestion des enseignants",
            "Gestion des étudiants",
            "Gestion des évaluations",
          ].includes(project.title)
        );
  return (
    <>
      <NavBar />
      <div className="max-w-5xl h-screen mx-auto px-8">
        <HoverEffect items={projects} />
      </div>

    </>
  );
}

