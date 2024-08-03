
const Searchbar = () => {
  return (
    <div className="flex items-center justify-center my-4 pe-20">
      <input
        type="search"
        placeholder="Search..."
        className="w-96  max-w-md px-4 py-2  rounded-lg placeholder:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Searchbar;
