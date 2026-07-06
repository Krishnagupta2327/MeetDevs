import express from "express";
import cors from "cors";
import { chromium } from "playwright";

const app = express();
const PORT = 5000;

app.use(cors());

// Function to fetch Swiggy restaurant data using Chromium
async function getRestaurantData(id) {
    let browser;

    try {
        browser = await chromium.launch({
            headless: true,
        });

        const page = await browser.newPage();

        console.log("Opening Swiggy...");

        await page.goto("https://www.swiggy.com", {
            waitUntil: "domcontentloaded",
            timeout: 30000,
        });

        // wait for cookies/session
        await page.waitForTimeout(3000);

        console.log("Fetching API for Restaurant ID:", id);

        const result = await page.evaluate(async (restaurantId) => {
            const url =
                `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU` +
                `&complete-menu=true` +
                `&lat=26.8324151` +
                `&lng=80.92915119999999` +
                `&restaurantId=${restaurantId}`;

            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                    },
                });

                const text = await response.text();

                return {
                    status: response.status,
                    body: text,
                };
            } catch (err) {
                return {
                    status: 500,
                    body: err.message,
                };
            }
        }, id);

        console.log("Swiggy Response Status:", result.status);

        if (result.status !== 200) {
            throw new Error(
                `Swiggy returned status ${result.status}\n${result.body}`
            );
        }

        return JSON.parse(result.body);

    } catch (error) {
        console.error("Playwright Error:", error.message);
        throw error;

    } finally {
        if (browser) {
            await browser.close();
            console.log("Chromium closed");
        }
    }
}


// API endpoint
app.get("/restaurant/:id", async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Request received for:", id);

        const data = await getRestaurantData(id);

        res.json(data);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


// Health check route
app.get("/", (req, res) => {
    res.send("Swiggy Proxy Server Running");
});


app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});