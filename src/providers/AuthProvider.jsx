// import { createContext, useState } from "react";

// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//     const [auth, setAuth] = useState({});

//     return (
//         <AuthContext.Provider value={{ auth, setAuth }}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

// export default AuthContext;


// import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
// import axios from "axios";

// const AuthContext = createContext(undefined);

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (context === undefined) {
//         throw new Error("useAuth must be used within an AuthProvider");
//     }
//     return context; 
// }

// const AuthProvider = ({ children }) => {
//     const [token, setToken] = useState(); 

//     useEffect(() => {
//         const fetchMe = async () => {
//             try {
//                 const response = await axios.get("http://localhost:5000/api/users/me"); 
//                 setToken(response.data.accessToken);
//             }catch (error) {
//                 console.error("Error fetching user data:", error);
//                 setToken(null); // Set token to null if there's an error
//             }
    
//         }; 

//         fetchMe(); 
//     }, []); 

// useLayoutEffect(() => {
//     const authInterceptor = axios.interceptors.request.use((config) => {
//         config.headers.Authorization = !config_retry && token ? `Bearer ${token}` : config.headers.Authorization;
//         return config;
//     }); 

//     return () => {
//         axios.interceptors.request.eject(authInterceptor); 
//     };
// }, [token]);

// }


import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check localStorage for token on load
  useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          axios.get('http://localhost:5000/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(response => {
            setUser(response.data);
          })
          .catch(err => {
            console.error('Error fetching user data', err);
            setUser(null);
          });
        }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    if (token) {
        axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          setUser(response.data);
        })
        .catch(err => {
          console.error('Error fetching user data', err);
          setUser(null);
        });
      }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
