'use client';
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation';
import Router from 'next/router'
import style from './header.module.css'

type User = {
    createdAt: string;
    email: string;
    name: string;
    updatedAt: string;
}
const Header = () =>{
    const [user, setUser] = useState<User | undefined>()
    const [cartAmmount, setCartAmmount] = useState(0)
    const router = useRouter()

    useEffect(()=>{ // To fix later
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            const user = JSON.parse(storedUser)
            setUser(user)
        }
        const cartItems = localStorage.getItem('cartItems')
        if (cartItems) {
            const cartItemsArray = JSON.parse(cartItems)
            const itemsAmmount = cartItemsArray.length
            setCartAmmount(itemsAmmount)
            console.log(itemsAmmount)
        }
        const handleStorageChange= (event: StorageEvent) => {
                const storedUser = localStorage.getItem("user")
                if (storedUser) {
                    const user = JSON.parse(storedUser)
                    setUser(user)
                }
                const cartItems = localStorage.getItem('cartItems')
                if (cartItems) {
                    const cartItemsArray = JSON.parse(cartItems)
                    const itemsAmmount = cartItemsArray.length
                    setCartAmmount(itemsAmmount)
                    console.log(itemsAmmount)
                }else{
                    setCartAmmount(0)
                }
          }
          
        window.addEventListener('storage', handleStorageChange);
    },[])

    const handlerLogOut = ()=>{
        localStorage.clear()
        setUser(undefined)
        window.dispatchEvent(new Event("storage"));
        router.push('/shop')
    }

    return(
        <header>
            <div className="logo">Logo</div>
            <nav>
                <ul>
                <li><Link href="/">Головна</Link></li>
                <li><Link href="/shop">Магазин</Link></li>
                <li><Link href="/about">Про нас</Link></li>
                </ul>
            </nav>
            <div className="icons">
                <a className={style["dropdown-container"]} href="#">
                    <svg width="17" height="23" viewBox="0 0 17 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.65602 6.33334C4.65602 4.20208 6.38374 2.47436 8.51499 2.47436C10.6462 2.47436 12.374 4.20208 12.374 6.33334C12.374 8.46459 10.6462 10.1923 8.51499 10.1923C6.38374 10.1923 4.65602 8.46459 4.65602 6.33334ZM8.51499 0.858978C5.49158 0.858978 3.04063 3.30993 3.04063 6.33334C3.04063 9.35674 5.49158 11.8077 8.51499 11.8077C11.5384 11.8077 13.9893 9.35674 13.9893 6.33334C13.9893 3.30993 11.5384 0.858978 8.51499 0.858978ZM3.45293 16.3167C4.17663 15.593 5.15817 15.1864 6.18163 15.1864H10.8483C11.8718 15.1864 12.8533 15.593 13.577 16.3167C14.3007 17.0404 14.7073 18.0219 14.7073 19.0454V21.3787C14.7073 21.8248 15.0689 22.1864 15.515 22.1864C15.961 22.1864 16.3227 21.8248 16.3227 21.3787V19.0454C16.3227 17.5935 15.7459 16.2011 14.7193 15.1744C13.6926 14.1478 12.3002 13.571 10.8483 13.571H6.18163C4.72974 13.571 3.33732 14.1478 2.31068 15.1744C1.28404 16.2011 0.707275 17.5935 0.707275 19.0454V21.3787C0.707275 21.8248 1.06889 22.1864 1.51497 22.1864C1.96104 22.1864 2.32266 21.8248 2.32266 21.3787V19.0454C2.32266 18.0219 2.72923 17.0404 3.45293 16.3167Z" fill="#121212"/>
                    </svg>
                    <div className={style["dropdown-menu"]}>
                    {localStorage.getItem('user') ? (
                    <>
                    <Link href="/cart">
                        <span className={style["dropdown-item"]}>Cart</span>
                    </Link>
                    <Link href="/orders">
                        <span className={style["dropdown-item"]}>Orders</span>
                    </Link>
                    <button onClick={handlerLogOut}>
                        <span className={style["dropdown-item"]}>Log out</span>
                    </button>
                    </>
                    ) : (
                    <Link href="/login" >
                    <span className={style["dropdown-item"]}>Log in</span>
                    </Link>
                    )}
                    </div>
                </a>
                {user && <span className="greating">Вітаємо, {user.name}</span>}
                <Link href="/cart">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3078 6.99999C11.3078 6.82777 11.3949 6.462 11.7488 6.13432C12.0906 5.81785 12.7521 5.47436 14.0001 5.47436C15.2481 5.47436 15.9095 5.81785 16.2513 6.13432C16.6052 6.462 16.6924 6.82777 16.6924 6.99999C16.6924 7 16.6924 7 16.6924 7V8.82019H11.3078V7C11.3078 7 11.3078 7 11.3078 6.99999ZM9.69238 6.99999C9.69239 6.39444 9.95522 5.59355 10.6513 4.94902C11.3595 4.29327 12.4481 3.85898 14.0001 3.85898C15.5521 3.85898 16.6406 4.29327 17.3488 4.94902C18.0449 5.59355 18.3078 6.39444 18.3078 6.99999C18.3078 7 18.3078 7 18.3078 7V8.82019H21.0821C21.5282 8.82019 21.8898 9.18181 21.8898 9.62789V20.661C21.8898 21.2954 21.6357 21.9024 21.1855 22.3489C20.7356 22.7953 20.1267 23.0448 19.4931 23.0448H8.3703C7.73677 23.0448 7.12787 22.7953 6.67792 22.3489C6.22774 21.9024 5.97363 21.2954 5.97363 20.661V9.62789C5.97363 9.18181 6.33525 8.82019 6.78133 8.82019H9.69238V7C9.69238 7 9.69238 7 9.69238 6.99999ZM9.69238 12.8333V10.4356H7.58902V20.661C7.58902 20.8627 7.66973 21.0574 7.81553 21.2021C7.96156 21.3469 8.16099 21.4295 8.3703 21.4295H19.4931C19.7024 21.4295 19.9019 21.3469 20.0479 21.2021C20.1937 21.0574 20.2744 20.8627 20.2744 20.661V10.4356H18.3078V12.8333H16.6924V10.4356H11.3078V12.8333H9.69238Z" fill="#121212"/>
                    </svg>
                </Link>
                {cartAmmount > 0 && <span className="cartAmmount">{cartAmmount}</span>}
                
            </div>
            
            
            
        </header>
    )
}
export {Header}