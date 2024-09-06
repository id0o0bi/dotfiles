import { fileExist } from "../core/utils.js"
import keys from "../core/keys.js";

// @link https://openweathermap.org/forecast5
// @link weather icons: https://bas.dev/work/meteocons
// (*times are shown in the local timezone)
//
// Weather object see below list
class OpenWeather extends Service {
    static {
        Service.register(this, {}, {
            'city':  ['object', 'r'],    // below example in "city"
            'today': ['object', 'r'],    // below example in "list"
            'hours': ['array', 'r'],     // array of weather objects
        });
    }

    // prefix means private in JS
    #city = {};
    #today = {};
    #hours = [];

    get city() { return this.#city; }
    get today() { return this.#today; }
    get hours() { return this.#hours; }

    constructor() {
        super();
        this.update();
        setInterval(() => {this.update()}, 1800000);
    }

    update() {
        let arg = [
            `q=${keys.openweather_city}`,
            'units=metric',
            'lang=zh_cn',
            `appid=${keys.openweather_key}`, 
            'cnt=5'
        ]
        let url = `https://api.openweathermap.org/data/2.5/forecast?${arg.join('&')}`;
        Utils.execAsync(['curl', url])
            .then(res => {
                let data = JSON.parse(res);
                if (data.cod != 200) {
                    // utils.notify({
                    //     summary: "weather info update failed",
                    //     iconname: "info-symbolic",
                    //     body: res,
                    // })
                    return ;
                }

                this.#city  = data.city;
                this.#hours = data.list;
                this.#today = this.#hours[0];

                // console.log(this.#today)
                this.changed('city');
                this.changed('today');
                this.changed('hours');
            }).catch(console.error)
    }

    getTsHourStr(timestamp) {
        return (new Date(timestamp))
            .getHours().toString()
            .padStart(2, '0') + ':00';
    }

    getWeatherIcon(data) {

        let none = `${App.configDir}/assets/openweathermap/na.svg`;
        if (!data.weather) 
            return none;

        let icon = data.weather[0]?.icon || '';
        let file = `${App.configDir}/assets/openweathermap/${icon}.svg`;
        return fileExist(file) ? file : none;
    }


}

export const weather = new OpenWeather;
export default weather;

// {
//    "city": {
//       "coord": {
//          "lat": 30.2937,
//          "lon": 120.1614
//       },
//       "country": "CN",
//       "id": 1808926,
//       "name": "Hangzhou",
//       "population": 1878129,
//       "sunrise": 1725399475,
//       "sunset": 1725445158,
//       "timezone": 28800
//    },
//    "cnt": 40,
//    "cod": "200",
//    "list": [
//       {
//          "clouds": {
//             "all": 44
//          },
//          "dt": 1725429600,
//          "dt_txt": "2024-09-04 06:00:00",
//          "main": {
//             "feels_like": 310.22,
//             "grnd_level": 1002,
//             "humidity": 53,
//             "pressure": 1004,
//             "sea_level": 1004,
//             "temp": 306.1,
//             "temp_kf": -0.76,
//             "temp_max": 306.86,
//             "temp_min": 306.1
//          },
//          "pop": 0,
//          "sys": {
//             "pod": "d"
//          },
//          "visibility": 10000,
//          "weather": [
//             {
//                "description": "scattered clouds",
//                "icon": "03d",
//                "id": 802,
//                "main": "Clouds"
//             }
//          ],
//          "wind": {
//             "deg": 70,
//             "gust": 3.7,
//             "speed": 3.78
//          }
//       },
//       // ...
//    ],
//    "message": 0
// }
