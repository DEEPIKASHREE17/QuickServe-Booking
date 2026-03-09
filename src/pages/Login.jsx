import { useNavigate } from "react-router-dom";

function Login(){

const navigate = useNavigate();

const handleLogin = (e)=>{
e.preventDefault();
navigate("/dashboard");
}

return(

<div className="container">

<h2>Login</h2>

<form onSubmit={handleLogin}>

<input placeholder="Email" required />
<input type="password" placeholder="Password" required />

<button>Login</button>

</form>

<p onClick={()=>navigate("/register")}>Create Account</p>

</div>

)

}

export default Login;