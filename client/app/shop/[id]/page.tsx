
async function getCar(id : string) {
    const cars = await fetch(`http://localhost:8080/cars/${id}`)
    return cars.json();
    
}

type Props = {
    params:{
        id : string,
    }
}


export default async function Car({params: {id} }: Props){
    const car = await getCar(id);
    return <>
        <div className="car-page">
            <div className="car-top">
                <div className="car-image">
                    <img src="https://s3.us-east-2.amazonaws.com/dealer-inspire-vps-vehicle-images/39a7-110009639/thumbnails/large/19XFL2H80PE015266/1d878e5c02bbc7afefffe5f5581dec20.jpg" alt="Car Image"/>
                </div>
                <div className="car-info">
                    <h2>{car.brand} {car.model}</h2>
                    <p>Available Colors:</p>
                    <div className="color-options">
                        <div className="color-option color-red" ></div>
                        <div className="color-option color-blue" ></div>
                        <div className="color-option color-gray" ></div>
                    </div>
                    <p>Horsepower: {car.horsepower} HP</p>
                    <p>Max Speed: {car.max_speed} km/h</p>
                    <p>0-100 km/h: {car.acceleration_to_100} seconds</p>
                    <button className="order-button">Order</button>
                </div>
            </div>
            <div className="description">{car.desc}</div>
        </div>
    </>
}