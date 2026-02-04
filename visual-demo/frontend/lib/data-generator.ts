/**
 * Data generator for realistic pharmaceutical/patient data
 */

/**
 * Hash a string to a number for seeding random generation
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Seeded random number generator
 */
function seededRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

const firstNames = [
  'WILLIAM', 'SHIRLEY', 'LASHAUNDRA', 'WARREN', 'JOHN', 'MARY', 'ROBERT', 'PATRICIA',
  'MICHAEL', 'LINDA', 'DAVID', 'BARBARA', 'RICHARD', 'ELIZABETH', 'JOSEPH', 'SUSAN',
  'THOMAS', 'JESSICA', 'CHARLES', 'SARAH', 'CHRISTOPHER', 'KAREN', 'DANIEL', 'NANCY',
  'MATTHEW', 'LISA', 'ANTHONY', 'BETTY', 'MARK', 'MARGARET', 'DONALD', 'SANDRA',
  'STEVEN', 'ASHLEY', 'PAUL', 'KIMBERLY', 'ANDREW', 'EMILY', 'JOSHUA', 'DONNA',
  'KENNETH', 'MICHELLE', 'KEVIN', 'DOROTHY', 'BRIAN', 'CAROL', 'GEORGE', 'AMANDA',
  'EDWARD', 'MELISSA', 'RONALD', 'DEBORAH', 'TIMOTHY', 'STEPHANIE', 'JASON', 'REBECCA',
  'JEFFREY', 'SHARON', 'RYAN', 'LAURA', 'JACOB', 'CYNTHIA', 'GARY', 'KATHLEEN',
  'NICHOLAS', 'AMY', 'ERIC', 'ANGELA', 'JONATHAN', 'SHIRLEY', 'STEPHEN', 'ANNA',
  'LARRY', 'BRENDA', 'JUSTIN', 'PAMELA', 'SCOTT', 'EMMA', 'BRANDON', 'FRANCES',
  'BENJAMIN', 'CHRISTINE', 'SAMUEL', 'MARIE', 'FRANK', 'JANET', 'GREGORY', 'CATHERINE',
  'RAYMOND', 'VIRGINIA', 'ALEXANDER', 'MARIA', 'PATRICK', 'HEATHER', 'JACK', 'DIANE',
  'DENNIS', 'JULIE', 'JERRY', 'JOYCE', 'TYLER', 'VICTORIA', 'AARON', 'KELLY',
  'JOSE', 'CHRISTINA', 'HENRY', 'JOAN', 'ADAM', 'EVELYN', 'DOUGLAS', 'JUDITH',
  'NATHAN', 'MEGAN', 'ZACHARY', 'CHERYL', 'KYLE', 'ANDREA', 'NOAH', 'HANNAH',
  'ETHAN', 'JACQUELINE', 'JEREMY', 'MARTHA', 'WALTER', 'GLORIA', 'CHRISTIAN', 'TERESA',
  'KEITH', 'SARA', 'ROGER', 'JANICE', 'TERRY', 'MARIE', 'GERALD', 'JULIA',
  'HAROLD', 'GRACE', 'SEAN', 'JUDY', 'AUSTIN', 'THERESA', 'CARL', 'MADISON',
  'ARTHUR', 'BEVERLY', 'LAWRENCE', 'DENISE', 'DYLAN', 'MARILYN', 'JESSE', 'AMBER',
  'JORDAN', 'DANIELLE', 'BRYAN', 'ROSE', 'BILLY', 'BRITTANY', 'JOE', 'DIANA',
  'BRUCE', 'ABIGAIL', 'RALPH', 'JANE', 'WAYNE', 'LORI', 'ROY', 'ALEXIS',
  'EUGENE', 'MARIE', 'LOUIS', 'OLIVIA', 'PHILIP', 'TIFFANY', 'JOHNNY', 'GRACE',
  'HOWARD', 'SOPHIA', 'ALBERT', 'JANET', 'HARRY', 'KIMBERLY', 'ARTHUR', 'EMILY',
];

