import PortalClient from './PortalClient';

export const metadata = {
    title: "Dimn AI | Customer Portal",
    description: "Manage your subscription, view billing history, and update your account settings",
    icons: {
        icon: "/favicon.png",
    },
};

export default function Portal() {
    return <PortalClient />;
}
