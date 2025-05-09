import React, { useState } from 'react';
import axios from 'axios';

export default function AdminPanel() {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState('');

    const generateLink = async () => {
        if (!redirectUrl) {
            alert('Por favor, insira a URL de redirecionamento');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('https://payment-link-server.vercel.app/api/generate-link', {
                redirectUrl
            });
            const fullLink = `${window.location.origin}/pagamento/${data.link.split('/').pop()}`;
            setLinks([...links, { url: fullLink, redirectUrl }]);
        } catch (error) {
            console.error('Erro ao gerar link:', error);
            alert('Erro ao gerar link!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-panel">
            <div style={pageStyle}>
                <header style={headerStyle}>
                    <h1 style={headerTitleStyle}>Guaraci</h1>
                    <p style={headerSubtitleStyle}>Pagamento via link</p>
                </header>
                <main style={mainStyle}>
                    <form style={formStyle}>
                        <h1 style={titleStyle}>Painel de Vendas</h1>

                        <div style={fieldContainer}>
                            <label style={labelStyle}>URL de Redirecionamento</label>
                            <input
                                type="url"
                                value={redirectUrl}
                                onChange={(e) => setRedirectUrl(e.target.value)}
                                placeholder="https://exemplo.com/obrigado"
                                style={inputStyle}
                                required
                            />
                        </div>

                        <button
                            onClick={generateLink}
                            disabled={loading || !redirectUrl}
                            style={{
                                ...buttonStyle,
                                backgroundColor: loading ? '#ccc' : '#0063F7',
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? 'Gerando...' : 'Gerar Link Único'}
                        </button>

                        <h2 style={subtitleStyle}>Links Criados:</h2>
                        <ul style={listStyle}>
                            {links.map((link, index) => (
                                <li key={index} style={listItemStyle}>
                                    <div>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={linkStyle}
                                        >
                                            {link.url}
                                        </a>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            Redireciona para: {link.redirectUrl}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(link.url)
                                                .then(() => alert('Link copiado!'))
                                                .catch(() => {
                                                    const tempInput = document.createElement('input');
                                                    tempInput.value = link.url;
                                                    document.body.appendChild(tempInput);
                                                    tempInput.select();
                                                    document.execCommand('copy');
                                                    document.body.removeChild(tempInput);
                                                    alert('Link copiado!');
                                                });
                                        }}
                                        style={copyButtonStyle}
                                    >
                                        Copiar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </form>
                </main>
            </div>
        </div>
    );
}

// Styles
const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
};

const headerStyle = {
    backgroundColor: '#0063F7',
    color: '#ffffff',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '800px',
    margin: '20px auto 40px',
    borderRadius: '16px',
};

const headerTitleStyle = {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
};

const headerSubtitleStyle = {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'normal',
};

const mainStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
};

const formStyle = {
    width: '100%',
    maxWidth: '600px',
    padding: '30px',
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
};

const titleStyle = {
    color: '#0063F7',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
};

const subtitleStyle = {
    color: '#000000',
    fontSize: '18px',
    marginTop: '20px',
};

const buttonStyle = {
    padding: '14px',
    backgroundColor: '#0063F7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
};

const listStyle = {
    listStyle: 'none',
    padding: 0,
    marginTop: '10px',
};

const listItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #ccc',
};

const linkStyle = {
    color: '#0063F7',
    textDecoration: 'none',
    fontSize: '14px',
    wordBreak: 'break-word',
};

const copyButtonStyle = {
    padding: '8px 12px',
    backgroundColor: '#0063F7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
};

const fieldContainer = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
};
