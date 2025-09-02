// Transform SurveyJS form data to API payload format
export const transformQuotePayload = (surveyData) => {
    console.log("[payloadTransformer] Input survey data:", surveyData);
    
    // Helper function to convert boolean to Y/N
    const boolToYN = (value) => value ? "Y" : "N";
    
    // Generate external reference ID
    const generateReferenceId = () => {
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.random().toString(36).substr(2, 6).toUpperCase();
        return `${timestamp}-${random}`;
    };
    
    // Transform address data
    const transformAddress = (addressData, vehicleData = null) => {
        // Use vehicle-specific address if provided, otherwise use main address
        const addrPrefix = vehicleData?.v_useMainAddress === 'custom' ? 'v_addr_' : 'address_';
        const source = vehicleData?.v_useMainAddress === 'custom' ? vehicleData : addressData;
        
        return {
            addressLine: source[`${addrPrefix}addressLine`] || addressData.address_addressLine,
            suburb: source[`${addrPrefix}suburb`] || addressData.address_suburb,
            postalCode: parseInt(source[`${addrPrefix}postalCode`] || addressData.address_postalCode),
            latitude: parseFloat(source[`${addrPrefix}latitude`] || addressData.address_latitude || -26.10757),
            longitude: parseFloat(source[`${addrPrefix}longitude`] || addressData.address_longitude || 28.0567)
        };
    };
    
    // Transform driver data
    const transformRegularDriver = (vehicleData, clientData) => {
        const isDriverPolicyholder = vehicleData.v_driver_isDriverPolicyholder;
        
        return {
            currentlyInsured: vehicleData.v_driver_currentlyInsured,
            dateOfBirth: isDriverPolicyholder 
                ? (extractDateFromId(clientData.idNumber) || vehicleData.v_driver_dateOfBirth || "1990-01-01")
                : (vehicleData.v_driver_dateOfBirth || "1990-01-01"),
            emailAddress: isDriverPolicyholder 
                ? clientData.email 
                : vehicleData.v_driver_emailAddress || vehicleData.v_driver_emailAddress1,
            idNumber: isDriverPolicyholder 
                ? clientData.idNumber 
                : vehicleData.v_driver_idNumber,
            licenseIssueDate: vehicleData.v_driver_licenseIssueDate,
            maritalStatus: vehicleData.v_driver_maritalStatus,
            mobileNumber: isDriverPolicyholder 
                ? clientData.mobileNumber 
                : vehicleData.v_driver_mobileNumber,
            prvInsLosses: parseInt(vehicleData.v_driver_prvInsLosses || 0),
            relationToPolicyHolder: isDriverPolicyholder ? "Self" : "Other",
            yearsWithoutClaims: parseInt(vehicleData.v_driver_yearsWithoutClaims || 0)
        };
    };
    
    // Extract date of birth from SA ID number
    const extractDateFromId = (idNumber) => {
        if (!idNumber || idNumber.length !== 13) return null;
        
        try {
            const year = idNumber.substring(0, 2);
            const month = idNumber.substring(2, 4);
            const day = idNumber.substring(4, 6);
            
            // Validate month and day
            const monthNum = parseInt(month);
            const dayNum = parseInt(day);
            
            if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
                console.warn(`[payloadTransformer] Invalid date in ID: ${idNumber} (month: ${month}, day: ${day})`);
                return null;
            }
            
            // Determine century (00-30 = 2000s, 31-99 = 1900s)
            const fullYear = parseInt(year) <= 30 ? `20${year}` : `19${year}`;
            
            // Additional validation - check if date is valid
            const testDate = new Date(fullYear, monthNum - 1, dayNum);
            if (testDate.getFullYear() !== parseInt(fullYear) || 
                testDate.getMonth() !== monthNum - 1 || 
                testDate.getDate() !== dayNum) {
                console.warn(`[payloadTransformer] Invalid date constructed from ID: ${idNumber}`);
                return null;
            }
            
            return `${fullYear}-${month}-${day}`;
        } catch (error) {
            console.warn(`[payloadTransformer] Error extracting date from ID ${idNumber}:`, error);
            return null;
        }
    };
    
    // Transform vehicle data
    const transformVehicles = (vehicles, clientData) => {
        return vehicles.map(vehicle => {
            const transformed = {
                accessories: boolToYN(vehicle.v_accessories),
                address: transformAddress(surveyData, vehicle),
                category: vehicle.v_category,
                colour: vehicle.v_colour,
                coverCode: vehicle.v_coverCode,
                engineSize: parseFloat(vehicle.v_engineSize),
                financed: boolToYN(vehicle.v_financed),
                insuredValueType: vehicle.v_insuredValueType,
                make: vehicle.v_make,
                marketValue: parseInt(vehicle.v_retailValue), // Using retail as market value
                model: vehicle.v_model,
                modified: boolToYN(vehicle.v_modified),
                overnightParkingSituation: vehicle.v_overnightParkingSituation,
                owner: boolToYN(vehicle.v_owner_isOwnerPolicyholder),
                partyIsRegularDriver: boolToYN(vehicle.v_driver_isDriverPolicyholder),
                regularDriver: transformRegularDriver(vehicle, clientData),
                retailValue: parseInt(vehicle.v_retailValue),
                status: vehicle.v_status === 'SecondHand' ? 'Used' : vehicle.v_status,
                useType: vehicle.v_useType,
                year: parseInt(vehicle.v_year)
            };
            
            // Add optional fields
            if (vehicle.v_accessories && vehicle.v_accessoriesAmount) {
                transformed.accessoriesAmount = parseInt(vehicle.v_accessoriesAmount);
            }
            
            if (vehicle.v_mmCode) {
                transformed.mmCode = vehicle.v_mmCode;
            }
            
            // Add security features
            if (vehicle.v_accessControl !== undefined) {
                transformed.accessControl = boolToYN(vehicle.v_accessControl);
            }
            
            if (vehicle.v_securityGuard !== undefined) {
                transformed.securityGuard = boolToYN(vehicle.v_securityGuard);
            }
            
            if (vehicle.v_trackingDevice !== undefined) {
                transformed.trackingDevice = boolToYN(vehicle.v_trackingDevice);
            }
            
            return transformed;
        });
    };
    
    // Build final payload
    const payload = {
        agentBranch: surveyData.agentBranch?.trim() || "",
        agentEmail: surveyData.agentEmail,
        externalReferenceId: generateReferenceId(),
        source: "SureStrat",
        vehicles: transformVehicles(surveyData.vehicles, surveyData)
    };
    
    console.log("[payloadTransformer] Transformed payload:", payload);
    return payload;
};