const lastNames = [
  'CHASTANG', 'DATES', 'MACKROY', 'OMEARA-DATES', 'SMITH', 'JOHNSON', 'WILLIAMS', 'BROWN',
  'JONES', 'GARCIA', 'MILLER', 'DAVIS', 'RODRIGUEZ', 'MARTINEZ', 'HERNANDEZ', 'LOPEZ',
  'WILSON', 'ANDERSON', 'THOMAS', 'TAYLOR', 'MOORE', 'JACKSON', 'MARTIN', 'LEE',
  'THOMPSON', 'WHITE', 'HARRIS', 'SANCHEZ', 'CLARK', 'RAMIREZ', 'LEWIS', 'ROBINSON',
  'WALKER', 'YOUNG', 'ALLEN', 'KING', 'WRIGHT', 'SCOTT', 'TORRES', 'NGUYEN',
  'HILL', 'FLORES', 'GREEN', 'ADAMS', 'NELSON', 'BAKER', 'HALL', 'RIVERA',
  'CAMPBELL', 'MITCHELL', 'CARTER', 'ROBERTS', 'GOMEZ', 'PHILLIPS', 'EVANS', 'TURNER',
  'DIAZ', 'PARKER', 'CRUZ', 'EDWARDS', 'COLLINS', 'STEWART', 'MORRIS', 'MORALES',
  'ROGERS', 'REED', 'COOK', 'MORGAN', 'BELL', 'MURPHY', 'BAILEY', 'RIVERA',
  'COOPER', 'RICHARDSON', 'COX', 'HOWARD', 'WARD', 'TORRES', 'PETERSON', 'GRAY',
  'RAMIREZ', 'JAMES', 'WATSON', 'BROOKS', 'KELLY', 'SANDERS', 'PRICE', 'BENNETT',
  'WOOD', 'BARNES', 'ROSS', 'HENDERSON', 'COLEMAN', 'JENKINS', 'PERRY', 'POWELL',
  'LONG', 'PATTERSON', 'HUGHES', 'FLORES', 'WASHINGTON', 'BUTLER', 'SIMMONS', 'FOSTER',
  'GONZALES', 'BRYANT', 'ALEXANDER', 'RUSSELL', 'GRIFFIN', 'DIAZ', 'HAYES', 'MYERS',
];

const drugNames = [
  'WEGOVY', 'DEXLANSOPRAZOLE', 'MONTELUKAST SODIUM', 'ALBUTEROL SULFATE', 'PREDNISONE',
  'CLINDAMYCIN PHOSPHATE', 'TRAZODONE HCL', 'ROSUVASTATIN CALCIUM', 'XARELTO', 'IPRATRO/ALBUT',
  'LEVOTHYROXINE', 'METOPROLOL SUCCIN ER', 'SPIRONOLACTONE', 'DULOXETINE DR', 'LOSARTAN POT',
  'POTASSIUM CHL ER', 'TRULICITY', 'MOUNJARO', 'BASAGLAR KWIKPEN', 'INSULIN LISPRO',
  'JANUMET XR', 'PREMARIN', 'ATORVASTATIN', 'LISINOPRIL', 'AMLODIPINE', 'OMEPRAZOLE',
  'METFORMIN', 'GABAPENTIN', 'SERTRALINE', 'FLUOXETINE', 'AMOXICILLIN', 'AZITHROMYCIN',
  'CIPROFLOXACIN', 'CEPHALEXIN', 'DOXYCYCLINE', 'HYDROCHLOROTHIAZIDE', 'FUROSEMIDE',
  'CARVEDILOL', 'WARFARIN', 'CLOPIDOGREL', 'ASPIRIN', 'IBUPROFEN', 'ACETAMINOPHEN',
];

const strengths = [
  '10MG', '20MG', '25MG', '50MG', '100MG', '112MCG', '1MG/0.5ML', '0.5/3MG/3ML',
  '5MG', '40MG', '80MG', '160MG', '500MG', '1000MG', '250MG', '125MG',
  '2.5MG', '5MG/ML', '10MG/ML', '20MG/ML', '50MG/ML', '100MG/ML', '200MG',
  '300MG', '400MG', '600MG', '800MG', '150MG', '200MG', '300MG ER',
];

