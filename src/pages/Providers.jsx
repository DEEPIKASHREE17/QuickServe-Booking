function Providers(){

const providers = [

{
name:"Rahul",
service:"Electrician",
experience:"5 Years",
charge:"₹300",
availability:"Available",
rating:"4.5"
},

{
name:"Priya",
service:"Beautician",
experience:"3 Years",
charge:"₹500",
availability:"Available",
rating:"4.8"
}

]

return(

<div>

<h2>Service Providers</h2>

<table>

<thead>

<tr>
<th>Name</th>
<th>Service</th>
<th>Experience</th>
<th>Charge</th>
<th>Availability</th>
<th>Rating</th>
</tr>

</thead>

<tbody>

{providers.map((p,index)=>(

<tr key={index}>
<td>{p.name}</td>
<td>{p.service}</td>
<td>{p.experience}</td>
<td>{p.charge}</td>
<td>{p.availability}</td>
<td>{p.rating}</td>
</tr>

))}

</tbody>

</table>

</div>

)

}

export default Providers;