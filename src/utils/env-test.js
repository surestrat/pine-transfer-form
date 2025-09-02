// Environment Variables Test Utility
export const testEnvironmentVariables = () => {
    console.log("=== Environment Variables Test ===");
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
    console.log("VITE_PINE_API_URL:", import.meta.env.VITE_PINE_API_URL);
    console.log("VITE_QUOTE_API_URL:", import.meta.env.VITE_QUOTE_API_URL);
    console.log("NODE_ENV:", import.meta.env.NODE_ENV);
    console.log("MODE:", import.meta.env.MODE);
    console.log("DEV:", import.meta.env.DEV);
    console.log("PROD:", import.meta.env.PROD);
    console.log("==================================");
    
    // Check if critical env vars are missing
    const missingVars = [];
    if (!import.meta.env.VITE_API_URL && !import.meta.env.VITE_PINE_API_URL) {
        missingVars.push("VITE_API_URL or VITE_PINE_API_URL");
    }
    
    if (missingVars.length > 0) {
        console.error("❌ Missing environment variables:", missingVars);
        return false;
    }
    
    console.log("✅ Environment variables loaded successfully");
    return true;
};
