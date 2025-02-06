import { HoverEffect } from "../components/ui/card-hover-effect";
import { AiOutlineTeam } from "react-icons/ai";
import { LuSchool } from "react-icons/lu";
import { IoSchool } from "react-icons/io5";
import NavBar from "../components/Admin/NavBar";

export function AdminLayout() {
  return (
    <>
      <NavBar />
      <div className="max-w-5xl h-screen mx-auto px-8">
        <HoverEffect items={projects} />
      </div>
    </>
  );
}
export const projects = [
  {
    title: "Gestion Enseignants",
    icon: <AiOutlineTeam size={60} className="mx-auto" />,
    description: "Gérer les utilisateurs des enseignants.",
    link: "/admin/home/enseignants",
  },
  {
    title: "Gestion Promotions",
    icon: <LuSchool size={60} className="mx-auto" />,
    description: "Gérer les promotions.",
    link: "promotions",
  },
  {
    title: "Gestion Étudiants",
    icon: <IoSchool size={60} className="mx-auto" />,
    description: "Gérer les étudiants.",
    link: "etudiants",
  },
];
