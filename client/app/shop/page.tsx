"use client";
import { CarItems } from "@/components/CarItems";
import { getCars } from "@/services/getCars";
import Link from "next/link";
import ReactSlider from 'react-slider'
import "rc-slider/assets/index.css";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';

type CheckboxOptions = {
    [key: string]: boolean;
}
type TypesState = {
    [id: string]: {
      name: string;
      checked: boolean;
    };
  };
type Filter = {
brand?: string[];
search?: string;
type?: string[];
price?: [minPrice:number,maxPrice:number];
}
// type BrandOptions = [{}]  

export default function Shop(){
    const [carItems, setCarItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [isFilterOpened, setIsFilterOpened] = useState(false)
    const [allCars, setAllCars] = useState<any[]>([])
    const [allBrands, setAllBrands] = useState<any[]>([])
    const [allTypes, setAllTypes] = useState<any[]>([])
    const [priceBounds, setPriceBounds] = useState<{minPrice:any,maxPrice:any}>({minPrice:0,maxPrice:1})
    const [sliderValue, setSliderValue] = useState<number[]>([])
    const [brandsState, setBrandsState] = useState<CheckboxOptions>({})
    const [typesState, setTypesState] = useState<TypesState>({})
    const [selectedBrands, setSelectedBrands] = useState<string[]>([])
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])
    const [filter, setFilter] = useState<Filter>({})

    const handleSliderChange = (event:any) => {
        console.log(event.target)
        // setSliderValue(Math.floor(event.target.value));
      };


    useEffect(() => {
        const fetchCars = async () => {
          try {
            const cars = await fetch(`http://localhost:8080/cars?limit=10000`)
            const result = await cars.json();
            const prices = result["cars"].map((car:any) => car.price);
            const maxPrice = Math.max(...prices);
            const minPrice = Math.min(...prices);
            setPriceBounds({maxPrice:maxPrice,minPrice:minPrice})
            setAllCars(result["cars"]);
          } catch (error) {
            console.error("Error fetching cars:", error);
          }
        };
    
        fetchCars();
      }, []);

      useEffect(() => {
        const fetchCars = async () => {
          try {
            const cars = await fetch(`http://localhost:8080/types`)
            const result = await cars.json();
            setAllTypes(result);
          } catch (error) {
            console.error("Error fetching cars:", error);
          }
        };
    
        fetchCars();
      }, []);

      let getAllBrands = () => {
        // const uniqueBrands = [...new Set(allCars.map(item => item.brand))];
        console.log(allCars)
        const uniqueBrands = allCars.filter((item, index, self) => self.findIndex(obj => obj.brand === item.brand) === index)
                                  .map(item => item.brand);
        console.log(uniqueBrands)
      };

    useEffect(() => {
        const fetchCars = async () => {
          try {
            const cars = await getCars(page);
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
    
      useEffect(() => {
        let uniqueBrands: string[] = [];
        if (allCars.length > 0) {
          uniqueBrands = allCars
            .filter(
              (item, index, self) =>
                self.findIndex((obj) => obj.brand === item.brand) === index
            )
            .map((item) => item.brand);
        }
        const selectedBrand = uniqueBrands.reduce((acc: any, key: string) => {
            acc[key] = false;
            return acc;
          }, {});
        
        setBrandsState(selectedBrand)
        setAllBrands(uniqueBrands);
      }, [allCars]);

      const handleBrandChange = (event: any) => {
        const { name, checked } = event.target;
        setBrandsState((prevOptions) => ({
          ...prevOptions,   
          [name]: checked,
        }));
        
      };


      useEffect(() => {
        const res = Object.keys(brandsState).filter((brand) => brandsState[brand]);
        setSelectedBrands(res);
        const updatedFilter = {... filter}
        updatedFilter.brand=res
        setFilter(updatedFilter)
        // const fetchCars = async () => {
        //     try {
        //       const cars = await getCars(page, filter);
        //       setCarItems(cars["cars"]);
        //     } catch (error) {
        //       console.error("Error fetching cars:", error);
        //     } finally {
        //       setLoading(false);
        //     }
        //   };
      
        // fetchCars();
      }, [brandsState]);

      const handleTypeChange = (event: any) => {
        const { name, checked } = event.target;
        const id = event.target.getAttribute('data-id');
        setTypesState((prevOptions) => ({
          ...prevOptions,   
          [id]: {name, checked},
        }));
        
      };

      useEffect(() => {
        console.log(typesState)
        const res = Object.keys(typesState).filter((type) => typesState[type].checked);
        setSelectedTypes(res)
        const updatedFilter = {... filter}
        updatedFilter.type=res
        setFilter(updatedFilter)
        // const fetchCars = async () => {
        //     try {
        //       const cars = await getCars(page, filter);
        //       setCarItems(cars["cars"]);
        //     } catch (error) {
        //       console.error("Error fetching cars:", error);
        //     } finally {
        //       setLoading(false);
        //     }
        //   };
      
        // fetchCars();
      }, [typesState]);

    function nextPage(event: any): void {
            const fetchCars = async () => {
              try {
                const cars = await getCars(page+1, filter);
                console.log(cars["cars"])
                if(cars["currentPage"] <= cars["totalPages"]){
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

    const handleTextboxChange = (event:any, index:any) => {
        const { value } = event.target;
        const updatedSliderValue = [...sliderValue];
        updatedSliderValue[index] = Number(value);
        setSliderValue(updatedSliderValue);
      };
    const updateSliderFilter = (value:any)=>{
        const updatedFilter = {... filter}
        updatedFilter.price=value
        setFilter(updatedFilter)
        // const fetchCars = async () => {
        //     try {
        //       const cars = await getCars(page, filter);
        //       setCarItems(cars["cars"]);
        //     } catch (error) {
        //       console.error("Error fetching cars:", error);
        //     } finally {
        //       setLoading(false);
        //     }
        //   };
      
        // fetchCars();
    }
    useEffect(() => {
        
        const fetchCars = async () => {
            try {
                const cars = await getCars(page, filter);
                setCarItems(cars["cars"]);
            } catch (error) {
                console.error("Error fetching cars:", error);
            } finally {
                setLoading(false);
            }
            };
            
            fetchCars();
      }, [filter]);

      const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            const value = event.currentTarget.value;
            const updatedFilter = {... filter}
            updatedFilter.search = value
            setFilter(updatedFilter)
        }
      };

    return(<>
            <div className="container">
                <div className="search-field">
                    <input type="text" onKeyDown={handleSearch} placeholder="Search..."/>
                    <div className="search-buttons">
                        <button onClick={()=>setIsFilterOpened(!isFilterOpened)} className="filter-button">Фильтри</button>
                        <button className="search-button">Шукати</button>
                    </div>
                </div>
                {isFilterOpened && 
                    <div className="filter-options">
                        <div className="filter-column">
                        <h3>Brand</h3>
                        {allBrands.map((brand:any)=>(
                            <label><input name={brand} checked={brandsState[`{${brand}}`]} onChange={handleBrandChange} type="checkbox"/> {brand}</label>
                        ))}
                        </div>
                        <div className="filter-column">
                        <h3>Type</h3>
                        {allTypes.map((type:any)=>{
                            return(
                                <label key={type._id}><input data-id={type._id} name={type.name} checked={(typesState[type._id]?.checked as boolean) || false} onChange={handleTypeChange} type="checkbox"/> {type.name}</label>
                            )
                        })}
                        </div>
                        <div className="filter-column">
                        <h3>Price Range</h3>
                        <div className="slider-field">
                            <input defaultValue={Math.floor(priceBounds.minPrice)} onChange={(event) => handleTextboxChange(event, 0)} className="priceTexbox" type="text" name="minPrice" value={sliderValue[0]}/>
                            <ReactSlider
                            className="horizontal-slider"
                            thumbClassName="example-thumb"
                            trackClassName="example-track"
                            renderThumb={(props, state) => <div {...props}>‎</div>}
                            min={Math.floor(priceBounds.minPrice)}
                            max={Math.floor(priceBounds.maxPrice)}
                            defaultValue={[0, Math.floor(priceBounds.maxPrice)]}
                            onChange={value=>{setSliderValue(value)}}
                            onAfterChange={value=>updateSliderFilter(value)}
                            value={sliderValue}
                            pearling
                            minDistance={10}
                            />
                            <input defaultValue={Math.floor(priceBounds.maxPrice)} onChange={(event) => handleTextboxChange(event, 1)} className="priceTexbox" type="text" name="maxPrice" value={sliderValue[1]}/>
                        </div>
                        </div>
                        <hr />
                  </div>
                }
                <div className="grid">
                    {carItems.map((car: any)=>(
                        <div key={car._id} className="item">
                            <div className="item-image">
                            <img src="https://s3.us-east-2.amazonaws.com/dealer-inspire-vps-vehicle-images/39a7-110009639/thumbnails/large/19XFL2H80PE015266/1d878e5c02bbc7afefffe5f5581dec20.jpg" alt="Car Image"/>
                            </div>
                            <div className="item-info">
                            <Link href={`/shop/${car._id}`}>{car.brand} {car.model}</Link>
                            <p>{Math.floor(car.price)}$</p>
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
                <button onClick={nextPage} className="uploadButton">Загрузити ще</button>
            </div>
</>)}