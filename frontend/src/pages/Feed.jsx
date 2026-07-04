import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import api from "../services/api";

function Feed() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setSearchLoading(true);
                const response = await api.get(
                    `/api/users/search?q=${encodeURIComponent(searchQuery.trim())}`
                );
                setSearchResults(response.data?.users || []);
            } catch (err) {
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSelectUser = (user) => {
        setSearchQuery("");
        setSearchResults([]);
        navigate(`/profile/${user.username}`);
    };

    return (
        <div className="page-shell">
            <div className="page-content">
                <div className="page-header">
                    <h1>Feed</h1>
                </div>

                <div className="search-bar">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search users..."
                    />

                    {searchQuery.trim().length >= 2 && (
                        <div className="search-results" role="listbox">
                            {searchLoading && (
                                <div className="search-result-item search-result-item--muted">
                                    Searching...
                                </div>
                            )}

                            {!searchLoading && searchResults.length === 0 && (
                                <div className="search-result-item search-result-item--muted">
                                    No users found
                                </div>
                            )}

                            {!searchLoading &&
                                searchResults.map((user) => (
                                    <button
                                        key={user._id}
                                        type="button"
                                        className="search-result-item"
                                        onClick={() => handleSelectUser(user)}
                                    >
                                        {user.photo_url ? (
                                            <img
                                                className="profile-avatar profile-avatar--small"
                                                src={user.photo_url}
                                                alt={user.display_name || user.username}
                                            />
                                        ) : (
                                            <div className="profile-avatar profile-avatar--placeholder profile-avatar--small">
                                                {(user.display_name || user.username || "U")
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}

                                        <span className="search-result-meta">
                                            <span className="search-result-name">
                                                {user.display_name || user.username}
                                            </span>
                                            <span className="search-result-username">
                                                @{user.username}
                                            </span>
                                        </span>
                                    </button>
                                ))}
                        </div>
                    )}
                </div>

                <div className="feed-card">
                    <h2>Welcome to Echo Feed</h2>
                    <p>
                        This is a UI-only feed placeholder for the new social
                        experience.
                    </p>
                </div>
            </div>

            <BottomNavigation />
        </div>
    );
}

export default Feed;