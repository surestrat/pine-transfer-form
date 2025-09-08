# Backend Quote API Requirements

## ✅ STATUS: COMPLETED - Backend Already Implemented

The backend quote API is already implemented and working! The frontend has been updated to work with your existing API response format.

## Overview
The frontend needs a new API endpoint to retrieve quote information by quote ID. This will be used on the success page to display premium and excess information after a successful transfer.

## ✅ Implemented API Endpoint

### GET /api/v1/quote/{quote_id}

**Status:** ✅ **WORKING** - Tested with quote ID: `ec8933cc6b2549cc8b44536351fc5c98`

**Description:** Retrieve quote details by quote ID

**Path Parameters:**
- `quote_id` (string, required) - The quote identifier to retrieve

## Response Formats

### Current Backend Response (HTTP 200)
```json
{
  "id": "ec8933cc6b2549cc8b44536351fc5c98",
  "source": "SureStrat",
  "internalReference": "12345678910",
  "status": "PENDING",
  "vehicles": [...],
  "premium": "1149.3408672180176",
  "excess": "6200.0",
  "quoteId": "68be102519c6c307d6924e1d",
  "agentEmail": "agent@email.com",
  "agentBranch": "lenasiaHO",
  "created_at": "2025-09-07T23:07:16.742+00:00",
  "updated_at": "2025-09-07T23:07:17.641+00:00"
}
```

### Expected Frontend Format (for reference)
```json
{
  "success": true,
  "data": {
    "quoteId": "679765d8cdfba62ff342d2ef",
    "premium": 1240.45,
    "excess": 6200.0,
    "externalReferenceId": "QUOTE-1725369011123-456",
    "status": "active",
    "createdAt": "2025-09-08T01:22:02.585866Z"
  },
  "timestamp": "2025-09-08T01:22:02.585866Z"
}
```

### Quote Not Found (HTTP 404)
```json
{
  "success": false,
  "error": {
    "code": "QUOTE_NOT_FOUND",
    "message": "Quote not found or may have expired.",
    "technical_message": "No quote found with ID: 679765d8cdfba62ff342d2ef",
    "details": {
      "quote_id": "679765d8cdfba62ff342d2ef"
    }
  },
  "timestamp": "2025-09-08T01:22:02.585866Z"
}
```

### Quote Expired (HTTP 410) - Optional
```json
{
  "success": false,
  "error": {
    "code": "QUOTE_EXPIRED",
    "message": "This quote has expired. Please request a new quote.",
    "technical_message": "Quote expired on 2025-09-07T01:22:02.585866Z",
    "details": {
      "quote_id": "679765d8cdfba62ff342d2ef",
      "expired_at": "2025-09-07T01:22:02.585866Z"
    }
  },
  "timestamp": "2025-09-08T01:22:02.585866Z"
}
```

### Server Error (HTTP 500)
```json
{
  "success": false,
  "error": {
    "code": "QUOTE_RETRIEVAL_ERROR",
    "message": "Unable to retrieve quote information. Please try again.",
    "technical_message": "Database connection error",
    "details": {}
  },
  "timestamp": "2025-09-08T01:22:02.585866Z"
}
```

## Required Data Fields

The response data object must contain these **exact** field names:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `quoteId` | string | Yes | The quote identifier |
| `premium` | float | Yes | Monthly premium amount in ZAR |
| `excess` | float | Yes | Excess amount in ZAR |
| `externalReferenceId` | string | No | External reference ID if available |
| `status` | string | Yes | Quote status ("active", "expired", "transferred") |
| `createdAt` | string | Yes | ISO 8601 timestamp when quote was created |

## Database Storage Requirements

To implement this endpoint, you need to store quote information when quotes are created. Minimum required fields:

- **Quote ID** (Primary Key) - Unique identifier for the quote
- **Premium** (Decimal) - Monthly premium amount
- **Excess** (Decimal) - Excess amount
- **External Reference ID** (String, Optional) - Reference ID from quote request
- **Status** (String) - Current status of the quote
- **Created At** (Timestamp) - When the quote was created
- **Expires At** (Timestamp, Optional) - When the quote expires

## Implementation Notes

1. **Quote Storage:** You need to modify your existing quote creation endpoint to store quote data in a database/storage system when quotes are successfully created.

2. **Quote ID Generation:** The quote ID should be the same ID returned when creating a quote via `POST /api/v1/quote`.

3. **Status Management:** 
   - New quotes should have status "active"
   - When a quote is used in a transfer, optionally update status to "transferred"
   - Optionally implement expiry logic (e.g., 30 days) and set status to "expired"

4. **Error Handling:** Follow the same error response format as your existing endpoints.

5. **CORS:** Ensure the new endpoint has the same CORS configuration as existing endpoints.

## Frontend Integration

Once implemented, the frontend will call this endpoint like:

```javascript
GET http://localhost:4000/api/v1/quote/679765d8cdfba62ff342d2ef
```

The frontend expects:
- HTTP 200 with success response for valid quotes
- HTTP 404 with error response for missing quotes
- HTTP 500 with error response for server errors
- Consistent JSON structure matching existing API format

## Testing

You can test the endpoint with:

```bash
curl -X GET "http://localhost:4000/api/v1/quote/test-quote-id" \
  -H "Accept: application/json"
```

Expected response should match the JSON formats specified above.
