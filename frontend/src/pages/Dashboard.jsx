import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { auth } from "../services/firebase";
import { getMyCapsules } from "../services/capsuleService";

function Dashboard() {
    const navigate = useNavigate();

    const [capsules, setCapsules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const res = await getMyCapsules();

            setCapsules(res.data.capsules);
        } catch (err) {
            console.error(err);
            setError("Failed to load capsules.");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await signOut(auth);
        navigate("/");
    };

    return (
        <div className="dashboard">

            <div className="dashboard-header">

                <h1>My Capsules</h1>

                <div>

                    <button
                        onClick={() => navigate("/create")}
                    >
                        Create Capsule
                    </button>

                    <button
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </div>

            {loading && <h3>Loading...</h3>}

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            {!loading && capsules.length === 0 && (
                <h3>No Capsules Found</h3>
            )}

            {!loading &&
                capsules.map((capsule) => (
                    <div
                        key={capsule._id}
                        className="capsule-card"
                    >
                        <h3>
                            {capsule.content?.text || "Untitled Capsule"}
                        </h3>

                        <p>
                            <strong>Audience:</strong>{" "}
                            {capsule.audience}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {capsule.status}
                        </p>

                        <p>
                            <strong>Trigger:</strong>{" "}
                            {capsule.deliveryCondition?.rawInput || "None"}
                        </p>

                        <p>
                            <strong>Created:</strong>{" "}
                            {new Date(
                                capsule.createdAt
                            ).toLocaleString()}
                        </p>
                    </div>
                ))}
        </div>
    );
}

export default Dashboard;