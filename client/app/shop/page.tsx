"use client";
import { CarItems } from "@/components/CarItems";
import { getCars } from "@/services/getCars";
import Link from "next/link";
import ReactSlider from 'react-slider'
import "rc-slider/assets/index.css";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from './page.module.css'

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
price?: number[];
sort?: string;
sortType?: string;
}
// type BrandOptions = [{}]  

export default function Shop(){
    const options = ["Ім'я", "Ціна(Зростання)", "Ціна(Спадання)"];
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
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

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
            result['cars'].map((car:any)=>{
                console.log(car.img)
            })
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
        setPage(1)
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
        setPage(1)
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
        let newValue = 0;
        const Value = Number(value)
        if(index == 0){
            if (Value<priceBounds.minPrice) {
                updatedSliderValue[index] = Number(Math.floor(priceBounds.minPrice));
            }else
            if (Value>sliderValue[1]) {
                updatedSliderValue[1] = Value+10
                updatedSliderValue[0] = Value
            }else
            if (Value>priceBounds.maxPrice) {
                updatedSliderValue[1] = Number(Math.floor(priceBounds.maxPrice))
                updatedSliderValue[0] = Number(Math.floor(priceBounds.maxPrice))-10
            }else{
                updatedSliderValue[index] = Value
            }
        }
        if(index == 1){
            if (Value<priceBounds.minPrice) {
                updatedSliderValue[1] = Number(Math.floor(priceBounds.minPrice))+10
                updatedSliderValue[0] = Number(Math.floor(priceBounds.minPrice))
            }else
            if (Value<sliderValue[0]) {
                updatedSliderValue[1] = Value
                updatedSliderValue[0] = Value-10
            }else
            if (Value>priceBounds.maxPrice) {
                updatedSliderValue[index] = Number(Math.floor(priceBounds.maxPrice));
            }else{
                updatedSliderValue[index] = Value
            }
        }
        // updatedSliderValue[index] = Number(value)
        setSliderValue(updatedSliderValue);
        const updatedFilter = {... filter}
        updatedFilter.price=updatedSliderValue
        setPage(1)
        setFilter(updatedFilter)
      };
    const updateSliderFilter = (value:any)=>{
        const updatedFilter = {... filter}
        updatedFilter.price=sliderValue
        setPage(1)
        setFilter(updatedFilter)
        console.log(selectedOptionIndex)
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
            setPage(1)
            setFilter(updatedFilter)
        }
      };

      const handleSelectChange = (event: any) => {
        const selectedIndex = event.target.selectedIndex;
        setSelectedOptionIndex(parseInt(selectedIndex));
        const currentFilter = { ...filter }
        switch (parseInt(selectedIndex)) {
            case 0:
                currentFilter.sort = "brand"
            break;
            case 1:
                currentFilter.sort = "price"
                currentFilter.sortType = "asc"
            break;
            case 2:
                currentFilter.sort = "price"
                currentFilter.sortType = "desc"
            break;
        }
        setPage(1)
        setFilter(currentFilter)
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
                            <input defaultValue={Math.floor(priceBounds.minPrice)}  onChange={(event) => handleTextboxChange(event, 0)} className="priceTexbox" type="text" name="minPrice" value={sliderValue[0]}/>
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
                <div className={styles.sort}>
                    <div className={styles.dropdown}>
                        <label htmlFor="sort-select">Сортувати за:</label>
                        <select value={selectedOptionIndex} onChange={handleSelectChange} id="sort-select">
                        {options.map((option, index) => (
                            <option key={index} value={index}>{option}</option>
                        ))}
                        </select>
                    </div>
                </div>
                <div className="grid">
                    {carItems.map((car: any)=>(
                        <div key={car._id} className="item">
                            <div className="item-image">
                            <Image width={100} height={100} src={`${car.img}`} alt="Car Image"/>
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
                <button onClick={nextPage} className="uploadButton">Загрузити ще</button>
            </div>
</>)}