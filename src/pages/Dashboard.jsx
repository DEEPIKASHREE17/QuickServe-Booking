import { useNavigate } from "react-router-dom";

function Dashboard(){

const navigate = useNavigate();

return(

<div>

<h1>Welcome to QuickServe</h1>

<button onClick={()=>navigate("/profile")}>Profile</button>

<button onClick={()=>navigate("/categories")}>
Browse Services
</button>

<button onClick={()=>navigate("/providers")}>
Find Providers
</button>

</div>

)

}

export default Dashboard;