import {useState} from "react";
import {Sidebar, SidebarBody, SidebarLink} from "../ui/sidebar";
import {FiLogOut} from "react-icons/fi";
import {AiOutlineTeam} from "react-icons/ai";
import {LuSchool} from "react-icons/lu";
import {IoSchool} from "react-icons/io5";
import {PiSealQuestionFill} from "react-icons/pi";
import {FaArrowsLeftRightToLine} from "react-icons/fa6";
import {FaFileAlt} from "react-icons/fa";
import {BsCardHeading} from "react-icons/bs";
import {Link, Outlet} from "react-router-dom";
import {motion} from "framer-motion";
import {cn} from "../../lib/utils";


export function Dashboard() {
  const role = localStorage.getItem("role")
  
  const allLinks = [
    {
      label: "Gestion des enseignants",
      href: "/user/home/enseignants",
      icon: (
        <AiOutlineTeam className="text-neutral-700 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Gestion des promotions",
      href: "/user/home/promotions",
      icon: <LuSchool className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Consultation des promotions",
      href: "/user/home/promotions",
      icon: <LuSchool className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Gestion des étudiants",
      href: "/user/home/etudiants",
      icon: <IoSchool className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Gestion des qualificatifs",
      href: "/user/home/qualificatifs",
      icon: (
        <FaArrowsLeftRightToLine className="text-neutral-700 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Gestion des questions",
      href: "/user/home/questions",
      icon: (
        <PiSealQuestionFill className="text-neutral-700 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Gestion des rubriques",
      href: "/user/home/rubriques",
      icon: (
        <BsCardHeading className="text-neutral-700 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Gestion des évaluations",
      href: "/user/home/evaluations",
      icon: <FaFileAlt className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Consultation des évaluations",
      href: "/user/home/evaluations",
      icon: <FaFileAlt className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Déconnexion",
      href: "/",
      icon: <FiLogOut onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('id');
      }} className="text-neutral-700 h-5 w-5 flex-shrink-0"/>,
    },
  ];

  let links = [] as any[];

  if (role === "ENS") {
    links = allLinks.filter((link) =>
      [
        "Gestion des questions",
        "Gestion des rubriques",
        "Consultation des promotions",
        "Gestion des évaluations",
        "Déconnexion",
      ].includes(link.label)
    );
  } else if(role === "ADM") {
    links = allLinks.filter((link) =>
      [
        "Gestion des questions",
        "Gestion des rubriques",
        "Gestion des promotions",
        "Gestion des qualificatifs",
        "Gestion des enseignants",
        "Gestion des étudiants",
        "Déconnexion",
      ].includes(link.label)
    );
  }else if(role === "ETU") {
    links = allLinks.filter((link) =>
      ["Consultation des évaluations", "Déconnexion"].includes(link.label)
    );
  }


  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-1 flex-col md:flex-row bg-white  w-full mx-auto border border-neutral-200  overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <Outlet />
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      to="/user"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black  rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black  whitespace-pre"
      >
        UBO - SPI
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      to="/admin"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black  rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

