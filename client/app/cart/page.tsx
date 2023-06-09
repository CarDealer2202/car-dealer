'use client'
import { useEffect, useState } from 'react';
import styles from './page.module.css'

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
            
            setUniqueItems(countUniqueObjects(cartItems))
            setCarItems(cartItems)
        }
    const handleStorageChange= (event: StorageEvent) => {
        const cartItemsString = localStorage.getItem('cartItems')
        if (cartItemsString) {
            const cartItems = JSON.parse(cartItemsString)
            setUniqueItems(countUniqueObjects(cartItems))
            setCarItems(cartItems)
        }
      }

    window.addEventListener('storage', handleStorageChange);
  },[carItems])

  useEffect(()=>{
    if (carItems) {
        const totalPrice: number = carItems.reduce((sum: number, element: Car) => {
            return sum + element.price;
          }, 0);
        setFullPrice(totalPrice)
    }
    // const handleStorageChange= (event: StorageEvent) => {
    //     if (carItems) {
    //         const totalPrice: number = carItems.reduce((sum: number, element: Car) => {
    //             return sum + element.price;
    //           }, 0);
    //         setFullPrice(totalPrice)
    //     }
    //   }

    // window.addEventListener('storage', handleStorageChange);
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

  return (
    <main>
        <div className={styles.cart}>
            {uniqueItems&& uniqueItems.map((uniqueSlot: any) => (
                <div key={uniqueSlot.item._id} className={styles.item}>
                <div className={styles.carInfo}>
                    <div className={styles.carImage}>
                    <img src={uniqueSlot.item.img} alt="Car Image" />
                    </div>
                    <div className={styles.carDetails}>
                        {uniqueSlot.repetition > 1 ? <p>{`${uniqueSlot.item.name} x ${uniqueSlot.repetition}`}</p>: <p>{`${uniqueSlot.item.name}`}</p>}
                        
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
                <button className={styles["order-button"]}>Замовити</button>
            </div>
        </div>
    </main>
  );
};

export default Cart;
