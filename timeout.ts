import { Express } from "express";

async function startServer() {
    const app: Express = (await import("express")).default();
    app.get("/timeout", (req, res) => {
        setTimeout(() => {
            res.send("Hello from the server");
        }, 5000);
    });
    app.listen(9000, () => {
        console.log("Server started at http://localhost:9000");
    });
}

const url = "http://localhost:9000/timeout";

async function fetchWithTimeout(url: string, timeout: number) {
    await startServer();
    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(timeout) });
        const result = await res.blob();
    } catch (err: any) {
        console.log(err);
        if (err.name === "TimeoutError") {
            console.error(`Timeout: It took more than ${timeout}ms to get the result!`);
        } else if (err.name === "AbortError") {
            console.error(
                "Fetch aborted by user action (browser stop button, closing tab, etc.",
            );
        } else if (err.name === "TypeError") {
            console.error("AbortSignal.timeout() method is not supported");
        } else {
            // A network error, or some other problem.
            console.error(`Error: type: ${err.name}, message: ${err.message}`);
        }
    }
}

fetchWithTimeout(url, 1500);
