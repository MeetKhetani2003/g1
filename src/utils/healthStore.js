// src/utils/healthStore.js
// Centralized, reactive state store for G1 Healthcare Ecosystem
// Persists in localStorage with realistic demonstration data

const STORAGE_KEYS = {
  PATIENT: "g1_patient_profile",
  SERVICES: "g1_services_data",
  LAB_TESTS: "g1_lab_tests_data",
  LAB_INQUIRIES: "g1_lab_inquiries_data",
  STAFF: "g1_staff_data",
  BOOKINGS: "g1_bookings_data",
  DOCTORS: "g1_doctors_data",
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
  photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  emergencyContact: "Vikram Sharma (+91 98250 99881 - Brother)",
  allergies: "Penicillin, Dust Mites",
  chronicConditions: "Mild Asthma (Controlled)",
  membershipTier: "Gold Life Member",
  issuedDate: "12 Oct 2024",
  validTill: "Lifetime Verified",
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
    if (!googleUser) return stored;

    // A custom uploaded photo (GridFS, base64, or explicit upload) must take absolute priority
    const hasCustomPhoto =
      stored.isCustomPhoto === true ||
      (stored.photo &&
        (stored.photo.startsWith("/api/files") ||
          stored.photo.startsWith("data:") ||
          (stored.photo !== DEFAULT_PATIENT.photo && stored.photo !== googleUser.picture)));

    const activePhoto = hasCustomPhoto
      ? stored.photo
      : (googleUser.picture || stored.photo);

    return {
      ...stored,
      name: stored.name || googleUser.name,
      email: googleUser.email || stored.email,
      photo: activePhoto,
      healthId: stored.healthId || googleUser.healthId,
      phone: stored.phone || googleUser.phone,
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

  // Doctors Management
  getDoctors() {
    return getStored(STORAGE_KEYS.DOCTORS, DEFAULT_DOCTORS);
  },

  getDoctorBySlug(slug) {
    const doctors = healthStore.getDoctors();
    return doctors.find((d) => d.slug === slug || d.id === slug) || null;
  },

  saveDoctor(doctorData) {
    const doctors = healthStore.getDoctors();
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
      };
      updated = [newDoctor, ...doctors];
    }
    setStored(STORAGE_KEYS.DOCTORS, updated);
    return updated;
  },

  deleteDoctor(doctorId) {
    const doctors = healthStore.getDoctors();
    const filtered = doctors.filter((d) => d.id !== doctorId && d.slug !== doctorId);
    setStored(STORAGE_KEYS.DOCTORS, filtered);
    return filtered;
  },
};
