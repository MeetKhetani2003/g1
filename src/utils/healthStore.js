// src/utils/healthStore.js
// Centralized, reactive state store for G1 Healthcare Ecosystem
// Persists in localStorage with realistic demonstration data

import { providers as initialProviders } from "../data/providers";
import {
  DEFAULT_GOV_SCHEMES,
  DEFAULT_CAMPS,
  DEFAULT_AMBULANCES,
  DEFAULT_LABORATORIES,
  DEFAULT_PHARMACIES,
  DEFAULT_REGISTRATIONS,
  DISEASE_DIRECTORY,
} from "../data/healthcareEcosystem";

const STORAGE_KEYS = {
  PATIENT: "g1_patient_profile",
  SERVICES: "g1_services_data",
  LAB_TESTS: "g1_lab_tests_data",
  LAB_INQUIRIES: "g1_lab_inquiries_data",
  STAFF: "g1_staff_data",
  BOOKINGS: "g1_bookings_data",
  DOCTORS: "g1_doctors_data",
  PROVIDERS: "g1_providers_data",
  GOV_SCHEMES: "g1_gov_schemes_data",
  CAMPS: "g1_camps_data",
  AMBULANCES: "g1_ambulances_data",
  AMBULANCE_BOOKINGS: "g1_ambulance_bookings_data",
  LABORATORIES: "g1_laboratories_data",
  PHARMACIES: "g1_pharmacies_data",
  PHARMACY_ORDERS: "g1_pharmacy_orders_data",
  REGISTRATIONS: "g1_partner_registrations_data",
};

// Default seed data
const DEFAULT_PATIENT = {
  id: "P-101",
  healthId: "G1-849201",
  name: "Dr. Ananya Sharma",
  email: "ananya.sharma@example.com",
  phone: "+91 98765 43210",
  age: "32",
  gender: "Female",
  bloodGroup: "O+",
  dob: "1994-06-15",
  address: "42, Green Valley Enclave, Ring Road, Ahmedabad, Gujarat 380054",
  city: "Ahmedabad",
  photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  emergencyContact: "Vikram Sharma (+91 98250 99881 - Brother)",
  allergies: "Penicillin, Dust Mites",
  chronicConditions: "Mild Asthma (Controlled)",
  membershipTier: "Gold Life Member",
  issuedDate: "12 Oct 2024",
  validTill: "Lifetime Verified",
  governmentSchemes: [
    {
      id: "sch-pmjay-01",
      schemeId: "pmjay",
      schemeName: "Ayushman Bharat PM-JAY",
      cardNo: "AB-GJ-2024-984210",
      familyId: "NFSA-GJ-449102",
      coverageAmount: "₹5,00,000 / year",
      status: "Active & Verified",
      verifiedByAdmin: true,
      validTill: "Lifetime Verified",
      treatmentsCovered: [
        "Cardiology & Stenting",
        "Secondary Hospitalization",
        "General & Laparoscopic Surgery",
        "ICU & Critical Care",
        "Oncology & Chemotherapy",
        "Orthopedic Joint Replacement",
      ],
      customValues: {
        "State Health ID": "GJ-AHM-9912",
        "Ration Card Category": "Priority Household (PHH)",
      },
    },
    {
      id: "sch-maa-02",
      schemeId: "maa",
      schemeName: "Mukhyamantri Amrutum (MAA) Card",
      cardNo: "MAA-2023-881920",
      familyId: "FAM-GJ-8819",
      coverageAmount: "₹5,00,000 / family",
      status: "Active",
      verifiedByAdmin: true,
      validTill: "31 Dec 2027",
      treatmentsCovered: [
        "Cardiovascular Surgeries",
        "Neuro Surgery",
        "Burns & Polytrauma",
        "Renal Diseases & Dialysis",
      ],
      customValues: {
        District: "Ahmedabad",
        "Income Certificate Ref": "INC-2024-4410",
      },
    },
  ],
  insurancePolicies: [
    {
      id: "ins-01",
      provider: "Star Health & Allied Insurance",
      policyNo: "SH-COMP-8829104",
      policyType: "Family Health Optima Comprehensive Floater",
      sumInsured: "₹10,00,000",
      tpaDesk: "Medi Assist TPA Pvt Ltd",
      validTill: "24 Nov 2026",
      status: "Active (Cashless Empanelled)",
      cashlessEligible: true,
    },
  ],
  consultationHistory: [
    {
      id: "CONS-7821",
      date: "14 Jan 2026",
      doctorName: "Dr. Ananya Rao",
      doctorImage:
        "https://images.pexels.com/photos/7195113/pexels-photo-7195113.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      specialty: "Internal Medicine & Diabetes",
      mode: "Offline In-Clinic Visit",
      hospital: "CityCare Multispecialty Hospital",
      diagnosis: "Mild Bronchospasm & Seasonal Upper Respiratory Infection",
      prescription: [
        { medicine: "Tab Amoxicillin 500mg", dosage: "1-0-1 (5 Days)", instructions: "After food" },
        { medicine: "Tab Montelukast + Levocetirizine", dosage: "0-0-1 (5 Days)", instructions: "Before bed" },
        { medicine: "Inhaler Budecort 200mcg", dosage: "2 Puffs Twice Daily", instructions: "Rinse mouth after use" },
      ],
      doctorNotes: "Chest clear bilaterally on follow-up, advised steam inhalation and avoid chilled beverages.",
    },
    {
      id: "CONS-7410",
      date: "02 Dec 2025",
      doctorName: "Dr. Rajesh K. Mehta",
      doctorImage:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
      specialty: "Cardiology & Interventional Heart Care",
      mode: "Online Video Consultation",
      hospital: "CityCare Heart Institute",
      diagnosis: "Routine Preventive Cardiac Screen - Stage 1 Essential Hypertension",
      prescription: [
        { medicine: "Tab Telmisartan 40mg", dosage: "1-0-0 (Morning)", instructions: "With water before breakfast" },
        { medicine: "Tab Atorvastatin 10mg", dosage: "0-0-1 (Night)", instructions: "After dinner" },
      ],
      doctorNotes: "BP 132/86 mmHg. Advised 40 mins daily brisk walk and low sodium diet.",
    },
  ],
};

