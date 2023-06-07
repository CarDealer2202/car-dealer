// import instagram from '.'
// import twitter from ".";
// import gmail from ".";
import Image from 'next/image';


const Footer = () =>{
    return(
        <footer>
            <div className="footer-top">
            <div className="left">
            <h2>Logo</h2>
            <div className="social-icons">
                <a href="#"><Image width={50} height={50} src="/images/5279111_network_fb_social media_facebook_facebook logo_icon.svg" alt="Facebook"/></a>
                <a href="#"><Image width={50} height={50} src="/images/5279112_camera_instagram_social media_instagram logo_icon.svg" alt="Instagram"/></a>
                <a href="#"><Image width={50} height={50} src="/images/5279123_tweet_twitter_twitter logo_icon.svg" alt="Twitter"/></a>
                <a href="#"><Image width={50} height={50} src="/images/1147408_address book_circle_contacts_email_gmail_icon.svg" alt="Gmail"/></a>
            </div>
            </div>
            <div className="right">
            <div className="column">
                <h3>Магазин</h3>
                <a href="#">Мiй аккаунт</a>
                <a href="#">Логiн</a>
                <a href="#">Список бажань</a>
                <a href="#">Корзина</a>
            </div>
            <div className="column">
                <h3>Про нас</h3>
                <a href="#">Полiтика доставки</a>
                <a href="#">Полiтика печеньок</a>
                <a href="#">Частi питання</a>
            </div>
            <div className="column">
                <h3>Компaнiя</h3>
                <a href="#">Наша iсторiя</a>
                <a href="#">Полiтика приватностi</a>
                <a href="#">Зв'язок з нами</a>
            </div>
            </div>
        </div>
        <hr />    
        <div className="footer-bottom">
            <div className="left">
                <span>&copy; 2023 Logo</span>
            </div>
            <div className="right">
                <img src="country-flag.png" alt="Country Flag"/>
                <div className="dropdown">
                    <button className="dropdown-btn">Мова</button>
                    <div className="dropdown-content">
                    <a href="#">English</a>
                    <a href="#">УкраЇнська</a>
                </div>
            </div>
            <div className="dropdown">
                <button className="dropdown-btn">Валюта</button>
                <div className="dropdown-content">
                <a href="#">USD</a>
                <a href="#">UAH</a>
                <a href="#">Euro</a>
                </div>
            </div>
            </div>
        </div>
        </footer>

    )
}
export {Footer}