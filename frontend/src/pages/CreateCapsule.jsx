import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createCapsule } from "../services/capsuleService";

function CreateCapsule() {

    const navigate = useNavigate();

    const [audience, setAudience] = useState("PRIVATE");

    const [message, setMessage] = useState("");

    const [trigger, setTrigger] = useState("");

    const [showCreatedAt, setShowCreatedAt] = useState(true);

    const [showLocation, setShowLocation] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const suggestions = [

        "When RCB wins IPL",

        "When India wins the Cricket World Cup",

        "When GTA VI releases",

        "When Bitcoin reaches $150,000",

        "Tomorrow at 8 PM",

        "On 1 January 2030"

    ];

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        setError("");

        try {

            await createCapsule({

                audience,

                recipients: [],

                content: {

                    type: "TEXT",

                    text: message

                },

                deliveryCondition: {

                    rawInput: trigger

                },

                revealContext: {

                    showCreatedAt,

                    showLocation

                }

            });

            alert("Capsule created successfully!");

            navigate("/feed");

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

                <p className="subtitle">

                    Lock your message until a future event happens.

                </p>

                <form onSubmit={handleSubmit}>

                    <label>

                        Audience

                    </label>

                    <select

                        value={audience}

                        onChange={(e) =>

                            setAudience(e.target.value)

                        }

                    >

                        <option value="PRIVATE">

                            Private

                        </option>

                        <option value="DIRECT">

                            Direct

                        </option>

                        <option value="PUBLIC">

                            Public

                        </option>

                    </select>

                    <label>

                        Your Message

                    </label>

                    <textarea

                        rows="6"

                        placeholder="Write something your future self or others will read..."

                        value={message}

                        onChange={(e) =>

                            setMessage(e.target.value)

                        }

                        required

                    />

                    <label>

                        Trigger

                    </label>

                    <textarea

                        rows="3"

                        placeholder="Example: When RCB wins IPL"

                        value={trigger}

                        onChange={(e) =>

                            setTrigger(e.target.value)

                        }

                        required

                    />

                    <small>

                        Suggestions

                    </small>

                    <div className="trigger-suggestions">

                        {

                            suggestions.map((item) => (

                                <button

                                    key={item}

                                    type="button"

                                    className="suggestion"

                                    onClick={() =>

                                        setTrigger(item)

                                    }

                                >

                                    {item}

                                </button>

                            ))

                        }

                    </div>

                    <label className="checkbox">

                        <input

                            type="checkbox"

                            checked={showCreatedAt}

                            onChange={(e) =>

                                setShowCreatedAt(e.target.checked)

                            }

                        />

                        Reveal creation time

                    </label>

                    <label className="checkbox">

                        <input

                            type="checkbox"

                            checked={showLocation}

                            onChange={(e) =>

                                setShowLocation(e.target.checked)

                            }

                        />

                        Reveal creation location

                    </label>

                    {

                        error &&

                        <p className="error">

                            {error}

                        </p>

                    }

                    <button

                        type="submit"

                        disabled={loading}

                    >

                        {

                            loading

                                ? "Creating..."

                                : "Save Capsule"

                        }

                    </button>

                </form>

                <br />

                <button

                    onClick={() =>

                        navigate("/feed")

                    }

                >

                    Back to Feed

                </button>

            </div>

        </div>

    );

}

export default CreateCapsule;