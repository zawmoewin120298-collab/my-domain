import { createContext, useContext, useState, useEffect } from "react";
import { subdomainAPI } from "@/lib/api";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
    const [subdomains, setSubdomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch subdomains from backend
    const fetchSubdomains = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await subdomainAPI.list();
            setSubdomains(data);
        } catch (err) {
            console.error('Failed to fetch subdomains:', err);
            setError(err.message);
            // Don't clear subdomains on error, keep previous data
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch on mount
    useEffect(() => {
        fetchSubdomains();
    }, []);

    // Refresh function that can be called manually
    const refresh = () => {
        fetchSubdomains();
    };

    return (
        <DashboardContext.Provider value={{
            subdomains,
            setSubdomains,
            loading,
            error,
            refresh
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

export const useDashboard = () => useContext(DashboardContext);
