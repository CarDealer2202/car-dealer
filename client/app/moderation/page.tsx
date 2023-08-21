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
    status: string;
}
const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sortedCars , setSortedCars] = useState<any[]>([]);
  const router = useRouter()


    const getEmail = (userId:string)=>{
        const accessToken = localStorage.getItem('accessToken')
        let result = ""
        fetch(`http://localhost:8080/users/email`, {
            method: 'PATCH',
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id: userId})
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                result = data
                return result
            })
    }
    useEffect(()=>{
        console.log(getEmail("64e30b397171f89f6981b572"))
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
        fetch(`http://localhost:8080/orders/all`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            })
            .then(response => response.json())
            .then(data => {
                if (data) {
                const rearrangedOrders = data.orders.map((item: any) => {
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
                    const resArray: any = [];

                    // Create a map to count the repetition of each car
                    const promises = updatedOrders.map(async (order)=>{
                        const accessToken = localStorage.getItem('accessToken')
                        const groupedCars:any = {};
                        const status = order.status
                        const userId = order.userId
                        const price = order.totalPrice
                        const orderId = order._id
                        const email = await fetch(`http://localhost:8080/users/email`, {
                            method: 'PATCH',
                            headers: {
                                "Authorization": `Bearer ${accessToken}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({id: userId})
                            })
                            .then(response => response.json())
                            .then(data => {
                                return data.email
                            })
                        // Group the cars by carId and color
                        order.cars.forEach((car: any, index: number) => {
                            const { carId, color } = car;
                            const img = order.car[index].img
                            const brand = order.car[index].brand
                            const model = order.car[index].model
                            const carKey = `${carId}_${color}`;
                            
                            if (groupedCars[carKey]) {
                            groupedCars[carKey].repetition++;
                            } else {
                            groupedCars[carKey] = {
                                item: { carId, color, img, brand, model },
                                repetition: 1,
                                
                            };
                            }
                        });
                        const newArray = Object.values(groupedCars);
                       return {items:newArray,status, email, userId, price,orderId}
                    });
                    
                    Promise.all(promises)
                    .then((resolvedData) => {
                        setSortedCars(resolvedData);
                    })
                    .catch((error) => {
                        console.error("An error occurred:", error);
                    });
                    })
                }
            })
            .catch(error => {
                console.error(error);
            });
    }  
  },[])

  const handleUpdateOrder = (orderId: string) => {
    updateTokens()
    const accessToken = localStorage.getItem('accessToken')
    fetch(`http://localhost:8080/orders/${orderId}`,{method:'PATCH',headers: {"Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json"},
                                                     body: JSON.stringify({status:"completed"})
          }).then(responce=>{
            if (responce.status == 200) {
                const updatedCars = sortedCars.map(order => {
                    if (order.orderId === orderId) {
                        order.status = "completed";
                    }
                    return order;
                });
                console.log("Updated cars: ", updatedCars);
                setSortedCars(updatedCars);
            }
    })
  };

  return (
    <main>
      {sortedCars.map((order: any) => (
        <div className={styles.obvertka}>
            <h3>{order.email}</h3>
            <div className={styles.order}>
                <div className={styles.carList}>
                    {order.items.map((car:any, index:number) => (
                    <div key={car.item.carId} className={styles.carItem}>
                        <div className={styles.carDetails}>
                            <Image alt='' src={car.item.img} width={100} height={100}/>
                            <Link href={"/shop/"+`${car.item.carId}`}>{car.item.brand} {car.item.model}</Link>
                            {car.repetition > 1 ? <p className={styles.aga}>{`x ${car.repetition}`}</p>:''}
                            <div className={styles[`${car.item.color}`]}></div>
                        </div>
                    </div>
                    ))}
                </div>
                <div className={styles.orderDetails}>
                    <div className="info">
                        <p>Статус: {order.status}</p>
                        <p>Повна ціна: {Math.floor(order.price)}$</p>
                    </div>    
                    <button disabled={order.status == "completed"} onClick={() => handleUpdateOrder(order.orderId)}>Завершити</button>
                </div>
            </div>
        </div>
      ))}
    </main>
  );
};

export default Orders;