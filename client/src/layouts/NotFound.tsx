const NotFound = () => {
  document.title = "UBO | Not Found";
  return (
    <div className="grid h-screen place-content-center bg-white px-4">
      <h1 className="uppercase tracking-widest text-gray-500">
        404 | Not Found
      </h1>
    </div>
  );
};

export default NotFound;
