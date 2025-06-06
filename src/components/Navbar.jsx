import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const { user, logout } = useAuth(); 

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <a href="#">
        <p className="h-9">TESS</p>
      </a>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <Link to="/">Home</Link>
        {/* <Link to="/">About Us</Link>
        <Link to="/">Contact Us</Link> */}

        {user?
          (
            <button 
            className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
            onClick={logout}
            >
              Logout
            </button>
          ):(
              <Link to='/login'>
              <button 
              className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
              >
                Login
              </button>
            </Link>
          ) 
        }

        
      </div>

      <button
        onClick={() => (open ? setOpen(false) : setOpen(true))}
        aria-label="Menu"
        className="sm:hidden"
      >
        {/* Menu Icon SVG */}
        <svg
          width="21"
          height="15"
          viewBox="0 0 21 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="21" height="1.5" rx=".75" fill="#426287" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}
      >
        <Link to="/" className="block">
          Home
        </Link>
        <Link to="/" className="block">
          About Us
        </Link>
        <Link to="/" className="block">
          Contact Us
        </Link>
        <button className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
