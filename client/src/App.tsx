import React, { useEffect, useState } from 'react';

interface Choices {
  [key: string]: string[];
}

function App() {

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [choices, setChoices] = useState<Choices | null>(null);
  const [loading, setLoading] = useState(false);

  const [constructionNumbers, setConstructionNumbers] = useState<string[]>([]);

  useEffect(() => {
    // build the query string based on the selections
    const buildQueryString = (params: Record<string, string>): string => {
      return Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    };

    const fetchChoices = async () => {      
      setLoading(true);
      try {
        console.log('Fetching...');

        const queryString = buildQueryString(selections);
        console.log(`Query string: ${queryString}`);

        const response = await fetch(`http://localhost:3001/api/choices?${queryString}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {

          /* this returns an object like this:

          {
            "Ceiling type": [
              "Ceiling below roof joists",
              "Ceiling on exposed beams",
              "Ceiling under attic or attic knee wall"
            ]
          }
          */
          const data: Choices = await response.json();

          // if we get the Extended Construction Numbers, set that value
          // otherwise, continue to build the form.
          if (data.hasOwnProperty('Extended Construction Numbers')) {
            setConstructionNumbers(data['Extended Construction Numbers']);
          } else {
            setChoices(prev => ({ ...prev, ...data }));
          }
        } else {
          console.error("ERROR: resetting form")
          resetForm();
        }
      } catch (error) {
        console.error('Error fetching choices:', error);
      }
      setLoading(false);
    };

    fetchChoices();
  }, [selections]);

  const resetForm = () => {
    // generic error handler; just remove all the values
    // and refetch the values.
    setChoices({});
    setSelections({})
    setConstructionNumbers([]);
  }

  // on change, append the selection to the list
  const handleSelection = (optionValue: string, optionKey: string) => {
    console.log(`Selecting: ${optionValue}, ${optionKey}`);
    setSelections(prev => ({ ...prev, [optionKey]: optionValue }));
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h1>Dynamic forms</h1>
      {loading && <p>Loading...</p>}

      {choices && Object.entries(choices).map(([key, options]) => (
      <div key={key} style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>{key}:</label>
          {Array.isArray(options) ? (
            <select 
              onChange={(e) => handleSelection(e.target.value, key)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', borderColor: '#ccc' }}>
              <option value="">Select {key}</option> {/* placeholder option */}
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <p>No options available</p>
          )}
        </div>
      ))}
      {/* If extended construction numbers exist, render them. */}
      {constructionNumbers.length > 0 ? (
        <div>
          <h1>Extended Construction Numbers:</h1>
          <h2>{constructionNumbers.join(' ')}</h2>
        </div>
      ) : (<></>)}
    </div>
  );
}

export default App;
