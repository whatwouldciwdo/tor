// AVR (Automatic Voltage Regulator) Complete Template Data
// Extracted from TPG Automatic Voltage Regulator (AVR).xlsx.pdf
// Format: Sections have number IDs (e.g., "1", "1.1"), items within sections have NO visible number

module.exports = [
  // Section 1: GENERAL
  { id: "1", description: "GENERAL" },
  { id: "1-a", description: "Brand & Manufacture", unit: "-", required: "Brand dan Manufactured OECD, yaitu: Melco, ABB, GE, BRUSH, WARSTILA", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.1: Standards Reference
  { id: "1.1", description: "Standards Reference" },
  { id: "1.1-a", description: "", unit: "-", required: "IEC60146-1-1:2009", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.1-b", description: "", unit: "-", required: "IEC61439-1:2009", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.1-c", description: "", unit: "-", required: "IEEE Std 421.5:2005", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.2: Control Electronic
  { id: "1.2", description: "Control Electronic" },
  { id: "1.2-a", description: "A. Redundant Converter configuration 2 x 110%", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.2-b", description: "B. Configuration of 2 control channels can operate Auto and Manual respectively", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.2-c", description: "C. The excitation panel configuration supplied has a cross control feature, for example converter 2 can be controlled by controller 1, and vice versa", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.2-d", description: "D. Capable of Switching Converter in Online conditions without Blinking", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.2-e", description: "E. Have two power supply redundance on the Aux Supply excitation system", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.3: Control Board
  { id: "1.3", description: "Control Board" },
  { id: "1.3-a", description: "a. Very fast analog and digital process I/Os with a typical cycle time", unit: "μs", required: "25", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.3-b", description: "b. Fast closed loop control and regular process logic implemented in one controller", unit: "", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.3-c", description: "c. Low speed I/Os with a typical cycles time", unit: "μs", required: "10", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.3-d", description: "d. Very fast analog / digital conversion and nominal / actual value comparison, directly on the peripheral I/O module", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.3-e", description: "e. Program and data stored in Flash memory, no battery backup needed", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.4: Communication control and measurement
  { id: "1.4", description: "Communication control and measurement - Fast Controller Board Processing module" },
  { id: "1.4-a", description: "a. port Ethernet communication with interface", unit: "-", required: "4 or More", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.4-b", description: "b. Optical module interfaces 4 or More (with maximum 12 optical links)", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.4-c", description: "c. Fast digital 24 Volt inputs isolated with opto couplers", unit: "-", required: "6 Or More", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.4-d", description: "d. 3 analog outputs", unit: "V", required: "± 10", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.4-e", description: "e. 3 analog inputs", unit: "mA", required: "± 10 or ± 20", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.4-f", description: "f. 2 digital relay outputs and one galvanically isolated electronic 24 volt fast output", unit: "V", required: "24", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.4-g", description: "g. 4 current measuring inputs", unit: "A", required: "5 or 1", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.4-h", description: "h. 4 voltage inputs", unit: "Vac", required: "110", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.4-i", description: "i. Independent watchdog function", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.5: Control terminal
  { id: "1.5", description: "Control terminal" },
  { id: "1.5-a", description: "a. Operations", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.5-b", description: "b. Power chart", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.5-c", description: "c. Single line diagram", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.5-d", description: "d. Slow, fast trending and transient recorder", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.5-e", description: "e. Events, event logger", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.5-f", description: "f. Parameter, settings", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.5-g", description: "g. Test Program Routines", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.5-h", description: "h. HMI language in English", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.6: Interface unit Module Board Input Output
  { id: "1.6", description: "Interface unit Modul Board Input Output" },
  { id: "1.6-a", description: "Type", unit: "-", required: "Modul Input Output OR Modul Input & Modul output", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-b", description: "a. Power Supply Input Redundant", unit: "V", required: "20 - 28", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-c", description: "b. Max Supply Current", unit: "A", required: "2", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-d", description: "c. 18 Relay Output", unit: "-", required: "500V Isolation Test Voltage", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-e", description: "d. 12 digital Control Input, with Two Independent Supply", unit: "-", required: "24 Vdc Voltage Supply", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-f", description: "e. 3 analog Inputs & 3 Analog Output", unit: "-", required: "-20 +20 mA & -10 +10 V", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-g", description: "f. 3 analog Output", unit: "V", required: "-10 +10", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-h", description: "g. 3 interfaces to PT100 or PTC temperature sensors", unit: "A", required: "5 or 1", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-i", description: "h. 1 optical module interface with 3 optical links", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-j", description: "i. 4 system control LED's", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-k", description: "j. Available spare on point C&D", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.7: Tools for control terminal PC
  { id: "1.7", description: "Tools for control terminal PC with the following features" },
  { id: "1.7-a", description: "a. Parameter setting", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.7-b", description: "b. Signal and status monitoring", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.7-c", description: "c. Fault logging", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.7-d", description: "d. Application program display", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.7-e", description: "e. Trending display up to 6 adjustable signal", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.8: The set includes
  { id: "1.8", description: "The set includes" },
  { id: "1.8-a", description: "a. Notebook with Microsoft windows operating system", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.8-b", description: "b. Ethernet connection", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.8-c", description: "c. Excitation control terminal software installed on notebook computer", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.9: Power supply unit for control electronics
  { id: "1.9", description: "Power supply unit for control electronics" },
  { id: "1.9-a", description: "a. Two Input Supply Unit Standby", unit: "-", required: "Load Sharing / Redundant", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.9-b", description: "b. DC to DC Converter Unit", unit: "Vdc", required: "Output 24 Vdc max Ripple 50 mVp-p", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.9-c", description: "c. With DC Circuit Protection Range", unit: "A", required: "0.1-4", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.10: Static Excitation System Power Converter
  { id: "1.10", description: "Static Excitation System Power Converter - The main components of each bridge are" },
  { id: "1.10-a", description: "a. 6 x Disk type thyristor", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.10-b", description: "b. 6 x Ultra-rapid fuses monitored by micro-switches", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.10-c", description: "c. AC overvoltage protection circuit (snubber circuit)", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.10-d", description: "d. Air outlet temperature detectors for temperature supervision", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.10-e", description: "e. The fans are replaceable during operation", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.10-f", description: "f. 2 fans each driven by an AC-motor and monitored by an airflow relay", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.10-g", description: "g. Field Breaker 110 % In Converter", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.10-h", description: "i. Capacity of nominal Current Excitation Converter minimum", unit: "-", required: "110% Ifn Rotor", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.10-i", description: "j. Capacity of nominal Voltage Excitation Converter minimum", unit: "-", required: "150% Vfn Rotor", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.11: MACHINE DATA AVR & SYSTEM OUTPUT VALUES
  { id: "1.11", description: "MACHINE DATA AVR & SYSTEM OUTPUT VALUES - Type ST5B acc. to IEEE Std 421.5:2005" },
  { id: "1.11-a", description: "a. Excitation system rated current", unit: "A", required: "1630", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.11-b", description: "b. Ceiling Current", unit: "A", required: "2348", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.11-c", description: "c. No Load Secondary Voltage", unit: "V", required: "400", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.11-d", description: "d. Rated Voltage (Continuous DC output)", unit: "V", required: "343", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.11-e", description: "e. On Load System Ceiling Voltage", unit: "V", required: "492", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.11-f", description: "f. Under Voltage Factor to reach Ceiling Voltage", unit: "unit", required: "1", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.11-g", description: "g. Ceiling Application Time", unit: "S", required: "10", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.11-h", description: "h. Response Ratio (ANSI/IEEE Std 421.1-1986)", unit: "S^-1", required: "2.35", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.11-i", description: "i. Response Time", unit: "mS", required: "20", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.12: Field suppression & field overvoltage protection
  { id: "1.12", description: "Field suppression & field overvoltage protection" },
  { id: "1.12-a", description: "a. Type of breaker", unit: "-", required: "ACB 115% In (Excitation)", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.12-b", description: "b. Connected to", unit: "-", required: "1 x symmetrical filter for shaft voltage suppression", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.12-c", description: "c. Rated current", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.12-d", description: "d. Resistor type", unit: "-", required: "Non linear for fast discharge", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.13: Basic Feature
  { id: "1.13", description: "Basic Feature" },
  { id: "1.13-a", description: "a. Automatic voltage regulator", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.13-b", description: "b. Signal acquisition of single - or 3-phase machine terminal voltage and current", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.13-c", description: "c. Softstart", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.13-d", description: "d. Adjustable active / reactive current influence", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.13-e", description: "e. Imposed power factor regulator (PF)", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.13-f", description: "f. Direct controlled power factor regulator (PF)", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.13-g", description: "g. Imposed reactive power regulator (Q)", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.13-h", description: "h. Direct controlled reactive power regulator (Q)", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.13-i", description: "i. Power system stabilizer (PSS)", unit: "-", required: "Type 2A/2B acc. to IEEE Std 421.5:2005", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.14: Standard PSS package
  { id: "1.14", description: "Standard PSS package" },
  { id: "1.14-a", description: "a. Parameter sets for the unit to be commissioned", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.14-b", description: "b. Step-response test, conducted during commissioning", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.14-c", description: "c. Cross-current compensation", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.14-d", description: "d. Line charging", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.14-e", description: "e. Q and/or P droop / compensation (active reactive power influence)", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.15: Limiters
  { id: "1.15", description: "Limiters" },
  { id: "1.15-a", description: "a. Maximum field current limiter", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.15-b", description: "b. Minimum field current limiter", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.15-c", description: "c. Overexcitation stator current limiter", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.15-d", description: "d. Underexcitation stator current limiter", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.15-e", description: "e. P/Q underexcitation limiter", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.15-f", description: "f. V/Hz limiter", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.15-g", description: "g. Cold gas dependent limiter", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.16: Monitoring and protective functions
  { id: "1.16", description: "Monitoring and protective functions" },
  { id: "1.16-a", description: "a. PT monitoring", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.16-b", description: "b. Field overcurrent protection", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.16-c", description: "c. V/Hz protection", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.16-d", description: "d. P/Q base loss of field protection", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.16-e", description: "e. Rotor temperature monitoring", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.16-f", description: "f. DC overvoltage protection (BOD & crowbar)", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.17: Regulator Monitoring (protection) function
  { id: "1.17", description: "Regulator Monitoring (protection) function" },
  { id: "1.17-a", description: "a. PT fuse failure monitoring", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-b", description: "b. Manual restrict", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-c", description: "c. Watch dog for internal control electronics", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-d", description: "d. Excitation transformer Temperature Monitoring", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-e", description: "e. Field over current instantaneous and time delayed", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-f", description: "f. PT & CT monitoring (All lost-, Sum not zero-, One lost, In-Phase – Detection)", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-g", description: "g. DC over voltage protection (BOD & crowbar)", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-h", description: "h. V/Hz Protection", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-i", description: "i. Loss of Excitation", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-j", description: "j. Rotor Earth Fault Relay", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-k", description: "k. Rotor Temperature Monitoring", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-l", description: "l. Rotor Insulation Monitoring", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.18: Converter monitoring (protection)
  { id: "1.18", description: "Converter monitoring (protection) - Any response leads to channel transfer prior to trip with redundant system" },
  { id: "1.18-a", description: "a. Thyristor converter Branch fault protection", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.18-b", description: "b. Output short circuit protection", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.18-c", description: "c. Power section signal U1, UE, IE monitoring", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.18-d", description: "d. Conduction Monitoring (Ripple Monitoring) if one of the 6 Thyristor Bridge Arms is not conducting", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.19: Self monitoring (protection)
  { id: "1.19", description: "Self monitoring (protection) - Automatic transfer of best possible condition takes place with redundant systems" },
  { id: "1.19-a", description: "a. Optical Link Monitoring (Redundant Link Between the 2 Channels)", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-b", description: "b. Back-up Channel Optical Link Monitoring (One Link per Channel)", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-c", description: "c. CIO optical link monitoring (one link per channel)", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-d", description: "d. I / O (CIO) Configuration Check", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-e", description: "e. Loss of auxiliary Power Source", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-f", description: "f. A) From Main Power Source (disable at standstill in case Shunt supply)", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-g", description: "g. B) From Station Battery", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-h", description: "h. CPU Watch Dog", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-i", description: "i. All required Configuration and Scaling Parameter set", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-j", description: "j. Converter Stopped (Pulse Block) by external command", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-k", description: "k. FCB tripped without internal or external trip command", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-l", description: "l. External Trip 1 or 2 command received", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-m", description: "m. Start Excitation not successful (no current after time out)", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-n", description: "n. Breaker operation lost (not correct breaker response)", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-o", description: "o. 24V Distribution Feeder lost (SC on an APD output)", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-p", description: "p. Auxiliaries Ready", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-r", description: "r. Parameter Save to Flash Fault", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-s", description: "s. Control IT (CIT) Version Fault", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-t", description: "t. Field Bus Connection Lost", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.20: Factory Test
  { id: "1.20", description: "Factory Test" },
  { id: "1.20-a", description: "a. General Inspection", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.20-b", description: "b. High voltage test according to IEC61439-1:2009", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.20-c", description: "c. Power supply circuit test", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.20-d", description: "d. Function test of the hardware (IO's, auxiliaries, breakers, sensors, actors, trip circuits)", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.20-e", description: "e. Functional test of the power converter (IEC60146-1-1:2009)", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.20-f", description: "f. Functional test of extra monitoring / protection functions", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.21: Technical highlights
  { id: "1.21", description: "Technical highlights" },
  { id: "1.21-a", description: "a. Very fast 400Mhz CPU with 64 bit floating point calculation", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-b", description: "b. Fiber optic connection with the MEGATROL® PCBs for redundant 10 Mbit data exchange, for maximum EMC immunity and for galvanic isolation", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-c", description: "c. Data acquisition of analog input signal (UG, IG & USyn) with a processing accuracy better than 0.5%", unit: "%", required: "0.5", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-d", description: "d. 28-channel data recorder by 2000 points per channel with 2.4 ms sample time (max. 4.8 s records)", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-e", description: "e. Event recording with 2.4 ms resolution with 1 ms accuracy including date and time stamp", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-f", description: "f. Full lifecycle management up to 25 years", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-g", description: "g. Easy monitoring and operation by local or remote Excitation Control Terminal (ECT) – (option)", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-h", description: "h. Easy time synchronization by Simple Network Time Protocol ((SNTP) signal via ETHERNET – (option)", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-i", description: "i. Serial interface with several protocols: OPC, MODBUS TCP, MODBUS RTU & PROFIBUS – (option)", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-j", description: "j. Flexible layout by detached AVR and fiber optic links (option)", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-k", description: "k. Built-in digital generator model in each AVR cubicle for off-line simulation (option)", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-l", description: "l. On-line maintenance of converters (option)", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-m", description: "m. Cross start automatic or remote (option)", unit: "-", required: "", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.22: Commissioning
  { id: "1.22", description: "Commissioning" },
  { id: "1.22-a", description: "a. General inspection of the installation", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.22-b", description: "b. Power supply circuit test", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.22-c", description: "c. Test of control circuits (interaction to the control desk and plant)", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.22-d", description: "d. Output voltage test of rectifier, if line supply is available", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.22-e", description: "e. No load regulation-functions, supervision and protection test", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.22-f", description: "f. Generator on-line regulation-functions, supervision and protection test", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.22-g", description: "g. Dynamic Test", unit: "", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.23: Submittal drawing and document
  { id: "1.23", description: "Submittal drawing and document" },
  { id: "1.23-a", description: "a. Factory Acceptance Test", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-b", description: "b. User Manual Hardware & software Application", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-c", description: "c. Mechanical Drawing", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-d", description: "d. Electrical Drawing", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-e", description: "e. Document Test Report", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-f", description: "f. Stability Study dan Sistem Representasi Komputer SFC dan AVR", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-g", description: "g. Commissioning test procedure for commissioning", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-h", description: "h. Document Declaration of EC Conformity", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-i", description: "i. Document Applicable Standard", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-j", description: "j. Document Yang terdiri dari:", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-j1", description: "   - Software Description", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-j2", description: "   - Functional Description", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-j3", description: "   - Signal & Parameter List Description", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-j4", description: "   - Alarm & Event List Description", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-k", description: "k. Document Operation & Data Sheet Yang terdiri dari:", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-k1", description: "   - Converter Module", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-k2", description: "   - Field Circuit Breaker", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-k3", description: "   - Over Voltage Protection", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-k4", description: "   - Control Component", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-k5", description: "   - Power Supply Module", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-k6", description: "   - 64R Protection Module", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
];
