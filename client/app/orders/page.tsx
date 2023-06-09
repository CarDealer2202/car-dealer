'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css'
import { updateTokens } from '@/services/updateToken';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Order={
    _id: string;
    totalPrice: number;
    cars: any[];
    car: any[];
}
const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter()

    useEffect(()=>{
        const user = localStorage.getItem('user')
        if (!user) {
            router.push('/login')
        }
    },[])

  useEffect(()=>{
    const user = localStorage.getItem('user')
    if(user){
        updateTokens();
        const accessToken = localStorage.getItem('accessToken')
        fetch(`http://localhost:8080/orders`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            })
            .then(response => response.json())
            .then(data => {
                if (data) {
                const rearrangedOrders = data.map((item: any) => {
                    const fetchCarData = item.cars.map((car: any) => {
                    return fetch(`http://localhost:8080/cars/${car.carId}`)
                        .then(response => response.json());
                    });

                    return Promise.all(fetchCarData)
                    .then(cars => {
                        item.car = cars;
                        return item;
                    });
                });

                Promise.all(rearrangedOrders)
                    .then(updatedOrders => {
                    console.log(updatedOrders);
                    setOrders(updatedOrders);
                    });
                }
            })
            .catch(error => {
                console.error(error);
            });
    }  
  },[])

  const handleDeleteOrder = (orderId: string) => {
    updateTokens()
    const accessToken = localStorage.getItem('accessToken')
    fetch(`http://localhost:8080/orders/${orderId}`,{method:'DELETE',headers: {"Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json", // adjust the content type as needed
          }}).then(responce=>{
            if (responce.status == 201) {
                console.log("result create order: ", responce.status)
                localStorage.removeItem('cartItems')
                window.dispatchEvent(new Event("storage"));
            }
    })
    const newOrders = orders.filter((order:any)=>{
        return order._id != orderId
    })
    setOrders(newOrders)
  };

  return (
    <main>
      {orders.map((order: Order) => (
        <div key={order._id} className={styles.order}>
          <div className={styles.carList}>
            {order.car.map((Car:any, index:number) => (
              <div key={Car.id} className={styles.carItem}>
                <div className={styles.carDetails}>
                    <Image alt='' src={Car.img} width={100} height={100}/>
                  <Link href={"/shop/"+`${Car._id}`}>{Car.brand} {Car.model}</Link>
                    <div className={styles[`${order.cars[index].color}`]}></div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.orderDetails}>
            <p>Повна ціна: {Math.floor(order.totalPrice)}$</p>
            <button onClick={() => handleDeleteOrder(order._id)}>Скасувати</button>
          </div>
        </div>
      ))}
    </main>
  );
};

export default Orders;