const Footer = () =>{
    return(
        <footer>
            <div className="footer-top">
            <div className="left">
            <h2>Logo</h2>
            <div className="social-icons">
                <a href="#"><img src="facebook-icon.png" alt="Facebook"/></a>
                <a href="#"><img src="instagram-icon.png" alt="Instagram"/></a>
                <a href="#"><img src="twitter-icon.png" alt="Twitter"/></a>
                <a href="#"><img src="gmail-icon.png" alt="Gmail"/></a>
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