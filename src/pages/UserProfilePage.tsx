import { UserProfile } from "@clerk/clerk-react";

const UserProfilePage = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '100px 20px',
            minHeight: '100vh',
            background: 'var(--bg-primary)'
        }}>
            <UserProfile path="/user-profile" routing="path" />
        </div>
    );
};

export default UserProfilePage;
