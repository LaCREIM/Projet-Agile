import {HoverEffect} from "../components/ui/card-hover-effect";
import {AiOutlineTeam} from "react-icons/ai";
import {LuSchool} from "react-icons/lu";
import {IoSchool} from "react-icons/io5";
import {PiSealQuestionFill} from "react-icons/pi";
import {FaArrowsLeftRightToLine} from "react-icons/fa6";
import {BsCardHeading} from "react-icons/bs";
import {FaFileAlt} from "react-icons/fa";

import NavBar from "../components/Admin/NavBar";

export function AdminLayout() {
  const role = localStorage.getItem("role");

  const allProjects = [
    {
      title: "Gestion des enseignants",
      icon: <AiOutlineTeam size={60} className="mx-auto" />,
      description: "Gérer les utilisateurs des enseignants.",
      link: "/user/home/enseignants",
    },
    {
      title: "Gestion des promotions",
      icon: <LuSchool size={60} className="mx-auto" />,
      description: "Gérer les promotions.",
      link: "/user/home/promotions",
    },
    {
      title: "Consultation des promotions",
      icon: <LuSchool size={60} className="mx-auto" />,
      description: "Consulter les promotions.",
      link: "/user/home/promotions",
    },
    {
      title: "Gestion des étudiants",
      icon: <IoSchool size={60} className="mx-auto" />,
      description: "Gérer les étudiants.",
      link: "/user/home/etudiants",
    },
    {
      title: "Gestion des qualificatifs",
      icon: <FaArrowsLeftRightToLine size={60} className="mx-auto" />,
      description: "Gérer les qualificatifs.",
      link: "/user/home/qualificatifs",
    },
    {
      title: "Gestion des questions",
      icon: <PiSealQuestionFill size={60} className="mx-auto" />,
      description: "Gérer les questions.",
      link: "/user/home/questions",
    },
    {
      title: "Gestion des rubriques",
      icon: <BsCardHeading size={60} className="mx-auto" />,
      description: "Gérer les rubriques.",
      link: "/user/home/rubriques",
    },
    {
      title: "Gestion des évaluations",
      icon: <FaFileAlt size={60} className="mx-auto" />,
      description: "Gérer les évaluations.",
      link: "/user/home/evaluations",
    },
    {
      title: "Consultation des évaluations",
      icon: <FaFileAlt size={60} className="mx-auto" />,
      description: "Consulter les évaluations.",
      link: "/user/home/evaluations",
    },
  ];

  let projets = [] as any[];

  if (role === "ENS") {
    projets = allProjects.filter((link) =>
      [
        "Gestion des questions",
        "Gestion des rubriques",
        "Consultation des promotions",
        "Gestion des évaluations",
      ].includes(link.title)
    );
  } else if (role === "ADM") {
    projets = allProjects.filter((link) =>
      [
        "Gestion des questions",
        "Gestion des rubriques",
        "Gestion des promotions",
        "Gestion des qualificatifs",
        "Gestion des enseignants",
        "Gestion des étudiants",
      ].includes(link.title)
    );
  } else if (role === "ETU") {
    projets = allProjects.filter((link) =>
      ["Consultation des évaluations"].includes(link.title)
    );
  }
  return (
    <div className={"h-screen"}>
      <NavBar />
      <div className="max-w-5xl mx-auto px-8">
        <h1 className="text-center pt-4 text-3xl font-bold my-4">Plateforme d'évaluation des enseignements</h1>
        <HoverEffect items={projets} />
      </div>
    </div>
  );
}
