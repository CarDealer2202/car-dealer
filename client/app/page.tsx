'use client';
import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react';

export default function Home() {
  const [topCars, setTopCars] = useState<any[]>([])

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const cars = await fetch(`http://localhost:8080/cars?sort=sale&limit=5`)
        const result = await cars.json();
        const prices = result.map((car:any) => car.price);
        setTopCars(result);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className={styles["main-container"]}>
      <div className={styles["block"]}>
        <div className={styles["position-wrapper"]}>
          <div className={styles["image-container"]}>
            <Image width={500} height={700} src="/images/image_2023-06-07_17-45-00.png" alt="Image" />
          </div>
        </div>
        <div className={styles["text-container"]}>
          <p>Наш магазин - це справжня знахідка для кожного шанувальника автомобілів. Він пропонує вражаючий асортимент якісних авто з різних країн світу. Ви можете знайти тут все - від недорогих моделей до розкішних автомобілів класу люкс.</p>
        </div>
      </div>

      <div className={styles.finalBlock}>
        <Image width={1000} height={1000} className={styles.backgroundImage} src="/images/image_2023-06-07_22-25-58.png" alt={''}/>
        <div className={styles.content}>
          <div className={styles.row}>
            <p>Готовий замовити</p>
          </div>
          <div className={styles.row}>
            <p className={styles.redText}>Авто?</p>
          </div>
          <div className={styles.row}>
            <Link href="/shop" className={styles.button}>Замовляй зараз</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
