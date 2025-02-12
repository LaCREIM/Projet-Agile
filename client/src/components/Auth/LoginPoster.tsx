import { BackgroundBeams } from "../ui/backgroud-beams";

const LoginPoster = () => {
  return (
    <div className="h-full w-full rounded-e-2xl bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-bold">
          SD-SPI
        </h1>
        <p className="text-neutral-400 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          SD-SPI permet aux professeurs de créer des évaluations pour recueillir
          les avis des étudiants sur les cours, TD et TP de chaque module.
        </p>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Offrez un retour constructif et contribuez à l'amélioration de la
          qualité de l'enseignement grâce à un système simple et intuitif.
        </p>
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default LoginPoster;
