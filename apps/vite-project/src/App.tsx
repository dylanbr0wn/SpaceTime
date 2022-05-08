import * as React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
    const [count, setCount] = React.useState(0);
    const [checked, setChecked] = React.useState(false);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>Hello Vite + React!</p>
                <p>
                    <button
                        type="button"
                        onClick={() => setCount((count) => count + 1)}
                    >
                        count is: {count}
                    </button>
                </p>
                <p>
                    Edit <code>App.tsx</code> and save to test HMR updates.
                </p>
                <p>
                    <input
                        className="toggle"
                        name="checkbox"
                        onChange={(e) => setChecked(!checked)}
                        // {...props}
                        type="checkbox"
                        checked={!!checked}
                    />
                    {" | "}
                    <a
                        className="App-link"
                        href="https://vitejs.dev/guide/features.html"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Vite Docs
                    </a>
                </p>
            </header>
        </div>
    );
}

export default App;
