import {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useLoginMutation} from "../../features/ApiAthSlice";
import {setCredentials} from "../../features/UserSlice";
import {toast} from "react-toastify";

const LoginInformation = () => {
    const dispatch = useDispatch();
    const userRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const [info, setInfo] = useState({
        username: "",
        password: "",
        token: "",
    });

    const [login] = useLoginMutation();

    useEffect(() => {
        if (userRef.current) userRef.current.focus();
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const userData = await login({
            username: info.username,
            password: info.password,
        });

        if (userData.error != undefined) {
            toast.error(((userData.error as any).data.message));
            return;
        }

        localStorage.setItem('token', userData.data.token);
        localStorage.setItem('role', userData.data.role);
        localStorage.setItem('id', userData.data.id);

        dispatch(setCredentials(userData));
        setInfo({
            username: "",
            password: "",
            token: ""
        });

        if (userData.data.role === "ETU") navigate("/user/home/evaluations");
        else navigate("/user");
    };

    return (
        <form className="w-full space-y-3">
            <input
                autoComplete="false"
                ref={userRef}
                type="text"
                name="username"
                value={info.username}
                placeholder="Nom d'utilisateur"
                onChange={handleInputChange}
                className="input input-bordered w-[80%] focus:outline-none"
                required
            />

            <input
                type="password"
                name="password"
                value={info.password}
                onChange={handleInputChange}
                placeholder="Mot de Passe"
                className="input input-bordered w-[80%] focus:outline-none"
                required
            />

            <div className="w-full flex items-center">
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 hover:cursor-pointer disabled:cursor-not-allowed w-1/2 mt-[5%] text-center mx-auto rounded-md border border-black bg-white text-neutral-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                >
                    Connexion
                </button>
            </div>
        </form>
    );
};

export default LoginInformation;