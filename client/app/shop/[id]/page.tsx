
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
                    <img src="https://gumlet.assettype.com/afkgaming/2022-02/e063c290-ee60-4c95-b732-82972cbf3298/Untitled_design__63___1_.jpg?w=411&format=webp&compress=true" alt="Car Image"/>
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