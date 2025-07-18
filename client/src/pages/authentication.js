import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Authentication() {

    const [userRegister, setUserRegister] = useState({});
    const [userLogin, setUserLogin] = useState({});
    const navigate = useNavigate();
    const [page, setPage] = useState('register');

    function onChangeForRegister(e) {
        setUserRegister({
            ...userRegister,
            [e.target.name]: e.target.value
        });
    }

    function onChangeForLogin(e){
        setUserLogin({
            ...userLogin,
            [e.target.name]:e.target.value
        });
    }
    const registerUrl = 'http://localhost:5000/authentication/register';
    const loginUrl = 'http://localhost:5000/authentication/login';
    const [logout,setLogout] = useState(true);
    // useEffect(()=>{
    //     async function checkAuth(){
    //         try{
    //             const res = await axios.get('http://localhost:5000/check-auth', {
    //                 withCredentials: true
    //             });
    //             if(res.status === 200) {
    //                 setLogout(false);
    //                 navigate('/todolist');
    //             }else{
    //                 console.log("User not authenticated");
    //             }
    //         }catch(err){
    //             console.log("Error checking authentication:", err);
    //         }
    //     }
    //     checkAuth();
    // }, [navigate]);
    
  return (
    <div>
        <div className='space-x-5 bg-black text-white p-5'>
        <button onClick={() =>{
            setPage('register');
        }}>Register</button>
        <button onClick={() =>{
            setPage('login');
        }}>Login</button>
        </div>
        {page === 'register' ?
        <div className='register'>
        <h1>Authentication Page</h1>
        <p>This page will handle user authentication, such as login and registration.</p>
        <form onSubmit = {async (e)=>{
            e.preventDefault();
            if(!userRegister || !userRegister.name || !userRegister.email || !userRegister.password) {
                alert("Please fill in all fields.");
                return;
            }
            try{
                await axios.post(registerUrl,userRegister,{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                alert("User registered successfully!");
                setPage('login');
            }
            catch(err){
                console.log(err);
                alert("Error registering user. Please try again.");
            }
            
        }}>
        <input type="text"
        onChange={onChangeForRegister} name="name" placeholder="Name" required />
        <input type="email"
        onChange={onChangeForRegister} name="email" placeholder="Email" required />
        <input type="password"
        onChange={onChangeForRegister} name="password" placeholder="Password" required />
        <button type="submit">Register</button>
        </form>
        </div>
        :
        <div className='login'>
            <form onSubmit={async (e)=>{
                e.preventDefault();
                if(!userLogin || !userLogin.email || !userLogin.password) {
                alert("Please fill in all fields.");
                return;
            }
            try{
                await axios.post(loginUrl, userLogin, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                console.log(userLogin);
                alert("Login successful!");
                navigate('/todolist');
            }
            catch(err){
                console.log(err);
                alert("Error logging in. Please try again.");
            }   
            }}>
                <input type='email' name='email' placeholder='Email' onChange={onChangeForLogin} required />
                <input type='password' name='password' placeholder='Password' onChange={onChangeForLogin} required />
                <button type='submit'>Login</button>
            </form>
        </div>
        }
        <div>
         <p className="text-center text-gray-500">
                This is a simple authentication if you want to logout press the buton
                Below.
              </p>
              <button
                className="bg-blue-800 mt-10 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={async () => {
                  try {
                    const res = await axios.get(
                      "http://localhost:5000/authentication/logout",
                      { withCredentials: true }
                    );
                    if(res.status === 200) {
                      console.log("User logged out successfully");
                      navigate("/authentication");
                    }
                  }catch(err){
                      console.error("Error logging out:", err);
                    }
                  }}
                  >Logout</button>
            </div>
    </div>
  )
}