const DEFAULT_SERVICES = [
  {
    id: "srv-cardiology",
    slug: "cardiology",
    title: "Cardiology & Heart Care",
    category: "Specialized Care",
    short: "Comprehensive cardiac assessment, ECG, Echo, and preventive heart screenings.",
    icon: "HeartHandshake",
    badge: "Most Requested",
    diagnosticSteps: [
      {
        id: "step-1",
        question: "What primary symptoms are you or the patient experiencing?",
        type: "multiselect",
        options: [
          "Chest discomfort or heaviness",
          "Shortness of breath on mild exertion",
          "Irregular heartbeat / Palpitations",
          "Dizziness or lightheadedness",
          "Routine preventive checkup only",
        ],
      },
      {
        id: "step-2",
        question: "How long have you observed these symptoms?",
        type: "singleselect",
        options: [
          "Started less than 48 hours ago",
          "1 to 2 weeks",
          "More than a month (chronic)",
          "No symptoms (routine checkup)",
        ],
      },
      {
        id: "step-3",
        question: "Do you have any documented pre-existing health conditions?",
        type: "multiselect",
        options: [
          "High Blood Pressure (Hypertension)",
          "High Cholesterol",
          "Diabetes Mellitus",
          "Family history of early heart disease",
          "None of the above",
        ],
      },
    ],
    packages: [
      {
        id: "cardio-silver",
        name: "Essential Heart Screen",
        tier: "Silver",
        price: 1499,
        originalPrice: 2499,
        features: ["Resting ECG", "Lipid Profile (8 parameters)", "Doctor Tele-Consultation", "Digital Report in 4 hrs"],
      },
      {
        id: "cardio-gold",
        name: "Comprehensive Cardio Check",
        tier: "Gold",
        popular: true,
        price: 2999,
        originalPrice: 4999,
        features: [
          "2D Echocardiography",
          "TMT / Stress Test",
          "Complete Blood & Lipid Profile",
          "Senior Cardiologist Consultation",
          "Dietary Heart Risk Assessment",
        ],
      },
      {
        id: "cardio-platinum",
        name: "Advanced Cardio & Vascular Scan",
        tier: "Platinum",
        price: 5499,
        originalPrice: 8999,
        features: [
          "Carotid Doppler Ultrasound",
          "Holter Monitoring (24h) if required",
          "High-Sensitivity Troponin-I Test",
          "1-on-1 VIP Cardiologist Review",
          "Free 30-Day Follow-Up",
        ],
      },
    ],
  },
  {
    id: "srv-ortho",
    slug: "orthopedics",
    title: "Orthopedics & Joint Care",
    category: "Surgical & Rehab",
    short: "Specialized consultation for knee pain, arthritis, spine, and sports injuries.",
    icon: "Building2",
    badge: "Specialized",
    diagnosticSteps: [
      {
        id: "step-1",
        question: "Which anatomical joint or region is causing discomfort?",
        type: "multiselect",
        options: ["Knee Joint (Bilateral/Unilateral)", "Lower Back / Spine", "Shoulder or Rotator Cuff", "Hip Joint", "Neck & Cervical"],
      },
      {
        id: "step-2",
        question: "What is the severity of your daily mobility restriction?",
        type: "singleselect",
        options: ["Mild stiffness in mornings", "Pain during climbing stairs", "Constant pain even while resting", "Recent sports/fall injury"],
      },
      {
        id: "step-3",
        question: "Have you undergone any previous imaging?",
        type: "singleselect",
        options: ["X-Ray taken recently", "MRI scan done", "No prior scans done yet"],
      },
    ],
    packages: [
      {
        id: "ortho-silver",
        name: "Joint Mobility Assessment",
        tier: "Silver",
        price: 1199,
        originalPrice: 1999,
        features: ["Digital Joint X-Ray (2 Views)", "Orthopedic Specialist Review", "Posture & Gait Guidance"],
      },
      {
        id: "ortho-gold",
        name: "Arthritis & Spine Care Package",
        tier: "Gold",
        popular: true,
        price: 2499,
        originalPrice: 3999,
        features: ["Uric Acid & RA Factor Tests", "Digital X-Ray + Bone Mineral Density", "Senior Orthopedic Surgeon Consult", "7-Day Physio Protocol"],
      },
    ],
  },
  {
    id: "srv-homecare",
    slug: "home-care",
    title: "Home Healthcare & Nursing",
    category: "At Home Services",
    short: "ICU setup at home, certified nurse visits, elderly care, and post-operative recovery.",
    icon: "HousePlus",
    badge: "24/7 Available",
    diagnosticSteps: [
      {
        id: "step-1",
        question: "What primary home care service do you need?",
        type: "singleselect",
        options: ["Post-Surgery Patient Nursing", "Elderly Assistance & Daily Vitals", "Wound Dressing / IV Infusion", "Physiotherapy at Home"],
      },
      {
        id: "step-2",
        question: "Required frequency or duration of nursing support?",
        type: "singleselect",
        options: ["Single Visit (1-2 Hours)", "12-Hour Day/Night Shift", "24/7 Live-In ICU Nursing", "Weekly Scheduled Visits"],
      },
    ],
    packages: [
      {
        id: "home-silver",
        name: "Single Certified Nurse Visit",
        tier: "Silver",
        price: 799,
        originalPrice: 1200,
        features: ["Vitals check (BP, Sugar, SpO2)", "Dressing / Injections / IV", "Doctor Tele-Update"],
      },
      {
        id: "home-gold",
        name: "Weekly Recovery Nursing Care",
        tier: "Gold",
        popular: true,
        price: 4999,
        originalPrice: 7500,
        features: ["7 Days Daily Nurse Visit", "Continuous Vitals Log & Charting", "Bedridden Patient Care & Hygiene", "Dedicated On-Call Physician"],
      },
    ],
  },
  {
    id: "srv-ambulance",
    slug: "emergency-ambulance",
    title: "24/7 Emergency Ambulance",
    category: "Emergency Care",
    short: "Swift response BLS & ACLS ambulances equipped with oxygen, ventilators, and paramedical staff.",
    icon: "Ambulance",
    badge: "Instant SOS",
    diagnosticSteps: [
      {
        id: "step-1",
        question: "What type of ambulance support is needed?",
        type: "singleselect",
        options: ["Advanced Cardiac Life Support (ACLS with Ventilator)", "Basic Life Support (BLS with Oxygen)", "Patient Transfer / Non-Emergency"],
      },
      {
        id: "step-2",
        question: "What is the patient's immediate consciousness level?",
        type: "singleselect",
        options: ["Conscious & Alert", "Drowsy / Confused", "Unconscious / Critical", "Severe Trauma / Accident"],
      },
    ],
    packages: [
      {
        id: "amb-bls",
        name: "City Basic Life Support (BLS)",
        tier: "Standard",
        price: 1800,
        originalPrice: 2500,
        features: ["Oxygen Cylinder & Stretcher", "Trained Emergency EMT", "Fast Dispatch under 15 Mins", "Hospital Handover Assistance"],
      },
      {
        id: "amb-acls",
        name: "Cardiac ICU Ambulance (ACLS)",
        tier: "ICU",
        popular: true,
        price: 3800,
        originalPrice: 5500,
        features: ["Transport Ventilator & Multi-Para Monitor", "Defibrillator on board", "Emergency Medical Officer (Doctor/Paramedic)", "Direct Emergency Room Admission Coordination"],
      },
    ],
  },
];