const packageSizes = [
  '90 CT', '100 CT', '30 CT', '60 CT', '28 CT', '30X3 ML', '10 ML', '5 ML',
  '120 CT', '180 CT', '14 CT', '21 CT', '84 CT', '50 CT', '75 CT',
];

const wholesalers = [
  'R&S Northeast', 'McKesson', 'AmerisourceBergen', 'Cardinal Health', 'H.D. Smith',
  'ABC', 'Morris & Dickson', 'Rochester Drug', 'Value Drug', 'Smith Drug',
];

const manufacturers = [
  'Novo Nordisk', 'Takeda', 'Merck', 'Pfizer', 'GlaxoSmithKline', 'Johnson & Johnson',
  'AbbVie', 'Bristol-Myers Squibb', 'Amgen', 'Gilead Sciences', 'Biogen', 'Regeneron',
  'Vertex', 'Moderna', 'Illumina', 'Incyte', 'Alexion', 'BioMarin', 'Alnylam',
];

const prescriberNames = [
  'Akisanya, Oluwole', 'Rosenthal, Richard', 'Smith, John', 'Johnson, Mary',
  'Williams, Robert', 'Brown, Patricia', 'Jones, Michael', 'Garcia, Linda',
  'Miller, David', 'Davis, Barbara', 'Rodriguez, Richard', 'Martinez, Elizabeth',
  'Hernandez, Joseph', 'Lopez, Susan', 'Wilson, Thomas', 'Anderson, Jessica',
];

const pharmacies = [
  '866 East Tremont Ave', '123 Main Street', '456 Oak Avenue', '789 Pine Road',
  '321 Elm Street', '654 Maple Drive', '987 Cedar Lane', '147 Birch Way',
];

/**
 * Generate a random patient name in LAST, FIRST format
 */
export function generatePatientName(locationCode?: string): string {
  const seed = locationCode ? hashString(locationCode + 'name') : Date.now();
  const random = seededRandom(seed);
  const firstName = firstNames[Math.floor(random() * firstNames.length)];
  const lastName = lastNames[Math.floor(random() * lastNames.length)];
  return `${lastName}, ${firstName}`;
}

/**
 * Generate a random drug name
 */
export function generateDrugName(): string {
  return drugNames[Math.floor(Math.random() * drugNames.length)];
}

/**
 * Generate a random NDC code (format: XXXXX-XXXX-XX)
 */
export function generateNDC(): string {
  const part1 = String(Math.floor(Math.random() * 90000) + 10000);
  const part2 = String(Math.floor(Math.random() * 9000) + 1000);
  const part3 = String(Math.floor(Math.random() * 90) + 10);
  return `${part1}-${part2}-${part3}`;
}

/**
 * Generate a random date within the range 11-2025 to 12-2025
 */
export function generateDate(): string {
  const month = Math.random() < 0.5 ? 11 : 12;
  const day = Math.floor(Math.random() * 28) + 1;
  const year = 2025;
  return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
}

/**
 * Generate a date in MM-YYYY format
 */
export function generateMonthYear(): string {
  const month = Math.random() < 0.5 ? 11 : 12;
  return `${String(month).padStart(2, '0')}-2025`;
}

/**
 * Generate a random dollar amount
 */
export function generateAmount(min: number = 0, max: number = 5000): string {
  const amount = Math.random() * (max - min) + min;
  return `$${amount.toFixed(2)}`;
}

/**
 * Generate a random quantity
 */
export function generateQuantity(min: number = 1, max: number = 200): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random package size
 */
export function generatePackageSize(): string {
  return packageSizes[Math.floor(Math.random() * packageSizes.length)];
}

/**
 * Generate a random strength
 */
export function generateStrength(): string {
  return strengths[Math.floor(Math.random() * strengths.length)];
}

/**
 * Generate a random wholesaler name
 */
export function generateWholesaler(): string {
  return wholesalers[Math.floor(Math.random() * wholesalers.length)];
}

/**
 * Generate a random manufacturer name
 */
export function generateManufacturer(): string {
  return manufacturers[Math.floor(Math.random() * manufacturers.length)];
}

/**
 * Generate a random prescriber name
 */
export function generatePrescriber(): string {
  return prescriberNames[Math.floor(Math.random() * prescriberNames.length)];
}

