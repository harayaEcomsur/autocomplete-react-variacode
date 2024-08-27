# AutoComplete Component

## How to Run

1. Install dependencies:
    ```bash
    npm install
    ```

2. Start the development server:
    ```bash
    npm run dev
    ```

3. Open the browser and navigate to this URL: `http://localhost:5173`.


## Considerations
- The filtering is done asynchronously.
- Basic styling has been applied inline. You can extend the styles using a CSS file.
- We can use 2 sources for data, mock data and API data
- We use some of cache and debounce for the API data fetch
- Vite for the bundle
