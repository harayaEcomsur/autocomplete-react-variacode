import React, { useState } from 'react';
import AutoComplete from './components/Autocomplete';

const App: React.FC = () => {
    const [source, setSource] = useState<'mock' | 'api' | null>(null);

    const handleMockData = () => {
        setSource('mock');
    };

    const handleApiData = () => {
        setSource('api');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Auto-Complete</h1>
            <button onClick={handleMockData} style={{ marginRight: '10px', padding: '10px 20px' }}>
                Use Mock Data
            </button>
            <button onClick={handleApiData} style={{ padding: '10px 20px' }}>
                Use API Data
            </button>

            {source === 'mock' && <AutoComplete source="mock" placeholder="Search..." />}
            {source === 'api' && <AutoComplete source="api" placeholder="Search Simpsons characters..." />}
        </div>
    );
};

export default App;
