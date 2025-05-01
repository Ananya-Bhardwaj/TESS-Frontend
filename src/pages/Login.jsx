import { useEffect, useState } from "react";
import axios from 'axios'; 
import { useAuth } from "../providers/AuthProvider";
import { replace, useNavigate } from "react-router-dom";
import { fetchInstitutions } from "../data";

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institute, setInstitute] = useState("");
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetchInstitutions();
            setInstitutions(response); // Assuming the response contains the institutions data
        } catch (error) {
            console.error("Error fetching institutions:", error);
        }
    };
    fetchData();
  }, []);

//   const { setToken} = useAuth(); 
  const navigate = useNavigate();

  const { user, login } = useAuth();

  const handleSubmit = async(e) => {
    e.preventDefault(); 
    try{
        if (state==="login"){
            //send email, password to backend for auth
            let response = await axios.post("http://localhost:5000/api/users/login", 
                {
                    "email": email, 
                    "password": password
                }
            )
    
            login(response.data.accessToken)
            
            setTimeout(() => {
                if (user["role"]==="Faculty"){
                    navigate('/upload-paper', {replace: true})
                }
                else if (user["role"]==="Authority"){
                    navigate('/exam-dashboard', {replace: true})
                }
                else if (user["role"]==="Admin"){
                    navigate('/admin', {replace: true})
                }
            }, 1500)
                
        }
        else{
            //send name, email, password

            let response = await axios.post("http://localhost:5000/api/users/register", 
                {
                    "email": email, 
                    "password": password, 
                    "institution": "Indira Gandhi Delhi Technical University for Women", 
                    "name": name
                }
            )
            
            if (response.statusText==="CREATED"){
                setState("login"); 
            }
        }
    }
    catch(err){
        console.error(err); 
    }

  }

  return (
      <form className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white mt-16">
          <p className="text-2xl font-medium m-auto">
              <span className="text-indigo-500">User</span> {state === "login" ? "Login" : "Sign Up"}
          </p>
          {state === "register" && (
            <>
              <div className="w-full">
                  <p>Name</p>
                  <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Your Name" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="text" required />
              </div>

              <div className="w-full">
                <label
                htmlFor="institution"
                >
                Institute
                </label>
                <select
                id="institution"
                name="institution"
                value={institute}
                onChange={(e => setInstitute(e.target.value))}
                className="w-full border border-gray-200 cursor-pointer rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                <option value="">Select Institute</option>
                {institutions.map((curr_inst) => (
                    <option key={curr_inst.name} value={curr_inst.name}>
                    {curr_inst.name}
                    </option>
                ))}
                </select>
            </div>
              
            </>
              
          )}
          <div className="w-full ">
              <p>Email</p>
              <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Your Email" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="email" required />
          </div>
          <div className="w-full ">
              <p>Password</p>
              <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter a password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="password" required />
          </div>
          {state === "register" ? (
              <p>
                  Already have account? <span onClick={() => setState("login")} className="text-indigo-500 cursor-pointer">Login</span>
              </p>
          ) : (
              <p>
                  Create an account? <span onClick={() => setState("register")} className="text-indigo-500 cursor-pointer">Register</span>
              </p>
          )}
          <button 
          className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer" 
          onClick={handleSubmit}
          >
              {state === "register" ? "Create Account" : "Login"}
          </button>
          
      </form>
  );
};

export default Login