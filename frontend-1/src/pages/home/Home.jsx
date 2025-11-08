import { Link } from "react-router-dom";
import "./home.css";

const Home = () => {
    return(
        <div>
            <nav className="navbar">
                <h2 className="nav-left">Harmony Yoga</h2>
                <div className="nav-right">
                    <Link className="button" to="/signup">Signup</Link>
                    <Link className="button" to="/login">Login</Link>
                </div>
            </nav>
            <section className="hero-section">
                <div className="hero-text hero-content">
                    At Harmony Yoga Health Care, we believe that true healing begins from within. Our approach combines the timeless practice of yoga with holistic health techniques to help you achieve physical vitality, emotional stability, and mental clarity. In today's fast-paced world, stress, poor posture, and unhealthy habits can take a toll on both the body and mind — that's why our programs are designed to restore balance through mindful movement, deep breathing, and conscious living.
                    Each session at Harmony Yoga Health Care is guided by experienced instructors and wellness professionals who focus on your unique needs. Whether you are managing chronic pain, recovering from an illness, improving flexibility, or simply seeking peace of mind, we provide personalized care that supports your journey toward better health. Our environment encourages relaxation, self-awareness, and healing — offering a space where you can slow down, breathe deeply, and rediscover the connection between your mind and body.
                    Through our yoga therapy sessions, meditation practices, nutritional guidance, and stress management workshops, we help you cultivate a sustainable lifestyle of wellness. Every breath, every pose, and every mindful moment brings you closer to a stronger, calmer, and healthier you.
                </div>
                <div className="hero-image hero-content">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkN7W-luVgsqZ9m_5qi8yYUkpLdpy1XMJKhg&s" alt=""/>
                </div>
            </section>
        </div>
    )
}

export default Home;