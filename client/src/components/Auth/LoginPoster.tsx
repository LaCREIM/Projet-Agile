import ubo from "/ubo-loc.jpg";

const LoginPoster = () => {
  return (
    <div
      className="h-full w-full rounded-e-2xl bg-neutral-950 relative flex flex-col items-center justify-center antialiased bg-cover bg-center"
      style={{
        backgroundImage: `url(${ubo})`,
      }}
    >
      {/* Additional content can go here */}
    </div>
  );
};

export default LoginPoster;
