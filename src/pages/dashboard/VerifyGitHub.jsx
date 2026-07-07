import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * The old manual KYC flow has been replaced with an automated
 * GitHub star check. This component just redirects to /register
 * where the new flow lives.
 */
export default function VerifyGitHub() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const domain = params.get('domain') || '';
        navigate(`/register${domain ? `?domain=${encodeURIComponent(domain)}` : ''}`, { replace: true });
    }, []);

    return null;
}
