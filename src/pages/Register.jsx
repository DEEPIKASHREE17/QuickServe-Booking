import { useNavigate } from "react-router-dom";

function Register(){

const navigate = useNavigate();

const handleSubmit = (e) =>{
e.preventDefault();
alert("Registration Successful");
navigate("/");
}

return(

<div className="container">

<h2>Register</h2>

<form onSubmit={handleSubmit}>

<input placeholder="Full Name" required />
<input placeholder="Email" required />
<input placeholder="Phone Number" required />
<input placeholder="Location" required />
<input type="password" placeholder="Password" required />

<button>Register</button>

</form>

</div>

)

}

export default Register;