const DEFAULT_LAB_TESTS = [
  {
    id: "lab-101",
    title: "G1 Complete Full Body Health Checkup",
    slug: "complete-full-body-checkup",
    category: "Full Body Checkup",
    price: 1299,
    originalPrice: 3500,
    discountPercentage: 63,
    parametersCount: 83,
    fastingRequired: "10-12 hrs fasting required",
    sampleType: "Blood & Urine",
    turnaround: "Report within 12 Hours",
    popular: true,
    description: "Evaluates Liver, Kidney, Thyroid, Heart, Blood Sugar, CBC, and Lipid profiles with home sample pickup.",
    inclusions: [
      "Complete Hemogram (CBC - 24 params)",
      "Lipid Profile for Heart (8 params)",
      "Liver Function Test (LFT - 12 params)",
      "Kidney Function Test (KFT - 10 params)",
      "Thyroid Profile Total (T3, T4, TSH)",
      "Fasting Blood Sugar & HbA1c",
      "Urine Routine & Microscopic (20 params)",
      "Doctor Report Review Consultation",
    ],
  },
  {
    id: "lab-102",
    title: "Advanced Diabetes & HbA1c Panel",
    slug: "diabetes-hba1c-panel",
    category: "Diabetes",
    price: 699,
    originalPrice: 1500,
    discountPercentage: 53,
    parametersCount: 6,
    fastingRequired: "8-10 hrs fasting recommended",
    sampleType: "Blood",
    turnaround: "Same Day (6 Hours)",
    popular: true,
    description: "Comprehensive 3-month average glucose assessment with microalbuminuria detection.",
    inclusions: ["HbA1c (Glycosylated Hemoglobin)", "Average Estimated Blood Glucose", "Fasting Blood Sugar", "Urine Microalbumin", "Creatinine"],
  },
  {
    id: "lab-103",
    title: "Thyroid Profile Total (T3, T4, TSH)",
    slug: "thyroid-profile-total",
    category: "Hormone & Thyroid",
    price: 399,
    originalPrice: 900,
    discountPercentage: 55,
    parametersCount: 3,
    fastingRequired: "Not strictly required (Morning sample preferred)",
    sampleType: "Blood",
    turnaround: "Report in 8 Hours",
    popular: false,
    description: "Crucial screening for hyperthyroidism, hypothyroidism, fatigue, and metabolism disorders.",
    inclusions: ["Total Triiodothyronine (T3)", "Total Thyroxine (T4)", "Thyroid Stimulating Hormone (TSH Ultra-sensitive)"],
  },
  {
    id: "lab-104",
    title: "Cardiac Risk Lipid Profile",
    slug: "cardiac-risk-lipid-profile",
    category: "Heart Care",
    price: 499,
    originalPrice: 1100,
    discountPercentage: 55,
    parametersCount: 9,
    fastingRequired: "12 hrs strict fasting required",
    sampleType: "Blood",
    turnaround: "Report in 6 Hours",
    popular: true,
    description: "Measures good (HDL) and bad (LDL) cholesterol, Triglycerides, and overall coronary risk ratios.",
    inclusions: ["Total Cholesterol", "HDL Cholesterol", "LDL Cholesterol", "VLDL Cholesterol", "Triglycerides", "TC/HDL Ratio", "LDL/HDL Ratio"],
  },
  {
    id: "lab-105",
    title: "Vitamin D & Vitamin B12 Deficiency Duo",
    slug: "vitamin-d-b12-duo",
    category: "Vitamins & Immunity",
    price: 999,
    originalPrice: 2400,
    discountPercentage: 58,
    parametersCount: 2,
    fastingRequired: "Fasting not required",
    sampleType: "Blood",
    turnaround: "Report within 18 Hours",
    popular: true,
    description: "Crucial for bone density, chronic fatigue, nerve pain, hair fall, and immunity strength.",
    inclusions: ["Vitamin D 25-Hydroxy", "Vitamin B12 (Cyanocobalamin)"],
  },
  {
    id: "lab-106",
    title: "Liver Function Test (LFT) Comprehensive",
    slug: "liver-function-test",
    category: "Organ Profile",
    price: 549,
    originalPrice: 1200,
    discountPercentage: 54,
    parametersCount: 12,
    fastingRequired: "8-10 hrs fasting required",
    sampleType: "Blood",
    turnaround: "Report in 8 Hours",
    popular: false,
    description: "Evaluates enzymes, proteins, and bilirubin for liver health, jaundice, and medication safety.",
    inclusions: ["SGOT / AST", "SGPT / ALT", "Total Bilirubin", "Direct & Indirect Bilirubin", "Alkaline Phosphatase", "Total Protein & Albumin"],
  },
];

