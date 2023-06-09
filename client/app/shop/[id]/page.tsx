'use client';

import { type } from "os";
import { useEffect, useState } from "react";
import style from './page.module.css'
import Image from "next/image";

async function getCar(id : string) {
    const cars = await fetch(`http://localhost:8080/cars/${id}`)
    return cars.json();
    
}

type Props = {
    params:{
        id : string,
    }
}
type Car ={
    _id: string;
    brand: string;
    model: string;
    img: string;
    color: string[];
    desc: string;
    type: string;
    horsepower: number;
    max_speed: number;
    acceleration_to_100: number;
    price: number;
}


export default function Car({params: {id} }: Props){
    const [car, setCar] = useState<Car>()
    const [selectedColor, setSelectedColor] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    useEffect(()=>{
        const fetchCar =async () => {
            const cars = await fetch(`http://localhost:8080/cars/${id}`)
            const json = await cars.json();
            console.log(json)
            setCar(json)
        }
        fetchCar()
        },[])
    const handleClick = ()=>{
        if (selectedColor) {
            const cartItems = localStorage.getItem('cartItems')
            if (cartItems) {
                let itemsArray = JSON.parse(cartItems)
                if (car) {
                    const newCar = {carId: car._id, price:car.price, image: car.img, name:`${car.brand} ${car.model}`, color:selectedColor}
                    itemsArray.push(newCar)
                    localStorage.setItem('cartItems', JSON.stringify(itemsArray))
                    window.dispatchEvent(new Event("storage"));
                    return;
                }
            }
            if (car) {
                const newCar = {carId: car._id, price:car.price, image: car.img, name:`${car.brand} ${car.model}`, color:selectedColor}
                localStorage.setItem('cartItems', JSON.stringify([newCar]))
                window.dispatchEvent(new Event("storage"));
            }
        }
        else{
            setShowMessage(true)
            setTimeout(()=>setShowMessage(false),3000)
        }
    }
    return <>
        <div className="car-page">
            {car && <>
            <div className="car-top">
                <div className="car-image">
                    <Image width={100} height={100} src={car.img} alt="Car Image"/>
                </div>
                <div className="car-info">
                    <h2>{car.brand} {car.model}</h2>
                    <p>Available Colors:</p>
                    <div className={style["color-options"]}>
                        {car.color.map((color:any, index: number)=>(
                            <div onClick={() => setSelectedColor(color)} className={`${style[`${color}`]}  ${style[`color-option`]} ${selectedColor === color ? style['selected'] : ''}`} ></div>
                        ))}
                    </div>
                    <p>Horsepower: {car.horsepower} HP</p>
                    <p>Max Speed: {car.max_speed} km/h</p>
                    <p>0-100 km/h: {car.acceleration_to_100} seconds</p>
                    <button onClick={handleClick} className="order-button">Order</button>
                </div>
            </div>
            <div className="description">{car.desc}</div>
            </>}
        </div>
        {showMessage && 
        <div className={style["message-popup"]}>
            <p>Виберіть колір, будь ласка</p>
        </div>}
    </>
}