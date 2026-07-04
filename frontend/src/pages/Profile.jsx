import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import api from "../services/api";

function Profile() {
    const { username: routeUsername } = useParams();
    const [profile, setProfile] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        display_name: "",
        bio: "",
        photo_url: ""
    });

    const isOwnProfile = !routeUsername || (currentUser?.username && routeUsername.toLowerCase() === currentUser.username.toLowerCase());

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const meResponse = await api.get("/api/users/me").catch(() => null);
            const meUser = meResponse?.data?.user || null;
            setCurrentUser(meUser);

            if (!routeUsername) {
                const user = meUser;
                setProfile(user);
                setFormData({
                    username: user?.username || "",
                    display_name: user?.display_name || "",
                    bio: user?.bio || "",
                    photo_url: user?.photo_url || ""
                });
                return;
            }

            if (meUser?.username && routeUsername.toLowerCase() === meUser.username.toLowerCase()) {
                setProfile(meUser);
                setFormData({
                    username: meUser?.username || "",
                    display_name: meUser?.display_name || "",
                    bio: meUser?.bio || "",
                    photo_url: meUser?.photo_url || ""
                });
                return;
            }

            const response = await api.get(`/api/users/${encodeURIComponent(routeUsername)}`);
            const user = response.data?.user;
            setProfile(user);
            setFormData({
                username: user?.username || "",
                display_name: user?.display_name || "",
                bio: user?.bio || "",
                photo_url: user?.photo_url || ""
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load profile.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [routeUsername]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleEdit = () => {
        setError("");
        setSuccess("");

        if (isEditing) {
            setFormData({
                username: profile?.username || "",
                display_name: profile?.display_name || "",
                bio: profile?.bio || "",
                photo_url: profile?.photo_url || ""
            });
        }

        setIsEditing((prev) => !prev);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const response = await api.put("/api/users/me", formData);
            setProfile(response.data?.user);
            setCurrentUser(response.data?.user);
            setFormData({
                username: response.data?.user?.username || "",
                display_name: response.data?.user?.display_name || "",
                bio: response.data?.user?.bio || "",
                photo_url: response.data?.user?.photo_url || ""
            });
            setIsEditing(false);
            setSuccess("Profile updated successfully.");
        } catch (err) {
            setError(err.response?.data?.message || "Could not update profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page-shell">
            <div className="page-content">
                <div className="page-header">
                    <h1>{isOwnProfile ? "Profile" : "User Profile"}</h1>
                    {isOwnProfile && (
                        <button className="profile-edit-toggle" onClick={toggleEdit}>
                            {isEditing ? "Cancel" : "Edit Profile"}
                        </button>
                    )}
                </div>

                {loading && <div className="feed-card">Loading profile...</div>}

                {error && <div className="feed-card error-card">{error}</div>}
                {success && <div className="feed-card success-card">{success}</div>}

                {!loading && profile && !isEditing && (
                    <div className="feed-card profile-card">
                        <div className="profile-summary">
                            {profile.photo_url ? (
                                <img className="profile-avatar" src={profile.photo_url} alt={profile.display_name || profile.username} />
                            ) : (
                                <div className="profile-avatar profile-avatar--placeholder">
                                    {(profile.display_name || profile.username || "U").charAt(0).toUpperCase()}
                                </div>
                            )}

                            <div>
                                <h2>{profile.display_name || profile.username || "Echo User"}</h2>
                                <p className="profile-username">@{profile.username || "username"}</p>
                                <p className="profile-bio">{profile.bio || "No bio yet."}</p>
                            </div>
                        </div>

                        {!isOwnProfile && (
                            <div className="profile-actions">
                                <button type="button" className="profile-action-btn">
                                    Message
                                </button>
                                <button type="button" className="profile-action-btn profile-action-btn--secondary">
                                    Send Capsule
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {!loading && profile && isEditing && (
                    <div className="feed-card">
                        <form className="profile-form" onSubmit={handleSubmit}>
                            <label>
                                Username
                                <input
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="username"
                                    required
                                />
                            </label>

                            <label>
                                Display Name
                                <input
                                    name="display_name"
                                    value={formData.display_name}
                                    onChange={handleChange}
                                    placeholder="Your display name"
                                />
                            </label>

                            <label>
                                Bio
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Tell people about yourself"
                                />
                            </label>

                            <label>
                                Photo URL
                                <input
                                    name="photo_url"
                                    value={formData.photo_url}
                                    onChange={handleChange}
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </label>

                            <button type="submit" className="profile-save-btn" disabled={saving}>
                                {saving ? "Saving..." : "Save Profile"}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <BottomNavigation />
        </div>
    );
}

export default Profile;
