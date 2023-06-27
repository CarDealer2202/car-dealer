"use client";
import Link from "next/link";
import "rc-slider/assets/index.css";
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import styles from './page.module.css'
import { updateTokens } from "@/services/updateToken";
import { useRouter } from 'next/navigation';


export default function Shop(){
    const [carItems, setCarItems] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [allCars, setAllCars] = useState<any[]>([])
    const [isLogined, setIsLogined] = useState(false)
    const [favouriteCars, setFavouriteCars] = useState<string[]>([])
    const [favouriteCarsList, setFavouriteCarsList] = useState<{}[]>([])
    const router = useRouter();

    useEffect(() => {
        const fetchCars = async () => {
          try {
            const cars = await fetch(`http://localhost:8080/cars?limit=10000`)
            const result = await cars.json();
            updateTokens()
            const accessToken = localStorage.getItem('accessToken')
            const responce = await fetch(`http://localhost:8080/users`,{
                method:'GET',
                headers: { 'Content-Type': 'application/json',"Authorization": `Bearer ${accessToken}` }})
                const json = await responce.json()
                const favouterCarIds = json.favorites.map((car:any) => car._id);  
                console.log(result["cars"])
                const updatedCars = result["cars"].filter((car: any) => {
                    if (favouterCarIds.includes(car._id)) {
                        car.isChecked = true;
                        return car;
                    }
                  });
                console.log("zxczxc")
            console.log(updatedCars)
            setCarItems(updatedCars)
            setAllCars(updatedCars);
          } catch (error) {
            console.error("Error fetching cars:", error);
          }
        };
    
        fetchCars()

        const user = localStorage.getItem('user')
        if (!user) {
            router.back()
        }
        const handleStorageChange = (event: StorageEvent) => {
            const user = localStorage.getItem('user')
            if (!user) {
                router.back()
            }
        }
        window.addEventListener('storage', handleStorageChange);
      }, []);

      const addToFavorites = (id:string)=>{
        const fetchAddFavouriteCar =async () => {
            updateTokens()
            const accessToken = localStorage.getItem('accessToken')
            const responce = await fetch(`http://localhost:8080/users`,{
                method:'PATCH',
                headers: { 'Content-Type': 'application/json',"Authorization": `Bearer ${accessToken}` },
                body: JSON.stringify({carId:id})})
            console.log()
            const json = await responce.json();
            const newFavorites = json.favorites.map((car:any) => car._id);
            setFavouriteCars(newFavorites)
        }
        fetchAddFavouriteCar();
      }

    useEffect(()=>{
        const fetchCars = async () => {
            try {
              const cars = await fetch(`http://localhost:8080/cars?limit=10000`)
              const result = await cars.json();
              updateTokens()
              const accessToken = localStorage.getItem('accessToken')
              const responce = await fetch(`http://localhost:8080/users`,{
                  method:'GET',
                  headers: { 'Content-Type': 'application/json',"Authorization": `Bearer ${accessToken}` }})
                  const json = await responce.json()
                  const favouterCarIds = json.favorites.map((car:any) => car._id);  
                  console.log(result["cars"])
                  const updatedCars = result["cars"].filter((car: any) => {
                      if (favouterCarIds.includes(car._id)) {
                          car.isChecked = true;
                          return car;
                      }
                    });
                  console.log("zxczxc")
              console.log(updatedCars)
              setCarItems(updatedCars)
              setAllCars(updatedCars);
            } catch (error) {
              console.error("Error fetching cars:", error);
            }
          };
      
          fetchCars()
    },[favouriteCars])  

    return(<>
            <div className="container">
                <div className="grid">
                    {carItems.map((car: any)=>(
                        <div key={car._id} className={styles["item"]}>
                            <div className={styles.main}>
                                <div className={styles["item-image"]}>
                                    <Image width={100} height={100} src={`${car.img}`} alt="Car Image"/>
                                </div>
                                <div className={styles["item-info"]}>
                                    <Link href={`/shop/${car._id}`}>{car.brand} {car.model}</Link>
                                    <p>{Math.floor(car.price)}$</p>
                                    <p>{car.horsepower}</p>
                                    <p>{car.max_speed}</p>
                                    <p>0-100 km/h: {car.acceleration_to_100} seconds</p>
                                </div>
                            </div>
                            <div className={styles.addFav}>
                                <button onClick={() => addToFavorites(car._id)} className={`${car.isChecked ? styles.favButtonGreen : styles.favButtonRed}`}>{car.isChecked ? "У 'Списку бажань'" : "Додати до 'Списку бажань'"}</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
</>)}