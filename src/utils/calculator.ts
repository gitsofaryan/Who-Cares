export function calculateStats(salary: number) {
  const pop = 1400000000;
  const median = 5917;
  
  let percentile = 0;
  
  if (salary <= 0) {
    percentile = 0;
  } else if (salary <= median) {
    percentile = (salary / median) * 50;
  } else if (salary <= 250000) {
    // Interpolate between 50 and 99.6 using log
    const logMin = Math.log(median);
    const logMax = Math.log(250000);
    const logSal = Math.log(salary);
    
    const progress = (logSal - logMin) / (logMax - logMin);
    percentile = 50 + (progress * 49.6);
  } else {
    // > 250,000
    // Asymptotic towards 99.99
    const excess = salary - 250000;
    // Every 1,00,000 adds half of remaining distance to 100
    const progress = 1 - Math.exp(-excess / 500000);
    percentile = 99.6 + (0.39 * progress);
  }

  const topPercent = 100 - percentile;
  const earnMore = Math.floor((topPercent / 100) * pop);
  const earnLess = Math.floor((percentile / 100) * pop);
  const multiplier = (salary / median).toFixed(1);

  // States
  // Bihar median = 3200
  // Bengaluru maybe median = 25000
  // Delhi median = 20000
  const biharPercentile = Math.min(99.99, salary <= 3200 ? (salary/3200)*50 : 50 + ((Math.log(salary) - Math.log(3200)) / (Math.log(150000) - Math.log(3200))) * 49.9);
  
  const blrPercentile = Math.min(99.9, salary <= 25000 ? (salary/25000)*50 : 50 + ((Math.log(salary) - Math.log(25000)) / (Math.log(350000) - Math.log(25000))) * 49);
  
  const delPercentile = Math.min(99.9, salary <= 20000 ? (salary/20000)*50 : 50 + ((Math.log(salary) - Math.log(20000)) / (Math.log(300000) - Math.log(20000))) * 49);

  return {
    percentile,
    topPercent: topPercent < 0.01 ? "< 0.01" : topPercent.toFixed(2),
    earnMore,
    earnLess,
    multiplier,
    biharPercentile: biharPercentile > 99 ? "99+" : biharPercentile.toFixed(0),
    blrPercentile: blrPercentile.toFixed(0),
    delPercentile: delPercentile.toFixed(0),
    beers: Math.floor(salary / 180),
    iphones: (salary / 119900).toFixed(1),
    flights: Math.floor(salary / 5000), // Assuming 5000 per flight
    rentPct: Math.min(100, (35000 / salary) * 100).toFixed(0)
  };
}

export function formatIndianNumber(num: number) {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + " Crore";
  } else if (num >= 100000) {
    return (num / 100000).toFixed(1) + " Lakh";
  } else {
    return num.toLocaleString('en-IN');
  }
}
