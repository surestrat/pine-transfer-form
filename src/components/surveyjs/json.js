export const json = {
  "autoFocusFirstQuestion": true,
  "pages": [
    {
      "name": "clientDetails",
      "title": "Client Details",
      "description": "Tell us who we’re quoting for. Your details help us link and retrieve your quote.",
      "elements": [
        {
          "type": "text",
          "name": "firstName",
          "title": "First Name",
          "isRequired": true,
          "requiredErrorText": "First name is required.",
          "validators": [
            {
              "type": "text"
            },
            {
              "type": "text",
              "minLength": 2,
              "maxLength": 30,
              "allowDigits": false
            }
          ],
          "autocomplete": "given-name",
          "maxLength": 30
        },
        {
          "type": "text",
          "name": "lastName",
          "title": "Last Name",
          "isRequired": true,
          "requiredErrorText": "Last name is required.",
          "validators": [
            {
              "type": "text"
            },
            {
              "type": "text",
              "minLength": 2,
              "maxLength": 30
            }
          ],
          "autocomplete": "family-name",
          "maxLength": 30
        },
        {
          "type": "text",
          "name": "idNumber",
          "title": "South African ID / Passport Number",
          "description": "For rating and verification. SA ID preferred for best accuracy.",
          "requiredErrorText": "A valid Id number or passport number required",
          "validators": [
            {
              "type": "text",
              "text": "Enter a valid SA ID (13 digits) or Passport (min 6 chars)."
            },
            {
              "type": "text",
              "text": "Please enter a valid Id Number/Passport",
              "minLength": 9,
              "maxLength": 13
            }
          ],
          "maxLength": 13
        },
        {
          "type": "text",
          "name": "email",
          "title": "Email Address",
          "isRequired": true,
          "requiredErrorText": "Email is required.",
          "validators": [
            {
              "type": "email",
              "text": "Please enter a valid email address."
            }
          ],
          "inputType": "email",
          "autocomplete": "email",
          "maxLength": 50
        },
        {
          "type": "text",
          "name": "mobileNumber",
          "title": "Mobile Number",
          "isRequired": true,
          "validators": [
            {
              "type": "regex",
              "text": "Phone number must be 10 digits.",
              "regex": "^[0-9]{10}$"
            }
          ],
          "inputType": "tel",
          "autocomplete": "tel-local"
        }
      ]
    },
    {
      "name": "primaryAddress",
      "title": "Primary Address",
      "description": "We use your location to rate risk and check overnight parking. If different per vehicle, we’ll capture it later.",
      "elements": [
        {
          "type": "text",
          "name": "address_addressLine",
          "title": "Street Address",
          "isRequired": true,
          "requiredErrorText": "Street address is required",
          "validators": [
            {
              "type": "text",
              "text": "Street address must be at least 5 characters",
              "minLength": 5
            }
          ],
          "autocomplete": "street-address",
          "maxLength": 100
        },
        {
          "type": "text",
          "name": "address_suburb",
          "title": "Suburb / Area",
          "isRequired": true,
          "requiredErrorText": "Suburb/Area is required",
          "validators": [
            {
              "type": "text",
              "text": "Suburb/Area must be at least 5 characters",
              "minLength": 5
            }
          ],
          "autocomplete": "address-line2",
          "maxLength": 30
        },
        {
          "type": "text",
          "name": "address_postalCode",
          "title": "Postal Code",
          "isRequired": true,
          "requiredErrorText": "Invalid postal code. Please enter a 4-digit postal code.",
          "validators": [
            {
              "type": "text",
              "text": "Enter a valid postal code (1–9999)."
            }
          ],
          "inputType": "number",
          "autocomplete": "tel-area-code",
          "min": 1000,
          "max": 9999,
          "minErrorText": "The postal code should not be less than 4 numbers",
          "maxErrorText": "The postal code should not be greater than 4 numbers"
        },
        {
          "type": "text",
          "name": "address_latitude",
          "visible": false,
          "title": "Latitude (optional)",
          "description": "If available (e.g., via GPS lookup). Improves accuracy.",
          "validators": [
            {
              "type": "numeric",
              "text": "Latitude must be between -90 and 90.",
              "minValue": -90,
              "maxValue": 90
            }
          ],
          "inputType": "number",
          "autocomplete": "tel"
        },
        {
          "type": "text",
          "name": "address_longitude",
          "visible": false,
          "title": "Longitude (optional)",
          "validators": [
            {
              "type": "numeric",
              "text": "Longitude must be between -180 and 180.",
              "minValue": -180,
              "maxValue": 180
            }
          ],
          "inputType": "number"
        }
      ]
    },
    {
      "name": "vehiclesPage",
      "title": "Vehicle Details",
      "description": "Add each vehicle you’d like quoted. You can add more than one.",
      "elements": [
        {
          "type": "paneldynamic",
          "name": "vehicles",
          "title": "Vehicle",
          "description": "Complete the details below. Add extra vehicles if needed.",
          "templateElements": [
            {
              "type": "dropdown",
              "name": "v_make",
              "title": "Make",
              "description": "Start typing to search. Popular makes in SA are listed.",
              "isRequired": true,
              "requiredErrorText": "Make of the vehicle is required",
              "choices": [
                "Isuzu",
                "Kia",
                "Ford",
                "Hyundai",
                "Toyota",
                "Volkswagen",
                "Suzuki",
                "Haval",
                "Nissan",
                "Renault",
                "Chery",
                "BMW",
                "Audi",
                "GWM",
                "Mercedes-Benz",
                "Honda",
                "Mazda",
                "Mitsubishi",
                "Land Rover",
                "Jaguar",
                "Volvo",
                "Mini",
                "Subaru",
                "Porsche",
                "Chevrolet",
                "Opel",
                "Peugeot",
                "Fiat",
                "Daihatsu",
                "Tata",
                "Mahindra",
                "Lexus",
                "Alfa Romeo",
                "Aston Martin",
                "BAIC",
                "Bentley",
                "BYD",
                "Cadillac",
                "Changan",
                "Citroën",
                "DFSK",
                "Dodge",
                "Ferrari",
                "Foton",
                "Geely",
                "Genesis",
                "Great Wall Motors",
                "Hino",
                "Infiniti",
                "JAC",
                "Jeep",
                "JMC",
                "Lamborghini",
                "Lancia",
                "Maserati",
                "McLaren",
                "Proton",
                "RAM",
                "Rolls-Royce",
                "SsangYong",
                "Polestar",
                "Rover",
                "Seat",
                "Skoda",
                "Tesla",
                "Zotye"
              ]
            },
            {
              "type": "text",
              "name": "v_model",
              "title": "Model",
              "description": "Enter the model of the vehicle...",
              "isRequired": true,
              "requiredErrorText": "The model of the vehicle is required",
              "validators": [
                {
                  "type": "text",
                  "text": "the model of the vehicle should be atleast 2 characters",
                  "minLength": 2
                }
              ],
              "maxLength": 50
            },
            {
              "type": "text",
              "name": "v_mmCode",
              "title": "MM Code/Licence number (optional)",
              "description": "Manufacturer model code or licence if known.",
              "validators": [
                {
                  "type": "text",
                  "text": "Licence or MM code should be atleast 4 characters",
                  "minLength": 4
                }
              ],
              "maxLength": 50
            },
            {
              "type": "text",
              "name": "v_year",
              "title": "Year of Manufacture",
              "isRequired": true,
              "requiredErrorText": "Year of manufacture is required",
              "validators": [
                {
                  "type": "numeric",
                  "text": "Enter a valid year between 1990 and 2025.",
                  "minValue": 1990,
                  "maxValue": 2025
                }
              ],
              "inputType": "number",
              "min": 1985,
              "max": 2025,
              "minErrorText": "The year should not be less than {0}",
              "maxErrorText": "The year should not be greater than {0}"
            },
            {
              "type": "dropdown",
              "name": "v_category",
              "title": "Body Category",
              "isRequired": true,
              "requiredErrorText": "Body of the vehicle is required",
              "choices": [
                "SUV",
                {
                  "value": "HB",
                  "text": "Hatchback"
                },
                {
                  "value": "SD",
                  "text": "Sedan"
                },
                {
                  "value": "CP",
                  "text": "Coupe"
                },
                {
                  "value": "SAV",
                  "text": "Sports Activity Vehicle"
                },
                {
                  "value": "DC",
                  "text": "Double Cab"
                },
                {
                  "value": "SC",
                  "text": "Single Cab"
                },
                {
                  "value": "MPV",
                  "text": "Multi-Purpose Vehicle"
                },
                {
                  "value": "CB",
                  "text": "Cabriolet"
                },
                {
                  "value": "SW",
                  "text": "Station Wagon"
                },
                {
                  "value": "XO",
                  "text": "Crossover"
                },
                {
                  "value": "HT",
                  "text": "Hardtop"
                },
                {
                  "value": "RV",
                  "text": "Recreational Vehicle"
                },
                {
                  "value": "CC",
                  "text": "Convertible Coupe"
                },
                {
                  "value": "PV",
                  "text": "Panel Van"
                },
                {
                  "value": "BS",
                  "text": "Bus"
                },
                {
                  "value": "DS",
                  "text": "Dual Sport"
                }
              ]
            },
            {
              "type": "text",
              "name": "v_colour",
              "title": "Colour",
              "isRequired": true,
              "requiredErrorText": "Colour of the vehicle is required",
              "inputType": "color"
            },
            {
              "type": "text",
              "name": "v_engineSize",
              "title": "Engine Size (litres)",
              "isRequired": true,
              "requiredErrorText": "Engine size is required",
              "validators": [
                {
                  "type": "numeric",
                  "text": "Enter engine size between 0.6 and 8.0.",
                  "minValue": 0.6,
                  "maxValue": 8
                }
              ],
              "inputType": "number",
              "min": 0.3,
              "max": 9,
              "minErrorText": "The size should not be less than 0.3L",
              "maxErrorText": "The size should not be greater than 9.0L",
              "step": 0.1
            },
            {
              "type": "dropdown",
              "name": "v_status",
              "title": "Vehicle Status",
              "isRequired": true,
              "choices": [
                "New",
                {
                  "value": "SecondHand",
                  "text": "Pre-owned"
                }
              ]
            },
            {
              "type": "boolean",
              "name": "v_modified",
              "title": "Aftermarket Modifications?",
              "description": "Non-factory performance/body mods.",
              "requiredErrorText": "Is the vehicle modified?"
            },
            {
              "type": "boolean",
              "name": "v_accessories",
              "title": "Non-standard Accessories Installed?",
              "requiredErrorText": "Does the vehicle have non-standard accessories installed"
            },
            {
              "type": "text",
              "name": "v_accessoriesAmount",
              "visibleIf": "{panel.v_accessories} = true",
              "title": "Accessories Value (ZAR)",
              "requiredErrorText": "The value of accessories is invalid or empty",
              "validators": [
                {
                  "type": "numeric",
                  "text": "Accessories value must be at least R500.",
                  "minValue": 500
                }
              ],
              "inputType": "number",
              "min": 1000,
              "max": 1000000,
              "minErrorText": "The value of accesories cannot be less that R100.00",
              "maxErrorText": "The size shouldThe value of accessories cannot be greater than R1000,000.00",
              "step": 1000
            },
            {
              "type": "boolean",
              "name": "v_financed",
              "title": "Is the Vehicle Financed?",
              "requiredErrorText": "Is this vehicle full paid? or still under financing?"
            },
            {
              "type": "text",
              "name": "v_financeInstitution",
              "visibleIf": "{panel.v_financed} = true",
              "title": "Finance Institution (optional)",
              "validators": [
                {
                  "type": "text",
                  "text": "Finance Institution should be atleast 2 characters",
                  "minLength": 2
                }
              ],
              "maxLength": 50,
              "placeholder": "e.g., WesBank, MFC"
            },
            {
              "type": "dropdown",
              "name": "v_useType",
              "title": "Primary Use",
              "isRequired": true,
              "requiredErrorText": "Primary use is required",
              "choices": [
                "Private",
                {
                  "value": "BusinessUse",
                  "text": "Business"
                },
                "Commercial"
              ]
            },
            {
              "type": "radiogroup",
              "name": "v_insuredValueType",
              "title": "Insured Value Type",
              "isRequired": true,
              "requiredErrorText": "Insured value type is required",
              "choices": [
                "Retail"
              ]
            },
            {
              "type": "text",
              "name": "v_retailValue",
              "visibleIf": "{panel.v_insuredValueType} = 'Retail'",
              "title": "Retail Value (ZAR)",
              "requiredIf": "{panel.v_insuredValueType} = 'Retail'",
              "validators": [
                {
                  "type": "numeric",
                  "text": "Retail value must be at least R20,000.",
                  "minValue": 20000
                },
                {
                  "type": "text",
                  "minLength": 4,
                  "maxLength": 9
                }
              ],
              "inputType": "number",
              "min": 0,
              "step": 1000
            },
            {
              "type": "dropdown",
              "name": "v_coverCode",
              "title": "Cover Type",
              "defaultValue": "Comprehensive",
              "isRequired": true,
              "choices": [
                "Comprehensive"
              ]
            },
            {
              "type": "dropdown",
              "name": "v_overnightParkingSituation",
              "title": "Where is the vehicle parked overnight?",
              "isRequired": true,
              "choices": [
                "Garage",
                "Carport",
                {
                  "value": "InTheOpen",
                  "text": "In the open (yard/street)"
                },
                {
                  "value": "Unconfirmed",
                  "text": "Unconfirmed/varies"
                }
              ]
            },
            {
              "type": "boolean",
              "name": "v_accessControl",
              "title": "Access Controlled Complex/Building?",
              "isRequired": true
            },
            {
              "type": "boolean",
              "name": "v_securityGuard",
              "title": "Security Guard on site?",
              "isRequired": true
            },
            {
              "type": "boolean",
              "name": "v_trackingDevice",
              "title": "Approved Tracking Device Installed?",
              "isRequired": true
            },
            {
              "type": "panel",
              "name": "v_vehicleAddress",
              "title": "Is overnight address different to your main address?",
              "elements": [
                {
                  "type": "radiogroup",
                  "name": "v_useMainAddress",
                  "title": "Overnight address",
                  "defaultValue": "main",
                  "isRequired": true,
                  "choices": [
                    {
                      "value": "main",
                      "text": "Same as main address"
                    },
                    {
                      "value": "custom",
                      "text": "Different address"
                    }
                  ]
                },
                {
                  "type": "panel",
                  "name": "v_customOvernightAddress",
                  "visibleIf": "{vehicles[0].v_useMainAddress} = 'custom'",
                  "title": "Overnight Address (for this vehicle)",
                  "elements": [
                    {
                      "type": "text",
                      "name": "v_addr_addressLine",
                      "title": "Street Address",
                      "isRequired": true
                    },
                    {
                      "type": "text",
                      "name": "v_addr_suburb",
                      "title": "Suburb / Area",
                      "isRequired": true
                    },
                    {
                      "type": "text",
                      "name": "v_addr_postalCode",
                      "title": "Postal Code",
                      "isRequired": true,
                      "inputType": "number"
                    },
                    {
                      "type": "text",
                      "name": "v_addr_latitude",
                      "visible": false,
                      "title": "Latitude (optional)",
                      "inputType": "number"
                    },
                    {
                      "type": "text",
                      "name": "v_addr_longitude",
                      "visible": false,
                      "title": "Longitude (optional)",
                      "inputType": "number"
                    }
                  ]
                }
              ]
            },
            {
              "type": "panel",
              "name": "v_ownerDetails",
              "title": "Owner",
              "elements": [
                {
                  "type": "boolean",
                  "name": "v_owner_isOwnerPolicyholder",
                  "title": "Are you the registered owner?",
                  "isRequired": true,
                  "requiredErrorText": "Registered owner is required"
                },
                {
                  "type": "text",
                  "name": "v_owner_fullName",
                  "visibleIf": "{panel.v_owner_isOwnerPolicyholder} = false",
                  "title": "Owner Full Name",
                  "requiredIf": "{panel.v_owner_isOwnerPolicyholder} = false",
                  "requiredErrorText": "Full name is required",
                  "validators": [
                    {
                      "type": "text",
                      "text": "Full name should be atleast 2 characters",
                      "minLength": 2
                    }
                  ],
                  "autocomplete": "name",
                  "maxLength": 30
                },
                {
                  "type": "text",
                  "name": "v_owner_id",
                  "visibleIf": "{panel.v_owner_isOwnerPolicyholder} = false",
                  "title": "Owner ID/Passport",
                  "requiredIf": "{panel.v_owner_isOwnerPolicyholder} = false",
                  "requiredErrorText": "A valid Id number or passport number required",
                  "validators": [
                    {
                      "type": "text",
                      "text": "Enter a valid Id or Passport",
                      "minLength": 9
                    }
                  ],
                  "maxLength": 13
                },
                {
                  "type": "dropdown",
                  "name": "v_owner_relation",
                  "visible": false,
                  "visibleIf": "{panel.v_owner_isOwnerPolicyholder} = false",
                  "title": "Relationship to owner",
                  "requiredIf": "{panel.v_owner_isOwnerPolicyholder} = false",
                  "choices": [
                    "Self",
                    "Living together",
                    "Spouse",
                    "Parent",
                    "Child",
                    "Sibling",
                    "Other"
                  ]
                }
              ]
            },
            {
              "type": "panel",
              "name": "v_driverDetails",
              "title": "Regular Driver",
              "elements": [
                {
                  "type": "boolean",
                  "name": "v_driver_isDriverPolicyholder",
                  "title": "Are you the regular driver?",
                  "requiredErrorText": "Regular driver required"
                },
                {
                  "type": "text",
                  "name": "v_driver_fullName",
                  "visibleIf": "{panel.v_driver_isDriverPolicyholder} = false",
                  "title": "Full Name",
                  "requiredIf": "{panel.v_driver_isDriverPolicyholder} = false",
                  "requiredErrorText": "Full name is required",
                  "validators": [
                    {
                      "type": "text",
                      "text": "Full name must be atleast 2 characters",
                      "minLength": 2
                    }
                  ],
                  "autocomplete": "name",
                  "maxLength": 30,
                  "placeholder": "{firstName}"
                },
                {
                  "type": "text",
                  "name": "v_driver_mobileNumber",
                  "visibleIf": "{panel.v_driver_isDriverPolicyholder} = false and {mobileNumber} empty",
                  "title": "Contact Number",
                  "validators": [
                    {
                      "type": "regex",
                      "text": "10 digits, e.g., 0821234567.",
                      "regex": "^[0-9]{10}$"
                    }
                  ],
                  "inputType": "tel",
                  "autocomplete": "tel-local"
                },
                {
                  "type": "text",
                  "name": "v_driver_emailAddress1",
                  "visibleIf": "{panel.v_driver_isDriverPolicyholder} = false",
                  "title": "Email Address",
                  "requiredIf": "{panel.v_driver_isDriverPolicyholder} = false",
                  "validators": [
                    {
                      "type": "regex",
                      "text": "10 digits, e.g., 0821234567.",
                      "regex": "^[0-9]{10}$"
                    }
                  ],
                  "inputType": "email",
                  "autocomplete": "email"
                },
                {
                  "type": "text",
                  "name": "v_driver_idNumber",
                  "visibleIf": "{panel.v_driver_isDriverPolicyholder} = false and {idNumber} empty",
                  "title": "Driver ID/Passport",
                  "requiredErrorText": "ID/Passport is required",
                  "validators": [
                    {
                      "type": "text",
                      "text": "ID/Passport must be atleast 9 characters",
                      "minLength": 2
                    }
                  ],
                  "maxLength": 13
                },
                {
                  "type": "dropdown",
                  "name": "v_driver_maritalStatus",
                  "title": "Marital Status",
                  "isRequired": true,
                  "requiredErrorText": "Marital status is required",
                  "choices": [
                    "Single",
                    "Married",
                    "Divorced",
                    "Widowed",
                    "LivingTogether",
                    "Annulment"
                  ]
                },
                {
                  "type": "radiogroup",
                  "name": "v_driver_currentlyInsured",
                  "title": "Currently insured elsewhere?",
                  "isRequired": true,
                  "requiredErrorText": "are you currently insured is required",
                  "choices": [
                    {
                      "value": true,
                      "text": "Yes"
                    },
                    {
                      "value": false,
                      "text": "No"
                    }
                  ]
                },
                {
                  "type": "text",
                  "name": "v_driver_yearsWithoutClaims",
                  "title": "Years without claims",
                  "defaultValue": 0,
                  "isRequired": true,
                  "validators": [
                    {
                      "type": "numeric",
                      "text": "0–25 years.",
                      "minValue": 0,
                      "maxValue": 25
                    }
                  ],
                  "inputType": "number",
                  "minErrorText": "The year/s should not be less than {0}",
                  "maxErrorText": "The yer/s should not be greater than {0}"
                },
                {
                  "type": "text",
                  "name": "v_driver_emailAddress",
                  "visibleIf": "{panel.v_driver_isDriverPolicyholder} = false and {email} empty",
                  "title": "Driver Email",
                  "isRequired": true,
                  "defaultDisplayValue": "emailAddress",
                  "inputType": "email",
                  "autocomplete": "email"
                },
                {
                  "type": "text",
                  "name": "v_driver_prvInsLosses",
                  "title": "Previous insurance losses (count)",
                  "defaultValue": 0,
                  "isRequired": true,
                  "validators": [
                    {
                      "type": "numeric",
                      "minValue": 0,
                      "maxValue": 20
                    }
                  ],
                  "inputType": "number"
                },
                {
                  "type": "text",
                  "name": "v_driver_licenseIssueDate",
                  "title": "License Issue Date",
                  "isRequired": true,
                  "requiredErrorText": "License issue date is required",
                  "inputType": "date"
                },
                {
                  "type": "text",
                  "name": "v_driver_dateOfBirth",
                  "visibleIf": "{idNumber} empty and {panel.v_driver_isDriverPolicyholder} = true and {panel.v_driver_idNumber} empty",
                  "title": "Date of Birth",
                  "requiredIf": "{idNumber} empty and {panel.v_driver_isDriverPolicyholder} = true and {panel.v_driver_idNumber} empty",
                  "inputType": "date"
                },
                {
                  "type": "boolean",
                  "name": "v_driver_hasClaimed",
                  "title": "Has the driver claimed in the last 5 years?",
                  "isRequired": true
                }
              ]
            },
            {
              "type": "paneldynamic",
              "name": "v_claims",
              "visibleIf": "{panel.v_driver_hasClaimed} = true",
              "title": "Claims (last 5 years)",
              "description": "Add each claim/accident if any.",
              "requiredIf": "{panel.v_driver_hasClaimed} = true",
              "templateElements": [
                {
                  "type": "text",
                  "name": "v_claim_incidentYear",
                  "title": "Year of incident",
                  "validators": [
                    {
                      "type": "numeric",
                      "text": "Enter year 2000–2025.",
                      "minValue": 2000,
                      "maxValue": 2025
                    }
                  ],
                  "inputType": "number"
                },
                {
                  "type": "text",
                  "name": "v_claim_amount",
                  "title": "Claim Amount (ZAR)",
                  "validators": [
                    {
                      "type": "numeric",
                      "minValue": 0
                    }
                  ],
                  "inputType": "number"
                },
                {
                  "type": "boolean",
                  "name": "v_claim_wasRejected",
                  "title": "Claim rejected?"
                },
                {
                  "type": "comment",
                  "name": "v_claim_description",
                  "title": "Claim description (what happened?)"
                }
              ],
              "addPanelText": "Add a claim",
              "removePanelText": "Remove claim"
            }
          ],
          "noEntriesText": "No vehicles added yet.",
          "panelCount": 1,
          "minPanelCount": 1,
          "confirmDelete": true,
          "confirmDeleteText": "Remove this vehicle?",
          "addPanelText": "Add Another Vehicle",
          "removePanelText": "Remove Vehicle"
        }
      ]
    },
    {
      "name": "userTypeAgent",
      "title": "Who is submitting?",
      "description": "Tell us which branch are you quoting from",
      "elements": [
        {
          "type": "panel",
          "name": "agentDetailsPanel",
          "title": "Sales Agent Details",
          "elements": [
            {
              "type": "text",
              "name": "agentName",
              "title": "Agent Full Name",
              "isRequired": true,
              "requiredErrorText": "full name is required",
              "validators": [
                {
                  "type": "text",
                  "text": "Fullname must be atleast 2 characters",
                  "minLength": 2
                }
              ],
              "maxLength": 30
            },
            {
              "type": "text",
              "name": "agentEmail",
              "visibleIf": "{agentName} notempty",
              "title": "Agent  Email ",
              "isRequired": true,
              "requiredErrorText": "Email is required",
              "inputType": "email",
              "autocomplete": "email",
              "maxLength": 50
            },
            {
              "type": "dropdown",
              "name": "agentBranch",
              "visibleIf": "{agentEmail} notempty",
              "title": "Agent Branch",
              "description": "Surestrat branches",
              "isRequired": true,
              "choices": [
                {
                  "value": "Lenasia-HeadOffice",
                  "text": "Lenasia Head Office"
                },
                {
                  "value": "\tLenasia-Riaad",
                  "text": "Lenasia Riaad"
                },
                {
                  "value": "\tLenasia-Ziyaad",
                  "text": "Lenasia Ziyaad"
                },
                {
                  "value": "\tLenasia-Tariq",
                  "text": "Lenasia Tariq"
                },
                {
                  "value": "\tRosebank-Irshad",
                  "text": "Rosebank Irshad"
                },
                {
                  "value": "\tVereeniging-Nur",
                  "text": "Vereeniging Nur"
                },
                {
                  "value": "\tKZN-Owen",
                  "text": "KZN Owen"
                },
                {
                  "value": "\tKZN-Leon",
                  "text": "KZN Leon"
                },
                {
                  "value": "\tEast-Rand-Johan",
                  "text": "East-Rand Johan"
                },
                {
                  "value": "\tPretoria-Tanya",
                  "text": "Pretoria Tanya"
                },
                {
                  "value": "\tRivonia-dean",
                  "text": "Rivonia Dean"
                },
                {
                  "value": "\tCape-Town-Nur",
                  "text": "Cape-Town Nur"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "triggers": [
    {
      "type": "setvalue",
      "expression": "!{externalReferenceId}",
      "setToName": "externalReferenceId",
      "setValue": "ref-{date}"
    },
    {
      "type": "setvalue",
      "setToName": "source",
      "setValue": "SureStrat"
    }
  ],
  "calculatedValues": [
    {
      "name": "source",
      "expression": "'SureStrat'"
    }
  ],
  "partialSendEnabled": true,
  "showCompletePage": false,
  "showQuestionNumbers": "onPage",
  "showProgressBar": true,
  "progressBarLocation": "aboveheader",
  "progressBarType": "questions",
  "checkErrorsMode": "onValueChanged",
  "pagePrevText": "Previous",
  "completeText": "Calculate quote",
  "previewText": "Preview quote",
  "editText": "Edit quoute",
  "showPreviewBeforeComplete": true,
  "previewMode": "answeredQuestions",
  "gridLayoutEnabled": true,
  "headerView": "advanced"
}