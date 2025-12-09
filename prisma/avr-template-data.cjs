// AVR (Automatic Voltage Regulator) Complete Template Data
// Extracted from TPG Automatic Voltage Regulator (AVR).xlsx.pdf

module.exports = [
  // Section 1: GENERAL
  { id: "1-0", description: "GENERAL" },
  { id: "1-1", description: "Brand & Manufacture", unit: "-", required: "Brand dan Manufactured OECD, yaitu: Melco, ABB, GE, BRUSH, WARSTILA", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.1: Standards Reference
  { id: "1.1-0", description: "Standards Reference" },
  { id: "1.1-1", description: "", unit: "-", required: "IEC60146-1-1:2009", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.1-2", description: "", unit: "-", required: "IEC61439-1:2009", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.1-3", description: "", unit: "-", required: "IEEE Std 421.5:2005", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.2: Control Electronic
  { id: "1.2-0", description: "Control Electronic" },
  { id: "1.2-1", description: "", unit: "-", required: "A. Redundant Converter configuration 2 x 110%", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.2-2", description: "", unit: "-", required: "B. Configuration of 2 control channels can operate Auto and Manual respectively", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.2-3", description: "", unit: "-", required: "C. The excitation panel configuration supplied has a cross control feature, for example converter 2 can be controlled by controller 1, and vice versa", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.2-4", description: "", unit: "-", required: "D. Capable of Switching Converter in Online conditions without Blinking", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.2-5", description: "", unit: "-", required: "E. Have two power supply redundance on the Aux Supply excitation system", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.3: Control Board
  { id: "1.3-0", description: "Control Board" },
  { id: "1.3-1", description: "", unit: "μs", required: "a. Very fast analog and digital process I/Os with a typical cycle time: 25", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.3-2", description: "", unit: "-", required: "b. Fast closed loop control and regular process logic implemented in one controller", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.3-3", description: "", unit: "μs", required: "c. Low speed I/Os with a typical cycles time: 10", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.3-4", description: "", unit: "-", required: "d. Very fast analog / digital conversion and nominal / actual value comparison, directly on the peripheral I/O module", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.3-5", description: "", unit: "-", required: "e. Program and data stored in Flash memory, no battery backup needed", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.4: Communication control and measurement
  { id: "1.4-0", description: "Communication control and measurement - Fast Controller Board Processing module" },
  { id: "1.4-3", description: "c. Fast digital 24 Volt inputs isolated with opto couplers", unit: "-", required: "6 Or More", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.4-4", description: "d. 3 analog outputs", unit: "V", required: "± 10", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.4-5", description: "e. 3 analog inputs", unit: "mA", required: "± 10 or ± 20", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.4-6", description: "f. 2 digital relay outputs and one galvanically isolated electronic 24 volt fast output", unit: "V", required: "24", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.4-7", description: "g. 4 current measuring inputs", unit: "A", required: "5 or 1", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.4-8", description: "h. 4 voltage inputs", unit: "Vac", required: "110", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.4-9", description: "i. Independent watchdog function", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.5: Control terminal
  { id: "1.5-0", description: "Control terminal" },
  { id: "1.5-1", description: "a. Operations", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.5-2", description: "b. Power chart", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.5-3", description: "c. Single line diagram", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.5-4", description: "d. Slow, fast trending and transient recorder", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.5-5", description: "e. Events, event logger", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.5-6", description: "f. Parameter, settings", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.5-7", description: "g. Test Program Routines", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.5-8", description: "h. HMI language in English", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.6: Interface unit Module Board Input Output
  { id: "1.6-0", description: "Interface unit Module Board Input Output" },
  { id: "1.6-1", description: "Type", unit: "-", required: "Module Input Output OR Module Input & Module output", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-2", description: "a. Power Supply Input Redundant", unit: "V", required: "20 - 28", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-3", description: "b. Max Supply Current", unit: "A", required: "2", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-4", description: "c. 18 Relay Output", unit: "-", required: "500V Isolation Test Voltage", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-5", description: "d. 12 digital Control Input, with Two Independent Supply", unit: "-", required: "24 Vdc Voltage Supply", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-6", description: "e. 3 analog Inputs & 3 Analog Output", unit: "-", required: "-20 +20 mA & -10 +10 V", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-7", description: "f. 3 analog Output", unit: "V", required: "-10 +10", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-8", description: "g. 3 interfaces to PT100 or PTC temperature sensors", unit: "A", required: "5 or 1", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-9", description: "h. 1 optical module interface with 3 optical links", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-10", description: "i. 4 system control LED's", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.6-11", description: "j. Available spare on point C&D", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.7: Tools for control terminal PC
  { id: "1.7-0", description: "Tools for control terminal PC with the following features" },
  { id: "1.7-1", description: "a. Parameter setting", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.7-2", description: "b. Signal and status monitoring", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.7-3", description: "c. Fault logging", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.7-4", description: "d. Application program display", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.7-5", description: "e. Trending display up to 6 adjustable signal", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.8: The set includes
  { id: "1.8-0", description: "The set includes" },
  { id: "1.8-1", description: "a. Notebook with Microsoft windows operating system", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.8-2", description: "b. Ethernet connection", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.8-3", description: "c. Excitation control terminal software installed on notebook computer", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.9: Power supply unit for control electronics
  { id: "1.9-0", description: "Power supply unit for control electronics" },
  { id: "1.9-1", description: "a. Two Input Supply Unit Standby", unit: "-", required: "Load Sharing / Redundant", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.9-2", description: "b. DC to DC Converter Unit", unit: "Vdc", required: "Output 24 Vdc max Ripple 50 mVp-p", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.9-3", description: "c. With DC Circuit Protection Range", unit: "A", required: "0.1-4", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.10: Static Excitation System Power Converter
  { id: "1.10-0", description: "Static Excitation System Power Converter - The main components of each bridge are" },
  { id: "1.10-1", description: "a. 6 x Disk type thyristor", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.10-2", description: "b. 6 x Ultra-rapid fuses monitored by micro-switches", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.10-3", description: "c. AC overvoltage protection circuit (snubber circuit)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.10-4", description: "d. Air outlet temperature detectors for temperature supervision", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.10-5", description: "e. The fans are replaceable during operation", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.10-6", description: "f. 2 fans each driven by an AC-motor and monitored by an airflow relay", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.10-7", description: "g. Field Breaker 110 % In Converter", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.10-8", description: "i. Capacity of nominal Current Excitation Converter minimum", unit: "-", required: "110% Ifn Rotor", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.10-9", description: "j. Capacity of nominal Voltage Excitation Converter minimum", unit: "-", required: "150% Vfn Rotor", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.11: MACHINE DATA AVR & SYSTEM OUTPUT VALUES
  { id: "1.11-0", description: "MACHINE DATA AVR & SYSTEM OUTPUT VALUES - Type ST5B acc. to IEEE Std 421.5:2005" },
  { id: "1.11-1", description: "a. Excitation system rated current", unit: "A", required: "1630", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.11-2", description: "b. Ceiling Current", unit: "A", required: "2348", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.11-3", description: "c. No Load Secondary Voltage", unit: "V", required: "400", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.11-4", description: "d. Rated Voltage (Continuous DC output)", unit: "V", required: "343", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.11-5", description: "e. On Load System Ceiling Voltage", unit: "V", required: "492", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.11-6", description: "f. Under Voltage Factor to reach Ceiling Voltage", unit: "unit", required: "1", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.11-7", description: "g. Ceiling Application Time", unit: "S", required: "10", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.11-8", description: "h. Response Ratio (ANSI/IEEE Std 421.1-1986)", unit: "S^-1", required: "2.35", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.11-9", description: "i. Response Time", unit: "mS", required: "20", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.12: Field suppression & field overvoltage protection
  { id: "1.12-0", description: "Field suppression & field overvoltage protection" },
  { id: "1.12-1", description: "a. Type of breaker", unit: "-", required: "ACB 115% In (Excitation)", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.12-2", description: "b. Connected to", unit: "-", required: "1 x symmetrical filter for shaft voltage suppression", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.12-3", description: "c. Rated current", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.12-4", description: "d. Resistor type", unit: "-", required: "Non linear for fast discharge", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.13: Basic Feature
  { id: "1.13-0", description: "Basic Feature" },
  { id: "1.13-1", description: "a. Automatic voltage regulator", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.13-2", description: "b. Signal acquisition of single - or 3-phase machine terminal voltage and current", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.13-3", description: "c. Softstart", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.13-4", description: "d. Adjustable active / reactive current influence", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.13-5", description: "e. Imposed power factor regulator (PF)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.13-6", description: "f. Direct controlled power factor regulator (PF)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.13-7", description: "g. Imposed reactive power regulator (Q)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.13-8", description: "h. Direct controlled reactive power regulator (Q)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.13-9", description: "i. Power system stabilizer (PSS)", unit: "-", required: "Type 2A/2B acc. to IEEE Std 421.5:2005", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.14: Standard PSS package
  { id: "1.14-0", description: "Standard PSS package" },
  { id: "1.14-1", description: "a. Parameter sets for the unit to be commissioned", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.14-2", description: "b. Step-response test, conducted during commissioning", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.14-3", description: "c. Cross-current compensation", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.14-4", description: "d. Line charging", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.14-5", description: "e. Q and/or P droop / compensation (active reactive power influence)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.15: Limiters
  { id: "1.15-0", description: "Limiters" },
  { id: "1.15-1", description: "a. Maximum field current limiter", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.15-2", description: "b. Minimum field current limiter", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.15-3", description: "c. Overexcitation stator current limiter", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.15-4", description: "d. Underexcitation stator current limiter", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.15-5", description: "e. P/Q underexcitation limiter", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.15-6", description: "f. V/Hz limiter", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.15-7", description: "g. Cold gas dependent limiter", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.16: Monitoring and protective functions
  { id: "1.16-0", description: "Monitoring and protective functions" },
  { id: "1.16-1", description: "a. PT monitoring", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.16-2", description: "b. Field overcurrent protection", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.16-3", description: "c. V/Hz protection", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.16-4", description: "d. P/Q base loss of field protection", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.16-5", description: "e. Rotor temperature monitoring", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.16-6", description: "f. DC overvoltage protection (BOD & crowbar)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.17: Regulator Monitoring (protection) function
  { id: "1.17-0", description: "Regulator Monitoring (protection) function" },
  { id: "1.17-1", description: "a. PT fuse failure monitoring", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-2", description: "b. Manual restrict", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-3", description: "c. Watch dog for internal control electronics", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-4", description: "d. Excitation transformer Temperature Monitoring", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-5", description: "e. Field over current instantaneous and time delayed", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-6", description: "f. PT & CT monitoring (All lost-, Sum not zero-, One lost, In-Phase – Detection)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-7", description: "g. DC over voltage protection (BOD & crowbar)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-8", description: "h. V/Hz Protection", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-9", description: "i. Loss of Excitation", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-10", description: "j. Rotor Earth Fault Relay", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-11", description: "k. Rotor Temperature Monitoring", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.17-12", description: "l. Rotor Insulation Monitoring", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.18: Converter monitoring (protection)
  { id: "1.18-0", description: "Converter monitoring (protection) - Any response leads to channel transfer prior to trip with redundant system" },
  { id: "1.18-1", description: "a. Thyristor converter Branch fault protection", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.18-2", description: "b. Output short circuit protection", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.18-3", description: "c. Power section signal U1, UE, IE monitoring", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.18-4", description: "d. Conduction Monitoring (Ripple Monitoring) if one of the 6 Thyristor Bridge Arms is not conducting", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.19: Self monitoring (protection)
  { id: "1.19-0", description: "Self monitoring (protection) - Automatic transfer of best possible condition takes place with redundant systems" },
  { id: "1.19-1", description: "a. Optical Link Monitoring (Redundant Link Between the 2 Channels)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-2", description: "b. Back-up Channel Optical Link Monitoring (One Link per Channel)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-3", description: "c. CIO optical link monitoring (one link per channel)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-4", description: "d. I / O (CIO) Configuration Check", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-5", description: "e. Loss of auxiliary Power Source", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-6", description: "f. A) From Main Power Source (disable at standstill in case Shunt supply)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-7", description: "g. B) From Station Battery", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-8", description: "h. CPU Watch Dog", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-9", description: "i. All required Configuration and Scaling Parameter set", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-10", description: "j. Converter Stopped (Pulse Block) by external command", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-11", description: "k. FCB tripped without internal or external trip command", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-12", description: "l. External Trip 1 or 2 command received", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-13", description: "m. Start Excitation not successful (no current after time out)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-14", description: "n. Breaker operation lost (not correct breaker response)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-15", description: "o. 24V Distribution Feeder lost (SC on an APD output)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-16", description: "p. Auxiliaries Ready", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-17", description: "r. Parameter Save to Flash Fault", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-18", description: "s. Control IT (CIT) Version Fault", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.19-19", description: "t. Field Bus Connection Lost", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.20: Factory Test
  { id: "1.20-0", description: "Factory Test" },
  { id: "1.20-1", description: "a. General Inspection", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.20-2", description: "b. High voltage test according to IEC61439-1:2009", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.20-3", description: "c. Power supply circuit test", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.20-4", description: "d. Function test of the hardware (IO's, auxiliaries, breakers, sensors, actors, trip circuits)", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.20-5", description: "e. Functional test of the power converter (IEC60146-1-1:2009)", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.20-6", description: "f. Functional test of extra monitoring / protection functions", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.21: Technical highlights
  { id: "1.21-0", description: "Technical highlights" },
  { id: "1.21-1", description: "a. Very fast 400Mhz CPU with 64 bit floating point calculation", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-2", description: "b. Fiber optic connection with the MEGATROL® PCBs for redundant 10 Mbit data exchange, for maximum EMC immunity and for galvanic isolation", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-3", description: "c. Data acquisition of analog input signal (UG, IG & USyn) with a processing accuracy better than 0.5%", unit: "%", required: "0.5", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-4", description: "d. 28-channel data recorder by 2000 points per channel with 2.4 ms sample time (max. 4.8 s records)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-5", description: "e. Event recording with 2.4 ms resolution with 1 ms accuracy including date and time stamp", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-6", description: "f. Full lifecycle management up to 25 years", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-7", description: "g. Easy monitoring and operation by local or remote Excitation Control Terminal (ECT) – (option)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-8", description: "h. Easy time synchronization by Simple Network Time Protocol ((SNTP) signal via ETHERNET – (option)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-9", description: "i. Serial interface with several protocols: OPC, MODBUS TCP, MODBUS RTU & PROFIBUS – (option)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-10", description: "j. Flexible layout by detached AVR and fiber optic links (option)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-11", description: "k. Built-in digital generator model in each AVR cubicle for off-line simulation (option)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-12", description: "l. On-line maintenance of converters (option)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.21-13", description: "m. Cross start automatic or remote (option)", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.22: Commissioning
  { id: "1.22-0", description: "Commissioning" },
  { id: "1.22-1", description: "a. General inspection of the installation", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.22-2", description: "b. Power supply circuit test", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.22-3", description: "c. Test of control circuits (interaction to the control desk and plant)", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.22-4", description: "d. Output voltage test of rectifier, if line supply is available", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.22-5", description: "e. No load regulation-functions, supervision and protection test", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.22-6", description: "f. Generator on-line regulation-functions, supervision and protection test", unit: "-", required: "Witness", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.22-7", description: "g. Dynamic Test", unit: "-", required: "Yes", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  
  // Section 1.23: Submittal drawing and document
  { id: "1.23-0", description: "Submittal drawing and document" },
  { id: "1.23-1", description: "a. Factory Acceptance Test", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-2", description: "b. User Manual Hardware & software Application", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-3", description: "c. Mechanical Drawing", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-4", description: "d. Electrical Drawing", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-5", description: "e. Document Test Report", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-6", description: "f. Stability Study dan Sistem Representasi Komputer SFC dan AVR", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-7", description: "g. Commissioning test procedure for commissioning", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-8", description: "h. Document Declaration of EC Conformity", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-9", description: "i. Document Applicable Standard", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-10", description: "j. Document Yang terdiri dari:", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-11", description: "   - Software Description", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-12", description: "   - Functional Description", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-13", description: "   - Signal & Parameter List Description", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-14", description: "   - Alarm & Event List Description", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-15", description: "k. Document Operation & Data Sheet Yang terdiri dari:", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-16", description: "   - Converter Module", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-17", description: "   - Field Circuit Breaker", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-18", description: "   - Over Voltage Protection", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-19", description: "   - Control Component", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-20", description: "   - Power Supply Module", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
  { id: "1.23-21", description: "   - 64R Protection Module", unit: "-", required: "Hard & Soft Copy", proposedGuaranteed: "Harus diisi oleh vendor", remarks: "" },
];
