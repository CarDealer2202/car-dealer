"use client";
import Link from "next/link"

type Cars = {
    cars: any[]
}

const CarItems = ({cars}: any) =>{
    console.log(cars)
    return(
        <div className="grid">
            <h1>Aboba</h1>
                        {cars.map((car: any)=>(
                            <div className="item">
                                <div className="item-image">
                                <img src="https://s3.us-east-2.amazonaws.com/dealer-inspire-vps-vehicle-images/39a7-110009639/thumbnails/large/19XFL2H80PE015266/1d878e5c02bbc7afefffe5f5581dec20.jpg" alt="Car Image"/>
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
    )
}
export {CarItems}