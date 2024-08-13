// @link https://github.com/chubin/wttr.in
// (*times are shown in the local timezone)
class Weather extends Service {
    static {
        Service.register(this, {}, {
            'data': ['object', 'r'],
        });
    }

    // prefix means private in JS
    #data = {};

    get data() { return this.#data; }

    codeMap = {
        "113": "Sunny",
        "116": "PartlyCloudy",
        "119": "Cloudy",
        "122": "VeryCloudy",
        "143": "Fog",
        "176": "LightShowers",
        "179": "LightSleetShowers",
        "182": "LightSleet",
        "185": "LightSleet",
        "200": "ThunderyShowers",
        "227": "LightSnow",
        "230": "HeavySnow",
        "248": "Fog",
        "260": "Fog",
        "263": "LightShowers",
        "266": "LightRain",
        "281": "LightSleet",
        "284": "LightSleet",
        "293": "LightRain",
        "296": "LightRain",
        "299": "HeavyShowers",
        "302": "HeavyRain",
        "305": "HeavyShowers",
        "308": "HeavyRain",
        "311": "LightSleet",
        "314": "LightSleet",
        "317": "LightSleet",
        "320": "LightSnow",
        "323": "LightSnowShowers",
        "326": "LightSnowShowers",
        "329": "HeavySnow",
        "332": "HeavySnow",
        "335": "HeavySnowShowers",
        "338": "HeavySnow",
        "350": "LightSleet",
        "353": "LightShowers",
        "356": "HeavyShowers",
        "359": "HeavyRain",
        "362": "LightSleetShowers",
        "365": "LightSleetShowers",
        "368": "LightSnowShowers",
        "371": "HeavySnowShowers",
        "374": "LightSleetShowers",
        "377": "LightSleet",
        "386": "ThunderyShowers",
        "389": "ThunderyHeavyRain",
        "392": "ThunderySnowShowers",
        "395": "HeavySnowShowers",
    };

    iconMap = {
        "Unknown":             "✨",
        "Cloudy":              "☁️",
        "Fog":                 "🌫",
        "HeavyRain":           "🌧",
        "HeavyShowers":        "🌧",
        "HeavySnow":           "❄️",
        "HeavySnowShowers":    "❄️",
        "LightRain":           "🌦",
        "LightShowers":        "🌦",
        "LightSleet":          "🌧",
        "LightSleetShowers":   "🌧",
        "LightSnow":           "🌨",
        "LightSnowShowers":    "🌨",
        "PartlyCloudy":        "⛅️",
        "Sunny":               "☀️",
        "ThunderyHeavyRain":   "🌩",
        "ThunderyShowers":     "⛈",
        "ThunderySnowShowers": "⛈",
        "VeryCloudy":          "☁️",
    };

    city = 'Hangzhou';

    constructor() {
        super();
        this.update();
        setInterval(() => {this.update()}, 1800000);
    }

    update() {
        Utils.fetch(`https://wttr.in/${this.city}?format=j1`)
            .then(r => r.text())
            .then(res => {
                this.#data = JSON.parse(res);
                this.changed('data');
            }).catch(console.error)
    }

    // get forcast for 12 hours, 3 hours per data item
    getHourlyForcast(len = 4) {
        if ( ! this.#data.weather || ! this.#data.current_condition) 
            return [];

        let weather = this.#data.weather;
        let current = this.#data.current_condition[0].localObsDateTime.split(/\s+/);

        let cast = [];
        let date = current[0];
        let hour = parseInt(current[1]);
        hour = hour + (current[2].toLowerCase() === 'pm' ? 12 : 0);

        push_loop:
        for (let w of weather) {
            if (w.date < date) continue;

            for (let h of w.hourly) {
                if (w.date === date && h.time <= hour*100) continue;

                cast.push(h);
                if (cast.length >= len) break push_loop;
            }
        }

        return cast;
    }

    getCurrentDesc() {
        if ( ! this.#data.current_condition) 
            return ''

        let icon = this.getCurrentIcon();
        let desc = this.#data.current_condition[0].weatherDesc.map(d => d.value.trim()).join(',');
        let temp = this.getCurrentTemp();
        return `${icon} ${desc}, ${temp}`;
    }

    getCurrentIcon() {
        if ( ! this.#data.current_condition) 
            return ''

        let code = this.#data.current_condition[0].weatherCode;
        return this.transformToIcon(code);
    }

    getCurrentTemp(unit = '°C') {
        if ( ! this.#data.current_condition) 
            return '';

        let temp = this.#data.current_condition[0].temp_C || '?';
        return `${temp}${unit}`;
    }

    transformToIcon(code) {
        return this.iconMap[this.codeMap[code] || 'unkown'] || '✨';
    }

}

// export to use in other modules
export const weather = new Weather;
export default weather;



// {
//     "current_condition": [
//         {
//             "FeelsLikeC": "38",
//             "FeelsLikeF": "100",
//             "cloudcover": "4",
//             "humidity": "64",
//             "localObsDateTime": "2024-07-21 09:59 PM",
//             "observation_time": "01:59 PM",
//             "precipInches": "0.0",
//             "precipMM": "0.0",
//             "pressure": "1005",
//             "pressureInches": "30",
//             "temp_C": "32",
//             "temp_F": "89",
//             "uvIndex": "1",
//             "visibility": "10",
//             "visibilityMiles": "6",
//             "weatherCode": "113",
//             "weatherDesc": [
//                 {
//                     "value": "Clear "
//                 }
//             ],
//             "weatherIconUrl": [
//                 {
//                     "value": ""
//                 }
//             ],
//             "winddir16Point": "ESE",
//             "winddirDegree": "123",
//             "windspeedKmph": "6",
//             "windspeedMiles": "4"
//         }
//     ],
//     "nearest_area": [
//         {
//             "areaName": [
//                 {
//                     "value": "Hangzhou"
//                 }
//             ],
//             "country": [
//                 {
//                     "value": "China"
//                 }
//             ],
//             "latitude": "30.255",
//             "longitude": "120.169",
//             "population": "1878129",
//             "region": [
//                 {
//                     "value": "Zhejiang"
//                 }
//             ],
//             "weatherUrl": [
//                 {
//                     "value": ""
//                 }
//             ]
//         }
//     ],
//     "request": [
//         {
//             "query": "Lat 30.25 and Lon 120.21",
//             "type": "LatLon"
//         }
//     ],
//     "weather": [
//         {
//             "astronomy": [
//                 {
//                     "moon_illumination": "100",
//                     "moon_phase": "Full Moon",
//                     "moonrise": "07:16 PM",
//                     "moonset": "04:28 AM",
//                     "sunrise": "05:11 AM",
//                     "sunset": "07:00 PM"
//                 }
//             ],
//             "avgtempC": "32",
//             "avgtempF": "90",
//             "date": "2024-07-21",
//             "hourly": [
//                 {
//                     "DewPointC": "21",
//                     "DewPointF": "70",
//                     "FeelsLikeC": "32",
//                     "FeelsLikeF": "89",
//                     "HeatIndexC": "32",
//                     "HeatIndexF": "89",
//                     "WindChillC": "29",
//                     "WindChillF": "84",
//                     "WindGustKmph": "17",
//                     "WindGustMiles": "11",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "99",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "89",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "92",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "7",
//                     "diffRad": "0.0",
//                     "humidity": "63",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1006",
//                     "pressureInches": "30",
//                     "shortRad": "0.0",
//                     "tempC": "29",
//                     "tempF": "84",
//                     "time": "0",
//                     "uvIndex": "1",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Clear "
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "SSW",
//                     "winddirDegree": "201",
//                     "windspeedKmph": "9",
//                     "windspeedMiles": "5"
//                 },
//                 {
//                     "DewPointC": "21",
//                     "DewPointF": "69",
//                     "FeelsLikeC": "29",
//                     "FeelsLikeF": "84",
//                     "HeatIndexC": "29",
//                     "HeatIndexF": "84",
//                     "WindChillC": "27",
//                     "WindChillF": "80",
//                     "WindGustKmph": "17",
//                     "WindGustMiles": "11",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "98",
//                     "chanceofovercast": "88",
//                     "chanceofrain": "100",
//                     "chanceofremdry": "0",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "0",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "86",
//                     "diffRad": "0.0",
//                     "humidity": "69",
//                     "precipInches": "0.0",
//                     "precipMM": "0.2",
//                     "pressure": "1006",
//                     "pressureInches": "30",
//                     "shortRad": "0.0",
//                     "tempC": "27",
//                     "tempF": "80",
//                     "time": "300",
//                     "uvIndex": "1",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "176",
//                     "weatherDesc": [
//                         {
//                             "value": "Patchy rain nearby"
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "SW",
//                     "winddirDegree": "217",
//                     "windspeedKmph": "8",
//                     "windspeedMiles": "5"
//                 },
//                 {
//                     "DewPointC": "21",
//                     "DewPointF": "70",
//                     "FeelsLikeC": "29",
//                     "FeelsLikeF": "83",
//                     "HeatIndexC": "29",
//                     "HeatIndexF": "83",
//                     "WindChillC": "26",
//                     "WindChillF": "80",
//                     "WindGustKmph": "14",
//                     "WindGustMiles": "9",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "99",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "90",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "87",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "7",
//                     "diffRad": "2.9",
//                     "humidity": "72",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1007",
//                     "pressureInches": "30",
//                     "shortRad": "5.7",
//                     "tempC": "26",
//                     "tempF": "80",
//                     "time": "600",
//                     "uvIndex": "7",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Sunny"
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "SW",
//                     "winddirDegree": "218",
//                     "windspeedKmph": "7",
//                     "windspeedMiles": "4"
//                 },
//                 {
//                     "DewPointC": "23",
//                     "DewPointF": "73",
//                     "FeelsLikeC": "37",
//                     "FeelsLikeF": "98",
//                     "HeatIndexC": "37",
//                     "HeatIndexF": "98",
//                     "WindChillC": "32",
//                     "WindChillF": "89",
//                     "WindGustKmph": "13",
//                     "WindGustMiles": "8",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "98",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "83",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "94",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "5",
//                     "diffRad": "226.8",
//                     "humidity": "58",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1006",
//                     "pressureInches": "30",
//                     "shortRad": "465.9",
//                     "tempC": "32",
//                     "tempF": "89",
//                     "time": "900",
//                     "uvIndex": "8",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Sunny"
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "SSW",
//                     "winddirDegree": "195",
//                     "windspeedKmph": "11",
//                     "windspeedMiles": "7"
//                 },
//                 {
//                     "DewPointC": "23",
//                     "DewPointF": "74",
//                     "FeelsLikeC": "43",
//                     "FeelsLikeF": "109",
//                     "HeatIndexC": "43",
//                     "HeatIndexF": "109",
//                     "WindChillC": "36",
//                     "WindChillF": "97",
//                     "WindGustKmph": "13",
//                     "WindGustMiles": "8",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "98",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "84",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "94",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "14",
//                     "diffRad": "235.1",
//                     "humidity": "48",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1006",
//                     "pressureInches": "30",
//                     "shortRad": "724.5",
//                     "tempC": "36",
//                     "tempF": "97",
//                     "time": "1200",
//                     "uvIndex": "9",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Sunny"
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "S",
//                     "winddirDegree": "187",
//                     "windspeedKmph": "12",
//                     "windspeedMiles": "7"
//                 },
//                 {
//                     "DewPointC": "21",
//                     "DewPointF": "71",
//                     "FeelsLikeC": "45",
//                     "FeelsLikeF": "113",
//                     "HeatIndexC": "45",
//                     "HeatIndexF": "113",
//                     "WindChillC": "39",
//                     "WindChillF": "103",
//                     "WindGustKmph": "8",
//                     "WindGustMiles": "5",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "97",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "91",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "85",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "8",
//                     "diffRad": "84.9",
//                     "humidity": "36",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1004",
//                     "pressureInches": "30",
//                     "shortRad": "795.1",
//                     "tempC": "39",
//                     "tempF": "103",
//                     "time": "1500",
//                     "uvIndex": "9",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Sunny"
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "SSE",
//                     "winddirDegree": "168",
//                     "windspeedKmph": "7",
//                     "windspeedMiles": "4"
//                 },
//                 {
//                     "DewPointC": "25",
//                     "DewPointF": "76",
//                     "FeelsLikeC": "43",
//                     "FeelsLikeF": "110",
//                     "HeatIndexC": "43",
//                     "HeatIndexF": "110",
//                     "WindChillC": "35",
//                     "WindChillF": "95",
//                     "WindGustKmph": "12",
//                     "WindGustMiles": "7",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "97",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "82",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "85",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "11",
//                     "diffRad": "78.3",
//                     "humidity": "54",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1004",
//                     "pressureInches": "30",
//                     "shortRad": "520.3",
//                     "tempC": "35",
//                     "tempF": "95",
//                     "time": "1800",
//                     "uvIndex": "9",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Sunny"
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "E",
//                     "winddirDegree": "88",
//                     "windspeedKmph": "7",
//                     "windspeedMiles": "4"
//                 },
//                 {
//                     "DewPointC": "24",
//                     "DewPointF": "76",
//                     "FeelsLikeC": "38",
//                     "FeelsLikeF": "100",
//                     "HeatIndexC": "38",
//                     "HeatIndexF": "100",
//                     "WindChillC": "32",
//                     "WindChillF": "89",
//                     "WindGustKmph": "12",
//                     "WindGustMiles": "7",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "96",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "91",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "85",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "4",
//                     "diffRad": "0.0",
//                     "humidity": "64",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1005",
//                     "pressureInches": "30",
//                     "shortRad": "0.0",
//                     "tempC": "32",
//                     "tempF": "89",
//                     "time": "2100",
//                     "uvIndex": "1",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Clear "
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "ESE",
//                     "winddirDegree": "123",
//                     "windspeedKmph": "6",
//                     "windspeedMiles": "4"
//                 }
//             ],
//             "maxtempC": "39",
//             "maxtempF": "103",
//             "mintempC": "26",
//             "mintempF": "78",
//             "sunHour": "13.9",
//             "totalSnow_cm": "0.0",
//             "uvIndex": "10"
//         },
//         {
//             "astronomy": [
//                 {
//                     "moon_illumination": "99",
//                     "moon_phase": "Waning Gibbous",
//                     "moonrise": "08:00 PM",
//                     "moonset": "05:38 AM",
//                     "sunrise": "05:12 AM",
//                     "sunset": "06:59 PM"
//                 }
//             ],
//             "avgtempC": "33",
//             "avgtempF": "91",
//             "date": "2024-07-22",
//             "hourly": [
//                 {
//                     "DewPointC": "24",
//                     "DewPointF": "75",
//                     "FeelsLikeC": "35",
//                     "FeelsLikeF": "95",
//                     "HeatIndexC": "35",
//                     "HeatIndexF": "95",
//                     "WindChillC": "30",
//                     "WindChillF": "86",
//                     "WindGustKmph": "14",
//                     "WindGustMiles": "9",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "96",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "80",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "88",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "5",
//                     "diffRad": "0.0",
//                     "humidity": "69",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1005",
//                     "pressureInches": "30",
//                     "shortRad": "0.0",
//                     "tempC": "30",
//                     "tempF": "86",
//                     "time": "0",
//                     "uvIndex": "1",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Clear "
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "SSW",
//                     "winddirDegree": "191",
//                     "windspeedKmph": "7",
//                     "windspeedMiles": "4"
//                 },
//                 {
//                     "DewPointC": "24",
//                     "DewPointF": "74",
//                     "FeelsLikeC": "33",
//                     "FeelsLikeF": "91",
//                     "HeatIndexC": "33",
//                     "HeatIndexF": "91",
//                     "WindChillC": "29",
//                     "WindChillF": "84",
//                     "WindGustKmph": "19",
//                     "WindGustMiles": "12",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "93",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "92",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "93",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "2",
//                     "diffRad": "0.0",
//                     "humidity": "74",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1004",
//                     "pressureInches": "30",
//                     "shortRad": "0.0",
//                     "tempC": "29",
//                     "tempF": "84",
//                     "time": "300",
//                     "uvIndex": "1",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Clear "
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "S",
//                     "winddirDegree": "184",
//                     "windspeedKmph": "10",
//                     "windspeedMiles": "6"
//                 },
//                 {
//                     "DewPointC": "23",
//                     "DewPointF": "73",
//                     "FeelsLikeC": "31",
//                     "FeelsLikeF": "87",
//                     "HeatIndexC": "31",
//                     "HeatIndexF": "87",
//                     "WindChillC": "28",
//                     "WindChillF": "82",
//                     "WindGustKmph": "20",
//                     "WindGustMiles": "13",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "90",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "80",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "85",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "0",
//                     "diffRad": "3.0",
//                     "humidity": "74",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1005",
//                     "pressureInches": "30",
//                     "shortRad": "6.0",
//                     "tempC": "28",
//                     "tempF": "82",
//                     "time": "600",
//                     "uvIndex": "7",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Sunny"
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "S",
//                     "winddirDegree": "182",
//                     "windspeedKmph": "12",
//                     "windspeedMiles": "7"
//                 },
//                 {
//                     "DewPointC": "22",
//                     "DewPointF": "72",
//                     "FeelsLikeC": "37",
//                     "FeelsLikeF": "99",
//                     "HeatIndexC": "37",
//                     "HeatIndexF": "99",
//                     "WindChillC": "33",
//                     "WindChillF": "91",
//                     "WindGustKmph": "16",
//                     "WindGustMiles": "10",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "94",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "84",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "91",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "5",
//                     "diffRad": "139.9",
//                     "humidity": "54",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1006",
//                     "pressureInches": "30",
//                     "shortRad": "574.0",
//                     "tempC": "33",
//                     "tempF": "91",
//                     "time": "900",
//                     "uvIndex": "8",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Sunny"
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "SSW",
//                     "winddirDegree": "192",
//                     "windspeedKmph": "14",
//                     "windspeedMiles": "9"
//                 },
//                 {
//                     "DewPointC": "23",
//                     "DewPointF": "73",
//                     "FeelsLikeC": "44",
//                     "FeelsLikeF": "112",
//                     "HeatIndexC": "44",
//                     "HeatIndexF": "112",
//                     "WindChillC": "38",
//                     "WindChillF": "100",
//                     "WindGustKmph": "18",
//                     "WindGustMiles": "11",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "94",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "86",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "93",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "8",
//                     "diffRad": "132.8",
//                     "humidity": "42",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1004",
//                     "pressureInches": "30",
//                     "shortRad": "785.3",
//                     "tempC": "38",
//                     "tempF": "100",
//                     "time": "1200",
//                     "uvIndex": "9",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Sunny"
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "S",
//                     "winddirDegree": "190",
//                     "windspeedKmph": "16",
//                     "windspeedMiles": "10"
//                 },
//                 {
//                     "DewPointC": "22",
//                     "DewPointF": "72",
//                     "FeelsLikeC": "46",
//                     "FeelsLikeF": "115",
//                     "HeatIndexC": "46",
//                     "HeatIndexF": "115",
//                     "WindChillC": "39",
//                     "WindChillF": "102",
//                     "WindGustKmph": "14",
//                     "WindGustMiles": "9",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "93",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "81",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "89",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "14",
//                     "diffRad": "145.3",
//                     "humidity": "38",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1002",
//                     "pressureInches": "30",
//                     "shortRad": "772.0",
//                     "tempC": "39",
//                     "tempF": "102",
//                     "time": "1500",
//                     "uvIndex": "9",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Sunny"
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "S",
//                     "winddirDegree": "179",
//                     "windspeedKmph": "12",
//                     "windspeedMiles": "8"
//                 },
//                 {
//                     "DewPointC": "23",
//                     "DewPointF": "74",
//                     "FeelsLikeC": "42",
//                     "FeelsLikeF": "108",
//                     "HeatIndexC": "42",
//                     "HeatIndexF": "108",
//                     "WindChillC": "36",
//                     "WindChillF": "96",
//                     "WindGustKmph": "22",
//                     "WindGustMiles": "13",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "93",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "91",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "86",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "6",
//                     "diffRad": "127.8",
//                     "humidity": "49",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1000",
//                     "pressureInches": "30",
//                     "shortRad": "497.8",
//                     "tempC": "36",
//                     "tempF": "96",
//                     "time": "1800",
//                     "uvIndex": "9",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Sunny"
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "SSE",
//                     "winddirDegree": "153",
//                     "windspeedKmph": "12",
//                     "windspeedMiles": "8"
//                 },
//                 {
//                     "DewPointC": "23",
//                     "DewPointF": "74",
//                     "FeelsLikeC": "37",
//                     "FeelsLikeF": "98",
//                     "HeatIndexC": "37",
//                     "HeatIndexF": "98",
//                     "WindChillC": "32",
//                     "WindChillF": "89",
//                     "WindGustKmph": "13",
//                     "WindGustMiles": "8",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "92",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "84",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "94",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "7",
//                     "diffRad": "0.0",
//                     "humidity": "60",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1002",
//                     "pressureInches": "30",
//                     "shortRad": "0.0",
//                     "tempC": "32",
//                     "tempF": "89",
//                     "time": "2100",
//                     "uvIndex": "1",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Clear "
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "SE",
//                     "winddirDegree": "146",
//                     "windspeedKmph": "6",
//                     "windspeedMiles": "4"
//                 }
//             ],
//             "maxtempC": "39",
//             "maxtempF": "102",
//             "mintempC": "28",
//             "mintempF": "82",
//             "sunHour": "13.0",
//             "totalSnow_cm": "0.0",
//             "uvIndex": "11"
//         },
//         {
//             "astronomy": [
//                 {
//                     "moon_illumination": "97",
//                     "moon_phase": "Waning Gibbous",
//                     "moonrise": "08:39 PM",
//                     "moonset": "06:49 AM",
//                     "sunrise": "05:13 AM",
//                     "sunset": "06:59 PM"
//                 }
//             ],
//             "avgtempC": "32",
//             "avgtempF": "90",
//             "date": "2024-07-23",
//             "hourly": [
//                 {
//                     "DewPointC": "23",
//                     "DewPointF": "73",
//                     "FeelsLikeC": "34",
//                     "FeelsLikeF": "92",
//                     "HeatIndexC": "34",
//                     "HeatIndexF": "92",
//                     "WindChillC": "30",
//                     "WindChillF": "85",
//                     "WindGustKmph": "17",
//                     "WindGustMiles": "11",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "92",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "93",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "91",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "4",
//                     "diffRad": "0.0",
//                     "humidity": "68",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1002",
//                     "pressureInches": "30",
//                     "shortRad": "0.0",
//                     "tempC": "30",
//                     "tempF": "85",
//                     "time": "0",
//                     "uvIndex": "1",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Clear "
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "S",
//                     "winddirDegree": "182",
//                     "windspeedKmph": "9",
//                     "windspeedMiles": "6"
//                 },
//                 {
//                     "DewPointC": "22",
//                     "DewPointF": "72",
//                     "FeelsLikeC": "31",
//                     "FeelsLikeF": "88",
//                     "HeatIndexC": "31",
//                     "HeatIndexF": "88",
//                     "WindChillC": "28",
//                     "WindChillF": "83",
//                     "WindGustKmph": "18",
//                     "WindGustMiles": "11",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "89",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "83",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "89",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "1",
//                     "diffRad": "0.0",
//                     "humidity": "71",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1002",
//                     "pressureInches": "30",
//                     "shortRad": "0.0",
//                     "tempC": "28",
//                     "tempF": "83",
//                     "time": "300",
//                     "uvIndex": "1",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Clear "
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "S",
//                     "winddirDegree": "176",
//                     "windspeedKmph": "10",
//                     "windspeedMiles": "6"
//                 },
//                 {
//                     "DewPointC": "22",
//                     "DewPointF": "72",
//                     "FeelsLikeC": "30",
//                     "FeelsLikeF": "86",
//                     "HeatIndexC": "30",
//                     "HeatIndexF": "86",
//                     "WindChillC": "27",
//                     "WindChillF": "81",
//                     "WindGustKmph": "17",
//                     "WindGustMiles": "11",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "86",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "83",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "91",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "2",
//                     "diffRad": "2.9",
//                     "humidity": "75",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1003",
//                     "pressureInches": "30",
//                     "shortRad": "5.6",
//                     "tempC": "27",
//                     "tempF": "81",
//                     "time": "600",
//                     "uvIndex": "7",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Sunny"
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "S",
//                     "winddirDegree": "175",
//                     "windspeedKmph": "10",
//                     "windspeedMiles": "6"
//                 },
//                 {
//                     "DewPointC": "22",
//                     "DewPointF": "72",
//                     "FeelsLikeC": "37",
//                     "FeelsLikeF": "99",
//                     "HeatIndexC": "37",
//                     "HeatIndexF": "99",
//                     "WindChillC": "33",
//                     "WindChillF": "91",
//                     "WindGustKmph": "17",
//                     "WindGustMiles": "11",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "90",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "81",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "91",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "6",
//                     "diffRad": "160.3",
//                     "humidity": "55",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1003",
//                     "pressureInches": "30",
//                     "shortRad": "559.9",
//                     "tempC": "33",
//                     "tempF": "91",
//                     "time": "900",
//                     "uvIndex": "8",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Sunny"
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "S",
//                     "winddirDegree": "188",
//                     "windspeedKmph": "15",
//                     "windspeedMiles": "9"
//                 },
//                 {
//                     "DewPointC": "22",
//                     "DewPointF": "71",
//                     "FeelsLikeC": "43",
//                     "FeelsLikeF": "110",
//                     "HeatIndexC": "43",
//                     "HeatIndexF": "110",
//                     "WindChillC": "37",
//                     "WindChillF": "99",
//                     "WindGustKmph": "13",
//                     "WindGustMiles": "8",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "89",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "88",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "88",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "5",
//                     "diffRad": "239.2",
//                     "humidity": "41",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1001",
//                     "pressureInches": "30",
//                     "shortRad": "741.8",
//                     "tempC": "37",
//                     "tempF": "99",
//                     "time": "1200",
//                     "uvIndex": "9",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Sunny"
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "SSW",
//                     "winddirDegree": "192",
//                     "windspeedKmph": "11",
//                     "windspeedMiles": "7"
//                 },
//                 {
//                     "DewPointC": "21",
//                     "DewPointF": "71",
//                     "FeelsLikeC": "45",
//                     "FeelsLikeF": "113",
//                     "HeatIndexC": "45",
//                     "HeatIndexF": "113",
//                     "WindChillC": "39",
//                     "WindChillF": "102",
//                     "WindGustKmph": "8",
//                     "WindGustMiles": "5",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "89",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "94",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "90",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "14",
//                     "diffRad": "181.2",
//                     "humidity": "36",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "999",
//                     "pressureInches": "29",
//                     "shortRad": "762.0",
//                     "tempC": "39",
//                     "tempF": "102",
//                     "time": "1500",
//                     "uvIndex": "9",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Sunny"
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "SE",
//                     "winddirDegree": "143",
//                     "windspeedKmph": "7",
//                     "windspeedMiles": "4"
//                 },
//                 {
//                     "DewPointC": "24",
//                     "DewPointF": "74",
//                     "FeelsLikeC": "42",
//                     "FeelsLikeF": "107",
//                     "HeatIndexC": "42",
//                     "HeatIndexF": "107",
//                     "WindChillC": "35",
//                     "WindChillF": "95",
//                     "WindGustKmph": "14",
//                     "WindGustMiles": "9",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "88",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "88",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "88",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "9",
//                     "diffRad": "101.2",
//                     "humidity": "52",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "999",
//                     "pressureInches": "29",
//                     "shortRad": "513.5",
//                     "tempC": "35",
//                     "tempF": "95",
//                     "time": "1800",
//                     "uvIndex": "8",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Sunny"
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "ENE",
//                     "winddirDegree": "77",
//                     "windspeedKmph": "8",
//                     "windspeedMiles": "5"
//                 },
//                 {
//                     "DewPointC": "23",
//                     "DewPointF": "74",
//                     "FeelsLikeC": "36",
//                     "FeelsLikeF": "96",
//                     "HeatIndexC": "36",
//                     "HeatIndexF": "96",
//                     "WindChillC": "31",
//                     "WindChillF": "88",
//                     "WindGustKmph": "24",
//                     "WindGustMiles": "15",
//                     "chanceoffog": "0",
//                     "chanceoffrost": "0",
//                     "chanceofhightemp": "88",
//                     "chanceofovercast": "0",
//                     "chanceofrain": "0",
//                     "chanceofremdry": "94",
//                     "chanceofsnow": "0",
//                     "chanceofsunshine": "87",
//                     "chanceofthunder": "0",
//                     "chanceofwindy": "0",
//                     "cloudcover": "5",
//                     "diffRad": "0.0",
//                     "humidity": "63",
//                     "precipInches": "0.0",
//                     "precipMM": "0.0",
//                     "pressure": "1000",
//                     "pressureInches": "30",
//                     "shortRad": "0.0",
//                     "tempC": "31",
//                     "tempF": "88",
//                     "time": "2100",
//                     "uvIndex": "1",
//                     "visibility": "10",
//                     "visibilityMiles": "6",
//                     "weatherCode": "113",
//                     "weatherDesc": [
//                         {
//                             "value": "Clear "
//                         }
//                     ],
//                     "weatherIconUrl": [
//                         {
//                             "value": ""
//                         }
//                     ],
//                     "winddir16Point": "SE",
//                     "winddirDegree": "140",
//                     "windspeedKmph": "13",
//                     "windspeedMiles": "8"
//                 }
//             ],
//             "maxtempC": "38",
//             "maxtempF": "101",
//             "mintempC": "27",
//             "mintempF": "81",
//             "sunHour": "13.0",
//             "totalSnow_cm": "0.0",
//             "uvIndex": "11"
//         }
//     ]
// }

