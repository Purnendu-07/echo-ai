import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import api from "../services/api";
import { auth } from "../services/firebase";

function Dashboard() {

    const navigate = useNavigate();

    const [sent, setSent] = useState([]);

    const [received, setReceived] = useState([]);

    const [activeTab, setActiveTab] = useState("sent");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        fetchDashboard();

    }, []);

    const fetchDashboard = async () => {

        try {

            setLoading(true);

            const res = await api.get("/api/dashboard");

            setSent(res.data.sent);

            setReceived(res.data.received);

        }

        catch (err) {

            console.error(err);

            setError("Failed to load dashboard.");

        }

        finally {

            setLoading(false);

        }

    };

    const logout = async () => {

        await signOut(auth);

        navigate("/");

    };

    const capsules =
        activeTab === "sent"
            ? sent
            : received;

    return (

        <div className="dashboard">

            <div className="dashboard-header">

                <h1>Echo Dashboard</h1>

                <div>

                    <button
                        onClick={() =>
                            navigate("/create")
                        }
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

            <div className="tabs">

                <button

                    className={
                        activeTab === "sent"
                            ? "active"
                            : ""
                    }

                    onClick={() =>
                        setActiveTab("sent")
                    }

                >

                    Sent

                </button>

                <button

                    className={
                        activeTab === "received"
                            ? "active"
                            : ""
                    }

                    onClick={() =>
                        setActiveTab("received")
                    }

                >

                    Received

                </button>

            </div>

            {

                loading &&

                <h3>Loading...</h3>

            }

            {

                error &&

                <p className="error">

                    {error}

                </p>

            }

            {

                !loading && capsules.length === 0 && (

                    <h3>

                        No Capsules Found

                    </h3>

                )

            }

            {

                !loading &&

                capsules.map((capsule) => (

                    <div

                        key={capsule._id}

                        className="capsule-card"

                    >

                        <h3>

                            {

                                activeTab === "sent"

                                    ? capsule.recipient_email

                                    : capsule.sender_id?.email ||
                                      "Unknown Sender"

                            }

                        </h3>

                        <p>

                            {

                                capsule.message_payload

                            }

                        </p>

                        <p>

                            Status:

                            {" "}

                            <strong>

                                {

                                    capsule.status

                                }

                            </strong>

                        </p>

                        <p>

                            Trigger:

                            {" "}

                            {

                                capsule.trigger.type

                            }

                        </p>

                    </div>

                ))

            }

        </div>

    );

}

export default Dashboard;