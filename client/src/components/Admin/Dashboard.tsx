import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineTeam } from "react-icons/ai";
import { LuSchool } from "react-icons/lu";
import { IoSchool } from "react-icons/io5";
import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import ubo from "/ubo.png";

export function Dashboard() {
  const links = [
    {
      label: "Gestion enseignants",
      href: "/admin/home/enseignants",
      icon: (
        <AiOutlineTeam className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Gestion promotions",
      href: "/admin/home/promotions",
      icon: (
        <LuSchool className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Gestion étudiants",
      href: "/admin/home/etudiants",
      icon: (
        <IoSchool className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "/",
      icon: (
        <FiLogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "pose1don",
      href: "#",
      icon: (
        <img
          src={ubo}
          className="h-7 w-7 flex-shrink-0 rounded-full"
          width={50}
          height={50}
          alt="Avatar"
        />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-1 flex-col md:flex-row bg-white dark:bg-neutral-800 w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
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
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        AT-MF
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// const Dashboard = () => {
//   return (
//     <div className="flex flex-1">
//       <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
//         <div className="flex gap-2">
//           {[...new Array(4)].map((i) => (
//             <div
//               key={"first-array" + i}
//               className="h-20 w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
//             ></div>
//           ))}
//         </div>
//         <div className="flex gap-2 flex-1">
//           {[...new Array(2)].map((i) => (
//             <div
//               key={"second-array" + i}
//               className="h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
//             ></div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
