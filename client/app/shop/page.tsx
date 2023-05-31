"use client";
import { CarItems } from "@/components/CarItems";
import { getCars } from "@/services/getCars";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Shop(){
    let currentPage = 1;
    const [carItems, setCarItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)

    useEffect(() => {
        const fetchCars = async () => {
          try {
            const cars = await getCars(currentPage);
            setCarItems(cars["cars"]);
          } catch (error) {
            console.error("Error fetching cars:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchCars();
        // getCars().then(setCarItems).finally
      }, []);

    function nextPage(event: any): void {
            const fetchCars = async () => {
              try {
                const cars = await getCars(page);
                if(cars["currentPage"] <= cars["totalPages"]){
                    // setCarItems([...cars["cars"]]);
                    console.log(cars["cars"])
                    console.log(carItems)
                    const newCarItems = [...carItems,...cars["cars"]]
                    setCarItems(newCarItems);
                    setPage(page+1)
                }
                return;
              } catch (error) {
                console.error("Error fetching cars:", error);
              } finally {
                setLoading(false);
              }
            };
        
            fetchCars();
    }

    return(<>
            <div className="container">
                <div className="search-field">
                    <input type="text" placeholder="Search..."/>
                    <div className="search-buttons">
                        <button className="filter-button">Фильтри</button>
                        <button className="search-button">Шукати</button>
                    </div>
                </div>
                <div className="grid">
                    {carItems.map((car: any)=>(
                        <div key={car._id} className="item">
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
                {/* {loading && <h2>Loading... {String(loading)}</h2>} */}
                {/* {loading ? <h2>Loading... {String(loading)}</h2> : <CarItems cars={carItems}/>} */}
                {/* <CarItems cars={carItems}/> */}
                <button onClick={nextPage}>Download more</button>
            </div>
</>)}