function Categories(){

const services = [
"Electrician",
"Plumber",
"AC Repair",
"Beautician",
"Tutor"
]

return(

<div>

<h2>Service Categories</h2>

<div className="grid">

{services.map((service,index)=>(
<div className="card" key={index}>
{service}
</div>
))}

</div>

</div>

)

}

export default Categories;