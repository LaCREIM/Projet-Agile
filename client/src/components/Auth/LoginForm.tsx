import LoginInformation from "./LoginInformation";
import LoginPoster from "./LoginPoster";

const LoginForm = () => {
  return (

    <div className="h-sceen w-full bg-white bg-grid-black/[0.2] relative">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="grid grid-cols-2 h-screen">
        <LoginPoster />
        <div className="flex flex-col w-3/4 mx-auto items-center justify-center text-center py-[20%] h-full">
          <div className="w-full flex flex-col gap-10  ">
            <h1 className="text-4xl  font-semibold">Bienvenue ------- change me ----- !</h1>
            <LoginInformation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
