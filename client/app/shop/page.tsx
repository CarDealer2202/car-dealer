async function getCars() {
    const cars = await fetch("http://localhost:8080/cars")
    return cars.json();
    
}
export default async function Shop(){
    const cars = await getCars()
    // const cars = {cars:[]}
    return(
        <>
        
        </>
    )
}
{/* <li key={car._id}>{car.brand} {car.model}</li> */}