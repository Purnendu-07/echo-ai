import { NavLink } from "react-router-dom";

const navItems = [
    { to: "/feed", label: "Feed", icon: "🏠" },
    { to: "/chats", label: "Chats", icon: "💬" },
    { to: "/create", label: "Create", icon: "＋" },
    { to: "/profile", label: "Profile", icon: "👤" },
];

function BottomNavigation() {
    return (
        <nav className="bottom-nav" aria-label="Bottom navigation">
            {navItems.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                        `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                    }
                >
                    <span className="bottom-nav__icon" aria-hidden="true">
                        {item.icon}
                    </span>
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
}

export default BottomNavigation;
