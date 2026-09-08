/* -------------------------------------------------------------
   TRAFFIC & ACCIDENT INTELLIGENCE SYSTEM - EMBEDDED TELEMETRY FEED
   ------------------------------------------------------------- */

// Embedded real records from 911.json.json for offline file:// compatibility
const RAW_TELEMETRY_DATA = [
  // --- December 2015 ---
  {
    "lat": 40.2978759,
    "lng": -75.5812935,
    "desc": "REINDEER CT & DEAD END;  NEW HANOVER; Station 332; 2015-12-10 @ 17:10:52;",
    "zip": 19525.0,
    "title": "EMS: BACK PAINS/INJURY",
    "timeStamp": "10-12-2015 17.40",
    "twp": "NEW HANOVER",
    "addr": "REINDEER CT & DEAD END",
    "e": 1
  },
  {
    "lat": 40.2580614,
    "lng": -75.2646799,
    "desc": "BRIAR PATH & WHITEMARSH LN;  HATFIELD TOWNSHIP; Station 345; 2015-12-10 @ 17:29:21;",
    "zip": 19446.0,
    "title": "EMS: DIABETIC EMERGENCY",
    "timeStamp": "10-12-2015 17.40",
    "twp": "HATFIELD TOWNSHIP",
    "addr": "BRIAR PATH & WHITEMARSH LN",
    "e": 1
  },
  {
    "lat": 40.1211818,
    "lng": -75.3519752,
    "desc": "HAWS AVE; NORRISTOWN; 2015-12-10 @ 14:39:21-Station:STA27;",
    "zip": 19401.0,
    "title": "Fire: GAS-ODOR/LEAK",
    "timeStamp": "10-12-2015 17.40",
    "twp": "NORRISTOWN",
    "addr": "HAWS AVE",
    "e": 1
  },
  {
    "lat": 40.116153,
    "lng": -75.343513,
    "desc": "AIRY ST & SWEDE ST;  NORRISTOWN; Station 308A; 2015-12-10 @ 16:47:36;",
    "zip": 19401.0,
    "title": "EMS: CARDIAC EMERGENCY",
    "timeStamp": "10-12-2015 17.40",
    "twp": "NORRISTOWN",
    "addr": "AIRY ST & SWEDE ST",
    "e": 1
  },
  {
    "lat": 40.251492,
    "lng": -75.6033497,
    "desc": "CHERRYWOOD CT & DEAD END;  LOWER POTTSGROVE; Station 329; 2015-12-10 @ 16:56:52;",
    "zip": null,
    "title": "EMS: DIZZINESS",
    "timeStamp": "10-12-2015 17.40",
    "twp": "LOWER POTTSGROVE",
    "addr": "CHERRYWOOD CT & DEAD END",
    "e": 1
  },
  {
    "lat": 40.2534732,
    "lng": -75.283245,
    "desc": "CANNON AVE & W 9TH ST;  LANSDALE; Station 345; 2015-12-10 @ 15:39:04;",
    "zip": 19446.0,
    "title": "EMS: HEAD INJURY",
    "timeStamp": "10-12-2015 17.40",
    "twp": "LANSDALE",
    "addr": "CANNON AVE & W 9TH ST",
    "e": 1
  },
  {
    "lat": 40.1821111,
    "lng": -75.1277951,
    "desc": "LAUREL AVE & OAKDALE AVE;  HORSHAM; Station 352; 2015-12-10 @ 16:46:48;",
    "zip": 19044.0,
    "title": "EMS: NAUSEA/VOMITING",
    "timeStamp": "10-12-2015 17.40",
    "twp": "HORSHAM",
    "addr": "LAUREL AVE & OAKDALE AVE",
    "e": 1
  },
  {
    "lat": 40.2172859,
    "lng": -75.405182,
    "desc": "COLLEGEVILLE RD & LYWISKI RD;  SKIPPACK; Station 336; 2015-12-10 @ 16:17:05;",
    "zip": 19426.0,
    "title": "EMS: RESPIRATORY EMERGENCY",
    "timeStamp": "10-12-2015 17.40",
    "twp": "SKIPPACK",
    "addr": "COLLEGEVILLE RD & LYWISKI RD",
    "e": 1
  },
  {
    "lat": 40.2890267,
    "lng": -75.3995896,
    "desc": "MAIN ST & OLD SUMNEYTOWN PIKE;  LOWER SALFORD; Station 344; 2015-12-10 @ 16:51:42;",
    "zip": 19438.0,
    "title": "EMS: SYNCOPAL EPISODE",
    "timeStamp": "10-12-2015 17.40",
    "twp": "LOWER SALFORD",
    "addr": "MAIN ST & OLD SUMNEYTOWN PIKE",
    "e": 1
  },
  {
    "lat": 40.1023985,
    "lng": -75.2914577,
    "desc": "BLUEROUTE  & RAMP I476 NB TO CHEMICAL RD; PLYMOUTH; 2015-12-10 @ 17:35:41;",
    "zip": 19462.0,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "10-12-2015 17.40",
    "twp": "PLYMOUTH",
    "addr": "BLUEROUTE  & RAMP I476 NB TO CHEMICAL RD",
    "e": 1
  },
  {
    "lat": 40.2319898,
    "lng": -75.2518915,
    "desc": "RT202 PKWY & KNAPP RD; MONTGOMERY; 2015-12-10 @ 17:33:50;",
    "zip": null,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "10-12-2015 17.40",
    "twp": "MONTGOMERY",
    "addr": "RT202 PKWY & KNAPP RD",
    "e": 1
  },
  {
    "lat": 40.0841613,
    "lng": -75.3083857,
    "desc": "BROOK RD & COLWELL LN; PLYMOUTH; 2015-12-10 @ 16:32:10;",
    "zip": 19428.0,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "10-12-2015 17.40",
    "twp": "PLYMOUTH",
    "addr": "BROOK RD & COLWELL LN",
    "e": 1
  },
  {
    "lat": 40.1741312,
    "lng": -75.0984907,
    "desc": "BYBERRY AVE & S WARMINSTER RD; UPPER MORELAND; 2015-12-10 @ 17:15:49;",
    "zip": 19040.0,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "10-12-2015 17.40",
    "twp": "UPPER MORELAND",
    "addr": "BYBERRY AVE & S WARMINSTER RD",
    "e": 1
  },
  {
    "lat": 40.062974,
    "lng": -75.135914,
    "desc": "OLD YORK RD & VALLEY RD; CHELTENHAM; 2015-12-10 @ 17:12:47;",
    "zip": 19027.0,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "10-12-2015 17.40",
    "twp": "CHELTENHAM",
    "addr": "OLD YORK RD & VALLEY RD",
    "e": 1
  },
  {
    "lat": 40.114239,
    "lng": -75.338508,
    "desc": "PENN ST & ARCH ST;  NORRISTOWN; Station 308A; 2015-12-10 @ 17:43:29;",
    "zip": 19401.0,
    "title": "EMS: VEHICLE ACCIDENT",
    "timeStamp": "10-12-2015 17.47",
    "twp": "NORRISTOWN",
    "addr": "PENN ST & ARCH ST",
    "e": 1
  },
  {
    "lat": 40.2093369,
    "lng": -75.1352655,
    "desc": "COUNTY LINE RD & WILLOW DR; HORSHAM; 2015-12-10 @ 17:45:23;",
    "zip": 18974.0,
    "title": "Traffic: DISABLED VEHICLE -",
    "timeStamp": "10-12-2015 17.47",
    "twp": "HORSHAM",
    "addr": "COUNTY LINE RD & WILLOW DR",
    "e": 1
  },
  {
    "lat": 40.114239,
    "lng": -75.338508,
    "desc": "PENN ST & ARCH ST; NORRISTOWN; 2015-12-10 @ 17:43:45;",
    "zip": 19401.0,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "10-12-2015 17.47",
    "twp": "NORRISTOWN",
    "addr": "PENN ST & ARCH ST",
    "e": 1
  },
  {
    "lat": 40.1990064,
    "lng": -75.3000584,
    "desc": "LILAC CT & PRIMROSE DR; UPPER GWYNEDD; 2015-12-10 @ 17:59:24-Station:STA80;",
    "zip": 19446.0,
    "title": "Fire: APPLIANCE FIRE",
    "timeStamp": "10-12-2015 18.02",
    "twp": "UPPER GWYNEDD",
    "addr": "LILAC CT & PRIMROSE DR",
    "e": 1
  },
  {
    "lat": 40.1433257,
    "lng": -75.422819,
    "desc": "RT422  & PAWLINGS RD OVERPASS; LOWER PROVIDENCE; 2015-12-10 @ 18:00:38;",
    "zip": null,
    "title": "Traffic: DISABLED VEHICLE -",
    "timeStamp": "10-12-2015 18.02",
    "twp": "LOWER PROVIDENCE",
    "addr": "RT422  & PAWLINGS RD OVERPASS",
    "e": 1
  },
  {
    "lat": 40.1532684,
    "lng": -75.1895576,
    "desc": "SUMMIT AVE & RT309 UNDERPASS; UPPER DUBLIN; 2015-12-10 @ 17:58:22;",
    "zip": null,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "10-12-2015 18.02",
    "twp": "UPPER DUBLIN",
    "addr": "SUMMIT AVE & RT309 UNDERPASS",
    "e": 1
  },
  {
    "lat": 40.1552833,
    "lng": -75.2642296,
    "desc": "PENLLYN BLUE BELL PIKE & VILLAGE CIR;  WHITPAIN; Station 385; 2015-12-10 @ 18:02:38;",
    "zip": 19422.0,
    "title": "EMS: HEAD INJURY",
    "timeStamp": "10-12-2015 18.06",
    "twp": "WHITPAIN",
    "addr": "PENLLYN BLUE BELL PIKE & VILLAGE CIR",
    "e": 1
  },
  {
    "lat": 40.0289031,
    "lng": -75.3518224,
    "desc": "EDENTON PL & DURHAM DR; DELAWARE COUNTY; 2015-12-10 @ 18:05:19-Station:STA23;",
    "zip": 19085.0,
    "title": "Fire: CARBON MONOXIDE DETECTOR",
    "timeStamp": "10-12-2015 18.06",
    "twp": "DELAWARE COUNTY",
    "addr": "EDENTON PL & DURHAM DR",
    "e": 1
  },
  {
    "lat": 40.0972222,
    "lng": -75.3761952,
    "desc": "SCHUYLKILL EXPY & WEADLEY RD OVERPASS; UPPER MERION; 2015-12-10 @ 18:05:39;",
    "zip": null,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "10-12-2015 18.06",
    "twp": "UPPER MERION",
    "addr": "SCHUYLKILL EXPY & WEADLEY RD OVERPASS",
    "e": 1
  },
  {
    "lat": 40.300736,
    "lng": -75.3319733,
    "desc": "CORNWALL TER & LIONS GATE CIR;  FRANCONIA; Station 339; 2015-12-10 @ 18:09:49;",
    "zip": 18964.0,
    "title": "EMS: RESPIRATORY EMERGENCY",
    "timeStamp": "10-12-2015 18.12",
    "twp": "FRANCONIA",
    "addr": "CORNWALL TER & LIONS GATE CIR",
    "e": 1
  },
  {
    "lat": 40.0993621,
    "lng": -75.1500348,
    "desc": "E GLENSIDE AVE & S KESWICK AVE; CHELTENHAM; 2015-12-10 @ 18:21:43;",
    "zip": 19038.0,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "10-12-2015 18.26",
    "twp": "CHELTENHAM",
    "addr": "E GLENSIDE AVE & S KESWICK AVE",
    "e": 1
  },
  {
    "lat": 40.0667184,
    "lng": -75.307176,
    "desc": "CONSHOHOCKEN STATE RD;  WEST CONSHOHOCKEN; Station 313A; 2015-12-10 @ 18:29:54;",
    "zip": null,
    "title": "EMS: VEHICLE ACCIDENT",
    "timeStamp": "10-12-2015 18.32",
    "twp": "WEST CONSHOHOCKEN",
    "addr": "CONSHOHOCKEN STATE RD",
    "e": 1
  },
  {
    "lat": 40.1042063,
    "lng": -75.3676652,
    "desc": "HAMPTON RD & BELMONT RD; UPPER MERION; 2015-12-10 @ 18:32:25-Station:STA49;",
    "zip": 19406.0,
    "title": "Fire: GAS-ODOR/LEAK",
    "timeStamp": "10-12-2015 18.37",
    "twp": "UPPER MERION",
    "addr": "HAMPTON RD & BELMONT RD",
    "e": 1
  },
  {
    "lat": 40.0249667,
    "lng": -75.2829046,
    "desc": "ROSEMONT AVE & DEAD END;  LOWER MERION; Station 313; 2015-12-10 @ 18:43:07;",
    "zip": null,
    "title": "EMS: CARDIAC EMERGENCY",
    "timeStamp": "10-12-2015 18.47",
    "twp": "LOWER MERION",
    "addr": "ROSEMONT AVE & DEAD END",
    "e": 1
  },
  {
    "lat": 40.2249227,
    "lng": -75.5280446,
    "desc": "LINFIELD TRAPPE RD;  LIMERICK; Station 324A; 2015-12-10 @ 18:50:37;",
    "zip": 19468.0,
    "title": "EMS: VEHICLE ACCIDENT",
    "timeStamp": "10-12-2015 18.52",
    "twp": "LIMERICK",
    "addr": "LINFIELD TRAPPE RD",
    "e": 1
  },
  {
    "lat": 40.2249227,
    "lng": -75.5280446,
    "desc": "LINFIELD TRAPPE RD; LIMERICK; 2015-12-10 @ 18:50:23-Station:STA51;",
    "zip": 19468.0,
    "title": "Fire: VEHICLE ACCIDENT",
    "timeStamp": "10-12-2015 18.52",
    "twp": "LIMERICK",
    "addr": "LINFIELD TRAPPE RD",
    "e": 1
  },
  {
    "lat": 40.2313745,
    "lng": -75.2797803,
    "desc": "CHURCH RD & E HANCOCK ST; LANSDALE; 2015-12-10 @ 19:06:07;",
    "zip": 19446.0,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "10-12-2015 19.11",
    "twp": "LANSDALE",
    "addr": "CHURCH RD & E HANCOCK ST",
    "e": 1
  },
  {
    "lat": 40.3209665,
    "lng": -75.6113493,
    "desc": "WILSON AVE & E PHILADELPHIA AVE;  DOUGLASS; Station 332; 2015-12-10 @ 19:07:27;",
    "zip": 19525.0,
    "title": "EMS: CVA/STROKE",
    "timeStamp": "10-12-2015 19.12",
    "twp": "DOUGLASS",
    "addr": "WILSON AVE & E PHILADELPHIA AVE",
    "e": 1
  },
  {
    "lat": 40.2432612,
    "lng": -75.2960797,
    "desc": "W MT VERNON ST & S MITCHELL AVE; LANSDALE; 2015-12-10 @ 19:08:43;",
    "zip": 19446.0,
    "title": "Traffic: ROAD OBSTRUCTION -",
    "timeStamp": "10-12-2015 19.12",
    "twp": "LANSDALE",
    "addr": "W MT VERNON ST & S MITCHELL AVE",
    "e": 1
  },
  {
    "lat": 40.1173446,
    "lng": -75.2111725,
    "desc": "FAIRFIELD DR & FARMAR LN;  WHITEMARSH; Station 318; 2015-12-10 @ 19:23:08;",
    "zip": 19031.0,
    "title": "EMS: HEMORRHAGING",
    "timeStamp": "10-12-2015 19.27",
    "twp": "WHITEMARSH",
    "addr": "FAIRFIELD DR & FARMAR LN",
    "e": 1
  },
  {
    "lat": 40.105308,
    "lng": -75.341987,
    "desc": "4TH ST & DEPOT ST;  BRIDGEPORT; Station 317; 2015-12-10 @ 19:35:47;",
    "zip": 19405.0,
    "title": "EMS: ASSAULT VICTIM",
    "timeStamp": "10-12-2015 19.39",
    "twp": "BRIDGEPORT",
    "addr": "4TH ST & DEPOT ST",
    "e": 1
  },
  {
    "lat": 40.1546593,
    "lng": -75.2215435,
    "desc": "BUTLER AVE & N RIDGE AVE;  AMBLER; Station 351; 2015-12-10 @ 19:54:45;",
    "zip": 19002.0,
    "title": "EMS: SEIZURES",
    "timeStamp": "10-12-2015 19.57",
    "twp": "AMBLER",
    "addr": "BUTLER AVE & N RIDGE AVE",
    "e": 1
  },
  
  // --- January 2016 ---
  {
    "lat": 40.091238,
    "lng": -75.148508,
    "desc": "CHURCH RD & KESWICK AVE; CHELTENHAM; Station 358; 2016-01-15 @ 08:32:00;",
    "zip": 19038,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "15-01-2016 08.36",
    "twp": "CHELTENHAM",
    "addr": "CHURCH RD & KESWICK AVE",
    "e": 1
  },
  {
    "lat": 40.125744,
    "lng": -75.339234,
    "desc": "MARKLEY ST & ROBERTS ST; NORRISTOWN; Station 308; 2016-01-15 @ 09:12:45;",
    "zip": 19401,
    "title": "EMS: CARDIAC EMERGENCY",
    "timeStamp": "15-01-2016 09.18",
    "twp": "NORRISTOWN",
    "addr": "MARKLEY ST & ROBERTS ST",
    "e": 1
  },
  {
    "lat": 40.251492,
    "lng": -75.60335,
    "desc": "KEIM ST BRIDGE & INDUSTRIAL HWY; POTTSTOWN; 2016-01-15 @ 12:45:11;",
    "zip": 19464,
    "title": "Traffic: DISABLED VEHICLE -",
    "timeStamp": "15-01-2016 12.50",
    "twp": "POTTSTOWN",
    "addr": "KEIM ST BRIDGE & INDUSTRIAL HWY",
    "e": 1
  },
  {
    "lat": 40.113538,
    "lng": -75.111797,
    "desc": "OLD YORK RD & WOODLAND RD; ABINGTON; 2016-01-15 @ 14:15:00-Station:STA81;",
    "zip": 19046,
    "title": "Fire: FIRE ALARM",
    "timeStamp": "15-01-2016 14.20",
    "twp": "ABINGTON",
    "addr": "OLD YORK RD & WOODLAND RD",
    "e": 1
  },

  // --- February 2016 ---
  {
    "lat": 40.129398,
    "lng": -75.332213,
    "desc": "MAIN ST & CARTER LN; NORRISTOWN; 2016-02-14 @ 11:22:30;",
    "zip": 19401,
    "title": "Traffic: ROAD OBSTRUCTION -",
    "timeStamp": "14-02-2016 11.28",
    "twp": "NORRISTOWN",
    "addr": "MAIN ST & CARTER LN",
    "e": 1
  },
  {
    "lat": 40.23199,
    "lng": -75.251892,
    "desc": "KNAPP RD & DEKALB PIKE; MONTGOMERY; Station 345; 2016-02-14 @ 16:30:15;",
    "zip": 19446,
    "title": "EMS: SEIZURES",
    "timeStamp": "14-02-2016 16.35",
    "twp": "MONTGOMERY",
    "addr": "KNAPP RD & DEKALB PIKE",
    "e": 1
  },
  {
    "lat": 40.062974,
    "lng": -75.135914,
    "desc": "CHELTEN HILLS DR & VALLEY RD; CHELTENHAM; Station 358A; 2016-02-14 @ 19:44:50;",
    "zip": 19027,
    "title": "EMS: RESPIRATORY EMERGENCY",
    "timeStamp": "14-02-2016 19.50",
    "twp": "CHELTENHAM",
    "addr": "CHELTEN HILLS DR & VALLEY RD",
    "e": 1
  },

  // --- March 2016 ---
  {
    "lat": 40.114239,
    "lng": -75.338508,
    "desc": "DEKALB ST & E JACOBY ST; NORRISTOWN; Station 308A; 2016-03-11 @ 00:25:00;",
    "zip": 19401,
    "title": "EMS: NAUSEA/VOMITING",
    "timeStamp": "11-03-2016 0.31",
    "twp": "NORRISTOWN",
    "addr": "DEKALB ST & E JACOBY ST",
    "e": 1
  },
  {
    "lat": 40.3434796,
    "lng": -75.4367547,
    "desc": "PAYNE RD & SWAMP CREEK RD;  MARLBOROUGH; Station 344A; 2016-03-11 @ 00:28:15;",
    "zip": 18054.0,
    "title": "EMS: CARDIAC EMERGENCY",
    "timeStamp": "11-03-2016 0.32",
    "twp": "MARLBOROUGH",
    "addr": "PAYNE RD & SWAMP CREEK RD",
    "e": 1
  },
  {
    "lat": 40.1135384,
    "lng": -75.1117969,
    "desc": "CLOVERLY LN & SEWELL LN;  ABINGTON; Station 381; 2016-03-11 @ 00:44:52;",
    "zip": 19046.0,
    "title": "EMS: OVERDOSE",
    "timeStamp": "11-03-2016 0.47",
    "twp": "ABINGTON",
    "addr": "CLOVERLY LN & SEWELL LN",
    "e": 1
  },
  {
    "lat": 40.2197745,
    "lng": -75.494772,
    "desc": "N TOWNSHIP LINE RD; PERKIOMEN; 2016-03-11 @ 00:46:00-Station:STA66;",
    "zip": 19468.0,
    "title": "Fire: VEHICLE FIRE",
    "timeStamp": "11-03-2016 0.51",
    "twp": "PERKIOMEN",
    "addr": "N TOWNSHIP LINE RD",
    "e": 1
  },
  {
    "lat": 40.2246375,
    "lng": -75.4899959,
    "desc": "N TOWNSHIP LINE RD & WARTMAN RD; PERKIOMEN; 2016-03-11 @ 00:47:43;",
    "zip": 19468.0,
    "title": "Traffic: VEHICLE FIRE -",
    "timeStamp": "11-03-2016 0.51",
    "twp": "PERKIOMEN",
    "addr": "N TOWNSHIP LINE RD & WARTMAN RD",
    "e": 1
  },
  {
    "lat": 40.2213286,
    "lng": -75.4822575,
    "desc": "WARTMAN RD & GREENWOOD AVE;  PERKIOMEN; Station 324; 2016-03-11 @ 00:51:49;",
    "zip": 19426.0,
    "title": "EMS: VEHICLE ACCIDENT",
    "timeStamp": "11-03-2016 0.56",
    "twp": "PERKIOMEN",
    "addr": "WARTMAN RD & GREENWOOD AVE",
    "e": 1
  },
  {
    "lat": 40.2213286,
    "lng": -75.4822575,
    "desc": "WARTMAN RD & GREENWOOD AVE; PERKIOMEN; 2016-03-11 @ 00:46:00-Station:STA66;",
    "zip": 19426.0,
    "title": "Fire: VEHICLE ACCIDENT",
    "timeStamp": "11-03-2016 1.02",
    "twp": "PERKIOMEN",
    "addr": "WARTMAN RD & GREENWOOD AVE",
    "e": 1
  },
  {
    "lat": 40.2213286,
    "lng": -75.4822575,
    "desc": "WARTMAN RD & GREENWOOD AVE; PERKIOMEN; 2016-03-11 @ 00:47:43;",
    "zip": 19426.0,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "11-03-2016 1.02",
    "twp": "PERKIOMEN",
    "addr": "WARTMAN RD & GREENWOOD AVE",
    "e": 1
  },
  {
    "lat": 40.2101703,
    "lng": -75.2174953,
    "desc": "LOWER STATE RD & SQUIRE DR;  HORSHAM; Station 352; 2016-03-11 @ 01:53:31;",
    "zip": 19002.0,
    "title": "EMS: ABDOMINAL PAINS",
    "timeStamp": "11-03-2016 1.57",
    "twp": "HORSHAM",
    "addr": "LOWER STATE RD & SQUIRE DR",
    "e": 1
  },
  {
    "lat": 40.0230397,
    "lng": -75.3151611,
    "desc": "MONTGOMERY AVE & MORRIS AVE; LOWER MERION; 2016-03-11 @ 01:58:28-Station:STA23;",
    "zip": 19010.0,
    "title": "Fire: FIRE ALARM",
    "timeStamp": "11-03-2016 2.02",
    "twp": "LOWER MERION",
    "addr": "MONTGOMERY AVE & MORRIS AVE",
    "e": 1
  },
  {
    "lat": 40.2387237,
    "lng": -75.578516,
    "desc": "EVERGREEN RD & W LIGHTCAP RD;  LOWER POTTSGROVE; Station 329; 2016-03-11 @ 02:01:12;",
    "zip": 19464.0,
    "title": "EMS: FEVER",
    "timeStamp": "11-03-2016 2.07",
    "twp": "LOWER POTTSGROVE",
    "addr": "EVERGREEN RD & W LIGHTCAP RD",
    "e": 1
  },
  {
    "lat": 40.084052,
    "lng": -75.29637,
    "desc": "FAYETTE ST & E 13TH AVE;  PLYMOUTH; Station 308; 2016-03-11 @ 02:20:08;",
    "zip": 19428.0,
    "title": "EMS: ALLERGIC REACTION",
    "timeStamp": "11-03-2016 2.22",
    "twp": "PLYMOUTH",
    "addr": "FAYETTE ST & E 13TH AVE",
    "e": 1
  },
  {
    "lat": 40.1007482,
    "lng": -75.2151078,
    "desc": "WISSAHICKON AVE & ROSE LN;  SPRINGFIELD; Station 311; 2016-03-11 @ 02:30:21;",
    "zip": 19031.0,
    "title": "EMS: HEAD INJURY",
    "timeStamp": "11-03-2016 2.32",
    "twp": "SPRINGFIELD",
    "addr": "WISSAHICKON AVE & ROSE LN",
    "e": 1
  },

  // --- April 2016 ---
  {
    "lat": 40.116153,
    "lng": -75.343513,
    "desc": "SWEDE ST & W MARSHALL ST; NORRISTOWN; Station 308A; 2016-04-18 @ 10:45:00;",
    "zip": 19401,
    "title": "EMS: FALL VICTIM",
    "timeStamp": "18-04-2016 10.52",
    "twp": "NORRISTOWN",
    "addr": "SWEDE ST & W MARSHALL ST",
    "e": 1
  },
  {
    "lat": 40.084161,
    "lng": -75.308386,
    "desc": "COLWELL LN & BROOK RD; PLYMOUTH; 2016-04-18 @ 11:32:15;",
    "zip": 19428,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "18-04-2016 11.36",
    "twp": "PLYMOUTH",
    "addr": "COLWELL LN & BROOK RD",
    "e": 1
  },

  // --- May 2016 ---
  {
    "lat": 40.174131,
    "lng": -75.098491,
    "desc": "BYBERRY AVE & MILL RD; UPPER MORELAND; 2016-05-22 @ 09:10:00;",
    "zip": 19040,
    "title": "Traffic: DISABLED VEHICLE -",
    "timeStamp": "22-05-2016 09.15",
    "twp": "UPPER MORELAND",
    "addr": "BYBERRY AVE & MILL RD",
    "e": 1
  },
  {
    "lat": 40.155283,
    "lng": -75.26423,
    "desc": "SKIPPACK PIKE & VALLEY RD; WHITPAIN; Station 385; 2016-05-22 @ 14:05:00;",
    "zip": 19422,
    "title": "EMS: CARDIAC EMERGENCY",
    "timeStamp": "22-05-2016 14.12",
    "twp": "WHITPAIN",
    "addr": "SKIPPACK PIKE & VALLEY RD",
    "e": 1
  },

  // --- June 2016 ---
  {
    "lat": 40.125739,
    "lng": -75.339822,
    "desc": "MARKLEY ST & W AIRY ST; NORRISTOWN; Station 308A; 2016-06-12 @ 09:20:00;",
    "zip": 19401,
    "title": "EMS: SYNCOPAL EPISODE",
    "timeStamp": "12-06-2016 09.24",
    "twp": "NORRISTOWN",
    "addr": "MARKLEY ST & W AIRY ST",
    "e": 1
  },
  {
    "lat": 40.097222,
    "lng": -75.376195,
    "desc": "SCHUYLKILL EXPY & KING OF PRUSSIA RD; UPPER MERION; 2016-06-12 @ 15:44:00;",
    "zip": 19406,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "12-06-2016 15.51",
    "twp": "UPPER MERION",
    "addr": "SCHUYLKILL EXPY & KING OF PRUSSIA RD",
    "e": 1
  },
  {
    "lat": 40.143326,
    "lng": -75.422819,
    "desc": "EAGLEVILLE RD & LEVEL RD; LOWER PROVIDENCE; 2016-06-12 @ 18:32:00-Station:STA53;",
    "zip": 19403,
    "title": "Fire: FIRE ALARM",
    "timeStamp": "12-06-2016 18.37",
    "twp": "LOWER PROVIDENCE",
    "addr": "EAGLEVILLE RD & LEVEL RD",
    "e": 1
  },

  // --- July 2016 ---
  {
    "lat": 40.231375,
    "lng": -75.27978,
    "desc": "HANCOCK ST & BROAD ST; LANSDALE; 2016-07-04 @ 13:10:00;",
    "zip": 19446,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "04-07-2016 13.15",
    "twp": "LANSDALE",
    "addr": "HANCOCK ST & BROAD ST",
    "e": 1
  },
  {
    "lat": 40.154659,
    "lng": -75.221544,
    "desc": "BUTLER PIKE & MAPLE AVE; AMBLER; Station 351; 2016-07-04 @ 20:50:00;",
    "zip": 19002,
    "title": "EMS: HEAD INJURY",
    "timeStamp": "04-07-2016 20.57",
    "twp": "AMBLER",
    "addr": "BUTLER PIKE & MAPLE AVE",
    "e": 1
  },

  // --- August 2016 ---
  {
    "lat": 40.3400721,
    "lng": -75.5917092,
    "desc": "RT100 SB & E PHILADELPHIA AVE OVERPASS; DOUGLASS; 2016-08-24 @ 10:49:48;",
    "zip": null,
    "title": "Traffic: DISABLED VEHICLE -",
    "timeStamp": "24-08-2016 10.52",
    "twp": "DOUGLASS",
    "addr": "RT100 SB & E PHILADELPHIA AVE OVERPASS",
    "e": 1
  },
  {
    "lat": 40.0844647,
    "lng": -75.3901733,
    "desc": "DEKALB PIKE & KING OF PRUSSIA RD;  UPPER MERION; Station 317; 2016-08-24 @ 10:52:08;",
    "zip": 19406.0,
    "title": "EMS: BACK PAINS/INJURY",
    "timeStamp": "24-08-2016 10.57",
    "twp": "UPPER MERION",
    "addr": "DEKALB PIKE & KING OF PRUSSIA RD",
    "e": 1
  },
  {
    "lat": 40.1330371,
    "lng": -75.4084631,
    "desc": "SHANNONDELL DR & SHANNONDELL BLVD; LOWER PROVIDENCE; 2016-08-24 @ 10:55:53-Station:STA53;",
    "zip": 19403.0,
    "title": "Fire: FIRE ALARM",
    "timeStamp": "24-08-2016 10.57",
    "twp": "LOWER PROVIDENCE",
    "addr": "SHANNONDELL DR & SHANNONDELL BLVD",
    "e": 1
  },
  {
    "lat": 40.1436007,
    "lng": -75.4278768,
    "desc": "EAGLEVILLE RD & REDTAIL RD; LOWER PROVIDENCE; 2016-08-24 @ 10:51:30;",
    "zip": 19403.0,
    "title": "Traffic: DISABLED VEHICLE -",
    "timeStamp": "24-08-2016 10.57",
    "twp": "LOWER PROVIDENCE",
    "addr": "EAGLEVILLE RD & REDTAIL RD",
    "e": 1
  },
  {
    "lat": 40.1792254,
    "lng": -75.1805718,
    "desc": "WELSH RD & NORRISTOWN RD; HORSHAM; 2016-08-24 @ 10:59:40;",
    "zip": 19044.0,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "24-08-2016 11.02",
    "twp": "HORSHAM",
    "addr": "WELSH RD & NORRISTOWN RD",
    "e": 1
  },
  {
    "lat": 40.1328695,
    "lng": -75.3335153,
    "desc": "MARKLEY ST & W LOGAN ST; NORRISTOWN; 2016-08-24 @ 11:05:00;",
    "zip": 19401.0,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "24-08-2016 11.06",
    "twp": "NORRISTOWN",
    "addr": "MARKLEY ST & W LOGAN ST",
    "e": 1
  },
  {
    "lat": 40.006974,
    "lng": -75.28908,
    "desc": "LANCASTER AVE & RITTENHOUSE PL; LOWER MERION; 2016-08-24 @ 11:05:48;",
    "zip": 19003.0,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "24-08-2016 11.07",
    "twp": "LOWER MERION",
    "addr": "LANCASTER AVE & RITTENHOUSE PL",
    "e": 1
  },
  {
    "lat": 40.115429,
    "lng": -75.3346793,
    "desc": "CHESTNUT ST & WALNUT ST;  NORRISTOWN; Station 308A; 2016-08-24 @ 11:07:31;",
    "zip": 19401.0,
    "title": "EMS: FALL VICTIM",
    "timeStamp": "24-08-2016 11.12",
    "twp": "NORRISTOWN",
    "addr": "CHESTNUT ST & WALNUT ST",
    "e": 1
  },
  {
    "lat": 40.1864308,
    "lng": -75.1925553,
    "desc": "WELSH RD & WEBSTER LN;  HORSHAM; Station 352; 2016-08-24 @ 11:13:19;",
    "zip": 19002.0,
    "title": "EMS: NAUSEA/VOMITING",
    "timeStamp": "24-08-2016 11.17",
    "twp": "HORSHAM",
    "addr": "WELSH RD & WEBSTER LN",
    "e": 1
  },
  {
    "lat": 40.2070553,
    "lng": -75.3179522,
    "desc": "MORRIS RD & S BROAD ST; UPPER GWYNEDD; 2016-08-24 @ 11:15:50;",
    "zip": 19446.0,
    "title": "Traffic: VEHICLE ACCIDENT -",
    "timeStamp": "24-08-2016 11.17",
    "twp": "UPPER GWYNEDD",
    "addr": "MORRIS RD & S BROAD ST",
    "e": 1
  }
];
