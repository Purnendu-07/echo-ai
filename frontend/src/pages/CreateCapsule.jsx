import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateCapsule() {

    const navigate = useNavigate();

    const [recipientEmail, setRecipientEmail] = useState("");

    const [message, setMessage] = useState("");

    const [triggerType, setTriggerType] = useState("time");

    const [unlockDate, setUnlockDate] = useState("");

    const [apiEndpoint, setApiEndpoint] = useState("");

    const [targetValue, setTargetValue] = useState("");

    const [conditionOperator, setConditionOperator] =
        useState("equals");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const submitCapsule = async (e) => {

        e.preventDefault();

        setError("");

        setLoading(true);

        try {

            let trigger = {};

            if (triggerType === "time") {

                trigger = {

                    type: "time",

                    unlock_date: unlockDate

                };

            }

            else {

                trigger = {

                    type: "api",

                    api_endpoint: apiEndpoint,

                    target_value: targetValue,

                    condition_operator: conditionOperator

                };

            }

            const payload = {

                recipient_email: recipientEmail,

                message_payload: message,

                trigger

            };

            await api.post("/api/capsules", payload);

            alert("Capsule Created Successfully!");

            navigate("/dashboard");

        }

        catch (err) {

            console.error(err);

            setError("Failed to create capsule.");

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="create-container">

            <div className="create-card">

                <h1>Create Capsule</h1>

                <form onSubmit={submitCapsule}>

                    <label>

                        Recipient Email

                    </label>

                    <input

                        type="email"

                        required

                        value={recipientEmail}

                        onChange={(e) =>
                            setRecipientEmail(e.target.value)
                        }

                    />

                    <label>

                        Message

                    </label>

                    <textarea

                        rows="6"

                        required

                        value={message}

                        onChange={(e) =>
                            setMessage(e.target.value)
                        }

                    />

                    <label>

                        Trigger Type

                    </label>

                    <select

                        value={triggerType}

                        onChange={(e) =>
                            setTriggerType(e.target.value)
                        }

                    >

                        <option value="time">

                            Time Trigger

                        </option>

                        <option value="api">

                            API Trigger

                        </option>

                    </select>

                    {

                        triggerType === "time"

                        &&

                        <>

                            <label>

                                Unlock Date

                            </label>

                            <input

                                type="datetime-local"

                                required

                                value={unlockDate}

                                onChange={(e) =>
                                    setUnlockDate(e.target.value)
                                }

                            />

                        </>

                    }

                    {

                        triggerType === "api"

                        &&

                        <>

                            <label>

                                API Endpoint

                            </label>

                            <input

                                type="text"

                                placeholder="https://example.com/api"

                                value={apiEndpoint}

                                onChange={(e) =>
                                    setApiEndpoint(e.target.value)
                                }

                                required

                            />

                            <label>

                                Target Value

                            </label>

                            <input

                                type="text"

                                value={targetValue}

                                onChange={(e) =>
                                    setTargetValue(e.target.value)
                                }

                                required

                            />

                            <label>

                                Condition

                            </label>

                            <select

                                value={conditionOperator}

                                onChange={(e) =>
                                    setConditionOperator(e.target.value)
                                }

                            >

                                <option value="equals">

                                    Equals

                                </option>

                                <option value="greater_than">

                                    Greater Than

                                </option>

                                <option value="less_than">

                                    Less Than

                                </option>

                                <option value="contains">

                                    Contains

                                </option>

                            </select>

                        </>

                    }
{error && (
                        <p className="error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Capsule"}
                    </button>

                </form>

                <br />

                <button
                    onClick={() => navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>

            </div>

        </div>

    );

}

export default CreateCapsule;