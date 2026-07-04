import BottomNavigation from "../components/BottomNavigation";

function Chats() {
    return (
        <div className="page-shell">
            <div className="page-content">
                <div className="page-header">
                    <h1>Chats</h1>
                </div>

                <div className="feed-card">
                    <h3>Your conversations</h3>
                    <p>Chat list UI will appear here soon.</p>
                </div>
            </div>

            <BottomNavigation />
        </div>
    );
}

export default Chats;
