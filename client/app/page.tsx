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
      <div className={styles["block-2"]}>
        <div className={styles.column}>
          <h3>Ціни</h3>
          <p>Ціни на машини в нашому магазині - це дійсно приємний сюрприз. Вони значно нижчі, ніж у багатьох інших магазинах, але при цьому якість авто не страждає. Тут ви можете знайти оптимальне співвідношення ціни та якості.</p>
        </div>
        <div className={styles.column}>
          <h3>Асортимент</h3>
          <p>Асортимент машин вражає своєю різноманітністю. Цей магазин пропонує автомобілі різних марок та моделей, що задовольнять потреби навіть найвимогливіших клієнтів. Крім того, у магазині завжди можна знайти найсвіжіші новинки автомобільного світу.</p>
        </div>
        <div className={styles.column}>
          <h3>Якість</h3>
          <p>Якість машин в нашому магазині завжди на висоті. Вони проходять ретельну перевірку перед тим, як потрапити на продаж, тому ви можете бути впевнені в якості своєї покупки. Крім того, у магазині завжди готові допомогти у вирішенні будь-яких питань, пов'язаних з придбанням автомобіля. Ви точно не залишитеся розчаровані, обравши машину в нашому магазині.</p>
        </div>
      </div>
      <h2 className={styles.topHeader}>Топ продажiв</h2>
      <div className={styles.carItems}>
        {topCars.map((car: any) => (
          <div key={car._id} className={styles.item}>
            <div className={styles.itemImage}>
              <Image width={100} height={100} src={car.img} alt="Car Image"/>
            </div>
            <div className={styles.itemInfo}>
              <Link href={`/shop/${car._id}`}>
                {car.brand} {car.model}
              </Link>
              <p>{Math.floor(car.price)}$</p>
              <p>{car.horsepower}</p>
              <p>{car.max_speed}</p>
              <p>0-100 km/h: {car.acceleration_to_100} seconds</p>
            </div>
          </div>
        ))}
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
