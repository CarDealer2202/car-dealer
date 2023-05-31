import Link from "next/link";

async function getCars() {
    const cars = await fetch("http://localhost:8080/cars?page=3")
    return cars.json();
    
}
export default async function Shop(){
    const cars = await getCars()
    // const cars = {cars:[]}
    console.log(cars)
    return(
        <>
        
            <div className="container">
                <div className="search-field">
                    <input type="text" placeholder="Search..."/>
                    <div className="search-buttons">
                        <button className="filter-button">Фильтри</button>
                        <button className="search-button">Шукати</button>
                    </div>
                </div>
                <div className="grid">
                        {cars["cars"].map((car: any)=>(
                            <div className="item">
                                <div className="item-image">
                                <img src="https://gumlet.assettype.com/afkgaming/2022-02/e063c290-ee60-4c95-b732-82972cbf3298/Untitled_design__63___1_.jpg?w=411&format=webp&compress=true" alt="Car Image"/>
                                </div>
                                <div className="item-info">
                                <Link href={`/shop/${car._id}`}>{car.brand} {car.model}</Link>
                                <p>{car.price}</p>
                                <p>{car.horsepower}</p>
                                <p>{car.max_speed}</p>
                                <p>0-100 km/h: {car.acceleration_to_100} seconds</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    )
}
{/* <li key={car._id}>{car.brand} {car.model}</li> */}