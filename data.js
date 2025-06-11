const reportData = {
  deviceInfo: {
    make: "Vega",
    model: "Alpha",
    serialNo: "ALP-BA0680",
    instrumentId: "BA0680"
  },
  specifications: {
    temperatureResolution: "0.1 °C",
    temperatureAccuracy: "± 0.1 °C",
    humidityResolution: "0.1 %",
    humidityAccuracy: "± 0.1 %"
  },
  loggerSummary: {
    startDateTime: "01-04-2025 11:01:00",
    endDateTime: "14-04-2025 11:01:00",
    recordingInterval: "1 mins",
    sendingInterval: "1 mins",
    minSetTemperature: "12 °C",
    maxSetTemperature: "30 °C",
    minSetHumidity: "25 %",
    maxSetHumidity: "70 %"
  },
  observedSummary: {
    minTemperature: "24.0 °C",
    maxTemperature: "33.8 °C",
    mkt: "26.8 °C",
    avgTemperature: "26.8 °C",
    minHumidity: "40.0 %",
    maxHumidity: "72.8 %",
    avgHumidity: "58.9 %"
  },
  trendData: {
    labels: dummyData.map((d) => d.timestamp),
    temperatureData: dummyData.map((d) => d.temperature),
    probesData: dummyData.map((d) => d.probes)
  },
  tableData: dummyData, // full array of entries
  dynamic: {
    reportname: "Test",
    email: "vega@gmail.com"
  }
};
