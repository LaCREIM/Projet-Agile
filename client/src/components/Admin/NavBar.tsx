import ubo from "/ubo.png";
import {FiLogOut} from "react-icons/fi";
import {useNavigate} from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("role");
        navigate("/");
    };

    return (
        <div className="navbar bg-base-100 rounded-b-md shadow-md px-[2%] flex justify-between flex-row">
            <img src={ubo} className="w-20" alt="ubo-logo"/>
            <a
                className="navbar-end text-xl hover:cursor-pointer hover:bg-gray-100 btn bg-white w-fit p-2 rounded-full"
                onClick={handleLogout}
            >
                <FiLogOut size={28}/>
            </a>
        </div>
    );
};

export default NavBar;