/**
 * Generate a random pharmacy address
 */
export function generatePharmacy(): string {
  return pharmacies[Math.floor(Math.random() * pharmacies.length)];
}

/**
 * Generate a random DOB (Date of Birth)
 */
export function generateDOB(): string {
  const year = Math.floor(Math.random() * 50) + 1950; // 1950-2000
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
}

/**
 * Generate a random Rx ID
 */
export function generateRxID(): string {
  return String(Math.floor(Math.random() * 90000) + 10000);
}

/**
 * Generate a random invoice number
 */
export function generateInvoiceNumber(): string {
  return String(Math.floor(Math.random() * 900000) + 100000);
}

/**
 * Generate a random item number
 */
export function generateItemNumber(): string {
  return String(Math.floor(Math.random() * 900000) + 100000);
}

/**
 * Generate patient data
 */
export function generatePatients(count: number = 50, locationCode?: string) {
  const baseSeed = locationCode ? hashString(locationCode) : Date.now();
  return Array.from({ length: count }, (_, i) => {
    const random = seededRandom(baseSeed + i);
    return {
      id: 24000 + i + (locationCode ? hashString(locationCode) % 1000 : 0),
      name: generatePatientName(locationCode ? `${locationCode}-${i}` : undefined) + (random() < 0.2 ? '*' : ''),
      dob: generateDOB(),
      pharmacy: generatePharmacy(),
      lastDispensed: generateDate(),
    };
  });
}

/**
 * Generate transaction data
 */
export function generateTransactions(count: number = 100, locationCode?: string) {
  const baseSeed = locationCode ? hashString(locationCode + 'trans') : Date.now();
  return Array.from({ length: count }, (_, i) => {
    const random = seededRandom(baseSeed + i);
    return {
      claimDate: generateDate(),
      rxId: generateRxID(),
      ndc: generateNDC(),
      drugDescription: generateDrugName(),
      strength: generateStrength(),
      rxType: random() < 0.8 ? 'P' : 'O',
      quantity: generateQuantity(),
      totalInsPaid: generateAmount(100, 2000),
      patientCoPay: generateAmount(0, 100),
      copayCollected: generateAmount(0, 100),
      pharmacyFee: generateAmount(0, 50),
      amount: generateAmount(100, 2500),
    };
  });
}

/**
 * Generate purchase data
 */
export function generatePurchases(count: number = 80, locationCode?: string) {
  const baseSeed = locationCode ? hashString(locationCode + 'purch') : Date.now();
  return Array.from({ length: count }, (_, i) => {
    const random = seededRandom(baseSeed + i);
    return {
      wholesaler: generateWholesaler(),
      invoiceNumber: generateInvoiceNumber(),
      date: generateDate(),
      itemNumber: generateItemNumber(),
      description: generateDrugName() + ' ' + generateStrength() + ' ' + generatePackageSize(),
      vendorNDC: generateNDC(),
      type: 'P',
      packageSize: generatePackageSize(),
      quantityPurchased: Math.floor(random() * 5) + 1,
      unitCost: generateAmount(0.50, 10),
      extended: generateAmount(1, 50),
    };
  });
}

/**
 * Generate inventory data
 */
export function generateInventory(count: number = 60) {
  return Array.from({ length: count }, () => ({
    ndc: generateNDC(),
    description: generateDrugName(),
    strength: generateStrength(),
    packageQuantity: generateQuantity(200),
    quantityPurchased: generateQuantity(100),
    quantityDispensed: generateQuantity(150),
    quantityOnHand: generateQuantity(-20, 200), // Can be negative
    packageSize: generatePackageSize(),
  }));
}

/**
 * Generate shipping information
 */
export function generateShippingInfo(count: number = 20, locationCode?: string) {
  const baseSeed = locationCode ? hashString(locationCode + 'ship') : Date.now();
  return Array.from({ length: count }, (_, i) => {
    return {
      patientName: generatePatientName(locationCode ? `${locationCode}-ship-${i}` : undefined) + '*',
      dateOfBirth: generateDOB(),
      lastOrderDate: generateDate(),
      nextOrderDate: generateDate(),
      expectedDeliveryDate: generateDate(),
    };
  });
}
