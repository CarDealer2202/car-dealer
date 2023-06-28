'use client'
import { useEffect, useState } from 'react';
import styles from './page.module.css'
import { useRouter } from 'next/navigation';
import { updateTokens } from '@/services/updateToken';
import Image from 'next/image';

type Car ={
    carId: string;
    name: string;
    img: string;
    color: string;
    price: number;
}
interface UniqueObject {
    item: object;
    repetition: number;
  }
const Cart = () => {
  const [carItems, setCarItems] = useState<Car[] | undefined>([]);
  const [uniqueItems, setUniqueItems] = useState<UniqueObject[]| undefined>([]);
  const [fullPrice, setFullPrice] = useState(0);
  const [inputValues, setInputValues] = useState<number[]>([]);
  const router = useRouter();


  function countUniqueObjects(arr:[]): UniqueObject[] {
    const uniqueObjects : { [key: string]: UniqueObject } = {};
  
    arr.forEach((item) => {
      const serializedItem  = JSON.stringify(item);
  
      if (uniqueObjects.hasOwnProperty(serializedItem)) {
        uniqueObjects[serializedItem].repetition++;
      } else {
        uniqueObjects[serializedItem] = {
          item: item,
          repetition: 1,
        };
      }
    });
  
    const uniqueArray = Object.values(uniqueObjects);
  
    return uniqueArray;
  }
  
  useEffect(()=>{
    const cartItemsString = localStorage.getItem('cartItems')
        if (cartItemsString) {
            const cartItems = JSON.parse(cartItemsString)
            console.log("AAAAA",countUniqueObjects(cartItems))
            setUniqueItems(countUniqueObjects(cartItems))
            setCarItems(cartItems)
        }
    const handleStorageChange= (event: StorageEvent) => {
        const cartItemsString = localStorage.getItem('cartItems')
        if (cartItemsString) {
            const cartItems = JSON.parse(cartItemsString)
            console.log(countUniqueObjects(cartItems))
            setUniqueItems(countUniqueObjects(cartItems))
            setCarItems(cartItems)
        }
      }

    window.addEventListener('storage', handleStorageChange);
  },[])

  const calculateTotalPrice = (items:any) => {
    let totalPrice = 0;
    
    items.forEach((item:any) => {
      const { price } = item.item;
      const repetition = item.repetition;
      totalPrice += price * repetition;
    });
  
    return totalPrice;
  };

  useEffect(()=>{
    if (carItems) {
        const totalPrice: number = carItems.reduce((sum: number, element: Car) => {
            return sum + element.price;
          }, 0);
        setFullPrice(calculateTotalPrice(uniqueItems))
    }
  },[carItems])

  const handleDelete = (carId: string, color: string) => {
    const cartItemsString = localStorage.getItem('cartItems')
    if (cartItemsString) {
        const cartItems = JSON.parse(cartItemsString)
        const updatedElements: Element[] = cartItems.filter((element: Car) => {
            return !(element.carId === carId && element.color === color);
          });
        
        if (updatedElements.length>0) {
            localStorage.setItem('cartItems', JSON.stringify(updatedElements))
        }
        else{
            localStorage.removeItem('cartItems')
            setUniqueItems(undefined)
            setCarItems(undefined)
            setFullPrice(0)
        }
        window.dispatchEvent(new Event("storage"));
    }
    
  };

  const handlerOrderClick = ()=>{
    const user = localStorage.getItem('user')
    const accessToken = localStorage.getItem('accessToken')
    if (user && uniqueItems && accessToken) {
        updateTokens();
        const carArray : any = [];

        uniqueItems.forEach((item:any) => {
            const { carId, color } = item.item;
            const repetition = item.repetition;

            for (let i = 0; i < repetition; i++) {
            carArray.push({ carId, color });
            }
        });
        console.log(carArray)
        // const requestArray = carItems.map(({ carId, color }) => ({ carId, color }));
        const requestBody = {cars:carArray}
        fetch(`http://localhost:8080/orders`,{method:'POST',headers: {"Authorization": `Bearer ${accessToken    }`, "Content-Type": "application/json", // adjust the content type as needed
          }, body:JSON.stringify(requestBody)}).then(responce=>{
            if (responce.status == 201) {
                console.log("result create order: ", responce.status)
                localStorage.removeItem('cartItems')
                // setUniqueItems(undefined)
                // setCarItems(undefined)
                setFullPrice(0)
                window.dispatchEvent(new Event("storage"));
                router.push('/orders')
            }
        })
        
    }
    else{
        router.push('/login')
    }
  }
  useEffect(()=>{
    setFullPrice(calculateTotalPrice(uniqueItems))
  },[uniqueItems])

  const handleChange = (event:any, index: number) => {
    const updatedValues = [...inputValues];
    let value = Number(event.target.value)
    if (value < 0) {
        value = 0
    }
    if (value> 100) {
        value = 100
    }
    updatedValues[index] = value
    // updatedValues[index] = event.target.value;
    if (uniqueItems) {
        const currentItems = [...uniqueItems]
        currentItems[index].repetition = value
        setUniqueItems(currentItems)
    }
    setInputValues(updatedValues);
  };

  return (
    <main>
        <div className={styles.cart}>
            {uniqueItems&& uniqueItems.map((uniqueSlot: any, index : number) => (
                <div key={uniqueSlot.item._id} className={styles.item}>
                <div className={styles.carInfo}>
                    <div className={styles.carImage}>
                    <Image width={100} height={100} src={uniqueSlot.item.image} alt="Car Image" />
                    </div>
                    <div className={styles.carDetails}>
                        <div className={styles["title-set"]}>
                        <p>{`${uniqueSlot.item.name} x `}</p>
                        <input value={inputValues[index]} onChange={(event) => handleChange(event, index)} className={styles.countInput} type="text" defaultValue={uniqueSlot.repetition}/>
                            {/* {uniqueSlot.repetition > 1 ? <p>{`${uniqueSlot.item.name} x ${uniqueSlot.repetition}`}</p>: <p>{`${uniqueSlot.item.name}`}</p>} */}
                            <div className={styles[`${uniqueSlot.item.color}`]}></div>
                        </div>
                        
                        <p>{Math.floor(uniqueSlot.item.price)}$</p>
                    </div>
                </div>
                <div className={styles.deleteButton}>
                    <button onClick={() => handleDelete(uniqueSlot.item.carId,uniqueSlot.item.color)}>Видалити</button>
                </div>
                </div>
            ))}
            <div className={styles["submit-block"]}>
                <p>Загалом: {fullPrice.toString() === '0' ? '0' : Math.floor(fullPrice)}$</p>
                <button onClick={handlerOrderClick} className={styles["order-button"]}>Замовити</button>
            </div>
        </div>
    </main>
  );
};

export default Cart;