const DEFAULT_STAFF = [
  {
    id: "stf-01",
    name: "Dr. Rajesh K. Mehta",
    role: "Senior Cardiologist",
    department: "Cardiology",
    experience: "18 Years",
    phone: "+91 98250 11223",
    email: "rajesh.mehta@g1health.org",
    status: "Active",
    rating: 4.9,
    assignedCases: 14,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "stf-02",
    name: "Dr. Sunita Deshmukh",
    role: "Chief Orthopedic Surgeon",
    department: "Orthopedics",
    experience: "15 Years",
    phone: "+91 98250 44556",
    email: "sunita.deshmukh@g1health.org",
    status: "Active",
    rating: 4.8,
    assignedCases: 11,
    avatar: "https://images.unsplash.com/photo-1594824813589-a292997aa775?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "stf-03",
    name: "Nurse Neha Parmar (B.Sc Nursing)",
    role: "Head ICU Nurse",
    department: "Home Healthcare",
    experience: "9 Years",
    phone: "+91 98250 77889",
    email: "neha.parmar@g1health.org",
    status: "On-Duty",
    rating: 4.95,
    assignedCases: 8,
    avatar: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "stf-04",
    name: "Mahesh Solanki",
    role: "Certified Senior Phlebotomist",
    department: "Diagnostic Labs",
    experience: "7 Years",
    phone: "+91 98250 99001",
    email: "mahesh.solanki@g1health.org",
    status: "In Field",
    rating: 4.85,
    assignedCases: 19,
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "stf-05",
    name: "Prakash Vaghela",
    role: "Emergency EMT & Pilot",
    department: "Ambulance Dispatch",
    experience: "6 Years",
    phone: "+91 98250 33445",
    email: "prakash.vaghela@g1health.org",
    status: "Standby",
    rating: 4.9,
    assignedCases: 6,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
];

const DEFAULT_DOCTORS = [
  {
    id: "doc-rajesh-mehta",
    slug: "dr-rajesh-mehta",
    name: "Dr. Rajesh K. Mehta",
    qualification: "MBBS, MD (Medicine), DM (Cardiology), FACC (USA)",
    department: "Cardiology",
    specialty: "Interventional Cardiology & Heart Failure",
    experience: "18 Years",
    rating: 4.9,
    reviewsCount: 384,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    city: "Mumbai",
    hospitalAffiliation: "Lilavati Hospital & Asian Heart Institute",
    clinicAddress: "Suite 402, Apex Cardiac Tower, Linking Road, Bandra West, Mumbai",
    consultationFee: 800,
    inClinicAvailable: true,
    status: "Active",
    languages: ["English", "Hindi", "Gujarati", "Marathi"],
    about: "Dr. Rajesh K. Mehta is a distinguished Interventional Cardiologist with over 18 years of clinical expertise. Having performed more than 4,500 complex coronary angioplasties, his approach balances precision intervention with evidence-based lifestyle cardiology.",
    specializations: ["Complex Coronary Angioplasty", "Radial Artery Angiography", "Heart Failure Management", "Preventive Cardiac Care", "Pacemaker Implantation"],
    awards: ["Gold Medalist DM Cardiology", "Times Healthcare Icon 2023", "Fellow of American College of Cardiology"],
    availability: "Mon - Sat: 09:30 AM – 06:30 PM",
    timingSlots: ["09:30 AM", "10:30 AM", "11:45 AM", "02:00 PM", "03:30 PM", "05:15 PM"],
  },
  {
    id: "doc-ananya-rao",
    slug: "dr-ananya-rao",
    name: "Dr. Ananya Rao",
    qualification: "MBBS, MD (Internal Medicine), DNB, FRCP",
    department: "General Medicine",
    specialty: "Internal Medicine & Diabetes Care",
    experience: "14 Years",
    rating: 4.9,
    reviewsCount: 512,
    image: "https://images.pexels.com/photos/7195113/pexels-photo-7195113.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    city: "Bengaluru",
    hospitalAffiliation: "Manipal Hospital & Indiranagar Clinic",
    clinicAddress: "G1 Care Center, 100ft Road, Indiranagar, Bengaluru",
    consultationFee: 600,
    inClinicAvailable: true,
    status: "Active",
    languages: ["English", "Hindi", "Kannada"],
    about: "Dr. Ananya Rao is an empathetic internal medicine consultant specializing in metabolic health, glycemic control in Type 1 & 2 diabetes, thyroid conditions, hypertension, and preventive primary care checkups.",
    specializations: ["Diabetes Mellitus Protocol Care", "Hypertension & Lipid Disorders", "Thyroid Management", "Adult Immunization", "Geriatric Primary Health"],
    awards: ["Fellow of Royal College of Physicians", "Best Physician Award 2022"],
    availability: "Mon - Sat: 10:00 AM – 07:00 PM",
    timingSlots: ["10:00 AM", "11:15 AM", "12:30 PM", "03:00 PM", "04:30 PM", "06:00 PM"],
  },
  {
    id: "doc-sunita-deshmukh",
    slug: "dr-sunita-deshmukh",
    name: "Dr. Sunita Deshmukh",
    qualification: "MBBS, MS (Orthopedics), Joint Replacement Fellow (Germany)",
    department: "Orthopedics",
    specialty: "Robotic Joint Replacement & Arthroscopy",
    experience: "15 Years",
    rating: 4.8,
    reviewsCount: 290,
    image: "https://images.unsplash.com/photo-1594824813589-a292997aa775?auto=format&fit=crop&w=600&q=80",
    city: "Delhi NCR",
    hospitalAffiliation: "Max Super Specialty & Fortis Escorts",
    clinicAddress: "Orthocare Specialists, Sector 62, Noida, Delhi NCR",
    consultationFee: 750,
    inClinicAvailable: true,
    status: "Active",
    languages: ["English", "Hindi", "Punjabi"],
    about: "Dr. Sunita Deshmukh is a senior orthopedic surgeon renowned for robotic-assisted knee and hip replacements, arthroscopic ligament reconstruction, and rapid post-operative recovery programs.",
    specializations: ["Total Knee & Hip Replacement", "Arthroscopic ACL Reconstruction", "Osteoarthritis Pain Care", "Sports Injury Rehabilitation", "Cartilage Preservation"],
    awards: ["Outstanding Orthopedic Surgeon Award 2021", "AO Trauma Faculty Member"],
    availability: "Mon - Fri: 09:00 AM – 05:00 PM",
    timingSlots: ["09:00 AM", "10:30 AM", "11:45 AM", "02:00 PM", "03:30 PM"],
  },
  {
    id: "doc-vikramaditya-sen",
    slug: "dr-vikramaditya-sen",
    name: "Dr. Vikramaditya Sen",
    qualification: "MBBS, MD (Medicine), DM (Neurology), FINR",
    department: "Neurology",
    specialty: "Neurology & Acute Stroke Management",
    experience: "16 Years",
    rating: 4.95,
    reviewsCount: 420,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
    city: "Kolkata",
    hospitalAffiliation: "Apollo Gleneagles Hospital",
    clinicAddress: "NeuroScience Center, Salt Lake Sector 3, Kolkata",
    consultationFee: 900,
    inClinicAvailable: true,
    status: "Active",
    languages: ["English", "Bengali", "Hindi"],
    about: "Dr. Vikramaditya Sen is an esteemed neurologist focused on acute stroke intervention, chronic migraine management, neuro-rehabilitation, seizure disorders, and Parkinson's clinical protocols.",
    specializations: ["Acute Ischemic Stroke", "Epilepsy & Seizure Disorders", "Migraine & Cluster Headaches", "Parkinsonism & Movement Disorders", "Neuro-Electrophysiology"],
    awards: ["World Stroke Organization Fellow", "Eminent Neurologist of the East 2023"],
    availability: "Tue - Sat: 11:00 AM – 07:00 PM",
    timingSlots: ["11:00 AM", "12:15 PM", "02:30 PM", "04:00 PM", "05:30 PM", "06:45 PM"],
  },
  {
    id: "doc-priya-nambiar",
    slug: "dr-priya-nambiar",
    name: "Dr. Priya S. Nambiar",
    qualification: "MBBS, MD (Pediatrics), NICU Fellowship",
    department: "Pediatrics",
    specialty: "Pediatrics & Neonatal Care",
    experience: "12 Years",
    rating: 4.9,
    reviewsCount: 340,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
    city: "Chennai",
    hospitalAffiliation: "Rainbow Children's Hospital",
    clinicAddress: "LittleSteps Pediatric Clinic, 4th Avenue, Anna Nagar, Chennai",
    consultationFee: 550,
    inClinicAvailable: true,
    status: "Active",
    languages: ["English", "Tamil", "Malayalam", "Hindi"],
    about: "Dr. Priya Nambiar is a compassionate pediatrician dedicated to holistic child healthcare, newborn health assessments, milestone developmental monitoring, and pediatric immunization.",
    specializations: ["Newborn & Infant Care", "Childhood Asthma & Allergies", "Developmental Milestones", "Pediatric Nutrition", "Vaccination Schedules"],
    awards: ["IAP Young Pediatrician Award", "Child Health Champion 2024"],
    availability: "Mon - Sat: 09:30 AM – 04:30 PM",
    timingSlots: ["09:30 AM", "10:45 AM", "12:00 PM", "02:00 PM", "03:15 PM"],
  },
  {
    id: "doc-rohan-kapoor",
    slug: "dr-rohan-kapoor",
    name: "Dr. Rohan Kapoor",
    qualification: "MBBS, MD (Dermatology, Venereology & Leprosy)",
    department: "Dermatology",
    specialty: "Clinical Dermatology & Hair Restoration",
    experience: "11 Years",
    rating: 4.85,
    reviewsCount: 275,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80",
    city: "Ahmedabad",
    hospitalAffiliation: "Zydus Hospital & SkinCraft Clinic",
    clinicAddress: "SkinCraft Aesthetics, SG Highway, Bodakdev, Ahmedabad",
    consultationFee: 650,
    inClinicAvailable: true,
    status: "Active",
    languages: ["English", "Hindi", "Gujarati"],
    about: "Dr. Rohan Kapoor specializes in adult and pediatric dermatology, acne scar therapies, eczema, psoriasis management, and advanced hair restoration therapies.",
    specializations: ["Acne & Rosacea Management", "Psoriasis & Eczema Care", "Trichology & Hair Loss Therapies", "Dermatosurgery", "Laser Skin Rejuvenation"],
    awards: ["IADVL Research Excellence Award 2020"],
    availability: "Mon - Sat: 10:30 AM – 07:30 PM",
    timingSlots: ["10:30 AM", "11:45 AM", "01:00 PM", "03:30 PM", "05:00 PM", "06:30 PM"],
  },
];

const DEFAULT_BOOKINGS = [
  {
    id: "BK-89021",
    bookingDate: "2026-10-17 11:30 AM",
    patientId: "G1-849201",
    patientName: "Dr. Ananya Sharma",
    phone: "+91 98765 43210",
    email: "ananya.sharma@example.com",
    serviceTitle: "Cardiology & Heart Care",
    packageTitle: "Comprehensive Cardio Check (Gold)",
    amount: 2999,
    paymentStatus: "PAID",
    paymentMethod: "Razorpay (UPI)",
    razorpayOrderId: "order_Qz891Ka098",
    razorpayPaymentId: "pay_Qz892348kL",
    status: "Confirmed",
    assignedStaff: "Dr. Rajesh K. Mehta",
    diagnosticResponses: [
      { question: "What primary symptoms are you experiencing?", answer: "Chest discomfort or heaviness, Shortness of breath" },
      { question: "How long have you observed these symptoms?", answer: "1 to 2 weeks" },
      { question: "Do you have any documented pre-existing health conditions?", answer: "High Blood Pressure (Hypertension)" },
    ],
  },
  {
    id: "BK-89018",
    bookingDate: "2026-10-17 09:15 AM",
    patientId: "G1-441209",
    patientName: "Rameshwar Patel",
    phone: "+91 98980 12345",
    email: "ramesh.patel22@gmail.com",
    serviceTitle: "Orthopedics & Joint Care",
    packageTitle: "Arthritis & Spine Care Package (Gold)",
    amount: 2499,
    paymentStatus: "FAILED_LEAD",
    paymentMethod: "Razorpay (Card - Dropped / Timed Out)",
    razorpayOrderId: "order_Qz6709Ka11",
    razorpayPaymentId: null,
    status: "Tele-Call Lead Pending",
    assignedStaff: "Needs Call Desk Follow-up",
    diagnosticResponses: [
      { question: "Which anatomical joint or region is causing discomfort?", answer: "Knee Joint (Bilateral), Lower Back / Spine" },
      { question: "What is the severity of your daily mobility restriction?", answer: "Pain during climbing stairs" },
      { question: "Have you undergone any previous imaging?", answer: "No prior scans done yet" },
    ],
  },
  {
    id: "BK-88992",
    bookingDate: "2026-10-16 04:40 PM",
    patientId: "G1-612984",
    patientName: "Sunil Joshi",
    phone: "+91 97240 55432",
    email: "sunil.joshi@outlook.com",
    serviceTitle: "Home Healthcare & Nursing",
    packageTitle: "Weekly Recovery Nursing Care (Gold)",
    amount: 4999,
    paymentStatus: "PAID",
    paymentMethod: "Razorpay (NetBanking)",
    razorpayOrderId: "order_Qz5510Ka00",
    razorpayPaymentId: "pay_Qz552233Nb",
    status: "In Progress",
    assignedStaff: "Nurse Neha Parmar (B.Sc Nursing)",
    diagnosticResponses: [
      { question: "What primary home care service do you need?", answer: "Post-Surgery Patient Nursing" },
      { question: "Required frequency or duration of nursing support?", answer: "Weekly Scheduled Visits" },
    ],
  },
];

const DEFAULT_LAB_INQUIRIES = [
  {
    id: "LAB-INQ-401",
    testTitle: "G1 Complete Full Body Health Checkup",
    patientName: "Dr. Ananya Sharma",
    phone: "+91 98765 43210",
    email: "ananya.sharma@example.com",
    amount: 1299,
    date: "2026-10-18",
    slot: "07:30 AM - 08:30 AM (Fasting Sample)",
    address: "42, Green Valley Enclave, Ring Road, Ahmedabad",
    prescriptionUrl: null,
    notes: "Patient prefers gentle vein needle for blood collection",
    status: "Phlebotomist Assigned",
    assignedStaff: "Mahesh Solanki",
    paymentStatus: "PAID",
    paymentMethod: "Razorpay",
    createdAt: "2026-10-17 12:45 PM",
  },
  {
    id: "LAB-INQ-402",
    testTitle: "Advanced Diabetes & HbA1c Panel",
    patientName: "Mohanlal B. Shah",
    phone: "+91 98240 77112",
    email: "mbshah@yahoo.com",
    amount: 699,
    date: "2026-10-19",
    slot: "08:30 AM - 09:30 AM",
    address: "B-12, Shukan Elegance, Satellite, Ahmedabad",
    prescriptionUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
    notes: "Diabetic patient for 12 years. Regular monitoring.",
    status: "Pending Phlebotomist",
    assignedStaff: "Unassigned",
    paymentStatus: "Pay on Collection (Cash/UPI)",
    paymentMethod: "COD",
    createdAt: "2026-10-17 02:10 PM",
  },
];

// Browser storage helper
function getStored(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage for ${key}`, e);
    return fallback;
  }
}

function setStored(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("g1-store-update", { detail: { key, value } }));
  } catch (e) {
    console.error(`Error writing localStorage for ${key}`, e);
  }
}

export const healthStore = {
  // Patient Profile
  getPatient(googleUser = null) {
    const stored = getStored(STORAGE_KEYS.PATIENT, DEFAULT_PATIENT);
    const base = {
      ...DEFAULT_PATIENT,
      ...stored,
      governmentSchemes: Array.isArray(stored?.governmentSchemes) && stored.governmentSchemes.length > 0
        ? stored.governmentSchemes
        : DEFAULT_PATIENT.governmentSchemes,
      insurancePolicies: Array.isArray(stored?.insurancePolicies) && stored.insurancePolicies.length > 0
        ? stored.insurancePolicies
        : DEFAULT_PATIENT.insurancePolicies,
      consultationHistory: Array.isArray(stored?.consultationHistory) && stored.consultationHistory.length > 0
        ? stored.consultationHistory
        : DEFAULT_PATIENT.consultationHistory,
    };

    if (!googleUser) return base;

    // A custom uploaded photo (GridFS, base64, or explicit upload) must take absolute priority
    const hasCustomPhoto =
      base.isCustomPhoto === true ||
      (base.photo &&
        (base.photo.startsWith("/api/files") ||
          base.photo.startsWith("data:") ||
          (base.photo !== DEFAULT_PATIENT.photo && base.photo !== googleUser.picture)));

    const activePhoto = hasCustomPhoto
      ? base.photo
      : (googleUser.picture || base.photo);

    return {
      ...base,
      name: base.name || googleUser.name,
      email: googleUser.email || base.email,
      photo: activePhoto,
      healthId: base.healthId || googleUser.healthId,
      phone: base.phone || googleUser.phone,
    };
  },

  updatePatient(updates) {
    const current = getStored(STORAGE_KEYS.PATIENT, DEFAULT_PATIENT);
    const updated = {
      ...current,
      ...updates,
      ...(updates.photo ? { isCustomPhoto: true } : {}),
    };
    setStored(STORAGE_KEYS.PATIENT, updated);
    return updated;
  },

  // Services
  getServices() {
    return getStored(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
  },

  getServiceBySlug(slug) {
    const services = healthStore.getServices();
    return services.find((s) => s.slug === slug) || null;
  },

  saveService(serviceData) {
    const services = healthStore.getServices();
    const idx = services.findIndex((s) => s.id === serviceData.id || s.slug === serviceData.slug);
    let updated;
    if (idx >= 0) {
      updated = [...services];
      updated[idx] = { ...updated[idx], ...serviceData };
    } else {
      const newService = {
        ...serviceData,
        id: serviceData.id || `srv-${Date.now()}`,
        slug: serviceData.slug || serviceData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      };
      updated = [newService, ...services];
    }
    setStored(STORAGE_KEYS.SERVICES, updated);
    return updated;
  },

  deleteService(serviceId) {
    const services = healthStore.getServices();
    const filtered = services.filter((s) => s.id !== serviceId && s.slug !== serviceId);
    setStored(STORAGE_KEYS.SERVICES, filtered);
    return filtered;
  },

  // Lab Tests
  getLabTests() {
    return getStored(STORAGE_KEYS.LAB_TESTS, DEFAULT_LAB_TESTS);
  },

  saveLabTest(testData) {
    const tests = healthStore.getLabTests();
    const idx = tests.findIndex((t) => t.id === testData.id);
    let updated;
    if (idx >= 0) {
      updated = [...tests];
      updated[idx] = { ...updated[idx], ...testData };
    } else {
      const newTest = {
        ...testData,
        id: testData.id || `lab-${Date.now()}`,
        slug: testData.slug || testData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      };
      updated = [newTest, ...tests];
    }
    setStored(STORAGE_KEYS.LAB_TESTS, updated);
    return updated;
  },

  deleteLabTest(testId) {
    const tests = healthStore.getLabTests();
    const filtered = tests.filter((t) => t.id !== testId);
    setStored(STORAGE_KEYS.LAB_TESTS, filtered);
    return filtered;
  },

  // Lab Inquiries
  getLabInquiries() {
    return getStored(STORAGE_KEYS.LAB_INQUIRIES, DEFAULT_LAB_INQUIRIES);
  },

  addLabInquiry(inquiry) {
    const inquiries = healthStore.getLabInquiries();
    const newInquiry = {
      ...inquiry,
      id: inquiry.id || `LAB-INQ-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
      status: inquiry.status || "Pending Phlebotomist",
      assignedStaff: inquiry.assignedStaff || "Unassigned",
    };
    const updated = [newInquiry, ...inquiries];
    setStored(STORAGE_KEYS.LAB_INQUIRIES, updated);
    return newInquiry;
  },

  updateLabInquiryStatus(id, newStatus, assignedStaff = null) {
    const inquiries = healthStore.getLabInquiries();
    const updated = inquiries.map((inq) => {
      if (inq.id === id) {
        return {
          ...inq,
          status: newStatus,
          ...(assignedStaff ? { assignedStaff } : {}),
        };
      }
      return inq;
    });
    setStored(STORAGE_KEYS.LAB_INQUIRIES, updated);
    return updated;
  },

  // Staff Management
  getStaff() {
    return getStored(STORAGE_KEYS.STAFF, DEFAULT_STAFF);
  },

  saveStaff(member) {
    const staff = healthStore.getStaff();
    const idx = staff.findIndex((s) => s.id === member.id);
    let updated;
    if (idx >= 0) {
      updated = [...staff];
      updated[idx] = { ...updated[idx], ...member };
    } else {
      const newStaff = {
        ...member,
        id: member.id || `stf-${Date.now()}`,
        status: member.status || "Active",
        rating: member.rating || 5.0,
        assignedCases: 0,
      };
      updated = [newStaff, ...staff];
    }
    setStored(STORAGE_KEYS.STAFF, updated);
    return updated;
  },

  deleteStaff(staffId) {
    const staff = healthStore.getStaff();
    const filtered = staff.filter((s) => s.id !== staffId);
    setStored(STORAGE_KEYS.STAFF, filtered);
    return filtered;
  },

  // Bookings & Leads Management
  getBookings() {
    return getStored(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
  },

  addBooking(booking) {
    const bookings = healthStore.getBookings();
    const newBooking = {
      ...booking,
      id: booking.id || `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      bookingDate: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
      status: booking.paymentStatus === "PAID" ? "Confirmed" : "Tele-Call Lead Pending",
    };
    const updated = [newBooking, ...bookings];
    setStored(STORAGE_KEYS.BOOKINGS, updated);
    return newBooking;
  },

  updateBooking(id, updates) {
    const bookings = healthStore.getBookings();
    const updated = bookings.map((b) => (b.id === id ? { ...b, ...updates } : b));
    setStored(STORAGE_KEYS.BOOKINGS, updated);
    return updated;
  },

  // Doctors Management & Priority Ranking
  getDoctors() {
    const doctors = getStored(STORAGE_KEYS.DOCTORS, DEFAULT_DOCTORS);
    return [...doctors].sort((a, b) => {
      const rankA = a.priorityRank ? Number(a.priorityRank) : 9999;
      const rankB = b.priorityRank ? Number(b.priorityRank) : 9999;
      if (rankA !== rankB) return rankA - rankB;
      return (b.rating || 0) - (a.rating || 0);
    });
  },

  getDoctorBySlug(slug) {
    const doctors = healthStore.getDoctors();
    return doctors.find((d) => d.slug === slug || d.id === slug) || null;
  },

  saveDoctor(doctorData) {
    const doctors = getStored(STORAGE_KEYS.DOCTORS, DEFAULT_DOCTORS);
    const idx = doctors.findIndex((d) => d.id === doctorData.id || d.slug === doctorData.slug);
    let updated;
    if (idx >= 0) {
      updated = [...doctors];
      updated[idx] = { ...updated[idx], ...doctorData };
    } else {
      const slug =
        doctorData.slug ||
        doctorData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const newDoctor = {
        ...doctorData,
        id: doctorData.id || `doc-${Date.now()}`,
        slug,
        status: doctorData.status || "Active",
        rating: doctorData.rating || 4.9,
        reviewsCount: doctorData.reviewsCount || 0,
        timingSlots: doctorData.timingSlots || ["10:00 AM", "11:30 AM", "02:30 PM", "04:30 PM"],
        priorityRank: doctorData.priorityRank || doctors.length + 1,
      };
      updated = [newDoctor, ...doctors];
    }
    setStored(STORAGE_KEYS.DOCTORS, updated);
    return updated;
  },

  updateDoctorPriorityRank(doctorId, rank) {
    const doctors = getStored(STORAGE_KEYS.DOCTORS, DEFAULT_DOCTORS);
    const updated = doctors.map((d) =>
      d.id === doctorId || d.slug === doctorId ? { ...d, priorityRank: Number(rank) } : d
    );
    setStored(STORAGE_KEYS.DOCTORS, updated);
    return updated;
  },

  deleteDoctor(doctorId) {
    const doctors = getStored(STORAGE_KEYS.DOCTORS, DEFAULT_DOCTORS);
    const filtered = doctors.filter((d) => d.id !== doctorId && d.slug !== doctorId);
    setStored(STORAGE_KEYS.DOCTORS, filtered);
    return filtered;
  },

  // Booking Status Management (including 'Consulted')
  updateBookingStatus(id, newStatus, extraData = {}) {
    return healthStore.updateBooking(id, {
      status: newStatus,
      ...extraData,
      statusUpdatedAt: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
    });
  },

  // Providers / Hospitals Management & Priority Ranking
  getProviders() {
    const seeded = initialProviders.map((p, i) => ({
      ...p,
      priorityRank: p.priorityRank || i + 1,
    }));
    const providers = getStored(STORAGE_KEYS.PROVIDERS, seeded);
    return [...providers].sort((a, b) => {
      const rankA = a.priorityRank ? Number(a.priorityRank) : 9999;
      const rankB = b.priorityRank ? Number(b.priorityRank) : 9999;
      if (rankA !== rankB) return rankA - rankB;
      return (b.rating || 0) - (a.rating || 0);
    });
  },

  saveProvider(providerData) {
    const providers = healthStore.getProviders();
    const idx = providers.findIndex((p) => p.id === providerData.id);
    let updated;
    if (idx >= 0) {
      updated = [...providers];
      updated[idx] = { ...updated[idx], ...providerData };
    } else {
      const newProvider = {
        ...providerData,
        id: providerData.id || `p-${Date.now()}`,
        priorityRank: providerData.priorityRank || providers.length + 1,
      };
      updated = [newProvider, ...providers];
    }
    setStored(STORAGE_KEYS.PROVIDERS, updated);
    return updated;
  },

  updateProviderPriorityRank(providerId, rank) {
    const providers = healthStore.getProviders();
    const updated = providers.map((p) =>
      p.id === providerId ? { ...p, priorityRank: Number(rank) } : p
    );
    setStored(STORAGE_KEYS.PROVIDERS, updated);
    return updated;
  },

  // Government Healthcare Schemes
  getGovSchemes() {
    return getStored(STORAGE_KEYS.GOV_SCHEMES, DEFAULT_GOV_SCHEMES);
  },

  saveGovScheme(schemeData) {
    const schemes = healthStore.getGovSchemes();
    const idx = schemes.findIndex((s) => s.id === schemeData.id || s.slug === schemeData.slug);
    let updated;
    if (idx >= 0) {
      updated = [...schemes];
      updated[idx] = { ...updated[idx], ...schemeData };
    } else {
      const newScheme = {
        ...schemeData,
        id: schemeData.id || `sch-${Date.now()}`,
        slug: schemeData.slug || schemeData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      };
      updated = [newScheme, ...schemes];
    }
    setStored(STORAGE_KEYS.GOV_SCHEMES, updated);
    return updated;
  },

  deleteGovScheme(id) {
    const schemes = healthStore.getGovSchemes();
    const filtered = schemes.filter((s) => s.id !== id && s.slug !== id);
    setStored(STORAGE_KEYS.GOV_SCHEMES, filtered);
    return filtered;
  },

  // Patient Scheme & Insurance Linking
  addSchemeToPatient(schemePayload) {
    const patient = healthStore.getPatient();
    const existing = patient.governmentSchemes || [];
    const newRecord = {
      ...schemePayload,
      id: schemePayload.id || `sch-pat-${Date.now()}`,
      assignedAt: new Date().toLocaleDateString("en-IN"),
      status: schemePayload.status || "Active & Verified",
    };
    const updatedSchemes = [newRecord, ...existing];
    return healthStore.updatePatient({ governmentSchemes: updatedSchemes });
  },

  removeSchemeFromPatient(schemeRecordId) {
    const patient = healthStore.getPatient();
    const existing = patient.governmentSchemes || [];
    const updatedSchemes = existing.filter((s) => s.id !== schemeRecordId);
    return healthStore.updatePatient({ governmentSchemes: updatedSchemes });
  },

  addInsuranceToPatient(policyPayload) {
    const patient = healthStore.getPatient();
    const existing = patient.insurancePolicies || [];
    const newRecord = {
      ...policyPayload,
      id: policyPayload.id || `ins-pat-${Date.now()}`,
      addedAt: new Date().toLocaleDateString("en-IN"),
      status: policyPayload.status || "Active (Cashless)",
    };
    const updatedPolicies = [newRecord, ...existing];
    return healthStore.updatePatient({ insurancePolicies: updatedPolicies });
  },

  removeInsuranceFromPatient(policyId) {
    const patient = healthStore.getPatient();
    const existing = patient.insurancePolicies || [];
    const updatedPolicies = existing.filter((p) => p.id !== policyId);
    return healthStore.updatePatient({ insurancePolicies: updatedPolicies });
  },

  addConsultationToPatient(consultationPayload) {
    const patient = healthStore.getPatient();
    const existing = patient.consultationHistory || [];
    const newRecord = {
      ...consultationPayload,
      id: consultationPayload.id || `CONS-${Math.floor(1000 + Math.random() * 9000)}`,
      date: consultationPayload.date || new Date().toLocaleDateString("en-IN", { dateStyle: "medium" }),
    };
    const updatedHistory = [newRecord, ...existing];
    return healthStore.updatePatient({ consultationHistory: updatedHistory });
  },

  // Health Camps Management
  getCamps() {
    return getStored(STORAGE_KEYS.CAMPS, DEFAULT_CAMPS);
  },

  getActiveCamps() {
    const camps = healthStore.getCamps();
    const now = new Date();
    return camps.filter((c) => {
      if (c.status === "Cancelled" || c.status === "Completed") return false;
      const end = new Date(c.endDate);
      // End date check: if valid date, must be today or future
      if (!isNaN(end.getTime())) {
        // Set end time to end of day 23:59:59
        end.setHours(23, 59, 59, 999);
        return end >= now;
      }
      return true;
    });
  },

  saveCamp(campData) {
    const camps = healthStore.getCamps();
    const idx = camps.findIndex((c) => c.id === campData.id);
    let updated;
    if (idx >= 0) {
      updated = [...camps];
      updated[idx] = { ...updated[idx], ...campData };
    } else {
      const newCamp = {
        ...campData,
        id: campData.id || `camp-${Date.now()}`,
        status: campData.status || "Active",
        registeredCount: campData.registeredCount || 0,
        newRegistrationsCount: campData.newRegistrationsCount || 0,
        attendees: campData.attendees || [],
      };
      updated = [newCamp, ...camps];
    }
    setStored(STORAGE_KEYS.CAMPS, updated);
    return updated;
  },

  deleteCamp(campId) {
    const camps = healthStore.getCamps();
    const filtered = camps.filter((c) => c.id !== campId);
    setStored(STORAGE_KEYS.CAMPS, filtered);
    return filtered;
  },

  registerCampAttendee(campId, attendeeData) {
    const camps = healthStore.getCamps();
    const newAttendee = {
      id: `att-${Date.now()}`,
      name: attendeeData.name,
      phone: attendeeData.phone,
      healthId: attendeeData.healthId || `G1-${Math.floor(100000 + Math.random() * 900000)}`,
      registeredAt: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
      attended: false,
      isNewUser: Boolean(attendeeData.isNewUser),
      notes: attendeeData.notes || "",
    };

    const updated = camps.map((camp) => {
      if (camp.id === campId) {
        const attendees = camp.attendees || [];
        return {
          ...camp,
          registeredCount: (camp.registeredCount || 0) + 1,
          newRegistrationsCount: attendeeData.isNewUser
            ? (camp.newRegistrationsCount || 0) + 1
            : (camp.newRegistrationsCount || 0),
          attendees: [newAttendee, ...attendees],
        };
      }
      return camp;
    });

    setStored(STORAGE_KEYS.CAMPS, updated);
    return newAttendee;
  },

  // Ambulances Fleet & Emergency Management
  getAmbulances() {
    const ambulances = getStored(STORAGE_KEYS.AMBULANCES, DEFAULT_AMBULANCES);
    return [...ambulances].sort((a, b) => {
      const rankA = a.priorityRank ? Number(a.priorityRank) : 9999;
      const rankB = b.priorityRank ? Number(b.priorityRank) : 9999;
      if (rankA !== rankB) return rankA - rankB;
      return (b.rating || 0) - (a.rating || 0);
    });
  },

  saveAmbulance(ambulanceData) {
    const ambulances = getStored(STORAGE_KEYS.AMBULANCES, DEFAULT_AMBULANCES);
    const idx = ambulances.findIndex((a) => a.id === ambulanceData.id);
    let updated;
    if (idx >= 0) {
      updated = [...ambulances];
      updated[idx] = { ...updated[idx], ...ambulanceData };
    } else {
      const newAmb = {
        ...ambulanceData,
        id: ambulanceData.id || `amb-${Date.now()}`,
        status: ambulanceData.status || "Available 24x7",
        priorityRank: ambulanceData.priorityRank || ambulances.length + 1,
      };
      updated = [newAmb, ...ambulances];
    }
    setStored(STORAGE_KEYS.AMBULANCES, updated);
    return updated;
  },

  deleteAmbulance(ambulanceId) {
    const ambulances = getStored(STORAGE_KEYS.AMBULANCES, DEFAULT_AMBULANCES);
    const filtered = ambulances.filter((a) => a.id !== ambulanceId);
    setStored(STORAGE_KEYS.AMBULANCES, filtered);
    return filtered;
  },

  bookAmbulance(bookingPayload) {
    const bookings = healthStore.getAmbulanceBookings();
    const newBooking = {
      ...bookingPayload,
      id: `AMB-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      requestedAt: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
      status: "Dispatched - Driver Assigned",
    };
    const updated = [newBooking, ...bookings];
    setStored(STORAGE_KEYS.AMBULANCE_BOOKINGS, updated);
    return newBooking;
  },

  getAmbulanceBookings() {
    return getStored(STORAGE_KEYS.AMBULANCE_BOOKINGS, [
      {
        id: "AMB-REQ-4820",
        ambulanceId: "amb-01",
        vehicleNumber: "GJ-01-AX-1088",
        hospitalAffiliation: "CityCare Multispecialty Hospital",
        patientName: "Rameshwar Patel",
        phone: "+91 98980 12345",
        pickupAddress: "Flat 402, Shivam Residency, Bodakdev, Ahmedabad",
        destinationHospital: "CityCare Emergency Trauma Wing",
        emergencyType: "Cardiac Chest Pain & Breathlessness",
        requestedAt: "2026-10-21 09:30 AM",
        status: "Completed - Patient Admitted",
      },
    ]);
  },

  updateAmbulanceBookingStatus(id, newStatus) {
    const bookings = healthStore.getAmbulanceBookings();
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    setStored(STORAGE_KEYS.AMBULANCE_BOOKINGS, updated);
    return updated;
  },

  // Deliverable Services: Laboratories Management & Priority Ranking
  getLaboratories() {
    const labs = getStored(STORAGE_KEYS.LABORATORIES, DEFAULT_LABORATORIES);
    return [...labs].sort((a, b) => {
      const rankA = a.priorityRank ? Number(a.priorityRank) : 9999;
      const rankB = b.priorityRank ? Number(b.priorityRank) : 9999;
      if (rankA !== rankB) return rankA - rankB;
      return (b.rating || 0) - (a.rating || 0);
    });
  },

  getLaboratoryById(id) {
    const labs = healthStore.getLaboratories();
    return labs.find((l) => l.id === id) || null;
  },

  saveLaboratory(labData) {
    const labs = getStored(STORAGE_KEYS.LABORATORIES, DEFAULT_LABORATORIES);
    const idx = labs.findIndex((l) => l.id === labData.id);
    let updated;
    if (idx >= 0) {
      updated = [...labs];
      updated[idx] = { ...updated[idx], ...labData };
    } else {
      const newLab = {
        ...labData,
        id: labData.id || `lab-${Date.now()}`,
        priorityRank: labData.priorityRank || labs.length + 1,
        tests: labData.tests || [],
      };
      updated = [newLab, ...labs];
    }
    setStored(STORAGE_KEYS.LABORATORIES, updated);
    return updated;
  },

  updateLabPriorityRank(labId, rank) {
    const labs = getStored(STORAGE_KEYS.LABORATORIES, DEFAULT_LABORATORIES);
    const updated = labs.map((l) => (l.id === labId ? { ...l, priorityRank: Number(rank) } : l));
    setStored(STORAGE_KEYS.LABORATORIES, updated);
    return updated;
  },

  deleteLaboratory(labId) {
    const labs = getStored(STORAGE_KEYS.LABORATORIES, DEFAULT_LABORATORIES);
    const filtered = labs.filter((l) => l.id !== labId);
    setStored(STORAGE_KEYS.LABORATORIES, filtered);
    return filtered;
  },

  // Deliverable Services: Medical Stores / Pharmacies Management
  getPharmacies() {
    const pharmacies = getStored(STORAGE_KEYS.PHARMACIES, DEFAULT_PHARMACIES);
    return [...pharmacies].sort((a, b) => {
      const rankA = a.priorityRank ? Number(a.priorityRank) : 9999;
      const rankB = b.priorityRank ? Number(b.priorityRank) : 9999;
      if (rankA !== rankB) return rankA - rankB;
      return (b.rating || 0) - (a.rating || 0);
    });
  },

  getPharmacyById(id) {
    const pharmacies = healthStore.getPharmacies();
    return pharmacies.find((p) => p.id === id) || null;
  },

  savePharmacy(pharmacyData) {
    const pharmacies = getStored(STORAGE_KEYS.PHARMACIES, DEFAULT_PHARMACIES);
    const idx = pharmacies.findIndex((p) => p.id === pharmacyData.id);
    let updated;
    if (idx >= 0) {
      updated = [...pharmacies];
      updated[idx] = { ...updated[idx], ...pharmacyData };
    } else {
      const newPharm = {
        ...pharmacyData,
        id: pharmacyData.id || `pharm-${Date.now()}`,
        priorityRank: pharmacyData.priorityRank || pharmacies.length + 1,
      };
      updated = [newPharm, ...pharmacies];
    }
    setStored(STORAGE_KEYS.PHARMACIES, updated);
    return updated;
  },

  deletePharmacy(pharmacyId) {
    const pharmacies = getStored(STORAGE_KEYS.PHARMACIES, DEFAULT_PHARMACIES);
    const filtered = pharmacies.filter((p) => p.id !== pharmacyId);
    setStored(STORAGE_KEYS.PHARMACIES, filtered);
    return filtered;
  },

  savePharmacyOrder(orderData) {
    const orders = healthStore.getPharmacyOrders();
    const newOrder = {
      ...orderData,
      id: `MED-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      orderedAt: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
      status: "Order Confirmed - Packaging",
    };
    const updated = [newOrder, ...orders];
    setStored(STORAGE_KEYS.PHARMACY_ORDERS, updated);
    return newOrder;
  },

  getPharmacyOrders() {
    return getStored(STORAGE_KEYS.PHARMACY_ORDERS, [
      {
        id: "MED-ORD-9102",
        pharmacyName: "WellServe 24x7 Express Medical Store",
        patientName: "Dr. Ananya Sharma",
        phone: "+91 98765 43210",
        medicines: ["Telmisartan 40mg (10 tabs)", "Atorvastatin 10mg (15 tabs)"],
        totalAmount: 231,
        orderedAt: "2026-10-21 10:15 AM",
        deliveryAddress: "42, Green Valley Enclave, Ahmedabad",
        status: "Delivered (Cash on Delivery)",
      },
    ]);
  },

  // Multi-Role Partner & Member Registrations
  getRegistrations() {
    return getStored(STORAGE_KEYS.REGISTRATIONS, DEFAULT_REGISTRATIONS);
  },

  saveRegistration(regPayload) {
    const regs = healthStore.getRegistrations();
    const refId = `G1-REG-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReg = {
      ...regPayload,
      id: `reg-${Date.now()}`,
      refId,
      submittedAt: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
      status: "Verified",
    };
    const updated = [newReg, ...regs];
    setStored(STORAGE_KEYS.REGISTRATIONS, updated);

    // If registering as a patient, also update patient profile
    if (regPayload.role === "patient") {
      healthStore.updatePatient({
        name: regPayload.name,
        phone: regPayload.phone,
        email: regPayload.email,
        city: regPayload.city,
        address: regPayload.address,
        ...(regPayload.roleDetails || {}),
      });
    }

    return newReg;
  },

  updateRegistrationStatus(id, newStatus) {
    const regs = healthStore.getRegistrations();
    const updated = regs.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    setStored(STORAGE_KEYS.REGISTRATIONS, updated);
    return updated;
  },

  // Disease to Doctor & Hospital Directory ("Bimari & Uska Doctor")
  getDiseases() {
    return DISEASE_DIRECTORY;
  },

  getDiseaseBySlug(slug) {
    return DISEASE_DIRECTORY.find((d) => d.slug === slug || d.id === slug) || null;
  },
};

